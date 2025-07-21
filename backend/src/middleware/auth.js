import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.warn('[AUTH] No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`[AUTH] Authenticated user: ${decoded.id} (${decoded.role})`);
    next();
  } catch (e) {
    console.warn('[AUTH] Invalid token:', e.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    console.warn(`[AUTH] Admin access denied for user: ${req.user?.id}`);
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log(`[AUTH] Admin access granted for user: ${req.user.id}`);
  next();
};
