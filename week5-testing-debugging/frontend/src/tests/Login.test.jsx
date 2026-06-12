import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../src/pages/Login';
import { useAuth } from '../../../src/context/AuthContext';

// Mock target context and navigate hooks
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component Test Suite', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      error: null
    });
  });

  it('renders all form input fields and quick inject controls', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password Code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In To Account/i })).toBeInTheDocument();
    
    // Quick inject controls
    expect(screen.getByRole('button', { name: 'STUDENT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'RECRUITER' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ROOT ADMIN' })).toBeInTheDocument();
  });

  it('triggers registration validation messages if email is missing or bad', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Sign In To Account/i });
    
    // Trigger empty form validation
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Email address is strictly required/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email-format' } });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/Please enter a valid format email address/i)).toBeInTheDocument();
  });

  it('validates password code compliance requirements', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In To Account/i });

    fireEvent.change(emailInput, { target: { value: 'candidate@university.edu' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  it('supports profile injector button triggers for demo logins', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password Code/i);
    const studentBtn = screen.getByRole('button', { name: 'STUDENT' });

    fireEvent.click(studentBtn);
    expect(emailInput.value).toBe('student.demo@campuslink.edu');
    expect(passInput.value).toBe('student123');
  });

  it('triggers successful context logins redirecting candidates', async () => {
    mockLogin.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password Code/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In To Account/i });

    fireEvent.change(emailInput, { target: { value: 'student.demo@campuslink.edu' } });
    fireEvent.change(passInput, { target: { value: 'student123' } });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'student.demo@campuslink.edu',
        password: 'student123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('renders login exception messages when api triggers denials', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid secret passcode'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password Code/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In To Account/i });

    fireEvent.change(emailInput, { target: { value: 'user@domain.com' } });
    fireEvent.change(passInput, { target: { value: 'password' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Access Denied: Invalid secret passcode/i)).toBeInTheDocument();
    });
  });
});
