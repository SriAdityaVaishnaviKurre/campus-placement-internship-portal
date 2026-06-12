import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../../src/pages/LandingPage';
import { jobService } from '../../../src/services/jobService';

// Mock the jobService
jest.mock('../../../src/services/jobService', () => ({
  jobService: {
    getAllJobs: jest.fn(),
  },
}));

describe('LandingPage Testing Suite', () => {
  const mockJobs = [
    {
      id: 1,
      title: 'Full Stack Engineer',
      company_name: 'Tech Corp',
      description: 'Building high quality cloud services with React and Node.',
      location: 'Bangalore, India',
      salary: '18 LPA',
      deadline: '2026-07-15',
      type: 'FULL-TIME',
      skills: ['React', 'Node', 'TypeScript']
    },
    {
      id: 2,
      title: 'Data Analyst',
      company_name: 'Analytics Co',
      description: 'Perform advanced intelligence analytics pipelines.',
      location: 'Delhi, India',
      salary: '10 LPA',
      deadline: '2026-08-31',
      type: 'INTERNSHIP',
      skills: ['SQL', 'Python']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('verifies initial elements render successfully', async () => {
    jobService.getAllJobs.mockResolvedValueOnce(mockJobs);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Verify Title and Sub-title are rendered
    expect(screen.getByText('CAMPUS LINK PLACEMENT HUB')).toBeInTheDocument();
    expect(screen.getByText(/A fully integrated career opportunities/)).toBeInTheDocument();

    // Verify stats cards are rendered with proper values
    expect(screen.getByText('Registered Alumni')).toBeInTheDocument();
    expect(screen.getByText('1,492')).toBeInTheDocument();
    expect(screen.getByText('Verified Employers')).toBeInTheDocument();
    expect(screen.getByText('87')).toBeInTheDocument();
  });

  it('displays loading state initially and then shows jobs on success', async () => {
    jobService.getAllJobs.mockResolvedValueOnce(mockJobs);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading Active Jobs Catalog From Directory/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
      expect(screen.getByText('Data Analyst')).toBeInTheDocument();
    });
  });

  it('performs job filtering based on search query text', async () => {
    jobService.getAllJobs.mockResolvedValueOnce(mockJobs);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Filter by title, company, stack...');
    
    // Filter to 'Full Stack'
    fireEvent.change(searchInput, { target: { value: 'Full Stack' } });
    expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Data Analyst')).not.toBeInTheDocument();

    // Filter to 'Analytics'
    fireEvent.change(searchInput, { target: { value: 'Analytics' } });
    expect(screen.getByText('Data Analyst')).toBeInTheDocument();
    expect(screen.queryByText('Full Stack Engineer')).not.toBeInTheDocument();
  });

  it('performs filtering based on job category select dropdown', async () => {
    jobService.getAllJobs.mockResolvedValueOnce(mockJobs);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
    });

    const selectDropdown = screen.getByRole('combobox');
    
    // Choose Internships only
    fireEvent.change(selectDropdown, { target: { value: 'INTERNSHIP' } });
    expect(screen.getByText('Data Analyst')).toBeInTheDocument();
    expect(screen.queryByText('Full Stack Engineer')).not.toBeInTheDocument();
  });

  it('handles remote API exceptions gracefully with failure alerts', async () => {
    jobService.getAllJobs.mockRejectedValueOnce(new Error('Network handshake failed'));

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Database Connection Failed/)).toBeInTheDocument();
      expect(screen.getByText(/Network handshake failed/)).toBeInTheDocument();
    });
  });
});
