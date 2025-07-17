// src/controllers/admin.js

export const getUsers = (req, res) => {
  res.json({
    message: 'TODO: Return list of all users (admin only)',
  });
};

export const getAuctions = (req, res) => {
  res.json({
    message: 'TODO: Return list of all auctions (admin only)',
  });
};

export const deleteAuction = (req, res) => {
  res.json({
    message: 'TODO: Force delete an auction',
    auctionId: req.params.id,
  });
};

export const updateUserRole = (req, res) => {
  res.json({
    message: 'TODO: Update user role (ADMIN <-> USER)',
    userId: req.params.id,
  });
};
