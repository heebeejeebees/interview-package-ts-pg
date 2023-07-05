import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import StudentController from './controllers/StudentController';

const router = Express.Router();

router.get('/healthcheck', HealthcheckController.healthcheckHandler);
router.post('/register', StudentController.registerStudentHandler);
router.get('/commonstudents', StudentController.retrieveStudentHandler);
router.post('/suspend', StudentController.suspendStudentHandler);
router.post(
  '/retrievefornotifications',
  StudentController.retrieveForNotifsStudentHandler
);

export default router;
