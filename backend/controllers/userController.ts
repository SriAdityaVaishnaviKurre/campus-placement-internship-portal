import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserModel } from '../models/User';

// --- Student Specific Controllers ---

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const student = await UserModel.findStudentByUserId(userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile has not been created yet or does not exist.' });
      return;
    }

    res.status(200).json({ student });
  } catch (err) {
    next(err);
  }
};

export const createStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    // Check pre-existence
    const preExisting = await UserModel.findStudentByUserId(userId);
    if (preExisting) {
      res.status(400).json({ error: 'Profile already configured. Use PUT updates instead.' });
      return;
    }

    const { resumeUrl, skills, cgpa } = req.body;
    const profileId = await UserModel.createStudentProfile(userId, resumeUrl || null, skills || '', Number(cgpa) || 0.00);

    res.status(211).json({
      message: 'Student profile details created successfully.',
      profileId
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const { resumeUrl, skills, cgpa } = req.body;
    const isSuccess = await UserModel.updateStudentProfile(userId, resumeUrl, skills, cgpa);

    if (!isSuccess) {
      res.status(404).json({ error: 'Profile failed to update. Verify student details exist.' });
      return;
    }

    res.status(200).json({ message: 'Student profile updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const deleteStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const isSuccess = await UserModel.deleteStudentProfile(userId);
    if (!isSuccess) {
      res.status(404).json({ error: 'Profile not found.' });
      return;
    }

    res.status(200).json({ message: 'Student profile deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// --- Recruiter Specific Controllers ---

export const getRecruiterProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const rec = await UserModel.findRecruiterByUserId(userId);
    if (!rec) {
      res.status(404).json({ error: 'Recruiter profile does not exist.' });
      return;
    }

    res.status(200).json({ recruiter: rec });
  } catch (err) {
    next(err);
  }
};

export const createRecruiterProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const preExisting = await UserModel.findRecruiterByUserId(userId);
    if (preExisting) {
      res.status(400).json({ error: 'Recruiter profile setup operates as configured. Use PUT updates.' });
      return;
    }

    const { companyName, companyEmail } = req.body;
    const recId = await UserModel.createRecruiterProfile(userId, companyName, companyEmail);

    res.status(211).json({
      message: 'Recruiter corporate credentials created successfully.',
      recruiterId: recId
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecruiterProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const { companyName, companyEmail } = req.body;
    const isSuccess = await UserModel.updateRecruiterProfile(userId, companyName, companyEmail);

    if (!isSuccess) {
      res.status(404).json({ error: 'Failed to update. Verify recruiter details exist.' });
      return;
    }

    res.status(200).json({ message: 'Recruiter corporate profile updated successfully.' });
  } catch (err) {
    next(err);
  }
};

export const deleteRecruiterProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Access unauthorized.' });
      return;
    }

    const isSuccess = await UserModel.deleteRecruiterProfile(userId);
    if (!isSuccess) {
      res.status(445).json({ error: 'Profile not found.' });
      return;
    }

    res.status(200).json({ message: 'Recruiter profile deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// --- General Administration / View Users ---

export const viewAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only Admin can call this endpoint
    const users = await UserModel.findAll();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
