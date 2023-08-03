import request from 'supertest';
import App from '../app';
import { StudentStatus } from '../models/types';

// mock sequelize connectsion
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  const mockSequelize = {
    authenticate: jest.fn(),
    define: jest.fn().mockImplementation((modelName) => {
      switch (modelName) {
        case 'Student':
          return {
            belongsToMany: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            findOne: (options: any) =>
              Promise.resolve({
                update: jest.fn(),
                save: jest.fn(),
                dataValues: {
                  status:
                    options.where.email === 'student1@email.com'
                      ? StudentStatus.ACTIVE
                      : StudentStatus.SUSPENDED,
                },
              }),
          };
        case 'Teacher':
          return {
            belongsToMany: jest.fn(),
            findOne: () => Promise.resolve(null),
          };
        case 'StudentTeacherRelation':
          return {
            findOrCreate: () => Promise.resolve(null),
          };
      }
    }),
  };
  return {
    Sequelize: jest.fn(() => mockSequelize),
    DataTypes: actualSequelize.DataTypes,
  };
});

afterEach((done) => {
  jest.resetAllMocks();
  done();
});

describe('POST /suspend', () => {
  test('Successful', async (done) => {
    const response = await request(App).post('/api/suspend').send({
      student: 'student1@email.com',
    });
    expect(response.status).toBe(204);

    done();
  });
  test('Already suspended', async (done) => {
    const response = await request(App).post('/api/suspend').send({
      student: 'student2@email.com',
    });
    expect(response.status).toBe(400);

    done();
  });
  test('Failure', async (done) => {
    const response = await request(App).post('/api/suspend').send({
      student: 'student1@email.com',
    });
    expect(response.status).toBe(204);

    done();
  });
});
