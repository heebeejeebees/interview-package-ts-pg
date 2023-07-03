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
    const result = await StudentService.registerStudent(req.body);
    return res.sendStatus(result ? StatusCodes.OK : StatusCodes.BAD_REQUEST);
  } catch (e) {
    if (e instanceof AppError) {
      return res.json(e);
    }
  }
};

StudentController.post('/register', registerStudentHandler);

export default StudentController;
