import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="cyber-footer" id="cyber-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>CAMPUS PLACEMENT PORTAL</h4>
          <p>
            A streamlined and professional campus recruitment system bridging qualified student talent with leading companies and industry innovators.
          </p>
          <p style={{ color: 'var(--cyber-green)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>
            Official Institutional Placement System
          </p>
        </div>

        <div className="footer-section">
          <h4>QUICK LINKS</h4>
          <ul className="footer-links">
            <li><Link to="/">Home / Vacancies</Link></li>
            <li><Link to="/dashboard">Student Dashboard</Link></li>
            <li><Link to="/job-details">Opportunities</Link></li>
            <li><Link to="/login">Portal Authentication</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>COMPLIANCE & TERMS</h4>
          <div className="footer-alert">
            <div className="footer-warning" style={{ color: 'var(--cyber-cyan)' }}>OFFICIAL PLACEMENT RULES</div>
            <p>
              All resume submissions and company interactions are monitored under the institutional guidelines and fair recruitment code of conduct.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <div>CampusLink Career Portal — Built with Google AI Studio</div>
        <div>Current Session: UTC 2026</div>
      </div>
    </footer>
  );
}
