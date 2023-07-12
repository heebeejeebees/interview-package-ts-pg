const TEST_FN = jest.fn();

/* const ERROR_FN = jest.fn();
const WARN_FN = jest.fn();
const INFO_FN = jest.fn();
const VERBOSE_FN = jest.fn();
const DEBUG_FN = jest.fn();
const SILLY_FN = jest.fn();
const LOG_FN = jest.fn();

jest.mock('winston', () => {
  const actualWinston = jest.requireActual('winston');
  return {
    createLogger: () => ({
      error: ERROR_FN,
      warn: WARN_FN,
      info: INFO_FN,
      verbose: VERBOSE_FN,
      debug: DEBUG_FN,
      silly: SILLY_FN,
      log: LOG_FN,
    }),
    format: actualWinston.format,
    transports: actualWinston.transports,
  };
}); */

jest.mock('winston', () => {
  const winston = jest.requireActual('winston');
  winston.transports.Console.prototype.log = TEST_FN;
  return winston;
});

import Logger from './logger';

const LOG = new Logger('logger.test.ts');
describe('Logger', () => {
  test('ERROR', () => {
    LOG.error('test1');
    expect(TEST_FN).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'ERROR', message: 'test1' }),
      expect.anything()
    );
  });

  test('WARN', () => {
    LOG.warn('test2');
    expect(TEST_FN).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'WARN', message: 'test2' }),
      expect.anything()
    );
  });
});

/*     
    LOG.info('test');
    expect(TEST_FN).toBeCalledTimes(1);
    LOG.verbose('test');
    expect(TEST_FN).toBeCalledTimes(1);
    LOG.debug('test');
    expect(TEST_FN).toBeCalledTimes(1);
    LOG.silly('test');
    expect(TEST_FN).toBeCalledTimes(1);
    LOG.log('silly', 'test');
    expect(TEST_FN).toBeCalledTimes(1); */
