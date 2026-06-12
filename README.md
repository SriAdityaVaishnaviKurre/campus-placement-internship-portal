# CAMPUS PLACEMENT & INTERNSHIP PORTAL // FULL-STACK CORE v4.0

An immersive, retro-futuristic glitch-art styled campus placement and internship portal connecting biological student candidate templates to commercial grid computing nodes.

Developed as a fully custom Full-Stack React JS (Frontend) + Express Node.js (Backend Backend) + MySQL / Mock In-Memory Database integration.

---

## ⚡ [SYSTEM_TELEMETRY_WEEK_4]

- **Project Phase**: Week 4 - Integrating Front-End, Back-End, and Database Registries.
- **Visual Theme**: 'Glitch Art', Cyan vs. Magenta Accent Lines, Dark CRT Canvas, and Animated Frame Tearing.
- **Technology Stack**: React 19 + Express.js + TSX Server Wrapper + JWT Security Handshakes + Axios Interceptors.

---

## 🛰️ [RESTful_API_ENDPOINTS_DIRECTORY]

All requests are prefixed with `/api` and require matching token authorizations.

### // MODULE: Authentication (`/api/auth`)
- `POST /register` - Registers a new user node (student/recruiter roles). Enforces bcrypt password hashing.
- `POST /login` - Sign-in. Issues high-integrity JWT authorization token.
- `POST /logout` - Terminates session, flushes JWT storage caches.

### // MODULE: Student Management (`/api/users/student`)
- `GET /profile` - Inspect active student profile fields (CGPA, resumeUrl, registered skills list).
- `PUT /profile` - Reconfigure candidate telemetry vectors.

### // MODULE: Recruiter Management (`/api/users/recruiter`)
- `GET /profile` - Consult corporate contractor registration records.
- `PUT /profile` - Edit corporate contractor coordinates (company name, email).

### // MODULE: Jobs & Opportunities (`/api/jobs`)
- `GET /` - Scans and fetches all active recruitment vacancies.
- `GET /:id` - Requests detail metrics for a specific slot.
- `POST /` - Deploys a new job vacancy (recruiter nodes only).
- `PUT /:id` - Overwrite opportunity specifications.
- `DELETE /:id` - Decommissions a vacancy pipeline.

### // MODULE: Applications Pipeline (`/api/applications`)
- `POST /` - Students dispatch their profile towards a selected job ID target.
- `GET /` - Retrieve the logs of applied jobs.
- `PUT /:id/status` - Recruiter node advancement actions (accept/shortlist, schedule interview, reject).
- `GET /reports` - System-wide telemetry details (admin clearances only).

---

## ⚙️ [SYSTEM_FLOW_ARCHITECTURE]

```
 [CLIENT_INTERFACE] (React UI on Chrome/Firefox Iframe)
          │
          ▼ [AXIOS_INTERCEPTORS] (Automatically appends: Bearer <JWT>)
          │
      (HTTP Port 3000 Ingress Router)
          │
          ▼
 [EXPRESS_SERVER_CORE] (NodeJS Controller Wrapper)
   ├── AuthMiddleware (Intercepts & Decodes JWT payload)
   │
   ├── [ACTIVE_ROUTE_ROUTERS]
   │     ├── authRoutes
   │     ├── userRoutes
   │     ├── jobRoutes
   │     └── applicationRoutes
   │
   ▼
 [DATABASE_MEMORY_SCHEMAS] (MySQL or persistent JSON state engine)
```

---

## 📂 [WORKSPACE_NODAL_ROSTER]

- `/src/services/api.ts` - Centrally declared Axios transponder. Attaches Authorization tokens, handles 401 token exclusions.
- `/src/context/AuthContext.tsx` - Coordinates active memory states of `user`, `studentProfile`, `recruiterProfile`, `applications`, and `jobs`.
- `/src/components/ProtectedRoute.tsx` - Blocks unauthorized visitors and roles from bypassing sector barriers.
- `/src/components/Sidebar.tsx` - Responsive dashboard menu control boards.
- `/src/pages/Dashboard.tsx` - High-density sensor terminal. Allows profile configuration, job creation, applicant status pipeline changes, and admin charts.
- `/src/pages/JobDetails.tsx` - Deep specifications analyzer. Includes application triggers.

---

## 🛠️ [DEPLOY_AND_BOOT_SEQUENCE]

