import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../../src/pages/Register';
import { useAuth } from '../../../src/context/AuthContext';

// Mock target context and navigates
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component Test Suite', () => {
  const mockRegisterUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      registerUser: mockRegisterUser,
      error: null
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all initial inputs correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('e.g. Rachel Tyrell')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. rachel@university.edu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimum 6 characters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Student Candidate' })).toBeInTheDocument();
  });

  it('validates blank submission name requirements', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: 'Register Profile' });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please provide your full name/i)).toBeInTheDocument();
  });

  it('validates missing email address constraints', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('e.g. Rachel Tyrell');
    const submitBtn = screen.getByRole('button', { name: 'Register Profile' });

    fireEvent.change(nameInput, { target: { value: 'Rachel Tyrell' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
  });

  it('validates minimum password length constraints', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('e.g. Rachel Tyrell');
    const emailInput = screen.getByPlaceholderText('e.g. rachel@university.edu');
    const passInput = screen.getByPlaceholderText('Minimum 6 characters');
    const submitBtn = screen.getByRole('button', { name: 'Register Profile' });

    fireEvent.change(nameInput, { target: { value: 'Rachel Tyrell' } });
    fireEvent.change(emailInput, { target: { value: 'rachel@university.edu' } });
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password must contain at least 6 characters/i)).toBeInTheDocument();
  });

  it('validates password mismatch constraints', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('e.g. Rachel Tyrell');
    const emailInput = screen.getByPlaceholderText('e.g. rachel@university.edu');
    const passInput = screen.getByPlaceholderText('Minimum 6 characters');
    const confirmInput = screen.getByPlaceholderText('••••••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Register Profile' });

    fireEvent.change(nameInput, { target: { value: 'Rachel Tyrell' } });
    fireEvent.change(emailInput, { target: { value: 'rachel@university.edu' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'passwordXYZ' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('successfully triggers user registration and redirects user', async () => {
    mockRegisterUser.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Rachel Tyrell'), { target: { value: 'Rachel Tyrell' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. rachel@university.edu'), { target: { value: 'rachel@university.edu' } });
    fireEvent.change(screen.getByPlaceholderText('Minimum 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), { target: { value: 'password123' } });
    
    // Choose recruiter role
    fireEvent.click(screen.getByRole('button', { name: 'Hiring Recruiter' }));

    fireEvent.click(screen.getByRole('button', { name: 'Register Profile' }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        name: 'Rachel Tyrell',
        email: 'rachel@university.edu',
        password: 'password123',
        role: 'recruiter'
      });
      expect(screen.getByText(/REGISTRATION SUCCESSFUL/i)).toBeInTheDocument();
    });

    // Fast-forward registration timer
    jest.advanceTimersByTime(2500);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders registration errors from API exceptions correctly', async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error('Email is already registered on campus database.'));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Rachel Tyrell'), { target: { value: 'Rachel Tyrell' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. rachel@university.edu'), { target: { value: 'rachel@university.edu' } });
    fireEvent.change(screen.getByPlaceholderText('Minimum 6 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register Profile' }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Email is already registered on campus database/i)).toBeInTheDocument();
    });
  });
});
