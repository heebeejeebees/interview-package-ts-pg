import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';
import sequelize from '../config/database';
import { Student } from './Student';
import { Teacher } from './Teacher';

interface StudentTeacherRelationModel
  extends Model<
    InferAttributes<StudentTeacherRelationModel>,
    InferCreationAttributes<StudentTeacherRelationModel>
  > {
  id: CreationOptional<number>;
  studentId: number;
  teacherId: number;
}

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

export { StudentTeacherRelation, StudentTeacherRelationModel, Student, Teacher };
