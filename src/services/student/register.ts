import { RegisterStudentReq } from '../types';
import { Student, Teacher, StudentTeacherRelation } from '../../models';
import { StudentStatus } from '../../models/types';
import { validateEmail } from '../../validators/string';
import Logger from '../../config/logger';
import { StatusCodes } from 'http-status-codes';
import {
  throwAndLog,
  throwNotProvidedError,
  throwInvalidEmailError,
  throwNotFoundError,
} from '../../utils/string';

const LOG = new Logger('register.ts');

/**
 * /register API - to register multiple new or existing students under a specified teacher
 * @param {RegisterStudentReq} ctx context of request body
 * @param {string} ctx.teacher specified teacher
 * @param {string[]} ctx.students list of student emails to be registered
 * @returns {Promise<number>} HTTP 204 if at least 1 success
 */
const registerStudent = async (ctx: RegisterStudentReq): Promise<number> => {
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
  if (!ctx.students || ctx.students.length === 0) {
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
  if (successCount === 0) {
    throwAndLog(
      LOG,
      'No students have been newly registered under this teacher'
    );
  }
  return StatusCodes.NO_CONTENT;
};

export default registerStudent;
