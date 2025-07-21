import request from 'supertest';
import express from 'express';
import bidsRouter from '../../src/routes/bids.js';
import * as bidsController from '../../src/controllers/bids.js';
import { jest } from '@jest/globals';


describe('Bids API', () => {
  const app = express();
  app.use(express.json());
  app.use('/bids', bidsRouter);

  it('should return 400 if auctionId or amount is missing (unit)', async () => {
    const req = { body: {}, user: { id: 'user1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await bidsController.placeBid(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Auction ID and amount are required' });
  });

  // Integration test (will require a valid JWT and auction in DB for full test)
  it('should return 401 for unauthenticated POST /bids', async () => {
    const res = await request(app).post('/bids').send({ auctionId: 'fake', amount: 10 });
    expect(res.statusCode).toBe(401);
  });
}); 