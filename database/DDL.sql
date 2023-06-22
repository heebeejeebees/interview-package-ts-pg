CREATE TABLE Student(
StudentID INT(10) PRIMARY KEY,
Email VARCHAR(100),
);
CREATE TABLE Teacher(
TeacherID INT(10) PRIMARY KEY,
Email VARCHAR(100),
);

CREATE TABLE StudentTeacherRelation(
StudentID INT(15) NOT NULL,
TeacherID INT(14) NOT NULL,FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
FOREIGN KEY (TeacherID) REFERENCES Teacher(TeacherID),
UNIQUE (StudentID, TeacherID)
);

INSERT INTO Student ('Email') VALUES ('common_student@gmail.com');
INSERT INTO Student ('Email') VALUES ('common_student@gmail.com');
INSERT INTO Teacher ('Email') VALUES ('teacher_bob@moe.edu.sg');
INSERT INTO Teacher ('Email') VALUES ('teacher_agnes@moe.edu.sg');

INSERT INTO StudentTeacherRelation ('StudentID','TeacherID') VALUES (1,2);
INSERT INTO StudentTeacherRelation ('StudentID','TeacherID') VALUES (2,1);
