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
  extractEmailMentions,
  transformMentionsToEmails,
} from '../../utils/string';

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
  // retrieve all valid emails prefixed with '@'
  const emailMentions = extractEmailMentions(ctx.notification);
  if (emailMentions.length === 0) {
    throwAndLog(
      LOG,
      'No email was @mentioned in notification content: ' + ctx.notification
    );
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
  return {
    recipients: students.map((student) => student.dataValues.email),
  };
};

export default retrieveForNotifsStudent;
