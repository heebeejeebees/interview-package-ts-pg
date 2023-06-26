import { Sequelize } from 'sequelize';
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

export default sequelize;
