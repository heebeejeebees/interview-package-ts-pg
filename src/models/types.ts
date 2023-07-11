import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

export enum StudentStatus {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
}

export interface StudentModel
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

export interface TeacherModel
  extends Model<
    InferAttributes<TeacherModel>,
    InferCreationAttributes<TeacherModel>
  > {
  id: CreationOptional<number>;
  email: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export interface StudentTeacherRelationModel
  extends Model<
    InferAttributes<StudentTeacherRelationModel>,
    InferCreationAttributes<StudentTeacherRelationModel>
  > {
  id: CreationOptional<number>;
  studentId: number;
  teacherId: number;
}