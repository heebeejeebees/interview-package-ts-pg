import request from 'supertest';
import Express from 'express';
import { Express as ExpressType } from 'express-serve-static-core';
import globalErrorHandler from './globalErrorHandler';
import AppError from '../errors/AppError';

const MOCK_ENDPOINT = '/mock-endpoint';
const MOCK_GENERIC_ERROR_MESSAGE = 'Something went wrong';

const createMockApp = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  underlyingFn: jest.Mock<any, any>,
  headersSent = false
): Promise<ExpressType> => {
  const mockApp = Express();
  mockApp.get(MOCK_ENDPOINT, async (req, res, next) => {
    try {
      if (headersSent) {
        res.send('set headersSent true');
      }
      await underlyingFn();
    } catch (e) {
      next(e);
    }
  });
  mockApp.use(globalErrorHandler);
  return mockApp;
};

describe('globalErrorHandler', () => {
  test('Headers Sent', async () => {
    const underlyingFn = jest.fn().mockImplementation(() => {
      throw new Error(MOCK_GENERIC_ERROR_MESSAGE);
    });
    const mockApp = await createMockApp(underlyingFn, true);
    const response = await request(mockApp).get(MOCK_ENDPOINT);
    expect(response.text).toBe('set headersSent true');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  test('Malformed JSON', async () => {
    const underlyingFn = jest.fn().mockImplementation(() => {
      class MalformedError extends Error {
        private type: string;
        constructor() {
          super();
          this.type = 'entity.parse.failed';
        }
        public getType(): string {
          return this.type;
        }
      }
      throw new MalformedError();
    });
    const mockApp = await createMockApp(underlyingFn);
    const response = await request(mockApp).get(MOCK_ENDPOINT);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Malformed JSON');
  });

  test('AppError', async () => {
    const underlyingFn = jest.fn().mockImplementation(() => {
      throw new AppError('Generated AppError');
    });
    const mockApp = await createMockApp(underlyingFn);
    const response = await request(mockApp).get(MOCK_ENDPOINT);
    expect(response.body.message).toBe('Generated AppError');
  });

  test('Internal Server Error', async () => {
    const underlyingFn = jest.fn().mockImplementation(() => {
      throw new Error(MOCK_GENERIC_ERROR_MESSAGE);
    });
    const mockApp = await createMockApp(underlyingFn);
    const response = await request(mockApp).get(MOCK_ENDPOINT);
    expect(response.status).toBe(500);
    expect(response.body.errorCode).toBe(99);
    expect(response.body.message).toBe('Internal Server Error');
  });
});
