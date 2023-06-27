import { RegisterStudentReq } from './types';
import sequelize, { Teacher } from '../config/database';
import { QueryTypes } from 'sequelize';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const LOG = new Logger('StudentService.ts');

const registerStudent = async (ctx: RegisterStudentReq): Promise<void> => {
  LOG.info('registerStudent ctx: ' + JSON.stringify(ctx));

  const invalidEmails: string[] = [];
  const existingEmails: string[] = [];

  if (!validateEmail(ctx.teacher)) {
    throw new AppError(
      `Invalid teacher email provided: ${ctx.teacher}`,
      StatusCodes.BAD_REQUEST
    );
  }

  const {
    dataValues: { id: teacherId },
  } = await Teacher.findOne({ where: { email: ctx.teacher } });

  if (!teacherId) {
    throw new AppError(
      `Teacher does not exist: ${ctx.teacher}`,
      StatusCodes.BAD_REQUEST
    );
  }

  ctx.students.forEach(async (email) => {
    if (!validateEmail(email)) {
      invalidEmails.push(email);
      return;
    }
    // TODO: check if student and relation exists
    await sequelize.query(
      `INSERT INTO Student (EMAIL)
      VALUES ('${email}')`,
      {
        type: QueryTypes.INSERT,
      }
    );
    // TODO: insert teacher-student relation
  });

  if (invalidEmails.length > 0 || existingEmails.length > 0) {
    throw new AppError(
      'Invalid student email(s) provided: ' + invalidEmails.toString(),
      StatusCodes.BAD_REQUEST
    );
  }
};

export default { registerStudent };
