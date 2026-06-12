import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, error: contextError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError('Email address is strictly required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Please enter a valid format email address.');
      return;
    }
    if (!password) {
      setLocalError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Login process failed]:', err);
      setLocalError(err?.message || 'Authentication failed. Access Denied.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = (type: 'student' | 'recruiter' | 'admin') => {
    if (type === 'student') {
      setEmail('student.demo@campuslink.edu');
      setPassword('student123');
    } else if (type === 'recruiter') {
      setEmail('recruiter.demo@campuslink.edu');
      setPassword('recruiter123');
    } else {
      setEmail('admin@campuslink.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="cyber-canvas" id="sys-login">
      <div className="auth-wrapper neon-border">
        <div className="auth-header">
          <div className="title-glitch" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            Portal Authentication
          </div>
          <p className="auth-desc mt-2">
            Secure login to the Campus Link database registries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form mt-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password Code</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {localError && (
            <div className="error-msg text-xs" style={{ color: '#ef4444' }}>
              ⚠️ Access Denied: {localError}
            </div>
          )}

          {contextError && !localError && (
            <div className="error-msg text-xs" style={{ color: '#ef4444' }}>
              ⚠️ Connection failure: {contextError}
            </div>
          )}

          <button
            type="submit"
            className="cyber-btn mt-2"
            style={{ width: '100%', padding: '0.8rem', outline: 'none' }}
            disabled={isLoading}
          >
            {isLoading ? 'Decrypting Credentials...' : 'Sign In To Account'}
          </button>
        </form>

        <div className="mt-6 border-t border-[var(--border-slate)] pt-4">
          <p className="text-[11px] text-[var(--text-muted)] mb-3 text-center tracking-wider font-semibold">
            ⚡ QUICK DEMO LOGIN INJECTORS
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => loadProfile('student')}
              className="cyber-btn cyber-btn-small"
              style={{ fontSize: '10px', padding: '0.45rem', border: '1px solid var(--cyber-cyan)', color: 'var(--cyber-cyan)', background: '#f5f3ff' }}
            >
              STUDENT
            </button>
            <button
              onClick={() => loadProfile('recruiter')}
              className="cyber-btn cyber-btn-small"
              style={{ fontSize: '10px', padding: '0.45rem', border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)', background: '#faf5ff' }}
            >
              RECRUITER
            </button>
            <button
              onClick={() => loadProfile('admin')}
              className="cyber-btn cyber-btn-small"
              style={{ fontSize: '10px', padding: '0.45rem', border: '1px solid var(--cyber-yellow)', color: 'var(--cyber-yellow)', background: '#fffbeb' }}
            >
              ROOT ADMIN
            </button>
          </div>
        </div>

        <p className="auth-redirect mt-6 text-sm text-[var(--text-muted)] text-center">
          Need a profile registered?{' '}
          <Link to="/register" className="auth-link" style={{ color: 'var(--cyber-cyan)' }}>
            Register Profile
          </Link>
        </p>
      </div>
    </div>
  );
}
