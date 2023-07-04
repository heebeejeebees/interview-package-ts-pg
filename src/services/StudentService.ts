import {
  RegisterStudentReq,
  RetrieveStudentRes,
  SuspendStudentReq,
} from './types';
import { Student, Teacher, StudentTeacherRelation } from '../config/database';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const LOG = new Logger('StudentService.ts');

/**
 * /register API - to register multiple new or existing students under a specified teacher
 * @param {string} ctx.teacher specified teacher
 * @param {Array<string>} ctx.students list of student emails to be registered
 * @returns HTTP 204 if success
 */
const registerStudent = async (ctx: RegisterStudentReq): Promise<number> => {
  // reject first if any email is invalid
  const emails = Object.values(ctx).flat();
  if (emails.length === 0) {
    throw new AppError('No email provided', StatusCodes.BAD_REQUEST);
  }
  for (const email of emails) {
    if (!validateEmail(email)) {
      LOG.error('POST /api/register, email invalid: ' + email);
      throw new AppError(
        `Invalid email provided: ${email}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  const teacher = await Teacher.findOne({
    where: { email: ctx.teacher },
  });

  // check if teacher doesn't exist
  if (teacher === null) {
    LOG.error(
      'POST /api/register, teacher not found, ctx: ' + JSON.stringify(ctx)
    );
    throw new AppError(
      `Teacher (email: ${ctx.teacher}) does not exist`,
      StatusCodes.BAD_REQUEST
    );
  }

  let successCount = 0;

  for (const email of ctx.students) {
    // register new or existing student
    const [student] = await Student.findOrCreate({
      where: {
        email,
        status: 'Active',
      },
    });

    // register student under teacher
    const [, created] = await StudentTeacherRelation.findOrCreate({
      where: {
        studentId: student.dataValues.id,
        teacherId: teacher.dataValues.id,
      },
    });

    if (created) {
      successCount++;
    }
  }

  // success if at least 1 new student-teacher relationship added
  return successCount > 0 ? StatusCodes.NO_CONTENT : StatusCodes.BAD_REQUEST;
};

/**
 * /commonstudents API - to retrieve list of students registered to a given list of teachers
 * @param {Array<string>} emails list of teacher emails
 * @returns list of student emails
 */
const retrieveStudent = async (
  emails: string[]
): Promise<RetrieveStudentRes> => {
  // check if no query
  if (!emails) {
    LOG.error('GET /api/commonstudents, no email provided');
    throw new AppError('No email provided', StatusCodes.BAD_REQUEST);
  }
  // reject if any email is invalid
  for (const email of emails) {
    if (!validateEmail(email)) {
      LOG.error('GET /api/commonstudents, invalid email: ' + email);
      throw new AppError(
        `Invalid email provided: ${email}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }
  // retrieve students
  const students = await Student.findAll({
    where: { status: 'Active' },
    include: { model: Teacher, where: { email: emails } },
  });
  return { students: students.map((student) => student.dataValues.email) };
};

/**
 * /suspend API - to suspend a specified student
 * @param {string} ctx.student email of student to suspend
 * @returns HTTP 204 if success
 */
const suspendStudent = async (ctx: SuspendStudentReq): Promise<number> => {
  if (!ctx.student) {
    LOG.error('GET /api/suspend, no email provided');
    throw new AppError('No email provided', StatusCodes.BAD_REQUEST);
  }
  if (!validateEmail(ctx.student)) {
    LOG.error('GET /api/suspend, invalid email: ' + ctx.student);
    throw new AppError(
      `Invalid email provided: ${ctx.student}`,
      StatusCodes.BAD_REQUEST
    );
  }
  const student = await Student.findOne({
    where: { email: ctx.student, status: 'Active' },
  });
  if (!student) {
    LOG.error('POST /api/suspend, student not found, email: ' + ctx.student);
    throw new AppError(
      `Student (email: ${ctx.student}) is not active or does not exist`,
      StatusCodes.BAD_REQUEST
    );
  }
  await student.update({ status: 'Suspended' });
  await student.save();
  return student ? StatusCodes.NO_CONTENT : StatusCodes.BAD_REQUEST;
};

export default { registerStudent, retrieveStudent, suspendStudent };
