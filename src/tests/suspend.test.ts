import request from 'supertest';
import App from '../app';

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
            findOne: () =>
              Promise.resolve({ update: jest.fn(), save: jest.fn() }),
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
    const response = await request(App)
      .post('/api/suspend')
      .send({
        student: 'student1@email.com',
      });
    expect(response.status).toBe(204);

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
