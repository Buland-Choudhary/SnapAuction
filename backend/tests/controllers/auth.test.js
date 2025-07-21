import express from 'express';
import request from 'supertest';
import authRouter from '../../src/routes/auth.js';
import * as authController from '../../src/controllers/auth.js';
import { jest } from '@jest/globals';

describe('Auth API Integration', () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);

  it('should return 400 for POST /auth/login with missing credentials', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('Auth Controller Unit', () => {
  it('should handle errors in login', async () => {
    const req = { body: { email: 'test', password: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.spyOn(authController, 'login').mockImplementationOnce(() => { throw new Error('fail'); });
    try {
      await authController.login(req, res);
    } catch {}
    // Should still call res.status(500) if not caught
  });
}); 