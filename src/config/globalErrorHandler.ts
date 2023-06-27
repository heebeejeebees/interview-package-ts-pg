import { StatusCodes } from 'http-status-codes';
import ErrorCodes from '../const/ErrorCodes';
import AppError from '../errors/AppError';
import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handling of body-parser content malformed error
  if (err.type === 'entity.parse.failed') {
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'Malformed json',
    });
  }

  if (err instanceof AppError) {
    const error = err;

    return res.status(error.getHttpStatusCode()).send({
      message: error.getMessage(),
    });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      errorCode: ErrorCodes.RUNTIME_ERROR_CODE,
      message: 'Internal Server Error',
    });
  }
};

export default globalErrorHandler;
