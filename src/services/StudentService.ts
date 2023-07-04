import {
  RegisterStudentReq,
  RetrieveStudentRes,
  SuspendStudentReq,
  StudentStatus,
} from './types';
import { Student, Teacher, StudentTeacherRelation } from '../config/database';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import { StatusCodes } from 'http-status-codes';
import {
  throwNotProvidedError,
  throwInvalidEmailError,
  throwNotFoundError,
} from '../utils/string';

/**
 * /register API - to register multiple new or existing students under a specified teacher
 * @param {string} ctx.teacher specified teacher
 * @param {Array<string>} ctx.students list of student emails to be registered
 * @returns HTTP 204 if success
 */
const registerStudent = async (ctx: RegisterStudentReq): Promise<number> => {
  const LOG = new Logger('StudentService.ts - POST /api/register');
  // reject first if any email is invalid
  const emails = Object.values(ctx).flat();
  if (emails.length === 0) {
    throwNotProvidedError(LOG, 'email');
  }
  for (const email of emails) {
    if (!validateEmail(email)) {
      throwInvalidEmailError(LOG, email);
    }
  }
  if (!ctx.teacher) {
    throwNotProvidedError(LOG, 'teacher email');
  }
  const teacher = await Teacher.findOne({
    where: { email: ctx.teacher },
  });

  // check if teacher doesn't exist
  if (teacher === null) {
    throwNotFoundError(LOG, 'teacher', ctx.teacher);
  }

  let successCount = 0;

  if (ctx.students.length === 0) {
    throwNotProvidedError(LOG, 'student emails');
  }

  for (const email of ctx.students) {
    // register new or existing student
    const [student] = await Student.findOrCreate({
      where: {
        email,
        status: StudentStatus.ACTIVE,
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
 * /commonstudents API - to retrieve list of students registered to a given list of teacher(s)
 * @param {Array<string>} emails list of teacher email(s)
 * @returns list of student emails
 */
const retrieveStudent = async (
  emails: string[]
): Promise<RetrieveStudentRes> => {
  const LOG = new Logger('StudentService.ts - GET /api/commonstudents');
  // check if no query
  if (!emails) {
    throwNotProvidedError(LOG, 'teacher email(s)');
  }
  // reject if any email is invalid
  for (const email of emails) {
    if (!validateEmail(email)) {
      throwInvalidEmailError(LOG, email);
    }
  }
  // retrieve students
  const students = await Student.findAll({
    where: { status: StudentStatus.ACTIVE },
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
  const LOG = new Logger('StudentService.ts - POST /api/suspend');
  if (!ctx.student) {
    throwNotProvidedError(LOG, 'student email');
  }
  if (!validateEmail(ctx.student)) {
    throwInvalidEmailError(LOG, ctx.student);
  }
  const student = await Student.findOne({
    where: { email: ctx.student, status: StudentStatus.ACTIVE },
  });
  if (!student) {
    throwNotFoundError(LOG, 'Active student', ctx.student);
  }
  await student.update({ status: StudentStatus.SUSPENDED });
  await student.save();
  return student ? StatusCodes.NO_CONTENT : StatusCodes.BAD_REQUEST;
};

export default { registerStudent, retrieveStudent, suspendStudent };