### 1. Register Environment Secrets
Create a `.env` configuration file in your workspace root (derived from `.env.example`):
```env
GEMINI_API_KEY="your-gemini-key"
PORT=3000
JWT_SECRET="CYBER_GRID_JWT_KEY_999!"
NODE_ENV="development"
```

### 2. Standard Client Installation
Installs modules and runtime libraries:
```bash
npm install
```

### 3. Initialize Server & Frontend Core
Launches our unified full-stack dev server:
```bash
npm run dev
```
Open secure gate `http://localhost:3000` inside your browser to view interface telemetry.

### 4. Running Backend Verification Tests
```bash
npx jest --verbose
```

---

## 📹 [VIDEO_DEMONSTRATION_SCRIPT]

**TRT (Total Run Time): 02:30**

### [00:00 - 00:30] SCENE 1: SYSTEM INGRESS (Login & Aesthetic Introduction)
- **Visuals**: Browser window centered on `http://localhost:3000`. Showcases the glitching title headers, cyber-cyan glows, and active statistics readouts. Click [RUN_LOGIN_SEQUENCE].
- **Speaker (Cryptic / Professional)**:
  > "System online. Initiating overview of the unified Campus Placement & Internship Portal integration. We are viewing the landing grid. Let us authenticate access utilizing our pre-seeded keys."
- **Action**: Click the `[STUDENT]` quick profile injection button to pre-populate fields with `student.demo@campuslink.edu` / `student123`. Click `// INIT_GRID_ACCESS`.

### [00:30 - 01:00] SCENE 2: STUDENT PORTAL OPERATIONS (Dashboard Overview & Skills Reconfiguration)
- **Visuals**: Flashes the student dashboard with custom stats cards. Scroll down the profile section. Click the `[RECONFIGURE_STUDENT_PROFILE]` button of the candidate. Change CGPA to `9.42`, add `Rust, PostgreSQL` to skills, and click `[COMMIT_SIGNALS]`.
- **Speaker**:
  > "Credential validation approved. Student profile scope active. Observe user statistics: 3 applications registered under client review. Let's re-align core skill matrices to match incoming requirements."
- **Action**: Form updates instantly. Show success message on screen.

### [01:00 - 01:30] SCENE 3: INVENTORY EXPANSION & APPLY (Active Jobs Feed)
- **Visuals**: Navigate to navbar link `"// FIND_JOBS"`. Select `"Software Development Engineer"` card details. Click `[DEPLOY_SUBMISSION_PACK]`.
- **Speaker**:
  > "Let's explore vacant opportunities. Our central directory registers active drives in Microsoft and Google. When applying, our resume profile parameters are dispatched immediately to the company queue."
- **Action**: Application updates to `[APPLICATION_TRANSMITTED_OK]`.

### [01:30 - 02:00] SCENE 4: CORPORATE ELEVATION (Recruiter controls & job creation)
- **Visuals**: Log out from the student profile. Click `[RECRUITER]` quick injection details, enter recruiter credentials, and log in. Navigate to `// CANDIDATE_QUEUE` to display the table. Accept the new application!
- **Speaker**:
  > "Disconnecting and authenticating as corporate recruiter identity. Within the candidate queue, we can review recent applicants, access their live CV links, and advance their status parameters."
- **Action**: Click `[OK]` (shortlist) or `[QA]` (interview) on the target applicant. The status badge flashes green instantly!

### [02:00 - 02:30] SCENE 5: ROOT ADMIN OBSERVATION (Statistical Analytics)
- **Visuals**: Log out and log in as Admin. Navigate to reports tab showing beautiful responsive counts of total entries, pipelines hosted, and status logs.
- **Speaker**:
  > "Finally, let's step into Root Administrator view. Here we see complete system metrics including cumulative registry counters, vacancy counts, and state distributions."
- **Action**: Scroll through telemetry charts and logs. Show clean logout sequence.
- **Speaker**:
  > "All operations completed cleanly. Communication channel closed. End of line."

---

## 📡 [SYSTEM_STABILITY_DECLARED]
- All strict type matrices compile green.
- Fully defensive state guarantees are in-place.
- Ready for full-stack deployment evaluation.

---

## Contributors

* Sri Aditya Vaishnavi Kurre

* 24A31A4660(Akshay Kountesh Tolem)

