import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  getRecruiterProfile,
  createRecruiterProfile,
  updateRecruiterProfile,
  deleteRecruiterProfile,
  viewAllUsers
} from '../controllers/userController';

const router = Router();

// --- Student Self-Service Profile Endpoints ---
router.get('/profile/student', authenticateToken, requireRole(['student', 'admin']), getStudentProfile);
router.post('/profile/student', authenticateToken, requireRole(['student']), createStudentProfile);
router.put('/profile/student', authenticateToken, requireRole(['student']), updateStudentProfile);
router.delete('/profile/student', authenticateToken, requireRole(['student', 'admin']), deleteStudentProfile);

// --- Recruiter Profile Endpoints ---
router.get('/profile/recruiter', authenticateToken, requireRole(['recruiter', 'admin']), getRecruiterProfile);
router.post('/profile/recruiter', authenticateToken, requireRole(['recruiter']), createRecruiterProfile);
router.put('/profile/recruiter', authenticateToken, requireRole(['recruiter']), updateRecruiterProfile);
router.delete('/profile/recruiter', authenticateToken, requireRole(['recruiter', 'admin']), deleteRecruiterProfile);

// --- Administration Utilities ---
router.get('/admin/users', authenticateToken, requireRole(['admin']), viewAllUsers);

export default router;
