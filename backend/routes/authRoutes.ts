import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// Endpoint: POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Full name is strictly required.'),
    body('email').isEmail().withMessage('Please specify a valid academic or corporate email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.'),
    body('role').isIn(['student', 'recruiter', 'admin']).withMessage('Role selection must resolve to one of: [student, recruiter, admin].')
  ],
  registerUser
);

// Endpoint: POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please specify a valid email address.'),
    body('password').notEmpty().withMessage('Password must be specified.')
  ],
  loginUser
);

// Endpoint: POST /api/auth/logout
router.post('/logout', logoutUser);

export default router;
