const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'socioloski-3d252.firebasestorage.app'
});

const bucket = admin.storage().bucket();

module.exports = { bucket };