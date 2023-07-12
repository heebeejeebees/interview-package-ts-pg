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
            findOrCreate: () => Promise.resolve(null),
            findOne: () => Promise.resolve(null),
            findAll: () => Promise.resolve([]),
          };
        case 'Teacher':
          return {
            belongsToMany: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            findOne: (options: any) => {
              switch (options.where.email) {
                case 'teacher1@email.com':
                  return Promise.resolve({ dataValues: { id: 0 } });
                default:
                  return Promise.resolve(null);
              }
            },
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

const BAD_REQUEST_HTTP_STATUS_CODE = 400;

describe('Undefined parameters', () => {
  describe('POST /register', () => {
    test('email', async (done) => {
      const response = await request(App).post('/api/register').send();
      expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
      expect(response.body.message).toBe('Param email not provided');

      done();
    });
    test('teacher email', async (done) => {
      const response = await request(App)
        .post('/api/register')
        .send({ students: ['student1@email.com'] });
      expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
      expect(response.body.message).toBe('Param teacher email not provided');

      done();
    });
    test('student emails', async (done) => {
      const response = await request(App)
        .post('/api/register')
        .send({ teacher: 'teacher1@email.com' });
      expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
      expect(response.body.message).toBe('Param student emails not provided');

      done();
    });
  });

  test('GET /commonstudents', async (done) => {
    const response = await request(App).get('/api/commonstudents').send();
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe('Param teacher email(s) not provided');

    done();
  });

  test('POST /suspend', async (done) => {
    const response = await request(App).post('/api/suspend').send();
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe('Param student email not provided');

    done();
  });

  test('POST /retrievefornotifications', async (done) => {
    const response = await request(App)
      .post('/api/retrievefornotifications')
      .send();
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe('Param notification not provided');

    done();
  });
});

describe('Invalid email parameters', () => {
  const invalidEmail = 'user@emailcom';
  const INVALID_MESSAGE_RESPONSE = 'Invalid email: ' + invalidEmail;

  test('POST /register', async (done) => {
    const response = await request(App)
      .post('/api/register')
      .send({ teacher: invalidEmail });
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(INVALID_MESSAGE_RESPONSE);

    done();
  });

  test('GET /commonstudents', async (done) => {
    const response = await request(App)
      .get('/api/commonstudents?teacher=' + invalidEmail)
      .send();
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(INVALID_MESSAGE_RESPONSE);

    done();
  });

  test('POST /suspend', async (done) => {
    const response = await request(App)
      .post('/api/suspend')
      .send({ student: invalidEmail });
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(INVALID_MESSAGE_RESPONSE);

    done();
  });

  test('POST /retrievefornotifications', async (done) => {
    const response = await request(App)
      .post('/api/retrievefornotifications')
      .send({
        teacher: invalidEmail,
        notification: 'Content without email mentions',
      });
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(INVALID_MESSAGE_RESPONSE);

    done();
  });
});

describe('No record found', () => {
  const mockStudentEmail = 'student1@email.com';
  const mockTeacherEmail = 'teacher1@email.com';

  test('POST /register', async (done) => {
    const response = await request(App)
      .post('/api/register')
      .send({ teacher: mockTeacherEmail });
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(
      'Model teacher not found, email: ' + mockTeacherEmail
    );

    done();
  });

  test('GET /commonstudents', async (done) => {
    const response = await request(App)
      .get('/api/commonstudents?teacher=' + mockTeacherEmail)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.students).toEqual([]);

    done();
  });

  test('POST /suspend', async (done) => {
    const response = await request(App)
      .post('/api/suspend')
      .send({ student: mockStudentEmail });
    expect(response.body.httpStatusCode).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(
      'Model Active student not found, email: ' + mockStudentEmail
    );

    done();
  });

  test('POST /retrievefornotifications', async (done) => {
    const response = await request(App)
      .post('/api/retrievefornotifications')
      .send({
        teacher: mockTeacherEmail,
        notification: 'Content with email mentions @' + mockStudentEmail,
      });
    expect(response.status).toBe(200);
    expect(response.body.recipients).toEqual([]);

    done();
  });
});
