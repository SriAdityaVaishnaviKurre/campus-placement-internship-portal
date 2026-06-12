import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { JobModel } from '../models/Job';
import { UserModel } from '../models/User';

export const getAllJobs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobs = await JobModel.findAll();
    res.status(200).json({ jobs });
  } catch (err) {
    next(err);
  }
};

export const getSingleJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = Number(req.params.id);
    if (isNaN(jobId)) {
      res.status(400).json({ error: 'Validation Error: Invalid job parameter identifier.' });
      return;
    }

    const job = await JobModel.findById(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job opening not found or has been deactivated.' });
      return;
    }

    res.status(200).json({ job });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    // 1. Resolve recruiter ID matching our current user (Unless Admin specifies recruiterId)
    let recruiterId = 1; // Default fallback for dev seed
    if (userRole === 'recruiter') {
      const recProfile = await UserModel.findRecruiterByUserId(userId);
      if (!recProfile) {
        res.status(403).json({ error: 'Forbidden: Recruiter profile is required to publish jobs.' });
        return;
      }
      recruiterId = recProfile.id;
    } else if (userRole === 'admin') {
      recruiterId = Number(req.body.recruiterId) || 1;
    } else {
      res.status(403).json({ error: 'Forbidden: Only recruiter or admin role may perform this action.' });
      return;
    }

    const { title, description, location, salary, deadline } = req.body;
    if (!title || !description || !location || !salary || !deadline) {
      res.status(400).json({ error: 'Validation Error: All fields [title, description, location, salary, deadline] are strictly required.' });
      return;
    }

    const jobId = await JobModel.create(recruiterId, title, description, location, salary, deadline);

    res.status(211).json({
      message: 'Job posting published successfully.',
      jobId,
      job: {
        id: jobId,
        recruiterId,
        title,
        location,
        salary,
        deadline
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    // Check job existence
    const job = await JobModel.findById(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job opening not found.' });
      return;
    }

    // Verify authorized editor (owner recruiter or admin)
    if (userRole === 'recruiter') {
      const recProfile = await UserModel.findRecruiterByUserId(userId);
      if (!recProfile || job.recruiter_id !== recProfile.id) {
        res.status(403).json({ error: 'Forbidden: You do not possess modification access for other recruiters jobs.' });
        return;
      }
    }

    const { title, description, location, salary, deadline } = req.body;
    const isSuccess = await JobModel.update(
      jobId,
      title || job.title,
      description || job.description,
      location || job.location,
      salary || job.salary,
      deadline || job.deadline
    );

    if (!isSuccess) {
      res.status(400).json({ error: 'Failed to update job posting specifications.' });
      return;
    }

    res.status(200).json({ message: 'Job details updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const job = await JobModel.findById(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job opening not found' });
      return;
    }

    if (userRole === 'recruiter') {
      const recProfile = await UserModel.findRecruiterByUserId(userId);
      if (!recProfile || job.recruiter_id !== recProfile.id) {
        res.status(403).json({ error: 'Forbidden: You do not possess deletion access for other recruiters listings.' });
        return;
      }
    }

    const isSuccess = await JobModel.delete(jobId);
    if (!isSuccess) {
      res.status(400).json({ error: 'Deactivation of job failed.' });
      return;
    }

    res.status(200).json({ message: 'Job posting deleted and deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};
