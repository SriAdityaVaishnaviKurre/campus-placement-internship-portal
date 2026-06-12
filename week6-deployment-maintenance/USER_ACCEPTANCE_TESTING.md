# 👥 [USER_ACCEPTANCE_TESTING] AUDIT PROTOCOLS & LOGS
### SYSTEM VALIDATION DECREE // STAKEHOLDER ACCEPTANCE // WORKFLOW CHECKLIST

```
 🧬 ================================================================
| [UAT_AUDITING_UNIT: SYSTEM COMPLIANCE RUNS]                      |
| SIMULATION_TYPE    : USER ACCEPTANCE RUNS ON LIVE PORTS          |
| RECORD_STATUS      : DOUBLE-PASS HANDSHAKE VALIDATED             |
| ACCURACY_RATE      : 100% CORRESPONDENCE ON AUDIT BLOCKS         |
|__________________________________________________________________|
```

---

## 👨‍🎓 1. CANDIDATE STUDENT AUDIT WORKFLOW

### Test Case Student_01: Account Registration
- **Test Objective**: Verify new student registrations are successfully stored in the database.
- **Pre-Conditions**: Valid user email that does not exist in the database.
- **Execution Steps**:
  1. Access the register portal segment (`/register`).
  2. Fill in student profile fields: Name: `"Rachel Connor"`, Email: `"rachel.c@campuslink.edu"`, Password: `"cyberdyne123"`.
  3. Ensure role selection is set to **Student Candidate** (cyan color).
  4. Trigger the `Register Profile` execution button.
- **Expected Outcome**: UI triggers verification: `[REGISTRATION SUCCESSFUL] Redirecting to login terminal sector...`. Account is written to database as a cryptographically hashed record, and username is saved successfully.
- **Actual Outcome**: Registration completes successfully; user is safely redirected to "/login".
- **Status**: ✅ PASS

### Test Case Student_02: Client Sign-In Authentication
- **Test Objective**: Authenticate user credentials and retrieve a secured JWT session token.
- **Pre-Conditions**: The candidate account has been successfully registered in the database.
- **Execution Steps**:
  1. Access the sign-in endpoint screen (`/login`).
  2. Input: Email: `"rachel.c@campuslink.edu"`, Passcode: `"cyberdyne123"`.
  3. Trigger the `Sign In To Account` action button.
- **Expected Outcome**: Server processes credentials, verifies against standard bcrypt salts, delivers dynamic JWT payload to browser localStorage, and redirects client to the `/dashboard`.
- **Actual Outcome**: Logins execute rapidly, storing credentials on the client, and seamlessly loading the dashboard workspace.
- **Status**: ✅ PASS

### Test Case Student_03: Workspace Jobs Directory Audit
- **Test Objective**: Confirm students can query the active jobs directory.
- **Pre-Conditions**: Student role holds active authorization credentials.
- **Execution Steps**:
  1. Login to Student Dashboard and click main Navigation header targeting vacancies search.
  2. Input keyword query: `"Software"` inside filter search box.
  3. Toggle filter categories option: `"FULL-TIME"`.
- **Expected Outcome**: Filtered list dynamically lists matching openings, showing salary, location, and required technology tags on screen.
- **Actual Outcome**: Search parameters filter the job grid display smoothly without full page reloads, and show exact details matching the database.
- **Status**: ✅ PASS

### Test Case Student_04: Submit Placement Applications
- **Test Objective**: Check if eligible students can apply to job openings.
- **Pre-Conditions**: Student holds active authentication and has not already applied to the selected job.
- **Execution Steps**:
  1. Inside jobs directory, click specialized vacancy item `Cloud Tech Analyst`.
  2. View specifications page. Find active apply tools, and click `Submit Applications Profile`.
- **Expected Outcome**: Server saves application with a default `pending` status, linking the candidate profile to the selected job ID. The application button changes to `"Application Transmitted ✓"`.
- **Actual Outcome**: The application is successfully stored in the database, and the apply button becomes disabled to prevent duplicate submissions.
- **Status**: ✅ PASS

### Test Case Student_05: Application Progress Tracking
- **Test Objective**: Confirm students can track the status of their application.
- **Pre-Conditions**: Student has submitted at least one application.
- **Execution Steps**:
  1. Access standard user workspace at `/dashboard`.
  2. View the table of current applications.
- **Expected Outcome**: Displays application info, showing matching organization info, submission dates, and status fields (e.g., `pending` or `shortlisted`).
- **Actual Outcome**: Student dashboard renders the application grid with live tracking values.
- **Status**: ✅ PASS

---

## 👩‍💼 2. HIRING RECRUITER AUDIT WORKFLOW

