import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import JobDetails from '../../../src/pages/JobDetails';
import { useAuth } from '../../../src/context/AuthContext';
import { jobService } from '../../../src/services/jobService';

// Mock target context and service layers
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../src/services/jobService', () => ({
  jobService: {
    getJobById: jest.fn(),
    getAllJobs: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: '?id=1'
  })
}));

describe('JobDetails Component Test Suite', () => {
  const mockApplyToJob = jest.fn();
  const mockLoadJobs = jest.fn();
  const mockLoadApplications = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockJob = {
    id: 1,
    title: 'Cloud Security Analyst',
    company_name: 'Azure Fortress',
    description: 'Ensure absolute defense bounds across multi-tenant cluster systems.',
    location: 'Remote, office options',
    salary: '22 LPA',
    deadline: '2026-09-30',
    type: 'FULL-TIME',
    skills: ['Azure', 'Kubernetes', 'Kusto']
  };

  it('renders loading states and then displays job details properly on fetch', async () => {
    useAuth.mockReturnValue({
      user: null,
      applyToJob: mockApplyToJob,
      applications: [],
      jobs: [],
      loadJobs: mockLoadJobs,
      loadApplications: mockLoadApplications,
    });
    jobService.getJobById.mockResolvedValueOnce(mockJob);

    render(
      <MemoryRouter>
        <JobDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Retrieving job specifications/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Cloud Security Analyst')).toBeInTheDocument();
      expect(screen.getByText('Azure Fortress')).toBeInTheDocument();
      expect(screen.getByText('22 LPA')).toBeInTheDocument();
    });
  });

  it('restricts unauthenticated users from applying and pushes sign-in redirects', async () => {
    useAuth.mockReturnValue({
      user: null,
      applyToJob: mockApplyToJob,
      applications: [],
      jobs: [],
      loadJobs: mockLoadJobs,
      loadApplications: mockLoadApplications,
    });
    jobService.getJobById.mockResolvedValueOnce(mockJob);

    render(
      <MemoryRouter>
        <JobDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cloud Security Analyst')).toBeInTheDocument();
    });

    const applyBtn = screen.getByRole('button', { name: /Submit Applications Profile/i });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/Authentication Required. Please sign in to submit your candidate profile./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign In to Apply/i })).toBeInTheDocument();
  });

  it('supports successful job applications for authorized students', async () => {
    useAuth.mockReturnValue({
      user: { id: 10, role: 'student' },
      applyToJob: mockApplyToJob,
      applications: [],
      jobs: [],
      loadJobs: mockLoadJobs,
      loadApplications: mockLoadApplications,
    });
    jobService.getJobById.mockResolvedValueOnce(mockJob);
    mockApplyToJob.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <JobDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cloud Security Analyst')).toBeInTheDocument();
    });

    const applyBtn = screen.getByRole('button', { name: /Submit Applications Profile/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(mockApplyToJob).toHaveBeenCalledWith(1);
      expect(screen.getByText(/Application profile submitted successfully/)).toBeInTheDocument();
    });
  });

  it('disables apply elements for students who have already submitted profiles', async () => {
    useAuth.mockReturnValue({
      user: { id: 10, role: 'student' },
      applyToJob: mockApplyToJob,
      applications: [{ id: 4, job_id: 1, student_id: 10, status: 'pending' }],
      jobs: [],
      loadJobs: mockLoadJobs,
      loadApplications: mockLoadApplications,
    });
    jobService.getJobById.mockResolvedValueOnce(mockJob);

    render(
      <MemoryRouter>
        <JobDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cloud Security Analyst')).toBeInTheDocument();
    });

    const successBtn = screen.getByRole('button', { name: /Application Transmitted/i });
    expect(successBtn).toBeDisabled();
    expect(screen.getByText(/Your profile has been received. You can track this application/i)).toBeInTheDocument();
  });
});
