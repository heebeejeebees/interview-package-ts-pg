import {
  RegisterStudentReq,
  RetrieveStudentRes,
  SuspendStudentReq,
  StudentStatus,
  RetrieveForNotifsStudentReq,
  RetrieveForNotifsStudentRes,
} from './types';
import { Student, Teacher, StudentTeacherRelation } from '../config/database';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import { StatusCodes } from 'http-status-codes';
import {
  throwNotProvidedError,
  throwInvalidEmailError,
  throwNotFoundError,
  extractEmailMentions,
  transformMentionsToEmails,
} from '../utils/string';
import AppError from '../errors/AppError';

/**
 * /register API - to register multiple new or existing students under a specified teacher
 * @param {string} ctx.teacher specified teacher
 * @param {Array<string>} ctx.students list of student emails to be registered
 * @returns HTTP 204 if at least 1 success
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
  // check if teacher email not provided
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
  // check if student emails not provided
  if (ctx.students.length === 0) {
    throwNotProvidedError(LOG, 'student emails');
  }

  let successCount = 0;

  // start registering
  for (const email of ctx.students) {
    // register new and existing student
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
    // student newly registered under teacher
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
  // if empty, just return empty
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

/**
 * /retrievefornotifications API - to retrieve a list of students who can receive a given notification
 * @param {string} ctx.teacher who is sending the notification
 * @param {string} ctx.notification content
 * @returns list of student recipients
 */
const retrieveForNotifsStudent = async (
  ctx: RetrieveForNotifsStudentReq
): Promise<RetrieveForNotifsStudentRes> => {
  const LOG = new Logger(
    'StudentService.ts - POST /api/retrievefornotifications'
  );
  // check if notification not provided
  if (!ctx.notification) {
    throwNotProvidedError(LOG, 'notification');
  }
  // retrieve all valid emails prefixed with '@'
  const emailMentions = extractEmailMentions(ctx.notification);
  if (emailMentions.length === 0) {
    LOG.error(
      'No email was @mentioned in notification content: ' + ctx.notification
    );
    throw new AppError('No email was @mentioned in notification content');
  }
  // retrieve students
  const students = await Student.findAll({
    where: {
      email: transformMentionsToEmails(emailMentions),
      status: StudentStatus.ACTIVE,
    },
    include: { model: Teacher, where: { email: ctx.teacher } },
  });
  // if empty, just return empty
  return { recipients: students.map((student) => student.dataValues.email) };
};

export default {
  registerStudent,
  retrieveStudent,
  suspendStudent,
  retrieveForNotifsStudent,
};
