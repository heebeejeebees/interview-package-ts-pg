import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import Logger from '../config/logger';

export const throwNotProvidedError = (
  LOG: Logger,
  param: string
): void => {
  LOG.error(`${param} not provided`);
  throw new AppError(`${param} not provided`, StatusCodes.BAD_REQUEST);
};

export const throwInvalidEmailError = (
  LOG: Logger,
  email: string
): void => {
  LOG.error(`email invalid: ${email}`);
  throw new AppError(
    `Invalid email provided: ${email}`,
    StatusCodes.BAD_REQUEST
  );
};

export const throwNotFoundError = (
  LOG: Logger,
  modelName: string,
  email: string
): void => {
  LOG.error(`${modelName} not found, email: ${email}`);
  throw new AppError(
    `${modelName} not found, email: ${email}`,
    StatusCodes.BAD_REQUEST
  );
};
