import request from 'supertest';
import App from '../app';

// mock sequelize connectsion
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  const mockId = 99;
  const mockStudentEmail = 'student1@email.com';
  const mockStudent = {
    dataValues: {
      id: mockId,
      email: mockStudentEmail,
    },
  };
  const mockTeacher = {
    dataValues: {
      id: mockId,
      email: 'teacher1@email.com',
    },
  };
  const mockOrphanStudentId = 400;
  const mockOrphanStudentEmail = 'orphanstudent@email.com';
  const mockOrphanStudent = {
    dataValues: {
      id: mockOrphanStudentId,
      email: mockOrphanStudentEmail,
    },
  };
  const mockSequelize = {
    authenticate: jest.fn(),
    define: jest.fn().mockImplementation((modelName) => {
      switch (modelName) {
        case 'Student':
          return {
            belongsToMany: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            findOrCreate: (options: any) => {
              switch (options.where.email) {
                case mockStudentEmail:
                  return Promise.resolve([mockStudent, true]);
                case mockOrphanStudentEmail:
                  return Promise.resolve([mockOrphanStudent, true]);
              }
            },
          };
        case 'Teacher':
          return {
            belongsToMany: jest.fn(),
            findOne: () => Promise.resolve(mockTeacher),
          };
        case 'StudentTeacherRelation':
          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            findOrCreate: (options: any) => {
              switch (options.where.studentId) {
                case mockId:
                  return Promise.resolve([null, true]);
                case mockOrphanStudentId:
                  return Promise.resolve([null, false]);
              }
            },
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

describe('POST /register', () => {
  test('Successful', async (done) => {
    const response = await request(App)
      .post('/api/register')
      .send({
        teacher: 'teacher1@email.com',
        students: ['student1@email.com'],
      });
    expect(response.status).toBe(204);

    done();
  });

  test('Failure', async (done) => {
    const response = await request(App)
      .post('/api/register')
      .send({
        teacher: 'teacher1@email.com',
        students: ['orphanstudent@email.com'],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'No students have been newly registered under this teacher'
    );

    done();
  });
});
