import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../src/pages/Dashboard';
import { useAuth } from '../../../src/context/AuthContext';
import { userService } from '../../../src/services/userService';
import { applicationService } from '../../../src/services/applicationService';

// Mock Auth Context and admin services
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../src/services/userService', () => ({
  userService: {
    getAllUsers: jest.fn(),
  },
}));

jest.mock('../../../src/services/applicationService', () => ({
  applicationService: {
    getReports: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component Test Suite', () => {
  const mockLogout = jest.fn();
  const mockUpdateStudentProfile = jest.fn();
  const mockUpdateRecruiterProfile = jest.fn();
  const mockLoadApplications = jest.fn();
  const mockLoadJobs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadApplications.mockResolvedValue([]);
    mockLoadJobs.mockResolvedValue([]);
  });

  const baseStudentContext = {
    user: { id: 1, name: 'John Student', email: 'john@campus.edu', role: 'student' },
    logout: mockLogout,
    studentProfile: { cgpa: 8.8, skills: 'React, Jest', resumeUrl: 'http://resume.pdf' },
    updateStudentProfile: mockUpdateStudentProfile,
    applications: [],
    loadApplications: mockLoadApplications,
    loadJobs: mockLoadJobs,
  };

  it('renders student profile layout and credentials correctly', async () => {
    useAuth.mockReturnValue(baseStudentContext);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('John Student')).toBeInTheDocument();
    expect(screen.getByText('User Session Outlet: john@campus.edu')).toBeInTheDocument();
    expect(screen.getByText(/Academic CGPA: 8.8/)).toBeInTheDocument();
  });

  it('allows students to update their profile information', async () => {
    useAuth.mockReturnValue(baseStudentContext);
    mockUpdateStudentProfile.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Click on Update Student Profile button
    const editBtn = screen.getByRole('button', { name: /update candidate profile/i });
    fireEvent.click(editBtn);

    // Verify input values and modification capacity
    const cgpaInput = screen.getByLabelText(/ACADEMIC CGPA/i);
    expect(cgpaInput.value).toBe('8.8');

    fireEvent.change(cgpaInput, { target: { value: '9.2' } });

    const submitBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateStudentProfile).toHaveBeenCalledWith({
        cgpa: 9.2,
        skills: 'React, Jest',
        resumeUrl: 'http://resume.pdf'
      });
      expect(screen.getByText(/Student profile details updated successfully/i)).toBeInTheDocument();
    });
  });

  it('renders recruiter administrative forms successfully', () => {
    const recruiterContext = {
      user: { id: 2, name: 'Alice Recruiter', email: 'alice@corp.com', role: 'recruiter' },
      logout: mockLogout,
      recruiterProfile: { company_name: 'Tech Corp', company_email: 'jobs@techcorp.com' },
      updateRecruiterProfile: mockUpdateRecruiterProfile,
      applications: [],
      loadApplications: mockLoadApplications,
      loadJobs: mockLoadJobs,
    };

    useAuth.mockReturnValue(recruiterContext);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Alice Recruiter')).toBeInTheDocument();
    expect(screen.getByText(/Corporate Hiring Recruiter Account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post new job opportunity/i })).toBeInTheDocument();
  });

  it('renders system admin specific widgets and analytical charts', async () => {
    const adminContext = {
      user: { id: 3, name: 'Super Admin', email: 'admin@campus.edu', role: 'admin' },
      logout: mockLogout,
      applications: [],
      loadApplications: mockLoadApplications,
      loadJobs: mockLoadJobs,
    };

    const mockUsers = [
      { id: 1, name: 'John Student', email: 'john@campus.edu', role: 'student' },
      { id: 2, name: 'Alice Recruiter', email: 'alice@corp.com', role: 'recruiter' }
    ];

    const mockReports = {
      usersCount: { total: 2 },
      jobsCount: { total: 5 },
      applicationsCount: { total: 10, pending: 4, shortlisted: 3, interviewing: 2, rejected: 1 }
    };

    useAuth.mockReturnValue(adminContext);
    userService.getAllUsers.mockResolvedValue(mockUsers);
    applicationService.getReports.mockResolvedValue(mockReports);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/MASTER SYSTEM ADMINISTRATOR ROOT ACCESS VALIDATED/)).toBeInTheDocument();
  });
});
