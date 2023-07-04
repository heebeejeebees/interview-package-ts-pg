import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import Logger from '../config/logger';

export const throwNotProvidedError = (
  LOG: Logger,
  api: string,
  param: string
): void => {
  LOG.error(`${api}, ${param} not provided`);
  throw new AppError(`${param} not provided`, StatusCodes.BAD_REQUEST);
};

export const throwInvalidEmailError = (
  LOG: Logger,
  api: string,
  email: string
): void => {
  LOG.error(`${api}, email invalid: ${email}`);
  throw new AppError(
    `Invalid email provided: ${email}`,
    StatusCodes.BAD_REQUEST
  );
};

export const throwNotFoundError = (
  LOG: Logger,
  api: string,
  modelName: string,
  email: string
): void => {
  LOG.error(`${api}, ${modelName} not found, email: ${email}`);
  throw new AppError(
    `${modelName} not found, email: ${email}`,
    StatusCodes.BAD_REQUEST
  );
};
