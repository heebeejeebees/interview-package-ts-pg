import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';
import sequelize from '../config/database';

interface TeacherModel
  extends Model<
    InferAttributes<TeacherModel>,
    InferCreationAttributes<TeacherModel>
  > {
  id: CreationOptional<number>;
  email: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

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

export { Teacher, TeacherModel };
