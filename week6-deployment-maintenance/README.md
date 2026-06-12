# 💻 CAMPUSLINK OPERATIONS MANUAL: WEEK 6 PRODUCTION DEPLOYMENT
### CAMPUS PLACEMENT & INTERNSHIP PORTAL // CLEARANCE LEVEL_5 // WEEK_6 CONFIGS

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

## 💾 SECTION 1: SYSTEM OVERVIEW & ARCHITECTURAL MOTIVATION

The **Campus Placement & Internship Portal** (internally code-named **CampusLink**) was engineered to deliver a secure, high-throughput, and aesthetically distinctive terminal bridging student career pursuits and corporate recruitment campaigns. Moving past standard, default modern templates, the system relies on a reliable and secure structural framework featuring **React.js (Vite)**, **Node.js (Express.js)**, and static-to-live **MySQL Relational database models**.

By opting for a retro-futurist, cybernetic "Glitch Art" visual style, the platform establishes an immersive, high-contrast, terminal-style design framework. This specialized visual identity features deep charcoal backgrounds paired with neon-vibrant cyan, yellow, and magenta highlights. On a functional level, the system implements user authentication, role-based role privileges (Student Candidates, Hiring Recruiters, Master Site Administrators), live job posting management tools, and real-time application tracking pipelines.

---

## 📐 SECTION 2: SYSTEM AND CODE DIRECTORIES

The Week 6 workspace deployment files are organized in the following directory layout:

```
week6-deployment-maintenance/
├── DEPLOYMENT_GUIDE.md          # Complete guide to deploying to Vercel/Netlify & Render/Railway
├── ENVIRONMENT_SETUP.md         # Production environment key definitions and configuration setup
├── SECURITY_CHECKLIST.md        # Hardened checklist (JWT, bcrypt, inputs, headers, database pools)
├── USER_ACCEPTANCE_TESTING.md   # System verification and stakeholder test cases
├── MAINTENANCE_PLAN.md          # Systems persistence guidelines (backups, recovery, server health)
├── LOGGING_AND_MONITORING.md    # API, database, and auth logs using Winston, Morgan, and Sentry
├── TROUBLESHOOTING_GUIDE.md     # Comprehensive guide resolving 20+ common production errors
├── PROJECT_REFLECTION_REPORT.md # Post-project retrospective detail (~1800 words overview)
├── FINAL_PROJECT_SUMMARY.md     # Final metrics and achievements breakdown
└── README.md                    # This operations manual
```

---

## 🧪 SECTION 3: SYSTEM TESTING SUITE MANUAL

### 3.1 Run Automated Frontend Test Suite
Tests are written using React Testing Library alongside browser JSDOM variables, targeting component features and validations:
```bash
# Install testing modules
npm install --prefix frontend

# Execute test suite
npm run test --prefix frontend
```

### 3.2 Run Automated Backend API Test Suite
Asserts API route responses and database access controls using Jest and Supertest under mock environments:
```bash
# Install testing modules
npm install --prefix backend

# Execute test suite
npm run test --prefix backend
```

---

## 🛠️ SECTION 4: LOCAL DEVELOPMENT & PORT CONFIGURATION

To spin up development servers locally, configure your environments using these steps:

### 4.1 Database Provisioning
Run the database schema setup scripts against your local MySQL server to initialize the tables:
```bash
mysql -u root -p < backend/schema.sql
```

### 4.2 Start Backend REST API Engine
```bash
cd backend
npm install
npm run dev
# Server boots on http://localhost:3000 (Uses fallback db dynamically if connection drops)
```

### 4.3 Start Frontend React Workspace
```bash
cd frontend
npm install
npm run dev
# Client boots and serves resources locally on http://localhost:5173
```

---

## 🚀 SECTION 5: PRODUCTION DEPLOYMENT OVERVIEW

A brief look at our production hosting strategy (for details, see `DEPLOYMENT_GUIDE.md`):

1.  **Frontend Compilation (Vercel/Netlify)**: Point the root path setup to `/` inside settings. Add the variable parameter `VITE_API_URL` targeting your backend server, and compile.
2.  **Backend Runtime Deploys (Render/Railway)**: Create web service runtimes, bind to port `3000`, configure variables, and run `npm run build && node server.ts`.
3.  **Managed MySQL (Aiven/AWS RDS)**: Run the setup schema SQL scripts against your secure instance to initialize production tables, and configure your backend connection string settings to use the database endpoint.

---

## 🔋 SECTION 6: OPERATIONS & SYSTEM MAINTENANCE PLAN

1.  **Server Health Audits**: Track service uptime and performance using online ping monitors. We expose a dedicated, lightweight health route at `/api/health` to simplify health checks.
2.  **Database Backups**: Schedule automated cron-jobs to take daily compressed dumps of the database (`mysqldump`) and store them in secure off-site archival vaults.
3.  **Error Streams Logger**: Monitor transaction logs using **Winston** error tracking and **Morgan** HTTP traffic logging. Integrate **Sentry** exception monitoring to capture frontend and backend crashes in real-time.
