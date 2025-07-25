// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import auctionRoutes from './routes/auctions.js';
import bidRoutes from './routes/bids.js';
import adminRoutes from './routes/admin.js';
import uploadsRouter from './routes/uploads.js';
import { handleAuctionSocket } from './sockets/bids.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRouter);

app.get('/', (req, res) => res.send('SnapAuction API Running'));

// replace app.listen with server.listen
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

handleAuctionSocket(io);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { io };
