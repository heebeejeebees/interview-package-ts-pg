import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export type RegisterStudentReq = {
  teacher: string;
  students: string[];
};

export type StudentStatus = 'Active' | 'Suspended';

export class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare status: CreationOptional<StudentStatus>;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

export class Teacher extends Model<
  InferAttributes<Teacher>,
  InferCreationAttributes<Teacher>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}
