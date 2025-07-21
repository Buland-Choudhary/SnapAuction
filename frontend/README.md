# SnapAuction Frontend

This is the frontend for SnapAuction, built with React, Vite, and Tailwind CSS.

---

## Folder Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── api/            # API abstraction (axios instance)
│   ├── assets/         # Images and static assets
│   ├── components/     # Reusable React components (navbar, ProtectedRoute)
│   ├── context/        # React context (Auth, Socket)
│   ├── pages/          # Main app pages (Home, Login, Signup, Dashboard, Auction...)
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   ├── App.css         # App-wide styles
│   └── index.css       # Tailwind base styles
├── package.json        # Frontend dependencies and scripts
└── ...
```

---

## Useful Commands

- Start development server:  
  `npm run dev`
- Build for production:  
  `npm run build`
- Preview production build:  
  `npm run preview`
- Lint code:  
  `npm run lint`

---

## Environment Variables

By default, the API base URL is set in `src/api/axios.js`:

To use a local backend during development, update the `baseURL` in `src/api/axios.js` or use an environment variable if you refactor for dynamic config.

---

## Backend URL

- The frontend expects the backend API to be available at the URL specified in `src/api/axios.js`.
- Update this URL if you deploy the backend elsewhere or run it locally.

---

## Features

- User authentication (login/signup)
- Real-time auctions and bidding (Socket.io)
- Dashboard, auction creation, and live auction pages
- Protected routes and context-based state management

---

## More Info

See the [project root README](../README.md) for setup instructions and project overview.
