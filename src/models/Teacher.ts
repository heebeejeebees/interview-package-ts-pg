import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TeacherModel } from './types';

const Teacher = sequelize.define<TeacherModel>(
  'Teacher',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
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

export default Teacher;
