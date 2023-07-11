import {
  DataTypes
} from 'sequelize';
import sequelize from '../config/database';
import { StudentModel } from './types';


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

export default Student;
