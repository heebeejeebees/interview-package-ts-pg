import Express, { RequestHandler, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorBase from '../errors/ErrorBase';
import StudentService from '../services/StudentService';

const StudentController = Express.Router();

const registerStudentHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  await StudentService.registerStudent(req.body)
    .then(() => res.sendStatus(StatusCodes.OK))
    .catch((e) => {
      if (e instanceof ErrorBase) {
        return res.json(e);
      }
    });
};

StudentController.post('/register', registerStudentHandler);

export default StudentController;
