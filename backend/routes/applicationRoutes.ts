import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  applyForJob,
  viewApplications,
  updateApplicationStatus,
  deleteApplication,
  viewReports
} from '../controllers/applicationController';

const router = Router();

// --- Main Application Submissions Process ---
router.post('/', authenticateToken, requireRole(['student']), applyForJob);
router.get('/', authenticateToken, requireRole(['student', 'recruiter', 'admin']), viewApplications);

// --- Status Management Tasks ---
router.put('/:id', authenticateToken, requireRole(['recruiter', 'admin']), updateApplicationStatus);
router.delete('/:id', authenticateToken, requireRole(['student', 'recruiter', 'admin']), deleteApplication);

// --- Report Generation Core Actions (Admin Only) ---
router.get('/admin/reports', authenticateToken, requireRole(['admin']), viewReports);

export default router;
