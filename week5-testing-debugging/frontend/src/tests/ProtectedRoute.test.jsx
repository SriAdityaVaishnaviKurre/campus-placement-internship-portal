import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../src/components/ProtectedRoute';
import { useAuth } from '../../../src/context/AuthContext';

// Mock Auth Context
jest.mock('../../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedRoute Testing Suite', () => {
  it('renders loading placeholder during authentications status audits', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Synchronizing system data... Please wait/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login panel', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/secured-sector']}>
        <Routes>
          <Route path="/login" element={<div>Login Interface</div>} />
          <Route path="/secured-sector" element={
            <ProtectedRoute>
              <div>Secured Space</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Interface')).toBeInTheDocument();
    expect(screen.queryByText('Secured Space')).not.toBeInTheDocument();
  });

  it('grants access to authenticated users matching requested permissions', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Amit Sharma', role: 'student' },
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/secured-sector']}>
        <Routes>
          <Route path="/secured-sector" element={
            <ProtectedRoute allowedRoles={['student']}>
              <div>Secured Student Space</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secured Student Space')).toBeInTheDocument();
  });

  it('declares access denied and redirects when user lacks scope clearances', () => {
    useAuth.mockReturnValue({
      user: { id: 1, name: 'Amit Sharma', role: 'student' },
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin-console']}>
        <Routes>
          <Route path="/dashboard" element={<div>User Dashboard Terminal</div>} />
          <Route path="/admin-console" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Admin Only Control Panel</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/You do not have the required permissions/i)).toBeInTheDocument();
  });
});
