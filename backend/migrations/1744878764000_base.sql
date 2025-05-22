-- Up Migration
CREATE TYPE ROLE_ENUM AS ENUM ('admin', 'user', 'trusted');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture_path TEXT NOT NULL, -- A default picture could be set here
    trust_score INTEGER NOT NULL DEFAULT 0, -- trust score of the user
    role ROLE_ENUM NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_tags ( -- example: exam, cheatsheet,...
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS study_programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL -- UN/VS are part of the name
);

CREATE TYPE DEGREE_LEVEL_ENUM AS ENUM ('undergraduate', 'master', 'PhD', 'other'); -- stopnja

CREATE TABLE IF NOT EXISTS study_programs_year ( -- Could be 1 table with study_programs
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    degree_level DEGREE_LEVEL_ENUM NOT NULL,
    semester INT NOT NULL,
    program_id INTEGER REFERENCES study_programs(id) NOT NULL
);


CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    study_programs_year_id INTEGER REFERENCES study_programs_year(id) NOT NULL-- subject can only connect to 1 program year
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL, -- file is saved localy, this is the path to it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    tag_id INTEGER REFERENCES file_tags(id),
    subject_id INTEGER REFERENCES subjects(id)
);



CREATE TYPE REPORT_ENUM AS ENUM ('unsafe', 'inappropriate', 'useless', 'misleading', 'inaccurate', 'corrupted', 'other');

CREATE TABLE IF NOT EXISTS file_reports (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) NOT NULL,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    reason REPORT_ENUM NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE RATING_ENUM AS ENUM ('like', 'dislike');

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    value RATING_ENUM NOT NULL, 
    created_by INTEGER REFERENCES users(id) NOT NULL,
    file_id INTEGER REFERENCES files(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ratings ADD CONSTRAINT unique_user_file_rating UNIQUE (created_by, file_id); -- limit likes per file and user

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- comment or file
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    CHECK (
        (parent_comment_id IS NOT NULL AND file_id IS NULL) OR
        (parent_comment_id IS NULL AND file_id IS NOT NULL)
    )  -- exactly 1 is valid
);

/***
    INDEXES
***/

-- created_by
CREATE INDEX idx_files_created_by ON files (created_by);
CREATE INDEX idx_file_reports_created_by ON file_reports (created_by);
CREATE INDEX idx_ratings_created_by ON ratings (created_by);
CREATE INDEX idx_comments_created_by ON comments (created_by);


-- file_id
CREATE INDEX idx_file_reports_file_id ON file_reports (file_id);
CREATE INDEX idx_ratings_file_id ON ratings (file_id);
CREATE INDEX idx_comments_file_id ON comments (file_id);

-- Down Migration
DROP INDEX idx_comments_file_id;
DROP INDEX idx_ratings_file_id;
DROP INDEX idx_file_reports_file_id;

DROP INDEX idx_comments_created_by;
DROP INDEX idx_ratings_created_by;
DROP INDEX idx_file_reports_created_by;
DROP INDEX idx_files_created_by;

DROP TABLE comments;

DROP TABLE ratings;
DROP TYPE RATING_ENUM;

DROP TABLE file_reports;
DROP TYPE REPORT_ENUM;

DROP TABLE files;

DROP TABLE subjects;

DROP TABLE study_programs_year;
DROP TYPE DEGREE_LEVEL_ENUM;

DROP TABLE study_programs;

DROP TABLE file_tags;

DROP TABLE users;
