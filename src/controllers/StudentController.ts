import Express, { RequestHandler, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import AppError from '../errors/AppError';
import StudentService from '../services/StudentService';

const StudentController = Express.Router();

// TODO: timeout
const registerStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    return res.sendStatus(await StudentService.registerStudent(req.body));
  } catch (e) {
    if (e instanceof AppError) {
      return res.json(e);
    }
  }
};

const retrieveStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // handle express query type
  let emails: string[] | undefined;
  if (req.query.teacher === undefined) {
    // do nothing
  } else if (Array.isArray(req.query.teacher)) {
    emails = req.query.teacher.map((q: string | ParsedQs) => q.toString());
  } else {
    emails = [req.query.teacher.toString()];
  }
  try {
    return res.send(await StudentService.retrieveStudent(emails));
  } catch (e) {
    if (e instanceof AppError) {
      return res.json(e);
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
      return res.json(e);
    }
  }
};

StudentController.post('/register', registerStudentHandler);
StudentController.get('/commonstudents', retrieveStudentHandler);
StudentController.post('/suspend', suspendStudentHandler);

export default StudentController;
