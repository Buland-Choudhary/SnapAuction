import request from 'supertest';
import express from 'express';
import auctionsRouter from '../../src/routes/auctions.js';

const app = express();
app.use(express.json());
app.use('/auctions', auctionsRouter);

describe('Auctions API', () => {
  it('should return a list of auctions', async () => {
    const res = await request(app).get('/auctions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
