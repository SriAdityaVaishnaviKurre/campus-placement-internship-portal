import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_PASSPHRASE_VAL_2026_PORTAL_SECURE';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'admin' | 'student' | 'recruiter';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access unauthorized: Authenticating JWT token is missing.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden: Invalid or expired validation token.' });
      return;
    }
    
    req.user = decoded as AuthRequest['user'];
    next();
  });
};

export const requireRole = (roles: Array<'admin' | 'student' | 'recruiter'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: This action requires authorization as one of: [${roles.join(', ')}].` });
      return;
    }

    next();
  };
};
