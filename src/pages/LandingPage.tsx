import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import JobCard from '../components/JobCard';
import { jobService } from '../services/jobService';

export default function LandingPage() {
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sysError, setSysError] = useState<string | null>(null);

  // Synchronize on mount
  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        setLoading(true);
        const data = await jobService.getAllJobs();
        setDbJobs(data || []);
      } catch (err: any) {
        console.error('[LandingPage fetch failed]:', err);
        setSysError(err?.message || 'Failed to sync remote placement catalog.');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveJobs();
  }, []);

  // Filtering logic
  const filteredJobs = useMemo(() => {
    return dbJobs.filter(job => {
      const typeStr = job.type || 'FULL-TIME';
      const matchesType = selectedType === 'ALL' || typeStr.toUpperCase() === selectedType.toUpperCase();
      const skillsStr = (job.skills || []).join(' ');
      const companyStr = job.company_name || job.company || '';
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skillsStr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [dbJobs, selectedType, searchQuery]);

  return (
    <div className="cyber-canvas" id="sys-landing-page">
      {/* Hero Section */}
      <section className="hero-wrapper neon-border">
        <div className="hero-tag">// WELCOME TO CAMPUSLINK //</div>
        <h1 className="hero-main" style={{ fontSize: '2.8rem', fontWeight: 'bold' }}>
          CAMPUS LINK PLACEMENT HUB
        </h1>
        <p className="hero-desc">
          A fully integrated career opportunities and recruitment portal. Students can manage profiles, submit resumes, and explore potential full-time placements and internship roles.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/register" className="cyber-btn" style={{ outline: 'none' }}>
            Create Account
          </Link>
          <a href="#vacancies" className="cyber-btn cyber-btn-magenta" style={{ outline: 'none' }}>
            Explore Drive Openings
          </a>
        </div>
      </section>

      {/* Statistics telemetry */}
      <section className="grid-stats">
        <StatsCard 
          label="Registered Alumni" 
          value="1,492" 
          highlightColor="var(--cyber-cyan)" 
          subText="Active Student Candidates"
        />
        <StatsCard 
          label="Verified Employers" 
          value="87" 
          highlightColor="var(--cyber-magenta)" 
          subText="Partner Enterprises"
        />
        <StatsCard 
          label="Placement Rate" 
          value="98.2%" 
          highlightColor="var(--cyber-green)" 
          subText="Successful career placements"
        />
        <StatsCard 
          label="Max Package Offered" 
          value="32.0 LPA" 
          highlightColor="var(--cyber-yellow)" 
          subText="Top annual salary offer"
        />
      </section>

      {/* Guide Section */}
      <section className="about-block neon-border" style={{ borderLeft: '4px solid var(--cyber-cyan)' }}>
        <div className="about-header">
          <h2 className="section-title text-xl">[Core Operational Objective]</h2>
          <span className="terminal-indicator">Version 4.2</span>
        </div>
        <p className="about-text">
          The Campus Placement & Internship Portal serves as a modernized professional bridge linking high-caliber student candidates with lead employers. The system enforces custom security access scopes for students, recruiters, and master site administrators to ensure reliable, high-integrity workflows.
        </p>
      </section>

      {/* Vacant Positions list with Filters */}
      <section className="jobs-section" id="vacancies">
        <div className="about-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">[Active Recruitment Openings]</h2>
          <span className="terminal-indicator" style={{ color: 'var(--cyber-cyan)' }}>
            {filteredJobs.length} Positions Available
          </span>
        </div>

        <div className="filter-bar neon-border">
          <div>
            <span className="filter-title">Search Jobs:</span>
            <input 
              type="text" 
              placeholder="Filter by title, company, stack..." 
              className="cyber-select"
              style={{ marginLeft: '1rem', width: '250px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <div>
              <span className="filter-title">Job Type:</span>
              <select 
                className="cyber-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ marginLeft: '0.5rem' }}
              >
                <option value="ALL">All Categories</option>
                <option value="FULL-TIME">Full-Time Placements</option>
                <option value="INTERNSHIP">Internship Drives</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 font-mono text-lg animate-pulse" style={{ color: 'var(--cyber-cyan)' }}>
            Loading Active Jobs Catalog From Directory...
          </div>
        ) : sysError ? (
          <div className="about-block neon-border text-center py-10" style={{ borderColor: 'var(--cyber-magenta)' }}>
            <span style={{ color: 'var(--cyber-magenta)', fontWeight: 'bold' }}>[Database Connection Failed] {sysError}</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Ensure database credentials or tables are configured and refresh.
            </p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="about-block neon-border text-center py-10" style={{ borderStyle: 'solid', borderColor: '#e2e8f0' }}>
            <span style={{ color: 'var(--cyber-yellow)', fontWeight: 'bold' }}>No matching opportunities found.</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Broaden or clear your search filter criteria to view listings.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
