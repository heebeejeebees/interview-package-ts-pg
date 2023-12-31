import { ParsedQs } from 'qs';
import AppError from '../errors/AppError';
import Logger from '../config/logger';

/**
 * logs and throws error
 * @param {Logger} LOG instantiated custom Logger
 * @param {string} msg message to be logged and thrown
 */
export const throwAndLog = (
  LOG: Logger,
  msg: string,
  httpStatusCode?: number
): void => {
  LOG.info(msg);
  throw new AppError(msg, httpStatusCode);
};

/**
 * logs and throws error when req param not provided by user
 * @param {Logger} LOG instantiated custom Logger
 * @param {string} param name of param not provided
 */
export const throwNotProvidedError = (LOG: Logger, param: string): void =>
  throwAndLog(LOG, `Param ${param} not provided`);

/**
 * logs and throws error when email is invalid
 * @param {Logger} LOG instantiated custom Logger
 * @param {string} email address provided
 */
export const throwInvalidEmailError = (LOG: Logger, email: string): void =>
  throwAndLog(LOG, `Invalid email: ${email}`);

/**
 * logs and throws error when sequelize model not found
 * @param {Logger} LOG instantiated custom Logger
 * @param {string} modelName name of model not found
 * @param {string} email used to find this model
 */
export const throwNotFoundError = (
  LOG: Logger,
  modelName: string,
  email: string
): void => {
  throwAndLog(LOG, `${modelName} not found, email: ${email}`);
};

/**
 * transforms ExpressJS Query Param to a string array
 * @param queryParam instantiated custom Logger
 * @returns array of 1 or more email strings
 */
export const transformExpressQueryParamToStringArray = (
  queryParam: string | string[] | ParsedQs | ParsedQs[]
): string[] => {
  // handle express query type
  let emails: string[] | undefined;
  if (queryParam === undefined) {
    // do nothing
  } else if (Array.isArray(queryParam)) {
    emails = queryParam.map((q: string | ParsedQs) => q.toString());
  } else {
    emails = [queryParam.toString()];
  }
  return emails;
};

/**
 * extracts '@' mentions on valid email formats
 * @param {string} content string to extract from
 * @returns array of email strings with '@' prefix
 */
export const getEmailMentions = (content: string): string[] =>
  content.match(
    /\B@(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))+/gi
  );

/**
 * removes '@' prefixes on mentions
 * @param {string[]} mentions list of strings with '@' prefix
 * @returns list of strings without '@' prefix
 */
export const transformMentionsToEmails = (mentions: string[]): string[] =>
  mentions.map((mention) => mention.substring(1));

/**
 * calculates intersection
 * @param {string[][]} arrays list of string arrays
 * @returns list of intersection strings
 */
export const getIntersection = (arrays: string[][]): string[] =>
  arrays.reduce((a, b) => a.filter((c) => b.includes(c)));
