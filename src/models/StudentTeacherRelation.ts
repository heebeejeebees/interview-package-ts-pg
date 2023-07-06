import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Student from './student';
import Teacher from './teacher';

const StudentTeacherRelation = sequelize.define(
  'StudentTeacherRelation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: Teacher,
      },
    },
  },
  { freezeTableName: true }
);

Student.belongsToMany(Teacher, { through: StudentTeacherRelation });
Teacher.belongsToMany(Student, { through: StudentTeacherRelation });

export { StudentTeacherRelation, Student, Teacher };
