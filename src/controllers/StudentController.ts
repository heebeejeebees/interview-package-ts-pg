import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import StudentService from '../services/StudentService';

const StudentController = Express.Router();

const registerStudentHandler: RequestHandler = async (req, res) => {
  const success = StudentService.registerStudent(req.body);

  return res.sendStatus(success ? StatusCodes.OK : StatusCodes.BAD_REQUEST);
}

StudentController.get('/register', registerStudentHandler);

export default StudentController;
