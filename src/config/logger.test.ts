const mockWinstonLog = jest.fn();

jest.mock('winston', () => {
  const winston = jest.requireActual('winston');
  winston.transports.Console.prototype.log = mockWinstonLog;
  return winston;
});

import Logger from './logger';

describe('Logger', () => {
  test('ERROR', () => {
    const LOG = new Logger('logger.test.ts');
    LOG.error('');
    LOG.warn('');
    LOG.info('');
    LOG.verbose('');
    LOG.debug('');
    LOG.silly('');
    LOG.log('info', '');
    expect(mockWinstonLog).toHaveBeenCalled();
  });
});
