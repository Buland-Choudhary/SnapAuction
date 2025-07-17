import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔑 Attempting login for:', email, password);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user ? user.name : 'No user found');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials pass' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    console.log('user logged in:', user.name);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const signup = (req, res) => {
  res.json({ message: 'TODO: Signup logic' });
};

export const logout = (req, res) => {
  res.json({ message: 'TODO: Logout logic' });
};
