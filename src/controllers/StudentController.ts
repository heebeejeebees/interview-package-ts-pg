import Express, { RequestHandler, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import StudentService from '../services/StudentService';

const StudentController = Express.Router();

const registerStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // TODO: timeout
  try {
    await StudentService.registerStudent(req.body);
    return res.sendStatus(StatusCodes.OK);
  } catch (e) {
    if (e instanceof AppError) {
      return res.json(e);
    }
  }
};

StudentController.post('/register', registerStudentHandler);

export default StudentController;
