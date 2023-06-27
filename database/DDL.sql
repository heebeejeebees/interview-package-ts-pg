-- init DBs
DROP DATABASE IF EXISTS TAS;
CREATE DATABASE TAS;
USE TAS;

-- init tables
DROP TABLE IF EXISTS Student;
CREATE TABLE Student(
  ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) NOT NULL,
  Status ENUM('Active', 'Suspended') NOT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Teacher;
CREATE TABLE Teacher(
  ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) NOT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS StudentTeacherRelation;
CREATE TABLE StudentTeacherRelation(
  StudentID INT(10) REFERENCES Student(ID) ON DELETE CASCADE ON UPDATE CASCADE,
  TeacherID INT(10) REFERENCES Teacher(ID) ON DELETE CASCADE ON UPDATE CASCADE,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (StudentID, TeacherID)
);

-- init data
INSERT INTO Student (ID, Email) VALUES (1, 'common_student@gmail.com');
INSERT INTO Student (ID, Email) VALUES (2, 'common_student@gmail.com');
INSERT INTO Teacher (ID, Email) VALUES (1, 'teacher_bob@moe.edu.sg');
INSERT INTO Teacher (ID, Email) VALUES (2, 'teacher_agnes@moe.edu.sg');

INSERT INTO StudentTeacherRelation (StudentID, TeacherID) VALUES (1,2);
INSERT INTO StudentTeacherRelation (StudentID, TeacherID) VALUES (2,1);
