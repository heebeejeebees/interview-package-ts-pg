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
    Op: actualSequelize.Op,
  };
});

afterEach((done) => {
  jest.resetAllMocks();
  done();
});

describe('POST /retrievefornotifications', () => {
  test('Successful', async (done) => {
    const response = await request(App)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacher1@email.com',
        notification: 'Content with email mentions @student1@email.com',
      });
    expect(response.body.recipients).toEqual(['student1@email.com']);

    done();
  });
  test('Failure', async (done) => {
    const response = await request(App)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacher1@email.com',
        notification: 'Content without email mentions',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'No email was @mentioned in notification content: Content without email mentions'
    );

    done();
  });
});
