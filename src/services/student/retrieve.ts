import { RetrieveStudentRes } from '../types';
import { Student, Teacher } from '../../models';
import { StudentStatus } from '../../models/types';
import { validateEmail } from '../../validators/string';
import Logger from '../../config/logger';
import {
  throwNotProvidedError,
  throwInvalidEmailError,
} from '../../utils/string';

const LOG = new Logger('retrieve.ts');

/**
 * /commonstudents API - to retrieve list of students registered to a given list of teacher(s)
 * @param {string[]} emails list of teacher email(s)
 * @returns {Promise<RetrieveStudentRes>} list of student emails
 */
const retrieveStudent = async (
  emails: string[]
): Promise<RetrieveStudentRes> => {
  // check if no emails provided
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
  return {
    students: students.map((student) => student.dataValues.email),
  };
};

export default retrieveStudent;
