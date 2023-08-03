import { RequestHandler, Request, Response } from 'express';
import AppError from '../errors/AppError';
import * as StudentService from '../services/student';
import { transformExpressQueryParamToStringArray } from '../utils/string';

const registerStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    return res.sendStatus(await StudentService.registerStudent(req.body));
  } catch (e) {
    if (e instanceof AppError) {
      return res
        .status(e.getHttpStatusCode())
        .json({ message: e.getMessage() });
    }
  }
};

const retrieveStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    return res.send(
      await StudentService.retrieveStudent(
        transformExpressQueryParamToStringArray(req.query.teacher)
      )
    );
  } catch (e) {
    if (e instanceof AppError) {
      return res
        .status(e.getHttpStatusCode())
        .json({ message: e.getMessage() });
    }
  }
};

const suspendStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    return res.sendStatus(await StudentService.suspendStudent(req.body));
  } catch (e) {
    if (e instanceof AppError) {
      return res
        .status(e.getHttpStatusCode())
        .json({ message: e.getMessage() });
    }
  }
};

const retrieveForNotifsStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    return res.send(await StudentService.retrieveForNotifsStudent(req.body));
  } catch (e) {
    if (e instanceof AppError) {
      return res
        .status(e.getHttpStatusCode())
        .json({ message: e.getMessage() });
    }
  }
};

export default {
  registerStudentHandler,
  retrieveStudentHandler,
  suspendStudentHandler,
  retrieveForNotifsStudentHandler,
};
