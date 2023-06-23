-- init DBs
DROP DATABASE IF EXISTS TAS;
CREATE DATABASE TAS;
USE TAS;

-- init tables
CREATE TABLE Student(
  ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) NOT NULL,
  Status ENUM('Active', 'Suspended') NOT NULL
);

CREATE TABLE Teacher(
  ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) NOT NULL
);

CREATE TABLE StudentTeacherRelation(
  StudentID INT(15) NOT NULL,
  TeacherID INT(14) NOT NULL,
  FOREIGN KEY (StudentID) REFERENCES Student(ID),
  FOREIGN KEY (TeacherID) REFERENCES Teacher(ID)
);

-- init data
INSERT INTO Student (ID, Email) VALUES (1, 'common_student@gmail.com');
INSERT INTO Student (ID, Email) VALUES (2, 'common_student@gmail.com');
INSERT INTO Teacher (ID, Email) VALUES (1, 'teacher_bob@moe.edu.sg');
INSERT INTO Teacher (ID, Email) VALUES (2, 'teacher_agnes@moe.edu.sg');

INSERT INTO StudentTeacherRelation (StudentID, TeacherID) VALUES (1,2);
INSERT INTO StudentTeacherRelation (StudentID, TeacherID) VALUES (2,1);
