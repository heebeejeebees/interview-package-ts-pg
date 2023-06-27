import { RegisterStudentReq } from './types';
import sequelize, { Student, Teacher } from '../config/database';
import { QueryTypes } from 'sequelize';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const LOG = new Logger('StudentService.ts');

const registerStudent = async (ctx: RegisterStudentReq): Promise<void> => {
  LOG.info('registerStudent ctx: ' + JSON.stringify(ctx));

  const invalidEmails: string[] = [];

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

  const existingTeacherStudents = await Teacher.findAll({
    include: {
      model: Student,
      required: true,
      where: {
        email: ctx.students,
      },
    },
  });

  let filteredStudentsEmail: string[] = [];

  if (existingTeacherStudents.length > 0) {
    const existingStudentEmails: string[] = [];
    existingTeacherStudents.forEach((teacherStudent) => {
      const existingStudentEmail = teacherStudent.dataValues.student.email;
      existingStudentEmails.push(existingStudentEmail);
      filteredStudentsEmail = ctx.students.filter(
        (e) => e !== existingStudentEmail
      );
    });
    throw new AppError(
      `Student(s) ${existingStudentEmails.toString()} is already under ${
        ctx.teacher
      }`,
      StatusCodes.BAD_REQUEST
    );
  } else {
    filteredStudentsEmail = ctx.students;
  }

  filteredStudentsEmail.forEach(async (email) => {
    if (!validateEmail(email)) {
      invalidEmails.push(email);
      return;
    }

    // TODO: use model and insert teacher-student relation also
    await sequelize.query(
      `INSERT INTO Student (EMAIL)
      VALUES ('${email}')`,
      {
        type: QueryTypes.INSERT,
      }
    );
  });

  if (invalidEmails.length > 0) {
    throw new AppError(
      'Invalid student email(s) provided: ' + invalidEmails.toString(),
      StatusCodes.BAD_REQUEST
    );
  }

  // TODO: revisit above code sequence
};

export default { registerStudent };
