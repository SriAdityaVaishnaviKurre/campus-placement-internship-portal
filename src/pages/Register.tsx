import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { user, registerUser, error: authContextError } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (!name.trim()) {
      setLocalError('Please provide your full name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Email address is required.');
      return;
    }
    if (!password) {
      setLocalError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        role
      });
      setSuccess('REGISTRATION SUCCESSFUL. Your profile has been created. Redirecting to the login screen...');
      
      // Clear fields on successful activation
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      console.error('[Registration failed]:', err);
      setLocalError(err?.message || 'Failed to complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cyber-canvas" id="sys-register">
      <div className="auth-wrapper neon-border" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <div className="title-glitch" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            Register New Profile
          </div>
          <p className="auth-desc mt-2">
            Establish a professional candidate or hiring recruiter signature in the centralized portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form mt-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Rachel Tyrell"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. rachel@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Selected Role</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === 'student' ? 'selected' : ''}`}
                onClick={() => setRole('student')}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
              >
                Student Candidate
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'recruiter' ? 'selected' : ''}`}
                onClick={() => setRole('recruiter')}
                disabled={isLoading}
                style={{ borderRadius: '8px' }}
              >
                Hiring Recruiter
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {localError && (
            <div className="error-msg text-xs" style={{ color: '#ef4444' }}>
              ⚠️ Error: {localError}
            </div>
          )}

          {authContextError && !localError && (
            <div className="error-msg text-xs" style={{ color: '#ef4444' }}>
              ⚠️ Context failure: {authContextError}
            </div>
          )}

          {success && (
            <div className="text-xs text-center p-3 font-semibold" style={{ color: 'var(--cyber-green)', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              🛡️ {success}
            </div>
          )}

          <button
            type="submit"
            className="cyber-btn mt-2"
            style={{ width: '100%', padding: '0.8rem', outline: 'none' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register Profile'}
          </button>
        </form>

        <p className="auth-redirect mt-6 text-sm text-[var(--text-muted)] text-center">
          Already registered?{' '}
          <Link to="/login" className="auth-link" style={{ color: 'var(--cyber-cyan)' }}>
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
}
