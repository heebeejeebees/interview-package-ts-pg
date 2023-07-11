import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { StudentTeacherRelationModel } from './types';
import Student from './Student';
import Teacher from './Teacher';

const StudentTeacherRelation = sequelize.define<StudentTeacherRelationModel>(
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
