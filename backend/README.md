# SnapAuction Backend

This is the backend API for SnapAuction, built with Node.js, Express, Prisma ORM, and PostgreSQL.

---

## Folder Structure

```
backend/
├── prisma/           # Prisma schema and seed scripts
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/       # Configuration files (e.g., cloudinary)
│   ├── controllers/  # Route controllers (admin, auctions, auth, bids, users)
│   ├── middleware/   # Express middleware (auth, upload)
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic/services
│   ├── sockets/      # Socket.io event handlers
│   ├── utils/        # Utility functions
│   ├── index.js      # App entry point
│   └── socket.js     # Socket.io setup
├── tmp_uploads/      # Temporary file uploads
├── package.json      # Backend dependencies and scripts
└── ...
```

---

## Useful Commands

- Start development server:  
  `npm run dev`
- Seed the database:  
  `npm run prisma:seed`

---

## Database Schema (Overview)

**User**

- `id` (String, PK)
- `name` (String)
- `email` (String, unique)
- `passwordHash` (String)
- `role` (enum: USER | ADMIN)
- `createdAt`, `updatedAt` (DateTime)
- Relations: auctions (as seller), wonAuctions, bids, follows

**Auction**

- `id` (String, PK)
- `title`, `description` (String)
- `basePrice`, `currentPrice`, `minIncrement`, `maxIncrement` (Float)
- `startTime`, `endTime` (DateTime)
- `isClosed` (Boolean)
- `sellerId`, `winnerId` (String)
- `createdAt`, `updatedAt` (DateTime)
- Relations: seller, winner, bids, follows, images

**Bid**

- `id` (String, PK)
- `amount` (Float)
- `createdAt` (DateTime)
- `auctionId`, `userId` (String)
- Relations: auction, user

**Follow**

- `id` (String, PK)
- `userId`, `auctionId` (String)
- `createdAt` (DateTime)
- Relations: user, auction

**AuctionImage**

- `id` (String, PK)
- `url` (String)
- `auctionId` (String)
- Relations: auction

**Role (enum)**: USER, ADMIN

> For the full detailed schema, see [`prisma/schema.prisma`](prisma/schema.prisma).

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## API Endpoints

### Auth

- `POST   /api/auth/login` — Login
- `POST   /api/auth/signup` — Signup
- `GET    /api/auth/logout` — Logout (auth required)
- `GET    /api/auth/me` — Get current user info (auth required)

### Users

- `GET    /api/users/dashboard` — Get user dashboard (auth required)
- `GET    /api/users/me/bids` — Get user's bids (auth required)
- `GET    /api/users/me/auctions` — Get user's auctions (auth required)

### Auctions

- `GET    /api/auctions/` — List all auctions
- `GET    /api/auctions/live` — List live auctions
- `GET    /api/auctions/upcoming` — List upcoming auctions
- `GET    /api/auctions/:id` — Get auction by ID
- `POST   /api/auctions/` — Create auction (auth required, file upload)
- `POST   /api/auctions/:id/follow` — Follow an auction (auth required)
- `POST   /api/auctions/:id/unfollow` — Unfollow an auction (auth required)

### Bids

- `POST   /api/bids/` — Place a new bid (auth required)
- `GET    /api/bids/auction/:id` — Get bid history for an auction

### Admin (auth + admin required)

- `GET    /api/admin/users` — List all users
- `GET    /api/admin/auctions` — List all auctions
- `DELETE /api/admin/auction/:id` — Delete an auction
- `PATCH  /api/admin/user/:id/role` — Promote/demote a user

### Uploads

- `GET    /api/uploads/upload-signature` — Get Cloudinary upload signature (auth required)

---

## Other Notes

- **File Uploads:** Auctions support image uploads (up to 5 images per auction).
- **Real-time:** Bidding and auction updates use Socket.io for real-time features.
- **Security:** JWT-based authentication, role-based access for admin routes.

---

## API Reference

For detailed request/response formats, see the controllers in [`src/controllers/`](src/controllers/) and the route definitions in [`src/routes/`](src/routes/).
