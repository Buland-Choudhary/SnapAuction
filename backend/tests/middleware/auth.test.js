import { authMiddleware, adminMiddleware } from '../../src/middleware/auth.js';
import { jest } from '@jest/globals';

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not admin', () => {
    const req = { user: { role: 'USER', id: 'user1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });
}); 