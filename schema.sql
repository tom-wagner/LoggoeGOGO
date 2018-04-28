-- NEW DB:

DROP DATABASE IF EXISTS oneTeam;
CREATE DATABASE oneTeam;
USE oneTeam;

-- -- added in order to allow videos to be deleted that are currently
-- -- referenced as foreign keys in timeStamps and teacherComments
-- SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE users (
  -- 'name' is equivalent to username
  -- not renamed to username in order to avoid breaking legacy code

  -- LEGACY CODE:
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL UNIQUE KEY,
  owner BOOLEAN NOT NULL, -- 1 if user is a teacher, 0 if user is a student

  -- NEW COLUMNS:
  firstName varchar(255),
  lastName varchar(255),
  hashedPassword varchar(255),
  salt varchar(255)
);

CREATE TABLE videos (
  -- LEGACY CODE:
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  videoId varchar(255) NOT NULL UNIQUE KEY,
  title varchar(255) NOT NULL,
  description varchar(255),
  image varchar(255),
  userId INT NOT NULL, -- changed from INT(11) to INT in order to set as Foreign Key
  duration INT(11),

  -- NEW COLUMNS:
  videoDescription varchar(255),
  series varchar(255),
  idxInSeries INT,

  -- FOREIGN KEY REFERENCES TO OTHER TABLES:
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE timeStamps (
  -- LEGACY CODE:
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  videoId varchar(255) NOT NULL,
  userId INT NOT NULL, -- changed from INT(11) to INT in order to set as Foreign Key
  timeStamp INT(11) NOT NULL,
  comment varchar(255),
  username varchar(255), -- added in order to play nice with legacy code

  -- NEW COLUMNS:
  addressedByTeacher BOOLEAN NOT NULL DEFAULT 0,
  commentType varchar(255),
  video INT,

  -- FOREIGN KEY REFERENCES TO OTHER TABLES:
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video) REFERENCES videos(id) ON DELETE CASCADE
);

-- NEW TABLE:
CREATE TABLE teacherComments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  comment varchar(255),
  videoId varchar(255),
  video INT,
  userId INT,
  begRange VARCHAR(11), -- Beginning timestamp of the video addressed by comment
  endRange VARCHAR(11), -- Ending timestamp of the video addressed by comment
  commentType varchar(255),

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE chats (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  video INT,
  videoId varchar(255) NOT NULL,
  username varchar(255),
  userId INT,
  text varchar(255),
  timeStamp DATETIME NOT NULL,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE uploads (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  videoId varchar(255) NOT NULL,
  url varchar(255) NOT NULL,
  filename varchar(255),
  fileType varchar(50),
  size INT
);

INSERT INTO users (name, firstName, lastName, hashedPassword, salt, owner) VALUES ('tom', 'Tom', 'Wagner', '123', '456', true);
INSERT INTO users (name, firstName, lastName, hashedPassword, salt, owner) VALUES ('amy', 'Amy', 'San Felipe', '123', '456', true);
INSERT INTO users (name, firstName, lastName, hashedPassword, salt, owner) VALUES ('ian', 'Ian', 'Pradhan', '123', '456', false);
INSERT INTO users (name, firstName, lastName, hashedPassword, salt, owner) VALUES ('wei', 'Wei', 'Gao', '123', '456', false);

-- insert a video for students to see:
INSERT INTO videos (videoId, title, userId, description, image, duration) VALUES ('ZK3O402wf1c', 'Lec 1 | MIT 18.06 Linear Algebra, Spring 2005', 1, 'Lecture 1: The Geometry of Linear Equations. View …e information at http://ocw.mit.edu/terms More...', 'https://i.ytimg.com/vi/ZK3O402wf1c/default.jpg', 2389);

-- insert a comment on the above video:
INSERT INTO timeStamps (videoId, userId, timeStamp, comment, addressedByTeacher, commentType, video) VALUES ('ZK3O402wf1c', 4, 132, 'hello so confused!!', false, null, 1);

-- insert a teacher comment on the video
INSERT INTO teacherComments (video, userId, begRange, endRange, comment) VALUES (1, 2, 110, 132, "I'm sorry you're confused!");
