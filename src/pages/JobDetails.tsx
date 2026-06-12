import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';

export default function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, applyToJob, applications, jobs, loadJobs, loadApplications } = useAuth();

  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Extract ID parameter from query string
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const loadJobDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const job = await jobService.getJobById(id);
          setSelectedJob(job || null);
        } else {
          // If no id, load first available job in list
          let activeJobs = jobs;
          if (!activeJobs || activeJobs.length === 0) {
            await loadJobs();
            const reFetched = await jobService.getAllJobs();
            activeJobs = reFetched || [];
          }
          if (activeJobs && activeJobs.length > 0) {
            setSelectedJob(activeJobs[0]);
          }
        }
      } catch (err: any) {
        console.error('[loadJobDetails Fail]:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [location.search, jobs]);

  const hasApplied = selectedJob && applications?.some((app: any) => Number(app.job_id) === Number(selectedJob.id));

  const handleApplyNode = async () => {
    if (!selectedJob) return;

    if (!user) {
      setIsError(true);
      setApplyMessage('Authentication Required. Please sign in to submit your candidate profile.');
      return;
    }

    if (user.role !== 'student') {
      setIsError(true);
      setApplyMessage('Hiring organization or admin accounts are restricted from submitting job applications.');
      return;
    }

    setIsError(false);
    setApplyMessage('');

    try {
      setLoading(true);
      await applyToJob(selectedJob.id);
      await loadApplications();
      setApplyMessage('Application profile submitted successfully! You can track this on your dashboard.');
    } catch (err: any) {
      setIsError(true);
      setApplyMessage(err?.message || 'Failed to submit application package.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cyber-canvas text-center py-20 font-mono text-lg animate-pulse" style={{ color: 'var(--cyber-cyan)' }}>
        Retrieving job specifications...
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="cyber-canvas" style={{ textAlign: 'center', padding: '5rem 0' }} id="sys-job-details">
        <h2 className="title-glitch" style={{ color: 'var(--cyber-magenta)' }}>Opportunity Not Located</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          The selected job posting could not be found or registered in our databases.
        </p>
        <Link to="/" className="cyber-btn mt-6">Return to Directory</Link>
      </div>
    );
  }

  const company = selectedJob.company_name || selectedJob.company || 'Partner Enterprise';

  return (
    <div className="cyber-canvas" id="sys-job-details">
      <div className="about-header" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-slate)', paddingBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--cyber-yellow)', fontWeight: 'bold' }}>Career Opportunity Specifications</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <h1 className="title-glitch" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', textTransform: 'none' }}>
            Opportunity specifications - #{selectedJob.id}
          </h1>
          {/* Quick node switcher */}
          {jobs && jobs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.8rem' }}>QUICK SWITCH:</span>
              <select
                className="cyber-select"
                value={selectedJob.id}
                onChange={(e) => navigate(`/job-details?id=${e.target.value}`)}
                style={{ fontSize: '12px', padding: '0.35rem' }}
              >
                {jobs.map((j: any) => (
                  <option key={j.id} value={j.id}>
                    {j.company_name || j.company || 'Enterprise'} - {j.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="job-details-grid">
        {/* Main Column */}
        <div className="job-main-column neon-border">
          <div className="details-comp-meta">
            <span className="details-comp-label">Hiring Organization</span>
            <div style={{ fontSize: '1.4rem', color: 'var(--cyber-cyan)', fontWeight: 'bold', marginTop: '0.2rem' }}>
              {company}
            </div>
            <h2 className="details-job-title text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{selectedJob.title}</h2>
          </div>

          <div className="details-section">
            <h3>Role Overview & Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              {selectedJob.description}
            </p>
          </div>

          <div className="details-section">
            <h3>Eligibility & Criteria</h3>
            <ul className="criteria-list text-sm mt-3 space-y-2">
              <li>Candidates must complete all submission steps prior to application deadlines.</li>
              <li>Undergraduate or graduate credentials alignment with organization recruitment target CGPA.</li>
              <li>Fully cleared placement and professional track institutional validation.</li>
            </ul>
          </div>

          <div className="details-section">
            <h3>Required System Skill sets</h3>
            <div className="skills-tags mt-3">
              {(selectedJob.skills || ['HTML5', 'SQL', 'React', 'Git']).map((skill: string, index: number) => (
                <span key={index} className="skill-tag" style={{ borderStyle: 'solid' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side specifications card */}
        <div className="job-side-column neon-border">
          <div>
            <div className="param-card-title">Salary Package Budget</div>
            <div className="stat-value font-bold" style={{ fontSize: '1.8rem', color: 'var(--cyber-yellow)' }}>
              {selectedJob.salary || selectedJob.package || 'Competitive'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annualized CTC Compensation</span>
          </div>

          <div>
            <div className="param-card-title">Opportunity Metadata</div>
            <div className="param-row">
              <span className="param-lbl">JOB POSTING ID:</span>
              <span className="param-val" style={{ color: 'var(--cyber-cyan)' }}>#{selectedJob.id}</span>
            </div>
            <div className="param-row">
              <span className="param-lbl">PRIMARY LOCATION:</span>
              <span className="param-val">{selectedJob.location}</span>
            </div>
            <div className="param-row">
              <span className="param-lbl">CLOSING DATE:</span>
              <span className="param-val font-semibold text-orange-600">{selectedJob.deadline || '2026-08-31'}</span>
            </div>
            <div className="param-row">
              <span className="param-lbl">ENGAGEMENT:</span>
              <span className="param-val" style={{ color: 'var(--cyber-green)' }}>{selectedJob.type || 'Full-Time'}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-slate)', paddingTop: '1.5rem', marginTop: 'auto' }}>
            {hasApplied ? (
              <div>
                <button className="cyber-btn" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed', background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }} disabled>
                  Application Transmitted ✓
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--cyber-green)', marginTop: '0.8rem', lineHeight: '1.4', fontWeight: 'bold' }} className="text-center">
                  Your profile has been received. You can track this application on your dashboard workspace.
                </p>
                <Link to="/dashboard" className="cyber-btn mt-4 text-xs py-2 block text-center" style={{ width: '100%' }}>
                  Manage Candidate Dashboard
                </Link>
              </div>
            ) : (
              <div>
                <button onClick={handleApplyNode} className="cyber-btn" style={{ width: '100%', outline: 'none' }}>
                  Submit Applications Profile
                </button>
                {applyMessage && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: isError ? '#ef4444' : 'var(--cyber-green)',
                    marginTop: '0.8rem',
                    lineHeight: '1.4',
                  }} className="text-center">
                    {applyMessage}
                  </p>
                )}
                {isError && !user && (
                  <Link to="/login" className="cyber-btn" style={{ width: '100%', textAlign: 'center', marginTop: '0.8rem', background: '#ffffff', borderColor: '#cbd5e1', color: 'var(--text-primary)', outline: 'none' }}>
                    Sign In to Apply
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
