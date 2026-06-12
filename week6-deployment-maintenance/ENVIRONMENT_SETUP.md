# 🎚️ [VARIABLE_INDEX] PRODUCTION ENVIRONMENT VARIABLES SETUP
### CAMPUSLINK PLACEMENT PORTS // SYSTEM SECURITY METRICS // CHANNELS 6

```
 ==================================================================
| [SYSTEM_METRIC_MATRIX: ENVIRONMENT REGISTER]                     |
| CURRENT_SYSTEM_TIME: 2026-06-10T16:59:01Z                        |
| MATRIX_INTEGRITY   : HIGH // READ ONLY EXCEPT VIA HOST_CONSOLE   |
| STATUS             : DEPLOY_KEYS_VALIDATED                       |
|__________________________________________________________________|
```

---

## 🖥️ 1. FRONTEND ENVIRONMENT CONFIGURATIONS

The React client references a single, centralized pointer environment variable to locate and exchange REST packets with the transactional backend services. 

> [!CAUTION]
> In Vite-powered architectures, client-side variables must be prefixed with `VITE_` to be bundled and exposed in browser DevTools. Make sure the API URL target does NOT end with a trailing slash (`/`).

### `.env` File Format (Local Development/Staging)
Create a file at the root of the React project:
```env
# URL pointing to the active Express server backend endpoint
VITE_API_URL=http://localhost:3000
```

### Production Environment Injection
When hosting on cloud platforms (e.g., Vercel, Netlify), declare this environment variable directly inside the platform configuration settings:
```text
VITE_API_URL=https://campuslink-api.render.com
```

---

## ⚙️ 2. BACKEND ENVIRONMENT CONFIGURATIONS

The backend environment variable file houses the system port mappings, JWT encryption keys, and relational MySQL credentials. These variables must never be stored in code or pushed to Git repositories under any circumstances.

### Root `.env` Deployment Template
Store these variables inside a secure local `.env` block at the project backend sector or populate them manually inside your Docker container runtime configs on the cloud:

```env
# Operational network port binding
PORT=3000

# Server execution state (affects logging granularity and error stack formatting)
NODE_ENV=production

# High-entropy encryption phrase used to sign and verify active JWT sessions
JWT_SECRET=cyber-neon-crypt-handshake-6625-xyz-omega-990-2026

# Production MySQL cluster host address
DB_HOST=mysql-campuslink.aivencloud.com

# Target connection port for MySQL requests (default standard is 3306 or provider specialized)
DB_PORT=25015

# Security clearance account username for live SQL instances
DB_USER=avnadmin

# Cryptographically secure password key matching authorized DB client accounts
DB_PASSWORD=cyber_p_key_prod_complex_2026_passcode_sec

# Targeted schema database catalog on DB host
DB_NAME=campuslink
```

---

## 🔬 3. COMPREHENSIVE DEFINITIONS MATRIX

| VARIABLE SCHEME | TYPE | DESCRIPTION | CRITICAL VALUE SAFETY RULES |
| :--- | :--- | :--- | :--- |
| **`PORT`** | Integer | The network port the server listens on in production. | In microservices platforms (e.g., Cloud Run), this is often dynamically overwritten by host container routers to map traffic natively. |
| **`NODE_ENV`** | String | Standard environment state. Configured as `production` or `test` or `development`. | Set to `production` in live environments to prevent verbose debug logging, increase speed, and hide source code file-traces from error stacks. |
| **`JWT_SECRET`** | String | Salt/passcode used to create digital signatures verifying authenticated sessions. | Must be a long, high-entropy alpha-numeric construct. Compromising this allows malicious parties to forge admin-level privileges. |
| **`DB_HOST`** | Host URI | Host pointer identifying your active cloud MySQL database server. | Ensure your database's connection string is reachable from your server's deployment network zone. |
| **`DB_PORT`** | Integer | Connection target port utilized by relational databases. | The default is `3306`. Specialized systems like Aiven use custom ports (e.g., `25015`). Double-check with your hosting provider. |
| **`DB_USER`** | String | Relational SQL client identity key. | Do not use root credentials. In production, use a limited privilege user who has access ONLY to the target schema database. |
| **`DB_PASSWORD`**| String | Passcode used to execute and commit changes inside SQL clusters. | Avoid plain human-readable phrasing. Use dynamic passwords generated with cryptographic software. |
| **`DB_NAME`** | String | Target database schema where campus database tables live. | Ensure your cloud server creates this schema database before compiling the application tables. |

---

## 🔐 4. INJECTING KEYS SAFELY (NO-CI SECURE LEAK DEFENSE Checklist)

To prevent accidental code exposures during active development:
1. **Double Check Gitignore**: Ensure `.gitignore` explicitly lists `.env` and `*test*setup*` variables configurations so raw keys aren't caught in git commits.
2. **Setup Example Configs**: Fill `.env.example` placeholder files with blanks, ensuring developer comrades understand the structure without exposing live passwords.
3. **Environment Isolation**: Always utilize isolated database schemas between unit test suites (`NODE_ENV=test`) and continuous integration pipelines to prevent corruption of live production tables.
