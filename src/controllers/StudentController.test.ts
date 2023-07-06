import request from 'supertest';
import App from '../app';
import { StudentTeacherRelation, Teacher } from '../models';
// import SequelizeMock from 'sequelize-mock';

/* use sequelize-mock
https://www.npmjs.com/package/sequelize-mock
  jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn(),
    define: jest.fn(() => ({ belongsToMany: jest.fn() })),
  };
  const actualSequelize = jest.requireActual('sequelize');
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: actualSequelize.DataTypes,
  };
});
afterAll(() => {
  jest.resetAllMocks();
}); */

describe('POST /register', async () => {
  test('Successful', async () => {
    const mockTeacher = Teacher.build({ email: 'teacher1@email.com' });
    jest
      .spyOn(Teacher, 'findOne')
      .mockImplementation(() => Promise.resolve(mockTeacher));
    jest
      .spyOn(StudentTeacherRelation, 'findOrCreate')
      .mockImplementation(() => Promise.resolve([mockTeacher, true]));
    const response = await request(App)
      .post('/api/register')
      .send({
        teacher: 'teacher1@email.com',
        students: ['student1@email.com', 'student2@email.com'],
      });
    expect(response.status).toBe(204);
  });
});
