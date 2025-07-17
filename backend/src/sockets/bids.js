// module.exports = (io) => {
//   const bidsNamespace = io.of("/bids");

//   bidsNamespace.on("connection", (socket) => {
//     console.log("Client connected to /bids");

//     socket.on("join_auction", ({ auctionId }) => {
//       socket.join(auctionId);
//     });

//     socket.on("place_bid", async ({ auctionId, amount }) => {
//       // Validate + update DB + broadcast
//       // Broadcast to auction room:
//       io.of("/bids").to(auctionId).emit("bid_placed", { amount });
//     });
//   });
// };
