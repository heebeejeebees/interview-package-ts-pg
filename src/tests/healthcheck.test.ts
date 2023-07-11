import request from 'supertest';
import app from '../app';

describe('GET /healthcheck', () => {
  test('Successful', async () => {
    const response = await request(app).get('/api/healthcheck');
    expect(response.statusCode).toBe(200);
  });
});
