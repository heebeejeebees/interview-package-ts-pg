import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';
import sequelize from '../config/database';
import { StudentStatus } from './types';

interface StudentModel
  extends Model<
    InferAttributes<StudentModel>,
    InferCreationAttributes<StudentModel>
  > {
  id: CreationOptional<number>;
  email: string;
  status: StudentStatus;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const Student = sequelize.define<StudentModel>(
  'Student',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Suspended'),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { freezeTableName: true }
);

export { Student, StudentModel };
