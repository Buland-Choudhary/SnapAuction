import express from 'express';
import request from 'supertest';
import adminRouter from '../../src/routes/admin.js';
import * as adminController from '../../src/controllers/admin.js';
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

describe('Admin API Integration', () => {
  const app = express();
  app.use(express.json());
  app.use('/admin', adminRouter);

  it('should return 401 for unauthenticated GET /admin/users', async () => {
    const res = await request(app).get('/admin/users');
    expect(res.statusCode).toBe(401);
  });
});

describe('Admin Controller Unit', () => {
  it('should handle errors in getUsers', async () => {
    jest.spyOn(PrismaClient.prototype, 'user', 'get').mockReturnValue({
      findMany: jest.fn().mockImplementation(() => { throw new Error('fail'); })
    });
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch users' });
  });
}); 