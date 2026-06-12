import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';
import {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobController';

const router = Router();

// --- Open/Public Access Read Directories ---
router.get('/', getAllJobs);
router.get('/:id', getSingleJob);

// --- Protected CRUD Operations (Recruiter / Admin Only) ---
router.post('/', authenticateToken, requireRole(['recruiter', 'admin']), createJob);
router.put('/:id', authenticateToken, requireRole(['recruiter', 'admin']), updateJob);
router.delete('/:id', authenticateToken, requireRole(['recruiter', 'admin']), deleteJob);

export default router;
