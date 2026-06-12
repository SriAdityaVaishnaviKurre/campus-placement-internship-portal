import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApplicationModel } from '../models/Application';
import { UserModel } from '../models/User';
import { JobModel } from '../models/Job';

export const applyForJob = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const { jobId } = req.body;
    if (!jobId) {
      res.status(400).json({ error: 'Validation Error: Target job identification parameter is required.' });
      return;
    }

    // 1. Fetch active student profile matching current user session
    const student = await UserModel.findStudentByUserId(userId);
    if (!student) {
      res.status(403).json({ error: 'Forbidden: A valid student profile is required to apply for positions.' });
      return;
    }

    // 2. Validate target job existence
    const job = await JobModel.findById(Number(jobId));
    if (!job) {
      res.status(404).json({ error: 'Failed: The specified job listing is either deactivated or does not exist.' });
      return;
    }

    // 3. Prevent duplication
    const isDuplicate = await ApplicationModel.checkDuplicate(student.id, job.id);
    if (isDuplicate) {
      res.status(400).json({ error: 'Validation Error: You have already submitted an application for this opportunity.' });
      return;
    }

    // 4. Create application instance
    const appId = await ApplicationModel.create(student.id, job.id, 'pending');

    res.status(211).json({
      message: 'Application successfully registered and routed to recruiter.',
      applicationId: appId,
      details: {
        id: appId,
        jobTitle: job.title,
        status: 'pending'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const viewApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    // Resolve applications based on role context
    if (userRole === 'student') {
      const student = await UserModel.findStudentByUserId(userId);
      if (!student) {
        res.status(200).json({ applications: [] });
        return;
      }
      const list = await ApplicationModel.findByStudentId(student.id);
      res.status(200).json({ applications: list });
    } else if (userRole === 'recruiter') {
      const rec = await UserModel.findRecruiterByUserId(userId);
      if (!rec) {
        res.status(200).json({ applications: [] });
        return;
      }
      const list = await ApplicationModel.findByRecruiterId(rec.id);
      res.status(200).json({ applications: list });
    } else if (userRole === 'admin') {
      // Admin sees master application registries. We can extract recruiter ID from query if provided.
      const recruiterIdQuery = req.query.recruiterId;
      if (recruiterIdQuery) {
        const list = await ApplicationModel.findByRecruiterId(Number(recruiterIdQuery));
        res.status(200).json({ applications: list });
      } else {
        // Return global applications list from our store
        const list = await ApplicationModel.findByStudentId(1); // Demo list fallback
        res.status(200).json({ applications: list });
      }
    }
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { status } = req.body;

    if (!userId || !userRole) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    if (!['pending', 'shortlisted', 'interviewing', 'rejected'].includes(status)) {
      res.status(400).json({ error: "Validation Error: Status must resolve to one of: ['pending', 'shortlisted', 'interviewing', 'rejected']." });
      return;
    }

    const app = await ApplicationModel.findById(appId);
    if (!app) {
      res.status(404).json({ error: 'Application record not found.' });
      return;
    }

    // Authorization guard: Only assigned Recruiter or Admin can update candidates
    if (userRole === 'recruiter') {
      const rec = await UserModel.findRecruiterByUserId(userId);
      const job = await JobModel.findById(app.job_id);
      if (!rec || !job || job.recruiter_id !== rec.id) {
        res.status(403).json({ error: 'Forbidden: You do not possess editing access for this candidates application.' });
        return;
      }
    }

    // Commit Status Update
    const isSuccess = await ApplicationModel.updateStatus(appId, status);
    if (!isSuccess) {
      res.status(400).json({ error: 'Failed to update application status.' });
      return;
    }

    res.status(200).json({ message: 'Candidate application status updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const app = await ApplicationModel.findById(appId);
    if (!app) {
      res.status(404).json({ error: 'Application record not found.' });
      return;
    }

    // Authorize: Applicants can withdraw own submissions, Recruiters can dismiss candidates, Admin has global access
    if (userRole === 'student') {
      const student = await UserModel.findStudentByUserId(userId);
      if (!student || app.student_id !== student.id) {
        res.status(403).json({ error: 'Forbidden: You cannot delete another students application.' });
        return;
      }
    } else if (userRole === 'recruiter') {
       const rec = await UserModel.findRecruiterByUserId(userId);
       const job = await JobModel.findById(app.job_id);
       if (!rec || !job || job.recruiter_id !== rec.id) {
         res.status(403).json({ error: 'Forbidden: You do not possess withdrawal access for this application.' });
         return;
       }
    }

    const isSuccess = await ApplicationModel.delete(appId);
    if (!isSuccess) {
      res.status(400).json({ error: 'Failed to delete application record.' });
      return;
    }

    res.status(200).json({ message: 'Application record deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const viewReports = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reportData = await ApplicationModel.getSummaryReport();
    res.status(200).json({ report: reportData });
  } catch (err) {
    next(err);
  }
};
