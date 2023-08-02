-- init DBs
DROP DATABASE IF EXISTS TAS;
CREATE DATABASE TAS;
USE TAS;

-- init tables
DROP TABLE IF EXISTS Student;
CREATE TABLE Student(
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  status ENUM('Active', 'Suspended') NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Teacher;
CREATE TABLE Teacher(
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS StudentTeacherRelation;
CREATE TABLE StudentTeacherRelation(
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  studentId INT(10) REFERENCES Student(id) ON DELETE CASCADE ON UPDATE CASCADE,
  teacherId INT(10) REFERENCES Teacher(id) ON DELETE CASCADE ON UPDATE CASCADE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- init data
INSERT INTO Student (id, email) VALUES (0, 'orphan_student@gmail.com');
INSERT INTO Student (id, email) VALUES (1, 'common_student1@gmail.com');
INSERT INTO Student (id, email) VALUES (2, 'common_student2@gmail.com');
INSERT INTO Student (id, email) VALUES (3, 'bob_student1@gmail.com');
INSERT INTO Student (id, email) VALUES (4, 'bob_student2@gmail.com');
INSERT INTO Student (id, email) VALUES (5, 'agnes_student1@gmail.com');
INSERT INTO Student (id, email) VALUES (6, 'agnes_student2@gmail.com');
INSERT INTO Student (id, email) VALUES (7, 'chad_student@gmail.com');

INSERT INTO Teacher (id, email) VALUES (0, 'orphan_teacher@moe.edu.sg');
INSERT INTO Teacher (id, email) VALUES (1, 'teacher_bob@moe.edu.sg');
INSERT INTO Teacher (id, email) VALUES (2, 'teacher_agnes@moe.edu.sg');
INSERT INTO Teacher (id, email) VALUES (3, 'teacher_chad@moe.edu.sg');

INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (1, 1);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (2, 1);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (3, 1);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (4, 1);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (1, 2);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (2, 2);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (5, 2);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (6, 2);
INSERT INTO StudentTeacherRelation (studentId, teacherId) VALUES (7, 3);
