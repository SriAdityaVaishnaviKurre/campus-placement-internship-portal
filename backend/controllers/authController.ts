import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_PASSPHRASE_VAL_2026_PORTAL_SECURE';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Input assertions validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array().map(e => e.msg) });
      return;
    }

    const { name, email, password, role } = req.body;

    // 2. Validate email availability
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Validation Error: Email is already registered on this portal.' });
      return;
    }

    // 3. Password hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create base user
    const userId = await UserModel.create(name, email, passwordHash, role);

    // 5. Setup default student/recruiter profile blocks respectively
    if (role === 'student') {
      await UserModel.createStudentProfile(userId, null, '', 0.00);
    } else if (role === 'recruiter') {
      await UserModel.createRecruiterProfile(userId, `${name}'s Organization`, email);
    }

    res.status(211).json({
      message: 'Account registered successfully.',
      user: {
        id: userId,
        name,
        email,
        role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array().map(e => e.msg) });
      return;
    }

    const { email, password } = req.body;

    // 1. Verify existence
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Authentication Failed: Invalid email or password.' });
      return;
    }

    // 2. Verify hashed password match
    // Support either column names from real MySQL query structure (password) or mock config fields (passwordHash)
    const storedHash = user.password || user.passwordHash;
    const isMatched = await bcrypt.compare(password, storedHash);
    if (!isMatched) {
      res.status(401).json({ error: 'Authentication Failed: Invalid email or password.' });
      return;
    }

    // 3. Generate secure JWT payload token (lasts 24 hours)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Authentication successful. Welcome to CampusLink Portal.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Standard stateless logout implementation 
    res.status(200).json({
      message: 'Logged out successfully. Secure portal session terminated.'
    });
  } catch (err) {
    next(err);
  }
};
