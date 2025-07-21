import express from 'express';
import request from 'supertest';
import usersRouter from '../../src/routes/users.js';
import * as usersController from '../../src/controllers/users.js';
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

describe('Users API Integration', () => {
  const app = express();
  app.use(express.json());
  app.use('/users', usersRouter);

  it('should return 401 for unauthenticated GET /users/dashboard', async () => {
    const res = await request(app).get('/users/dashboard');
    expect(res.statusCode).toBe(401);
  });
});

describe('Users Controller Unit', () => {
  it('should handle errors in getDashboard', async () => {
    // Mock PrismaClient.$transaction to throw
    jest.spyOn(PrismaClient.prototype, '$transaction').mockImplementationOnce(() => {
      throw new Error('fail');
    });

    const req = { user: { id: 'user1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await usersController.getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
