-- Insert sample users
INSERT INTO users (username, email, password, profile_picture_path, created_at) 
VALUES 
    ('user1', 'user1@example.com', 'hash1', '/path/to/profile1.jpg', CURRENT_TIMESTAMP),
    ('user2', 'user2@example.com', 'wswasdaw', '/path/to/profile2.jpg', CURRENT_TIMESTAMP);

-- Insert sample study programs
INSERT INTO study_programs (name) 
VALUES 
    ('Computer Science UN'),
    ('Electrical Engineering VS');

-- Insert sample study program years
INSERT INTO study_programs_year (year, degree_level, semester, program_id) 
VALUES 
    (2023, 'undergraduate', 1, 1),
    (2023, 'master', 1, 2);
    (2023, 'doctoral', 1, 2);

-- Insert sample subjects
INSERT INTO subjects (name, study_programs_year_id) 
VALUES 
    ('Algorithms', 1),
    ('Circuits', 2);
    ('Phisics', 3);

-- Insert sample file tags
INSERT INTO file_tags (name) 
VALUES 
    ('exam'), 
    ('cheatsheet');

-- Insert sample files
INSERT INTO files (name, path, created_at, created_by, tag_id, subject_id) 
VALUES 
    ('algorithms_exam.pdf', '/files/algorithms_exam.pdf', CURRENT_TIMESTAMP, 1, 1, 1),
    ('circuits_cheatsheet.pdf', '/files/circuits_cheatsheet.pdf', CURRENT_TIMESTAMP, 2, 2, 2);

-- Insert sample ratings
INSERT INTO ratings (value, created_by, file_id, created_at) 
VALUES 
    ('like', 1, 1, CURRENT_TIMESTAMP),
    ('dislike', 2, 2, CURRENT_TIMESTAMP);

-- Insert sample file reports
INSERT INTO file_reports (file_id, created_by, reason, description, created_at) 
VALUES 
    (1, 2, 'misleading', 'The exam content does not match the syllabus.', CURRENT_TIMESTAMP),
    (2, 1, 'inaccurate', 'The cheatsheet is outdated.', CURRENT_TIMESTAMP);

-- Insert sample comments
INSERT INTO comments (title, content, created_by, created_at, parent_comment_id, file_id) 
VALUES 
    ('Great file!', 'This is a really helpful exam paper.', 1, CURRENT_TIMESTAMP, NULL, 1),
    ('Needs improvement', 'Some parts are unclear.', 2, CURRENT_TIMESTAMP, NULL, 2),
    ('Follow-up comment', 'Can you clarify the second section?', 1, CURRENT_TIMESTAMP, 1, NULL);
