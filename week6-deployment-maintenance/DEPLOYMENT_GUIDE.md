# 🛰️ [TRANSMISSION_PROTOCOL] PRODUCTION DEPLOYMENT GUIDE
### CAMPUSLINK PLACEMENT SYSTEM // CLEARANCE LEVEL_5 // WEEK_6 CONFIGS

```
 __________________________________________________________________
| [SYS_DEPLOY_SEQUENCE]                                            |
| TARGET_PLATFORM_FRONTEND : VERCEL / NETLIFY                      |
| TARGET_PLATFORM_BACKEND  : RENDER / RAILWAY                      |
| PRODUCTION_DATABASES     : RELATIONAL MYSQL SECURE ENCLAVE       |
| PIPELINE_STATUS          : COMPILATION PASSED. DEPLOY_READY_OK   |
|__________________________________________________________________|
```

---

## 🎨 1. FRONTEND DEPLOYMENT

### 🚀 OPTION A: VERCEL CLOUD MATRIX

Vercel provides native pipeline hooks to compile and deploy React + Vite Single Page Applications (SPAs).

#### 🛠️ ACCOUNT SETUP & PIPELINE INITIATION
1. Access and authenticate at the [Vercel Console](https://vercel.com).
2. Trigger the `Add New Project` pipeline dropdown.
3. Import your active Git Repository housing the `/` codebase.
4. Set the **Framework Preset** configuration to `Vite`.
5. Point the core **Root Directory** query parameters specifically to the repository root `/` (Vite will extract and bundle files under `/dist` in compile phase).

#### 🎛️ SYSTEM ENVIRONMENT VARIABLES
Inside the Project Settings panel, decrypt the **Environment Variables** segment and register:
- **Key**: `VITE_API_URL`
- **Value**: `https://campuslink-api.render.com` *(Replace with your live Backend target domain)*

#### 🔬 BUILD & DEPLOYMENT SPECS
- **Build Command**: `npm run build` (This triggers `tsc && vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Click **Deploy**. Vercel will bundle the files into optimized statically cached bundles and output a secured live verification URL, e.g., `https://campuslink-frontend.vercel.app`.

---

### 🚀 OPTION B: NETLIFY APPARATUS

Netlify intercepts git signals, compiling assets for global distribution edge servers.

#### 🛠️ STEP-BY-STEP FLOW
1. Log in to [Netlify App Terminal](https://app.netlify.com).
2. Trigger `Import from Git` and authorize the cloud terminal.
3. Point the environment compiler paths exactly to `/`.
4. Register the following parameters inside the **Site Configuration Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Since SPAs handle internal page routing on the browser layer, inject a `_redirects` routing payload directly into the `dist/` directory on build so Netlify doesn't flash `404 page not found` errors:
   - Create a file `/public/_redirects` with:
     ```text
     /*   /index.html   200
     ```

#### 🎛️ REGISTERING VARIABLES
In the Netlify dashboard under `Site Settings -> Environment Variables`, configure your live API pointer:
- `VITE_API_URL` = `https://campuslink-api.onrender.com`

Trigger the compilation deploy run. The platform will deliver the production frontend workspace live.

---

## ⚙️ 2. BACKEND DEPLOYMENT

The Node.js + Express.js backend acts as our core server, requiring steady resources and execution environments.

### 🚀 OPTION A: RENDER CORE SUITE

Render hosts Express applications inside isolated Docker-equivalent Web Services.

#### 🛠️ SERVER INITIALIZATION WORKFLOW
1. Access your workspace via [Render Control Panel](https://dashboard.render.com).
2. Select `New -> Web Service` from the interface options.
3. Connect your active GitHub repository.
4. Input the following operational hardware parameters:
   - **Language**: `Node`
   - **Region**: Select a zone nearest your user database (e.g., `Singapore` or `N. Virginia`)
   - **Branch**: `main`

#### 🔬 EXECUTING COMMANDS
- **Build Command**: `npm install` (Compiles dependencies safely)
- **Start Command**: `node server.ts` or standard production runners `node dist/server.cjs` based on deployment types. For native full-stack environments, run:
  ```bash
  npm run build && node server.ts
  ```

#### 🎛️ SERVER ENVIRONMENT VARIABLES
Configure these key/value elements inside Render's internal `Advanced Settings -> Environment Variables` segment:
- `PORT` = `3000`
- `NODE_ENV` = `production`
- `JWT_SECRET` = `[YOUR_SUPER_SECURE_ENCRYPTED_SIGNATURE_KEY]`
- `DB_HOST` = `[YOUR_PRODUCTION_MYSQL_DATABASE_HOST]`
- `DB_USER` = `[YOUR_PROD_DATABASE_USER_NAME]`
- `DB_PASSWORD` = `[YOUR_PROD_DB_COMPLEX_PASSCODE]`
- `DB_NAME` = `[YOUR_PROD_MYSQL_SCHEMA_NAME]`

Click **Create Web Service**. After Render initializes network connections and boots the dependencies, it provides an active REST routing pointer, e.g., `https://campuslink-api.onrender.com`.

---

### 🚀 OPTION B: RAILWAY APPLICATION CONTROL

Railway is a server developer sandbox offering instantaneous runtime builds.

#### 🛠️ DEPLOYMENT STRATEGY
1. Authenticate at [Railway App](https://railway.app).
2. Choose `New Project` and click `Deploy from GitHub`.
3. Highlight your verified backend codebase layout.
4. Add the compilation variables by clicking `Variables -> Raw Editor` on your project container card:
   - Paste environment keys matching the database configurations and standard tokens of the platform.
5. In the Service settings, configure:
   - **Custom Domain**: Connect your personal domain path or trigger an auto-generated DNS pointer.
   - **Port Binding**: Ensure Railway bridges its dynamic environment port (`PORT`) to the Express routing listeners.

Trigger deployment. The console logs will render:
`[System Server] Running on http://0.0.0.0:3000 --- Fallback DB Active: False // MySQL Active!`

---

## 🛢️ 3. PRODUCTION DATABASES: MYSQL PRODUCTION DEPLOYMENT

To guarantee global security bounds, deploy a reliable MySQL cluster. Recommend utilizing managed services like **Aiven Cloud**, **AWS RDS**, or **DigitalOcean Databases**.

### 🛠️ LIVE METABASE CLOUD CONTAINER PROVISIONING (e.g. Aiven)
1. Trigger a Managed MySQL Database instance inside the Cloud console.
2. Select a secure region nearest your primary servers to minimize network overhead and latency.
3. Once the database status changes to `RUNNING`, retrieve your connection strings:
   - **Database Connection Host URI**: `mysql-campuslink.aivencloud.com`
   - **Database Connection Port**: `25015`
   - **Primary Master Username**: `avnadmin`
   - **Decrypted Password**: `[REDACTED_SECURE_PHRASE]`
   - **Primary Schema Name**: `campuslink`

### 🏗️ SCHEMA DATA SCHEMATICS SYNCHRONIZATION
To populate your production database, execute the structural SQL schema commands directly against the live database endpoint. Using your local CLI terminal machine:
```bash
# Connect and dispatch schema configurations to populate real tables
mysql -h mysql-campuslink.aivencloud.com -P 25015 -u avnadmin -p campuslink < backend/schema.sql
```

Verify table integration by logging into your cloud database console:
```sql
SHOW TABLES;
-- Outputs: jobs, users, applications, student_profiles, recruiter_profiles
```

---

## 🔗 4. SYSTEM HANDSHAKE VERIFICATION

To verify correct connectivity and functionality across all deployed environments, follow this four-step automated checklist:

1. **Verify Database Integrity**: Log into the active SQL DB and execute a test query:
   ```sql
   SELECT COUNT(*) FROM users;
   ```
2. **Verify API REST Responses**: Open a connection helper tool or dispatch a curl packet to the deployed api endpoint:
   ```bash
   curl -X GET https://campuslink-api.render.com/api/jobs
   ```
   *Expected response*: `{"success": true, "jobs": [...]}` along with status `200 OK`.
3. **Assert Frontend Handshake**: Launch a browser browser tab directed to the Vercel deployed frontend URL. Look for the dynamic jobs feed list; if jobs populate the viewport, the server and database handshake have succeeded.
4. **Assert JWT Authentication Flows**: Navigate to `/login` on the live platform, sign in with dummy credentials, write changes to the Candidate Profile, save, and reload. Observe if the changed attributes persist on reload. If they do, the live write pipelines are active and synchronized.
