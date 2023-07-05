import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

// const HealthcheckController = Express.Router();

export const healthcheckHandler: RequestHandler = async (req, res) =>
  res.sendStatus(StatusCodes.OK);

// HealthcheckController.get('/healthcheck', healthcheckHandler);

export default { healthcheckHandler };
// export default HealthcheckController;
