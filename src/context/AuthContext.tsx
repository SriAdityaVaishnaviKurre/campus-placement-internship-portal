import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserCreds } from '../services/authService';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'recruiter';
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  studentProfile: any | null;
  recruiterProfile: any | null;
  jobs: any[];
  applications: any[];
  isLoading: boolean;
  error: string | null;
  login: (creds: UserCreds) => Promise<void>;
  registerUser: (creds: UserCreds) => Promise<void>;
  logout: () => Promise<void>;
  loadStudentProfile: () => Promise<void>;
  loadRecruiterProfile: () => Promise<void>;
  updateStudentProfile: (payload: any) => Promise<void>;
  updateRecruiterProfile: (payload: any) => Promise<void>;
  loadJobs: () => Promise<void>;
  createJob: (payload: any) => Promise<void>;
  loadApplications: () => Promise<void>;
  applyToJob: (jobId: number | string) => Promise<void>;
  updateAppStatus: (appId: number | string, status: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);
  const [recruiterProfile, setRecruiterProfile] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Read initial credential values on dashboard initiation mounts
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem('neo_token');
      const savedUser = localStorage.getItem('neo_user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);

          // Eagerly pre-load core data for the respective authenticated roles
          if (parsedUser.role === 'student') {
            const profile = await userService.getStudentProfile();
            setStudentProfile(profile);
          } else if (parsedUser.role === 'recruiter') {
            const profile = await userService.getRecruiterProfile();
            setRecruiterProfile(profile);
          }
        } catch (err: any) {
          console.error('[Session Restoration failed]:', err);
          // Graceful session cleanup
          localStorage.removeItem('neo_token');
          localStorage.removeItem('neo_user');
        }
      }
      
      // Load public job openings
      try {
        const jobList = await jobService.getAllJobs();
        setJobs(jobList);
      } catch (err) {
        console.error('[Initial Jobs Fetch Failed]:', err);
      }

      setIsLoading(false);
    };

    initSession();
  }, []);

  const login = async (creds: UserCreds) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(creds);
      localStorage.setItem('neo_token', data.token);
      localStorage.setItem('neo_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      // Async pull profile contexts after successfully obtaining verified role access
      if (data.user.role === 'student') {
        const profile = await userService.getStudentProfile().catch(() => null);
        setStudentProfile(profile);
      } else if (data.user.role === 'recruiter') {
        const profile = await userService.getRecruiterProfile().catch(() => null);
        setRecruiterProfile(profile);
      }

      // Load applications list
      await loadApplications().catch(() => {});
    } catch (err: any) {
      setError(err?.message || 'Login exception occurred.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (creds: UserCreds) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(creds);
    } catch (err: any) {
      setError(err?.message || 'Registration exception occurred.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout().catch(() => {});
    } finally {
      localStorage.removeItem('neo_token');
      localStorage.removeItem('neo_user');
      setToken(null);
      setUser(null);
      setStudentProfile(null);
      setRecruiterProfile(null);
      setApplications([]);
      setIsLoading(false);
    }
  };

  const loadStudentProfile = async () => {
    try {
      const profile = await userService.getStudentProfile();
      setStudentProfile(profile);
    } catch (err: any) {
      console.error('[loadStudentProfile Fail]:', err);
    }
  };

  const loadRecruiterProfile = async () => {
    try {
      const profile = await userService.getRecruiterProfile();
      setRecruiterProfile(profile);
    } catch (err: any) {
      console.error('[loadRecruiterProfile Fail]:', err);
    }
  };

  const updateStudentProfile = async (payload: any) => {
    setError(null);
    try {
      await userService.updateStudentProfile(payload);
      await loadStudentProfile();
    } catch (err: any) {
      setError(err?.message || 'Student Profile update failed.');
      throw err;
    }
  };

  const updateRecruiterProfile = async (payload: any) => {
    setError(null);
    try {
      await userService.updateRecruiterProfile(payload);
      await loadRecruiterProfile();
    } catch (err: any) {
      setError(err?.message || 'Recruiter Profile update failed.');
      throw err;
    }
  };

  const loadJobs = async () => {
    try {
      const list = await jobService.getAllJobs();
      setJobs(list);
    } catch (err: any) {
      console.error('[loadJobs Fail]:', err);
    }
  };

  const createJob = async (payload: any) => {
    try {
      await jobService.createJob(payload);
      await loadJobs();
    } catch (err: any) {
      setError(err?.message || 'Creating job posting failed.');
      throw err;
    }
  };

  const loadApplications = async () => {
    if (!localStorage.getItem('neo_token')) return;
    try {
      const list = await applicationService.getApplications();
      setApplications(list);
    } catch (err: any) {
      console.error('[loadApplications Fail]:', err);
    }
  };

  const applyToJob = async (jobId: number | string) => {
    try {
      await applicationService.applyForJob(jobId);
      await loadApplications();
    } catch (err: any) {
      setError(err?.message || 'Submitting job application failed.');
      throw err;
    }
  };

  const updateAppStatus = async (appId: number | string, status: any) => {
    try {
      await applicationService.updateStatus(appId, status);
      await loadApplications();
    } catch (err: any) {
      setError(err?.message || 'Changing application status failed.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        studentProfile,
        recruiterProfile,
        jobs,
        applications,
        isLoading,
        error,
        login,
        registerUser,
        logout,
        loadStudentProfile,
        loadRecruiterProfile,
        updateStudentProfile,
        updateRecruiterProfile,
        loadJobs,
        createJob,
        loadApplications,
        applyToJob,
        updateAppStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be called from within an AuthProvider root.');
  }
  return context;
}
