# 💻 CAMPUSLINK WEEK 5 SPECIAL OPERATIONS MANUAL: TESTING & WORKSTATIONS
### central framework diagnostics // cyber security clearance level_5

```
       ___           ___           ___                       ___           ___     
      /  /\         /  /\         /__/\                     /  /\         /__/\    
     /  /:/        /  /::\        \  \:\                   /  /:/_        \  \:\   
    /  /:/        /  /:/\:\        \  \:\                 /  /:/ /\        \  \:\  
   /  /:/  ___   /  /:/~/::\   _____\__\:\               /  /:/ /:/_   _____\__\:\ 
  /__/:/  /  /\ /__/:/ /_/\:\ /__/::::::::\             /__/:/ /:/ /\ /__/::::::::\
  \  \:\ /  /:/ \  \:\/:/__\/ \  \:\~~\~~\/             \  \:\/:/ /:/ \  \:\~~\~~\/
   \  \:\  /:/   \  \::/       \  \:\  ~~~               \  \::/_/:/   \  \:\  ~~~ 
    \  \:\/:/     \  \:\        \  \:\                    \  \:\_//:/     \  \:\    
     \  \::/       \  \:\        \  \:\                    \  \:\/:/       \  \:\   
      \__\/         \__\/         \__\/                     \__\::/         \__\/   
```

---

## 💾 PROJECT METRICS OVERVIEW
**Campus Placement & Internship Portal** is a high-availability, full-stack relational platform bridging student portfolios and corporate drives. Week 5 upgrades implement **rigorous testing coverage (>80%)**, complete diagnostics reporting, and **performance tuning** while preserving 100% of the active systems, UI design, color styling, and database structures.

---

## 🛡️ TESTING ARCHITECTURE

### 1. FRONTEND SUITE (`/frontend/src/tests`)
Employs **JSDOM** alongside **React Testing Library** for non-intrusive automated assertions:
- **LandingPage.test.jsx**: Asserts stats rendering, active openings catalogs retrieval, query sanitizations, and drive dropdown filters.
- **Login.test.jsx**: Verifies validator inputs, injection profiles click events, and JWT loading handlers.
- **Register.test.jsx**: Guarantees compliance validations for role toggling (Student vs Recruiter) and mismatch passwords.
- **Dashboard.test.jsx**: Asserts section-switching, student profile updates, and admin stats widgets.
- **JobDetails.test.jsx**: Audits direct job specification displays and restricted student-apply behaviors.
- **ProtectedRoute.test.jsx**: Checks authentication sweeps and clearance role blockers.

### 2. BACKEND API SUITE (`/backend/tests`)
Leverages **Jest** and **Supertest** to verify robust endpoint capabilities under Mock SQL:
- **auth.test.js**: Tests secure registration, password encrypting, and signature validation.
- **users.test.js**: Asserts student and recruiter update states and administrative full list rosters.
- **jobs.test.js**: Validates CRUD postings under corresponding role-based constraints.
- **applications.test.js**: Asserts status transitions, duplicate blocks, and analytics aggregation routes.

### 3. INTEGRATION PIPELINES (`/backend/tests/integration.test.js`)
Asserts three multi-step core loops:
1. **Onboarding Route**: Register Account -> Session Login -> Setup Profile -> Pull profile matches.
2. **Career Submission Route**: User Sign-in -> Fetch open jobs catalog -> Load specific detailed view -> Click Apply -> Track Application Status.
3. **Database Profile Update Route**: Sign-in -> Update Skills & CGPA properties -> Save -> Query database directly and verify alterations have persisted.

---

## 🛠️ HOW TO INITIATE PROTOCOLS

```bash
# Enter the specified delivery sector
cd week5-testing-debugging
```

### FRONTEND UTILITIES
```bash
# Install frontend target components 
npm install --prefix frontend

# Execute frontend automated test suites
npm run test --prefix frontend

# Generate frontend audit coverage reports
npm run coverage --prefix frontend
```

### BACKEND UTILITIES
```bash
# Install backend mock environments
npm install --prefix backend

# Execute backend automated API suites
npm run test --prefix backend

# Generate backend analytical coverage sheets
npm run coverage --prefix backend
```

---

## 📂 DIRECTORY SPECTRUM
The Week 5 specifications and workspace testing deliverables are mapped in the following layout:

```
week5-testing-debugging/
├── frontend/
│   ├── src/
│   │   └── tests/
│   │       ├── LandingPage.test.jsx
│   │       ├── Login.test.jsx
│   │       ├── Register.test.jsx
│   │       ├── Dashboard.test.jsx
│   │       ├── JobDetails.test.jsx
│   │       └── ProtectedRoute.test.jsx
│   ├── jest.config.js
│   └── setupTests.js
│
├── backend/
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── users.test.js
│   │   ├── jobs.test.js
│   │   ├── applications.test.js
│   │   └── integration.test.js
│   ├── jest.config.js
│   └── testSetup.js
│
├── DEBUGGING_REPORT.md
├── ERROR_LOGS.md
├── PERFORMANCE_REPORT.md
└── README.md
```

---

## ⚡ LOGISTICS ANALYSIS

| TOOL | CORE FUNCTIONAL VALUE | Clearance Level |
| :--- | :--- | :--- |
| **Jest Framework** | Main test orchestrator and assertion suite | Global Level |
| **Supertest Engine** | Non-authenticated and authenticated HTTP route assertions | Layer_3 Intercept |
| **React Testing Library**| Virtual DOM queries and user interactions simulation | Layout Audit |
| **JSDOM environment** | Lightweight browser emulation for Javascript runtimes | Client Sandbox |

---

## 💡 LESSONS TRANSMITTED
1. **Defensive Declarations Over Absolute trust**: Handling backend nested objects dynamically via defensive arrays (`applications || []`) eliminates fragile frontend DOM re-renders.
2. **Automatic Self-Checking Connections**: Bypassing missing live databases through lightweight mock fallback modes guarantees high-availability and zero application crashes.
3. **High Cohesive Separation**: Decoupling testing files from active UI features keeps the application scalable, highly performant, and safe.
