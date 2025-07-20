// src/socket.js
export const handleAuctionConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    // Join a room for a specific auction
    socket.on('join_auction', (auctionId) => {
      const room = `auction_${auctionId}`;
      socket.join(room);
      console.log(`🏠 ${socket.id} joined ${room}`);

      // Emit updated user count
      const count = io.sockets.adapter.rooms.get(room)?.size || 0;
      io.to(room).emit('user_count_update', count);
    });

    // Leave the room
    socket.on('leave_auction', (auctionId) => {
      const room = `auction_${auctionId}`;
      socket.leave(room);
      console.log(`🚪 ${socket.id} left ${room}`);
      const count = io.sockets.adapter.rooms.get(room)?.size || 0;
      io.to(room).emit('user_count_update', count);
    });

    socket.on('disconnect', () => {
      console.log('👋 User disconnected:', socket.id);
    });
  });
};
