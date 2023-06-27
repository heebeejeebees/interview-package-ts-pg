import { DataTypes, Sequelize } from 'sequelize';
import Logger from './logger';

const LOG = new Logger('database.ts');
const {
  DB_HOST,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
  DB_PW,
  DB_POOL_ACQUIRE,
  DB_POOL_IDLE,
  DB_POOL_MAX_CONN,
  DB_POOL_MIN_CONN,
  DB_LOG_LEVEL,
} = process.env;

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PW, {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  pool: {
    acquire: parseInt(DB_POOL_ACQUIRE),
    idle: parseInt(DB_POOL_IDLE),
    max: parseInt(DB_POOL_MAX_CONN),
    min: parseInt(DB_POOL_MIN_CONN),
  },
  timezone: '+08:00',
  logging: (msg) => {
    LOG.log(DB_LOG_LEVEL, msg);
  },
});

const Student = sequelize.define(
  'Student',
  {
    id: {
      field: 'ID',
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      field: 'Email',
      type: DataTypes.STRING,
    },
    status: {
      field: 'Status',
      type: DataTypes.ENUM('Active', 'Suspended'),
    },
    createdAt: {
      field: 'CreatedAt',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'UpdatedAt',
      type: DataTypes.DATE,
    },
  },
  { freezeTableName: true }
);

const Teacher = sequelize.define(
  'Teacher',
  {
    id: {
      field: 'ID',
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      field: 'Email',
      type: DataTypes.STRING,
    },
    createdAt: {
      field: 'CreatedAt',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'UpdatedAt',
      type: DataTypes.DATE,
    },
  },
  { freezeTableName: true }
);

const StudentTeacherRelation = sequelize.define(
  'StudentTeacherRelation',
  {
    studentId: {
      field: 'StudentID',
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: 'ID',
      },
    },
    teacherId: {
      field: 'TeacherID',
      type: DataTypes.INTEGER,
      references: {
        model: Teacher,
        key: 'ID',
      },
    },
  },
  { freezeTableName: true }
);

// TODO: add unique constraint for all `email`s?
Student.belongsToMany(Teacher, { through: StudentTeacherRelation });
Teacher.belongsToMany(Student, { through: StudentTeacherRelation });

export { Student, Teacher };
export default sequelize;
