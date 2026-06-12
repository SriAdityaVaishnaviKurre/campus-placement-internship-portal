import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    studentProfile,
    recruiterProfile,
    updateStudentProfile,
    updateRecruiterProfile,
    applications,
    loadApplications,
    updateAppStatus,
    jobs,
    loadJobs,
  } = useAuth();

  const [activeSection, setActiveSection] = useState('OVERVIEW');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Edit fields
  const [studentCgpa, setStudentCgpa] = useState(8.5);
  const [studentSkills, setStudentSkills] = useState('');
  const [studentResume, setStudentResume] = useState('');
  const [isEditingStudent, setIsEditingStudent] = useState(false);

  const [recCompany, setRecCompany] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [isEditingRec, setIsEditingRec] = useState(false);

  // Recruiter: Post placement opportunity job variables
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobDeadline, setJobDeadline] = useState('2026-08-31');
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Admin view datasets
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminReports, setAdminReports] = useState<any | null>(null);

  // Synchronize dashboard files
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Set initial form states from context profiles
    if (user.role === 'student' && studentProfile) {
      setStudentCgpa(studentProfile.cgpa || 8.0);
      setStudentSkills(studentProfile.skills || '');
      setStudentResume(studentProfile.resumeUrl || '');
    } else if (user.role === 'recruiter' && recruiterProfile) {
      setRecCompany(recruiterProfile.company_name || '');
      setRecEmail(recruiterProfile.company_email || '');
    }

    // Load applications for current session
    loadApplications().catch(() => {});

    // Read admin directory rosters
    if (user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, studentProfile, recruiterProfile, navigate]);

  const fetchAdminData = async () => {
    try {
      const usersList = await userService.getAllUsers();
      setAdminUsers(usersList || []);
      const reportData = await applicationService.getReports();
      setAdminReports(reportData || null);
    } catch (err: any) {
      console.error('[Admin datasets fetch fail]:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Student update profile handler
  const handleStudentProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');
    setSuccessMsg('');

    try {
      const cgpaNum = parseFloat(String(studentCgpa));
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        throw new Error('CGPA must be a valid float value between 0.00 and 10.00.');
      }

      await updateStudentProfile({
        cgpa: cgpaNum,
        skills: studentSkills,
        resumeUrl: studentResume || null
      });

      setSuccessMsg('Student profile details updated successfully.');
      setIsEditingStudent(false);
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to update student profile data.');
    } finally {
      setLoading(false);
    }
  };

  // Recruiter update company details handler
  const handleRecruiterProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');
    setSuccessMsg('');

    try {
      if (!recCompany.trim()) {
        throw new Error('Company name cannot be blank.');
      }
      await updateRecruiterProfile({
        companyName: recCompany,
        companyEmail: recEmail
      });
      setSuccessMsg('Recruiter profile details saved successfully.');
      setIsEditingRec(false);
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to update corporate configurations.');
    } finally {
      setLoading(false);
    }
  };

  // Recruiter handler to post new placement opportunity drive vacancies
  const handleCreateJobSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');
    setSuccessMsg('');

    try {
      if (!jobTitle.trim() || !jobDesc.trim() || !jobSalary.trim() || !jobLoc.trim()) {
        throw new Error('All fields are required to allocate a vacancy pipeline.');
      }

      await jobService.createJob({
        title: jobTitle,
        description: jobDesc,
        salary: jobSalary,
        location: jobLoc,
        deadline: jobDeadline,
      });

      setSuccessMsg('New job posting posted and published successfully to the placement feed.');
      setJobTitle('');
      setJobDesc('');
      setJobSalary('');
      setJobLoc('');
      setIsCreatingJob(false);
      
      // Reload jobs context
      await loadJobs().catch(() => {});
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to post vacancy.');
    } finally {
      setLoading(false);
    }
  };

  // Status advancement triggers
  const handleStatusAdvancement = async (appId: number | string, status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected') => {
    try {
      setLoading(true);
      await updateAppStatus(appId, status);
      setSuccessMsg(`Application status updated to: ${status.toUpperCase()} for application #${appId}`);
      if (user?.role === 'admin') {
        fetchAdminData();
      }
    } catch (err: any) {
      setErrMsg(err?.message || 'Failed to change student status.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Overview metrics calculations
  const totalApplied = applications?.length || 0;
  const shortlistedCount = applications?.filter((a: any) => a.status === 'shortlisted').length || 0;
  const interviewingCount = applications?.filter((a: any) => a.status === 'interviewing').length || 0;
  const pendingCount = applications?.filter((a: any) => a.status === 'pending').length || 0;

  return (
    <div className="cyber-canvas" id="sys-candidate-dashboard">
      <div className="about-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-slate)' }}>
        <h1 className="title-glitch" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', textTransform: 'none' }}>
          Candidate & Placement Dashboard
        </h1>
        <span className="terminal-indicator">Role Clearance: {user.role.toUpperCase()}</span>
      </div>

      {successMsg && (
        <div className="text-xs p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200" style={{ borderRadius: '8px' }}>
          ✓ Action Success: {successMsg}
        </div>
      )}

      {errMsg && (
        <div className="text-xs p-3 mb-4 bg-rose-50 text-rose-800 border border-rose-200" style={{ borderRadius: '8px' }}>
          ⚠️ Alert: {errMsg}
        </div>
      )}

      <div className="dashboard-layout">
        {/* Render Sidebar controller with role credentials */}
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          onLogout={handleLogout}
          role={user.role}
        />

        {/* Content Panel Frame */}
        <div className="dashboard-content">
          
          {/* Section 1: OVERVIEW */}
          {activeSection === 'OVERVIEW' && (
            <>
              {/* Profile Card customized dynamically under roles */}
              <div className="profile-summary-card neon-border">
                <div style={{ flexGrow: 1 }}>
                  <div style={{ color: 'var(--cyber-yellow)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    User Session Outlet: {user.email}
                  </div>
                  <h2 className="profile-meta h2 text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>

                  {/* Student profile sub-panels */}
                  {user.role === 'student' && (
                    <div className="mt-2">
                      <div className="inline-block px-3 py-1 text-xs mb-3 font-semibold" style={{ background: '#f5f3ff', color: 'var(--cyber-cyan)', border: '1px solid #ddd6fe', borderRadius: '4px' }}>
                         Academic CGPA: {studentCgpa} | Resume Link: {studentResume ? 'Verified & Connected' : 'Not Uploaded Yet'}
                      </div>

                      {isEditingStudent ? (
                        <form onSubmit={handleStudentProfileSubmit} className="mt-4 border border-[var(--border-slate)] p-4 bg-white" style={{ borderRadius: '8px' }}>
                          <h4 className="text-sm font-bold text-slate-800 mb-3">Modify Candidate Profile Details</h4>
                          
                          <div className="form-group mb-3">
                            <label className="form-label text-xs font-semibold text-slate-600">ACADEMIC CGPA (0.00 - 10.00)</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-input"
                              value={studentCgpa}
                              onChange={(e) => setStudentCgpa(parseFloat(e.target.value) || 0)}
                              required
                            />
                          </div>

                          <div className="form-group mb-3">
                            <label className="form-label text-xs font-semibold text-slate-600">REGISTERED SKILLS (COMMA-SEPARATED)</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="ReactJS, Node, CSS, PostgreSQL"
                              value={studentSkills}
                              onChange={(e) => setStudentSkills(e.target.value)}
                            />
                          </div>

                          <div className="form-group mb-4">
                            <label className="form-label text-xs font-bold text-slate-600">RESUME PDF URL</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="https://drive.google.com/your-cv.pdf"
                              value={studentResume}
                              onChange={(e) => setStudentResume(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button type="submit" className="cyber-btn cyber-btn-small" disabled={loading}>
                              Save Profile
                            </button>
                            <button type="button" onClick={() => setIsEditingStudent(false)} className="cyber-btn cyber-btn-small" style={{ background: 'transparent', borderColor: '#e2e8f0', color: '#64748b' }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-4">
                          <span className="text-xs font-semibold text-[var(--cyber-magenta)]">Registered Professional Skillset</span>
                          <div className="skills-tags mt-2">
                            {studentSkills ? studentSkills.split(',').map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill.trim()}
                              </span>
                            )) : (
                              <span className="text-xs text-[var(--text-muted)] italic">No skills registered yet. Click update to compile your stack.</span>
                            )}
                          </div>
                          <button
                            onClick={() => setIsEditingStudent(true)}
                            className="cyber-btn cyber-btn-small mt-4 opacity-80 hover:opacity-100"
                            style={{ outline: 'none', background: 'transparent', borderColor: 'var(--cyber-cyan)', color: 'var(--cyber-cyan)' }}
                          >
                            Update Candidate Profile
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recruiter profile sub-panels */}
                  {user.role === 'recruiter' && (
                    <div className="mt-2">
                      <div className="inline-block px-3 py-1 text-xs mb-3 font-semibold" style={{ background: '#faf5ff', color: 'var(--cyber-magenta)', border: '1px solid #f3e8ff', borderRadius: '4px' }}>
                         Corporate Hiring Recruiter Account
                      </div>

                      {isEditingRec ? (
                        <form onSubmit={handleRecruiterProfileSubmit} className="mt-4 border border-[var(--border-slate)] p-4 bg-white" style={{ borderRadius: '8px' }}>
                          <h4 className="text-sm font-bold text-slate-800 mb-3">Modify Recruiting Details</h4>
                          
                          <div className="form-group mb-3">
                            <label className="form-label text-xs font-semibold text-slate-600">Company Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={recCompany}
                              onChange={(e) => setRecCompany(e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-group mb-4">
                            <label className="form-label text-xs font-semibold text-slate-600">Company Correspondence Email</label>
                            <input
                              type="email"
                              className="form-input"
                              placeholder="careers@enterprise.com"
                              value={recEmail}
                              onChange={(e) => setRecEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="flex gap-2">
                            <button type="submit" className="cyber-btn cyber-btn-small" disabled={loading}>
                              Save Details
                            </button>
                            <button type="button" onClick={() => setIsEditingRec(false)} className="cyber-btn cyber-btn-small" style={{ background: 'transparent', borderColor: '#e2e8f0', color: '#64748b' }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-4 text-xs leading-relaxed">
                          <p className="mb-1"><span className="font-semibold text-slate-600">Organization Name:</span> <span className="font-bold text-slate-800">{recCompany || 'Not configured'}</span></p>
                          <p className="mb-3"><span className="font-semibold text-slate-600">Hiring Correspondence Email:</span> <span className="font-bold text-slate-800">{recEmail || 'Not configured'}</span></p>
                          <button
                            onClick={() => setIsEditingRec(true)}
                            className="cyber-btn cyber-btn-small mt-2 opacity-80 hover:opacity-100"
                            style={{ outline: 'none', background: 'transparent', borderColor: 'var(--cyber-cyan)', color: 'var(--cyber-cyan)' }}
                          >
                            Edit Organization Details
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin details */}
                  {user.role === 'admin' && (
                    <div className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      <p className="font-semibold text-emerald-700">✓ MASTER SYSTEM ADMINISTRATOR ROOT ACCESS VALIDATED.</p>
                      <p className="text-slate-500 mt-1">All parallel directories are synchronized with live landing feeds.</p>
                    </div>
                  )}

                </div>

                <div className="profile-stats border-l border-[var(--border-slate)] pl-6">
                  <div className="profile-stat-item">
                    <div className="profile-stat-sub font-semibold text-slate-500 text-xs">SUBMISSIONS</div>
                    <div className="profile-stat-val text-2xl font-bold" style={{ color: 'var(--cyber-cyan)' }}>{totalApplied}</div>
                    <div className="profile-stat-sub font-semibold text-slate-500 text-xs mt-4">SHORTLISTED</div>
                    <div className="profile-stat-val text-2xl font-bold" style={{ color: 'var(--cyber-green)' }}>{shortlistedCount}</div>
                  </div>
                </div>
              </div>

              {/* Stats Widgets */}
              <div className="grid-stats" style={{ margin: '0' }}>
                <StatsCard label="Applications Logged" value={totalApplied} highlightColor="var(--cyber-cyan)" />
                <StatsCard label="Interviewing Loops" value={interviewingCount} highlightColor="var(--cyber-magenta)" />
                <StatsCard label="Under System Review" value={pendingCount} highlightColor="var(--cyber-yellow)" />
                {user.role === 'student' ? (
                  <StatsCard label="CGPA Rating" value={`${studentCgpa || '0.00'} / 10`} highlightColor="var(--cyber-green)" />
                ) : (
                  <StatsCard label="Active Opportunities" value={jobs?.length || 0} highlightColor="var(--cyber-green)" />
                )}
              </div>

              {/* Recruiter specific job posting drive console */}
              {user.role === 'recruiter' && (
                <div className="about-block neon-border mt-4">
                  <div className="about-header">
                    <h3 className="section-title text-md" style={{ color: 'var(--text-primary)' }}>Host New Career Opportunity</h3>
                    <span className="terminal-indicator">Hiring Activity Console</span>
                  </div>
                  
                  {isCreatingJob ? (
                    <form onSubmit={handleCreateJobSubmit} className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label text-xs font-semibold text-slate-600">PLACEMENT DRIVE TITLE</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Senior Software Engineer" 
                            value={jobTitle} 
                            onChange={(e) => setJobTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-xs font-semibold text-slate-600">SALARY PACKAGE (CTC BUDGET)</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. 15 LPA - 18 LPA" 
                            value={jobSalary} 
                            onChange={(e) => setJobSalary(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label text-xs font-semibold text-slate-600">WORKPLACE LOCATION</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Noida / Remote" 
                            value={jobLoc} 
                            onChange={(e) => setJobLoc(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-xs font-semibold text-slate-600">APPLICATION CLOSING DATE</label>
                          <input 
                            type="date" 
                            className="form-input" 
                            value={jobDeadline} 
                            onChange={(e) => setJobDeadline(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label text-xs font-semibold text-slate-600">OPPORTUNITY & ELIGIBILITY DESCRIPTION</label>
                        <textarea 
                          className="form-input h-24 font-sans text-sm" 
                          placeholder="Outline candidate requirements, eligibility guidelines, and required technological stacks..."
                          value={jobDesc} 
                          onChange={(e) => setJobDesc(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="cyber-btn cyber-btn-small" disabled={loading}>
                          Publish Job Posting
                        </button>
                        <button type="button" onClick={() => setIsCreatingJob(false)} className="cyber-btn cyber-btn-small" style={{ background: 'transparent', borderColor: '#e2e8f0', color: '#64748b' }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setIsCreatingJob(true)} className="cyber-btn">
                      + Post New Job Opportunity
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Section 2: APPLICATIONS */}
          {activeSection === 'APPLICATIONS' && (
            <div className="about-block neon-border" style={{ margin: '0' }}>
              <div className="about-header">
                <h2 className="section-title text-md" style={{ color: 'var(--text-primary)' }}>Candidate Applications Registry</h2>
                <span className="terminal-indicator">{totalApplied} Active Applications</span>
              </div>

              {totalApplied > 0 ? (
                <div className="table-container neon-border mt-4">
                  <table className="matrix-table text-xs">
                    <thead>
                      <tr>
                        <th>Application ID</th>
                        <th>Job Title</th>
                        <th>Candidate Name</th>
                        <th>Salary Details</th>
                        <th>Status</th>
                        {user.role === 'recruiter' && <th>Transition Status</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app: any) => (
                        <tr key={app.id}>
                          <td style={{ color: 'var(--text-muted)' }}>#{app.id}</td>
                          <td style={{ fontWeight: 'bold' }}>{app.job_title || app.title || 'Placement Opportunity'}</td>
                          <td style={{ color: 'var(--cyber-cyan)' }}>
                            {app.student_name || app.candidate_name || user.name}
                            {app.resume_url && (
                              <a href={app.resume_url} target="_blank" rel="noreferrer" className="block text-[10px] text-indigo-600 underline mt-1">
                                View Resume Reference
                              </a>
                            )}
                          </td>
                          <td style={{ color: 'var(--cyber-yellow)' }}>{app.salary || app.package || 'Competitive'}</td>
                          <td>
                            <span className={`status-badge ${
                              app.status === 'shortlisted' ? 'status-synced' :
                              app.status === 'interviewing' ? 'status-interview' :
                              app.status === 'pending' ? 'status-pending' :
                              'status-terminated'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          {user.role === 'recruiter' && (
                            <td>
                              <div style={{ display: 'flex', gap: '0.3rem' }}>
                                <button
                                  onClick={() => handleStatusAdvancement(app.id, 'shortlisted')}
                                  className="cyber-btn cyber-btn-small"
                                  style={{ padding: '0.15rem 0.35rem', fontSize: '9px', borderColor: 'var(--cyber-green)', color: 'var(--cyber-green)', background: 'transparent' }}
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleStatusAdvancement(app.id, 'interviewing')}
                                  className="cyber-btn cyber-btn-small"
                                  style={{ padding: '0.15rem 0.35rem', fontSize: '9px', borderColor: 'var(--cyber-cyan)', color: 'var(--cyber-cyan)', background: 'transparent' }}
                                >
                                  Interview
                                </button>
                                <button
                                  onClick={() => handleStatusAdvancement(app.id, 'rejected')}
                                  className="cyber-btn cyber-btn-small"
                                  style={{ padding: '0.15rem 0.35rem', fontSize: '9px', borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }} className="text-sm">
                  📡 No active candidate applications registered for your profile.
                </div>
              )}
            </div>
          )}

          {/* Section 3: ADMIN_USERS */}
          {activeSection === 'ADMIN_USERS' && user.role === 'admin' && (
            <div className="about-block neon-border" style={{ margin: '0' }}>
              <div className="about-header">
                <h2 className="section-title text-md" style={{ color: 'var(--text-primary)' }}>System Users Account Directory</h2>
                <span className="terminal-indicator">{adminUsers.length} Users Registered</span>
              </div>

              <div className="table-container neon-border mt-4">
                <table className="matrix-table text-xs">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Clearance Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((item: any) => (
                      <tr key={item.id}>
                        <td style={{ color: 'var(--text-muted)' }}>#{item.id}</td>
                        <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                        <td style={{ color: 'var(--cyber-cyan)' }}>{item.email}</td>
                        <td>
                          <span className={`status-badge ${
                            item.role === 'admin' ? 'status-synced' :
                            item.role === 'recruiter' ? 'status-interview' :
                            'status-pending'
                          }`}>
                            {item.role.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: ADMIN_REPORTS */}
          {activeSection === 'ADMIN_REPORTS' && user.role === 'admin' && (
            <div className="about-block neon-border" style={{ margin: '0' }}>
              <div className="about-header">
                <h2 className="section-title text-md" style={{ color: 'var(--text-primary)' }}>Placement Metrics & analytical reports</h2>
                <span className="terminal-indicator">System Overview Report</span>
              </div>

              {adminReports ? (
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat-unit" style={{ borderLeftColor: 'var(--cyber-cyan)' }}>
                      <div className="stat-value text-xl font-bold" style={{ color: 'var(--cyber-cyan)' }}>
                        {adminReports.usersCount?.total || 0}
                      </div>
                      <div className="stat-label text-[10px]">TOTAL SYSTEM ACCOUNTS</div>
                    </div>
                    <div className="stat-unit" style={{ borderLeftColor: 'var(--cyber-yellow)' }}>
                      <div className="stat-value text-xl font-bold" style={{ color: 'var(--cyber-yellow)' }}>
                        {adminReports.jobsCount?.total || 0}
                      </div>
                      <div className="stat-label text-[10px]">CAREER OPPORTUNITIES PUBLISHED</div>
                    </div>
                    <div className="stat-unit" style={{ borderLeftColor: 'var(--cyber-green)' }}>
                      <div className="stat-value text-xl font-bold" style={{ color: 'var(--cyber-green)' }}>
                        {adminReports.applicationsCount?.total || 0}
                      </div>
                      <div className="stat-label text-[10px]">SUBMITTED APPLICATION PROFILES</div>
                    </div>
                  </div>

                  {/* Status division map details */}
                  <div className="border border-[var(--border-slate)] p-4 bg-slate-50 text-xs space-y-2" style={{ borderRadius: '8px' }}>
                    <h3 className="font-bold text-slate-800 mb-2">Application Status Distribution</h3>
                    <p>🔵 Under Review Applications (Pending): {adminReports.applicationsCount?.pending || 0}</p>
                    <p>🟢 Shortlisted Candidates: {adminReports.applicationsCount?.shortlisted || 0}</p>
                    <p>🟣 Active Interviewing Loops: {adminReports.applicationsCount?.interviewing || 0}</p>
                    <p>🔴 Rejected Application Profiles: {adminReports.applicationsCount?.rejected || 0}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm">Computing statistics counts from active databases...</div>
              )}
            </div>
          )}

          {/* Section 5: DRIVES */}
          {activeSection === 'DRIVES' && (
            <div className="about-block neon-border" style={{ margin: '0' }}>
              <div className="about-header">
                <h2 className="section-title text-md" style={{ color: 'var(--text-primary)' }}>Upcoming Institutional Placement Drives</h2>
                <span className="terminal-indicator">Institutional Calendar</span>
              </div>
              <p className="about-text text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Placement drives correspond to structured recruiting schedules featuring top institutional partner brands. Ensure you register well in advance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div className="stat-unit" style={{ textAlign: 'left', borderLeft: '4px solid var(--cyber-yellow)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Amazon Analytics Drive</span>
                    <span style={{ color: 'var(--cyber-yellow)' }} className="font-semibold text-sm">TOMORROW, 10:00 AM</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Requires active knowledge of Python, SQL, Tableau, and general metrics analyses. Open to all engineering backgrounds.
                  </p>
                </div>

                <div className="stat-unit" style={{ textAlign: 'left', borderLeft: '4px solid var(--cyber-magenta)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Microsoft Engineering Drive</span>
                    <span style={{ color: 'var(--cyber-magenta)' }} className="font-semibold text-sm">THIS FRIDAY, 02:00 PM</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Focuses on core software development, general data structures and algorithms, and web app building blocks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: NOTIFICATIONS */}
          {activeSection === 'NOTIFICATIONS' && (
            <div className="notification-panel neon-border" style={{ margin: '0', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div className="notif-heading mb-4 text-sm font-semibold" style={{ color: '#047857' }}>System Broadcast Notifications</div>
              <div className="notif-list space-y-4">
                <div className="notif-item" style={{ borderLeftColor: 'var(--cyber-green)', color: 'var(--text-primary)' }}>
                  <div className="text-xs font-bold text-slate-800">GOOGLE Solutions Architect Drive:</div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Open for hiring. Computer Science students with React and Python experience are encouraged to apply before June 20th.</p>
                  <span className="notif-time block mt-2 text-[10px]" style={{ color: '#047857' }}>Shared on 2026-06-10, 12:44</span>
                </div>
                <div className="notif-item" style={{ borderLeftColor: 'var(--cyber-cyan)', color: 'var(--text-primary)' }}>
                  <div className="text-xs font-bold text-slate-800">Portal Security Access:</div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Credentials verification complete. Access session established securely.</p>
                  <span className="notif-time block mt-2 text-[10px]" style={{ color: '#047857' }}>Shared on 2026-06-10, 13:01</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
