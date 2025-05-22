// src/controllers/fileController.js
const { adjustTrustScore } = require('./trustScoreUtils');
const { File, FileTag, Subject, StudyProgramYear, StudyProgram, Rating, User } = require('../models');
const { Op } = require('sequelize');


const { bucket } = require('../config/firebaseConfig');


exports.listBySubjectAndTag = async (req, res, next) => {
  try {
    const { subjectId, tagId  } = req.params;
    const files = await File.findAll({
      where: { subjectId,
        tagId 
       },
      include: [
        { model: FileTag,    as: 'tag',     attributes: ['name'] },
        { model: Subject,    as: 'subject', attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(files);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { programId, degreeLevel, year, subjectId, tag, name } = req.query;

    // Build dynamic filters
    const fileWhere = {};
    if (subjectId) fileWhere.subjectId = subjectId;
    if (name)      fileWhere.name = { [Op.iLike]: `%${name}%` };

    // We'll join upward through Subject → Year → Program
    const include = [
      { model: FileTag, as: 'tag', attributes: ['name'], where: tag ? { name: tag } : undefined },
      {
        model: Subject,
        as: 'subject',
        attributes: ['id','name'],
        where: subjectId ? undefined : {},
        include: [{
          model: StudyProgramYear,
          as: 'year',
          attributes: ['id','year','degreeLevel','semester'],
          where: {
            ...(programId   && { programId }),
            ...(degreeLevel && { degreeLevel }),
            ...(year        && { year }),
          },
          include: [{
            model: StudyProgram,
            as: 'program',
            attributes: ['id','name'],
          }]
        }]
      }
    ];

    const files = await File.findAll({ where: fileWhere, include });
    res.json(files);
  } catch (err) {
    next(err);
  }
};



exports.create = async (req, res, next) => {
  try {
    
    const { tagId, subjectId } = req.body;
    const createdBy = req.session.userId || req.body.createdBy;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, buffer, mimetype } = req.file;
    // Create a unique filename to avoid collisions
    const timestamp = Date.now();
    const filename = `${timestamp}_${originalname}`;
    const firebasePath = `files/${filename}`;

    // Upload to Firebase Storage
    const fileStream = bucket.file(firebasePath).createWriteStream({
      metadata: { contentType: mimetype },
    });

    fileStream.on('error', err => {
      console.error('Firebase upload error:', err);
      return res.status(500).json({ error: 'Error uploading file to storage.' });
    });
    console.log(tagId)
    fileStream.on('finish', async () => {
      // Save entry in Postgres
      const newFile = await File.create({
        name: originalname,
        path: `/files/${filename}`,
        createdBy,
        tagId,
        subjectId,
      });

      await adjustTrustScore(createdBy, +1, 'File uploaded');
      res.status(201).json(newFile);
    });

    // Write buffer to Firebase
    fileStream.end(buffer);
  } catch (err) {

    next(err);
  }
};


exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId || req.user?.id;
    const user = await User.findByPk(userId);
    const userRole = user?.role;

    // Find the file record
    const fileRecord = await File.findByPk(id);
    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found.' });
    }
    console.log(userRole);
    // Authorization: only admin or owner can delete
    if (userRole !== 'admin' && fileRecord.createdBy !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Delete file from Firebase Storage
    const firebasePath = fileRecord.path.startsWith('/') 
      ? fileRecord.path.slice(1) 
      : fileRecord.path;
    await bucket.file(firebasePath).delete();

    // Delete any ratings associated with this file to avoid foreign key constraint errors
    await Rating.destroy({ where: { fileId: id } });
    // Remove database record
    await fileRecord.destroy();

    res.json({ message: `File ${id} deleted.` });
  } catch (err) {
    next(err);
  }
};


exports.getRatingsByFile = async (req, res, next) => {

 const fileId = req.params.fileId;

  try {
    const ratings = await Rating.findAll({
      where: { fileId: fileId }
    });

    let sum = 0;

    ratings.forEach(r => {
      if (r.value === 'like') sum++;
      else if (r.value === 'dislike') sum--;
    });
    res.json({ sum });
  } catch (err) {
    next(err);
  }
};

exports.adminDeleteInappropriate = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({error: 'Access denied. Admins only.'});
    }

    const file = await File.findByPk(id);
    if (!file) return res.status(404).json({error: 'File not found.'});

    await File.destroy({where: {id}});

    await adjustTrustScore(file.createdBy, -2, 'Uploaded inappropriate content (removed by admin)');

    res.json({message: `File ${id} was deleted by an admin.`});
  } catch (err) {
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: ko bo implenetirana seja, mora javiti napako namesto nastaviti 1
    const userId = req.user?.id || 1;

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const existingRating = await Rating.findOne({
      where: { fileId: id, createdBy: userId }
    });

    if (existingRating) {
      if (existingRating.value === 'like') {
        await existingRating.destroy();
        return res.status(200).json({ message: "Like removed." });
      }
      existingRating.value = 'like';
      await existingRating.save();
      return res.status(200).json({ message: "Dislike changed to Like." });
    }
    await Rating.create({
      fileId: id,
      value: 'like',
      createdBy: userId
    });
    return res.status(200).json({ message: "File upvoted successfully." });
  } catch (err) {
    next(err);
  }
};


exports.dislike = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: ko bo implenetirana seja, mora javiti napako namesto nastaviti 1
    const userId = req.user?.id || 1;

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const existingRating = await Rating.findOne({
      where: { fileId: id, createdBy: userId }
    });

    if (existingRating) {
      if (existingRating.value === 'dislike') {
        await existingRating.destroy();
        return res.status(200).json({ message: "Dislike removed." });
      }
      existingRating.value = 'dislike';
      await existingRating.save();
      return res.status(200).json({ message: "Like changed to Dislike." });
    }
    await Rating.create({
      fileId: id,
      value: 'dislike',
      createdBy: userId
    });
    return res.status(200).json({ message: "File downvoted successfully." });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ error: 'File id is required.' });
    }

    const fileRecord = await File.findByPk(fileId);
    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Remove leading slash from stored path to get the Firebase Storage key
    const firebasePath = fileRecord.path.startsWith('/') 
      ? fileRecord.path.slice(1) 
      : fileRecord.path;

    const remoteFile = bucket.file(firebasePath);

    // Fetch metadata for content type
    const [metadata] = await remoteFile.getMetadata();

    // Set response headers for download
    res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileRecord.name}"`
    );

    // Stream the file contents to the response
    const readStream = remoteFile.createReadStream();
    readStream.on('error', err => next(err));
    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
};
