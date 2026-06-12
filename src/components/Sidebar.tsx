interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  role: 'student' | 'recruiter' | 'admin';
}

export default function Sidebar({ activeSection, setActiveSection, onLogout, role }: SidebarProps) {
  const upperRole = String(role).toUpperCase();

  return (
    <aside className="dashboard-sidebar neon-border" id="dashboard-sidebar" style={{ background: 'var(--bg-panel)' }}>
      <div className="sidebar-heading" style={{ color: 'var(--cyber-yellow)', borderBottom: '1px solid var(--border-slate)', paddingBottom: '0.75rem' }}>
        Access Role: {upperRole}
      </div>

      <nav style={{ flexGrow: 1, marginTop: '1.5rem' }}>
        <ul className="sidebar-menu">
          <li>
            <button
              onClick={() => setActiveSection('OVERVIEW')}
              className={`sidebar-btn ${activeSection === 'OVERVIEW' ? 'active' : ''}`}
            >
              Dashboard Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('APPLICATIONS')}
              className={`sidebar-btn ${activeSection === 'APPLICATIONS' ? 'active' : ''}`}
            >
              {role === 'student' ? 'My Applications' : 'Manage Candidates'}
            </button>
          </li>

          {role === 'admin' && (
            <>
              <li>
                <button
                  onClick={() => setActiveSection('ADMIN_USERS')}
                  className={`sidebar-btn ${activeSection === 'ADMIN_USERS' ? 'active' : ''}`}
                >
                  Manage Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('ADMIN_REPORTS')}
                  className={`sidebar-btn ${activeSection === 'ADMIN_REPORTS' ? 'active' : ''}`}
                >
                  Analytics & Reports
                </button>
              </li>
            </>
          )}

          <li>
            <button
              onClick={() => setActiveSection('DRIVES')}
              className={`sidebar-btn ${activeSection === 'DRIVES' ? 'active' : ''}`}
            >
              Active Drives
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('NOTIFICATIONS')}
              className={`sidebar-btn ${activeSection === 'NOTIFICATIONS' ? 'active' : ''}`}
            >
              Broadcast Announcements
            </button>
          </li>
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button
          onClick={onLogout}
          className="cyber-btn cyber-btn-magenta cyber-btn-small"
          style={{ width: '100%', outline: 'none' }}
        >
          Disconnect Session
        </button>
      </div>
    </aside>
  );
}
