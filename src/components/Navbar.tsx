import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="cyber-header" id="sys-navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <span className="logo-text">CampusLink</span>
          <span className="logo-sub">Career Hub</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/job-details" className={`nav-link ${location.pathname.startsWith('/job-details') ? 'active' : ''}`}>
                Job Openings
              </Link>
            </li>
            {user ? (
              <li>
                <button onClick={handleLogout} className="auth-btn-nav">
                  Sign Out ({user.name.split(' ')[0]})
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="auth-btn-nav">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="auth-btn-nav" style={{ borderColor: 'var(--cyber-cyan)', color: 'var(--cyber-cyan)' }}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
