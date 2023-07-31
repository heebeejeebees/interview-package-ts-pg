import Express, { json, urlencoded } from 'express';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import globalErrorHandler from './config/globalErrorHandler';

const App = Express();

App.use(compression());
App.use(cors());
App.use(json());
App.use(urlencoded({ extended: true }));
App.use('/api', router);
App.use(globalErrorHandler);

export default App;