### Test Case Recruiter_01: Recruiter Session Initializing
- **Test Objective**: Authenticate recruiters and unlock the corporate hiring workspace.
- **Pre-Conditions**: Corporate account is registered in database.
- **Execution Steps**:
  1. Navigate to `/login`.
  2. Load recruiter credentials using quick-inject developer presets or input manually: Email: `"recruiter.demo@campuslink.edu"`, Password: `"recruiter123"`.
  3. Trigger Sign In.
- **Expected Outcome**: UI loads Recruiter Dashboard workspace, displaying corporate metadata and showing tools for creating and managing job postings.
- **Actual Outcome**: Recruiter session initializes successfully, displaying "Corporate Hiring Recruiter Account".
- **Status**: ✅ PASS

### Test Case Recruiter_02: Broadcast Placement Postings
- **Test Objective**: Permit corporate partners to broadcast and host new job vacancies.
- **Pre-Conditions**: Recruiter workspace is active.
- **Execution Steps**:
  1. Inside Dashboard, trigger the `Post New Job Opportunity` module.
  2. Input fields: Title: `"Staff Rust System Security Developer"`, Compensation: `"32 LPA"`, Location: `"Bangalore/Remote"`, Deadline: `"2026-09-12"`, Stack: `"Rust, Cryptography, Linux"`.
  3. Trigger the `Construct Posting Details` button.
- **Expected Outcome**: Server records the vacancy details, links the job posting to the recruiter's ID, and triggers action complete alerts.
- **Actual Outcome**: The database successfully registers the new job, showing it immediately at the top of the jobs directory table.
- **Status**: ✅ PASS

### Test Case Recruiter_03: Recruitment Drive Management
- **Test Objective**: Manage active job postings, update details, or remove stale entries.
- **Pre-Conditions**: Job posting has been created by the recruiter.
- **Execution Steps**:
  1. In the recruiter dashboard, look for your active job listings.
  2. Select the delete tool button next to the test posting `"Staff Rust System Security Developer"`.
- **Expected Outcome**: Database drops or marks the target record. The job listing is immediately removed from the dashboard and directory pages.
- **Actual Outcome**: The row layout disappears from the grid immediately. A reload verifies the record has been deleted from database.
- **Status**: ✅ PASS

### Test Case Recruiter_04: Candidate Reviews & Status Transitions
- **Test Objective**: Allow recruiters to review candidate applications and update their status.
- **Pre-Conditions**: Job application has been submitted by a student.
- **Execution Steps**:
  1. Access Recruiter dashboard workspace and look for "Active Resumes Recieved".
  2. Find applicant `"Rachel Connor"`. Review CGPA parameters, and click the `Shortlist` toggle.
- **Expected Outcome**: Server updates status column to `shortlisted`. Student dashboard tracking update displays the new status in real-time.
- **Actual Outcome**: Status column is instantly updated, displaying `"shortlisted"` on both the recruiter and student dashboard views.
- **Status**: ✅ PASS

---

## 👑 3. SYSTEM ADMINISTRATOR ROOT AUDIT WORKFLOW

### Test Case Admin_01: Administrative Portal Clearance Sync
- **Test Objective**: Gain supervisor access to the administrative dashboard workspace.
- **Pre-Conditions**: User account is flagged as standard `'admin'` inside core database tables.
- **Execution Steps**:
  1. Secure authentication on `/login` with credentials: `"admin@campuslink.edu"` / `"admin123"`.
  2. Trigger Sign In.
- **Expected Outcome**: Security checker detects administrative clearances, loading the supervisory dashboard: `[MASTER SYSTEM ADMINISTRATOR ROOT ACCESS VALIDATED]`.
- **Actual Outcome**: Renders administrative grid segments, bypassing standard student/recruiter structures, and displaying site reports.
- **Status**: ✅ PASS

### Test Case Admin_02: Active Directory Users Account Auditing
- **Test Objective**: Pull and view the global registry of registered users on the platform.
- **Pre-Conditions**: Master access is active.
- **Execution Steps**:
  1. Navigate to admin console workspace segment. Find the User Accounts listing sector.
- **Expected Outcome**: Displays user directory list, showing exact database records: user IDs, active email credentials, and clearance roles.
- **Actual Outcome**: Administrative API gathers user dataset, listing accounts in a clean table format.
- **Status**: ✅ PASS

### Test Case Admin_03: Aggregate Analytical Reporting
- **Test Objective**: Pull dynamic metrics on sign-ups, current postings, and overall matching ratios.
- **Pre-Conditions**: Database contains active transactional logs.
- **Execution Steps**:
  1. Access main dashboard control charts view.
- **Expected Outcome**: Charts display consolidated placement portal metrics: Total Users count, Vacancy Postings density, and categorized submissions statuses (Pending, Shortlisted, Interviewing, Rejected) parsed through analytic modules.
- **Actual Outcome**: Gathers numerical values cleanly, presenting metrics in graphical tables and diagnostic cards.
- **Status**: ✅ PASS
