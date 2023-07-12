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
            findAll: () =>
              Promise.resolve([
                { dataValues: { email: 'student1@email.com' } },
              ]),
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

describe('GET /commonstudents', () => {
  test('Successful', async (done) => {
    const response = await request(App)
      .get(
        '/api/commonstudents?teacher=teacher1@email.com&teacher=teacher2@email.com'
      )
      .send();
    expect(response.body.students).toEqual(['student1@email.com']);

    done();
  });
});
