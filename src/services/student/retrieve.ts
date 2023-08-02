import { RetrieveStudentRes } from '../types';
import { Student, Teacher } from '../../models';
import { validateEmail } from '../../validators/string';
import Logger from '../../config/logger';
import {
  throwNotProvidedError,
  throwInvalidEmailError,
  getIntersection,
} from '../../utils/string';

const LOG = new Logger('retrieve.ts');

/**
 * /commonstudents API - to retrieve list of common students registered to a given list of teacher(s)
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
  // to get list student emails per teacher
  const studentsByTeachers: string[][] = [];
  for (const email of emails) {
    // reject if any email is invalid
    if (!validateEmail(email)) {
      throwInvalidEmailError(LOG, email);
    }
    // get all students under current teacher
    const students = await Student.findAll({
      include: { model: Teacher, where: { email } },
    });
    studentsByTeachers.push(
      students.map((student) => student.dataValues.email)
    );
  }
  // retrieve common students
  // if empty, just return empty
  return { students: getIntersection(studentsByTeachers) };
};

export default retrieveStudent;
