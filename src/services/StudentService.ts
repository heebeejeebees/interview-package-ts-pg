import { RegisterStudentReq } from './types';
import { Student, Teacher, StudentTeacherRelation } from '../config/database';
import { validateEmail } from '../validators/string';
import Logger from '../config/logger';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const LOG = new Logger('StudentService.ts');

const registerStudent = async (ctx: RegisterStudentReq): Promise<boolean> => {
  // reject first if any email is invalid
  Object.values(ctx)
    .flat()
    .forEach((email: string) => {
      console.log('email: ', email);
      if (!validateEmail(email)) {
        throw new AppError(
          `Invalid email(s) provided: ${email}`,
          StatusCodes.BAD_REQUEST
        );
      }
    });

  const teacher = await Teacher.findOne({
    where: { email: ctx.teacher },
  });

  // check if teacher doesn't exist
  if (teacher === null) {
    LOG.error('ctx: ' + JSON.stringify(ctx));
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
  return successCount > 0;
};

export default { registerStudent };
