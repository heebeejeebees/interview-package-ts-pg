import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import StudentController from './controllers/StudentController';

const router = Express.Router();

router.use('/', HealthcheckController);
router.use('/', StudentController);

export default router;
