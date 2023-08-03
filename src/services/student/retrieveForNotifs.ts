import {
  RetrieveForNotifsStudentReq,
  RetrieveForNotifsStudentRes,
} from '../types';
import { Student, Teacher } from '../../models';
import { StudentStatus } from '../../models/types';
import Logger from '../../config/logger';
import {
  throwAndLog,
  throwNotProvidedError,
  getEmailMentions,
  transformMentionsToEmails,
  throwInvalidEmailError,
} from '../../utils/string';
import { validateEmail } from '../../validators/string';
import { Op } from 'sequelize';

const LOG = new Logger('retrieveForNotifs.ts');

/**
 * /retrievefornotifications API - to retrieve a list of students who can receive a given notification
 * @param {RetrieveForNotifsStudentReq} ctx context of request body
 * @param {string} ctx.teacher who is sending the notification
 * @param {string} ctx.notification content
 * @returns {Promise<RetrieveForNotifsStudentRes>} list of student recipients
 */
const retrieveForNotifsStudent = async (
  ctx: RetrieveForNotifsStudentReq
): Promise<RetrieveForNotifsStudentRes> => {
  // check if notification not provided
  if (!ctx.notification) {
    throwNotProvidedError(LOG, 'notification');
  }
  // check if email invalid
  if (!validateEmail(ctx.teacher)) {
    throwInvalidEmailError(LOG, ctx.teacher);
  }
  // retrieve all valid emails prefixed with '@'
  const emailMentions = getEmailMentions(ctx.notification);
  if (!emailMentions || emailMentions.length === 0) {
    throwAndLog(
      LOG,
      'No email was @mentioned in notification content: ' + ctx.notification
    );
  }
  // retrieve students under teacher or mentioned
  const students = await Student.findAll({
    where: {
      status: { [Op.ne]: StudentStatus.SUSPENDED },
      [Op.or]: [
        { email: transformMentionsToEmails(emailMentions) },
        { '$Teachers.email$': ctx.teacher },
      ],
    },
    include: { model: Teacher },
  });
  // if empty, just return empty
  return {
    recipients: students.map((student) => student.dataValues.email),
  };
};

export default retrieveForNotifsStudent;
