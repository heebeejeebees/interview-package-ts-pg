import request from 'supertest';
import app from '../app';

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
          };
        case 'Teacher':
          return {
            belongsToMany: jest.fn(),
          };
        case 'StudentTeacherRelation':
          return {};
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

describe('GET /healthcheck', () => {
  test('Successful', async () => {
    const response = await request(app).get('/api/healthcheck');
    expect(response.statusCode).toBe(200);
  });
});
