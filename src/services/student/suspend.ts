import { SuspendStudentReq } from '../types';
import { Student } from '../../models';
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

const LOG = new Logger('suspend.ts');

/**
 * /suspend API - to suspend a specified student
 * @param {SuspendStudentReq} ctx context of request body
 * @param {string} ctx.student email of student to suspend
 * @returns {Promise<number>} HTTP 204 if success
 */
const suspendStudent = async (ctx: SuspendStudentReq): Promise<number> => {
  // check if no student provided
  if (!ctx.student) {
    throwNotProvidedError(LOG, 'student email');
  }
  // check if email valid
  if (!validateEmail(ctx.student)) {
    throwInvalidEmailError(LOG, ctx.student);
  }
  // get active student to update
  const student = await Student.findOne({
    where: { email: ctx.student, status: StudentStatus.ACTIVE },
  });
  // check if student exists as active
  if (!student) {
    throwNotFoundError(LOG, 'Active student', ctx.student);
  }
  // suspend student
  await student.update({ status: StudentStatus.SUSPENDED });
  await student.save();
  return StatusCodes.NO_CONTENT;
};

export default suspendStudent;
