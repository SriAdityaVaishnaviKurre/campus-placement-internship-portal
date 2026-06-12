# 🧯 [CORE_STABILIZATION] SYSTEM TROUBLESHOOTING GUIDE
### DIAGNOSTICS ARCHIVE // 20+ DEPLOYMENT INCIDENT REPORTS // LEVEL_5 AUDITS

```
 ==================================================================
| [INCIDENT_HOTLINE_INDEX: RESOLUTION SCHEMATICS]                  |
| REGISTERED_ISSUES : 21 STABILIZATION RECORDS                      |
| PRIORITY          : INSTANT PATCH EXECUTION                      |
| SCANLINES         : RENDERED COMPLETE                            |
|__________________________________________________________________|
```

---

## 🖥️ I. FRONTEND DEPLOYMENT INCIDENTS (ISSUES 01 - 06)

### 📌 ISSUE 01: White Screen Render Failures After Compile
*   **SYMPTOM**: The live frontend page loads as a blank white page. The browser DevTools console outputs: `Uncaught TypeError: Cannot read properties of undefined (reading 'VITE_API_URL')`.
*   **ROOT CAUSE**: The client-side variable `VITE_API_URL` is referenced directly inside files without checking whether it exists. The active hosting platform failed to inject the environment variable during compilation.
*   **REMEDY PROTOCOL**: 
    1. Access your hosting dashboard (e.g. Vercel, Netlify).
    2. Confirm that the `VITE_API_URL` environment variable has been added in settings and matches your backend URL.
    3. Update the frontend code (e.g., in `/src/services/api.ts`) to use a safe placeholder value if the environment variable is missing:
       ```javascript
       export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
       ```

### 📌 ISSUE 02: Client Route Changes Return 404 Exceptions on Reload
*   **SYMPTOM**: Clicking links to reload pages like `/dashboard` or `/login` returns a generic provider `404 Not Found` error.
*   **ROOT CAUSE**: In single page applications (SPAs), routes are managed entirely within the browser via React Router. When you reload a page, the hosting server attempts to request that route path as a physical file on the server, which doesn't exist.
*   **REMEDY PROTOCOL**:
    - For **Vercel** setups: Inject a `vercel.json` file in your root folder configuring rewrite rules:
      ```json
      {
        "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
      }
      ```
    - For **Netlify** setups: Add a `_redirects` file directly to the `/public` directory:
      ```text
      /*    /index.html   200
      ```

### 📌 ISSUE 03: Compilation Crashes: `vite: command not found`
*   **SYMPTOM**: The platform build steps fail on startup with error logs showing: `sh: vite: command not found` or `Exit Code: 127`.
*   **ROOT CAUSE**: The `node_modules` catalog of dependencies was not installed prior to compiling assets, or was deleted during dynamic server cleanup cycles.
*   **REMEDY PROTOCOL**:
    Execute an explicit package install run immediately before compiling builds:
    ```bash
    npm install && npm run build
    ```

### 📌 ISSUE 04: SVG Vector Icons and Font Formats Fail to Load
*   **SYMPTOM**: Browser DevTools network panel reports constant `404` errors attempting to load localized custom images or workspace fonts.
*   **ROOT CAUSE**: Static asset files were placed inside path directories (like `/src/assets/`) that are bypassed during static compilation runs.
*   **REMEDY PROTOCOL**: 
    Ensure all assets (such as custom fonts or SVG files) are placed inside the static `/public/` directory. Reference those assets in components using absolute root paths (e.g., `<img src="/icon.svg" />`), bypassing Vite's compiler process.

### 📌 ISSUE 05: Client Build Pipeline Out of Memory
*   **SYMPTOM**: Complex production builds fail halfway through compilation with error logs showing: `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.
*   **ROOT CAUSE**: Node limits memory allocations to exactly 512MB inside small cloud builder environments, which can be exceeded during aggressive asset-bundling runs.
*   **REMEDY PROTOCOL**:
    Increase the Node.js memory limit parameter inside your target deployment build scripts:
    ```bash
    NODE_OPTIONS="--max-old-space-size=4096" npm run build
    ```

### 📌 ISSUE 06: Static Asset Delivery Delays (Slow Load Times)
*   **SYMPTOM**: Static web pages take over 5 seconds to become fully interactive on first load.
*   **ROOT CAUSE**: Large uncompressed static assets or web fonts block the main page load.
*   **REMEDY PROTOCOL**:
    Enable gzip or Brotli compression inside your server settings. Compress and resize large custom background images, converting them to highly optimized `.webp` or `.svg` formats.

---

## ⚙️ II. BACKEND RUNTIME & INTEGRATION INCIDENTS (ISSUES 07 - 13)

### 📌 ISSUE 07: Backend Service Fails to Load - Port Binding Ingress Conflicts
*   **SYMPTOM**: Deployment fails to start, displaying the error logs: `Error: listen EADDRINUSE: address already in use :::3000`.
*   **ROOT CAUSE**: Another backend thread or process is already running on the instance and listening on port `3000`.
*   **REMEDY PROTOCOL**:
    Kill any active processes running on port 3000 before starting your server, or configure the server to use a different port by passing a dynamic `PORT` environment variable:
    ```bash
    # Locate and kill the blocking process:
    lsof -i :3000
    kill -9 [PID]
    ```

### 📌 ISSUE 08: Missing API Request Payloads Result in `500 Server Crashes`
*   **SYMPTOM**: The Express backend crashes when receiving POST payloads with invalid or empty request bodies.
*   **ROOT CAUSE**: Express route controllers attempt to read properties from `req.body` directly without registering standard parsing middleware first.
*   **REMEDY PROTOCOL**:
    Inject Express JSON parser middlewares at the top of your `server.ts` routing chain:
    ```typescript
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    ```

### 📌 ISSUE 09: API Core Requests Blocked by Browser `CORS` Errors
*   **SYMPTOM**: The browser console displays: `Access to fetch at ... has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`.
*   **ROOT CAUSE**: The Express server lacks proper Cross-Origin Resource Sharing (CORS) configurations to allow requests from your frontend domain.
*   **REMEDY PROTOCOL**:
    Install the standard CORS middleware package, integrate it at the top of your Express routes, and configure it to allow requests from your frontend:
    ```typescript
    import cors from 'cors';
    
    app.use(cors({
      origin: process.env.VITE_FRONTEND_URL || 'https://campuslink.vercel.app',
      credentials: true
    }));
    ```

### 📌 ISSUE 10: Server Security Crash: `Secret key not specified`
*   **SYMPTOM**: The server starts up but instantly crashes on user logins, displaying: `Error: secretOrPrivateKey must have a value`.
*   **ROOT CAUSE**: The encryption variable `JWT_SECRET` was not provided or failed to load correctly from the environment.
*   **REMEDY PROTOCOL**:
    Ensure the environment variable is declared in your cloud dashboard settings. Add a fallback secret in your configuration code to prevent crashes:
    ```typescript
    const SECRET = process.env.JWT_SECRET || 'fallback-low-entropy-signature-key-change-it-now';
    ```

### 📌 ISSUE 11: JWT Token Conversions Fail: `jwt malformed`
*   **SYMPTOM**: Client requests fail with a `'401 Unauthorized'` response, and the server log shows `JsonWebTokenError: jwt malformed`.
*   **ROOT CAUSE**: The incoming JWT token failed to parse because it was missing a proper structure, lacked the required prefix, or contained empty whitespace characters.
*   **REMEDY PROTOCOL**:
    Update the backend authorization middleware to verify the format of incoming tokens:
    ```typescript
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Verify token
    }
    ```

### 📌 ISSUE 12: Middleware Blocking Execution (Unreturned Route Handlers)
*   **SYMPTOM**: API requests hang indefinitely without returning a response, eventually timing out.
*   **ROOT CAUSE**: Middleware functions (like authentication filters) do not trigger the `next()` callback, preventing Express from moving to the next route handler.
*   **REMEDY PROTOCOL**:
    Audit your custom middleware routines to ensure the `next()` callback is triggered under all logical execution paths:
    ```typescript
    export const authMiddleware = (req, res, next) => {
      if (isValid) {
        next(); // Ensure this is triggered to continue request execution!
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    };
    ```

### 📌 ISSUE 13: Memory Leaks in Multi-User Environments
*   **SYMPTOM**: Server memory usage increases steadily over time, eventually causing the instance to crash.
*   **ROOT CAUSE**: Global variable arrays or unclosed event listeners retain references to user connection contexts, preventing garbage collection.
*   **REMEDY PROTOCOL**:
    Do not store dynamic state inside global variables. Store dynamic user data in your SQL database or Redis cache instead. Close database connections and clean up timers when they are no longer needed.

---

## 🛢️ III. DATABASE CONNECTIVITY INCIDENTS (ISSUES 14 - 17)

### 📌 ISSUE 14: Database Connections Fail with `getaddrinfo EAI_AGAIN`
*   **SYMPTOM**: The Express backend fails to connect to the database, showing: `Error: getaddrinfo EAI_AGAIN dbhost123`.
*   **ROOT CAUSE**: The database address host provided in `DB_HOST` is invalid, contains typos, or cannot be resolved by DNS structures.
*   **REMEDY PROTOCOL**:
    1. Confirm that the address host provided in `DB_HOST` is correct and doesn't contain typos.
    2. Confirm that the database target host has been deployed and is running.
    3. Ensure your server environment can resolve DNS records. If failures persist, activate our self-healing fallback to allow the server to continue running in memory:
       ```typescript
       // Fallback active
       if (err.code === 'EAI_AGAIN') {
         useFallbackDb = true;
       }
       ```

### 📌 ISSUE 15: Connections Blocked by Firewall Restrictions
*   **SYMPTOM**: Database requests return timeout errors: `Error: connect ETIMEDOUT`.
*   **ROOT CAUSE**: Relational databases (like AWS RDS, Google Cloud SQL) use built-in firewalls that block incoming traffic from unauthorized hosts.
*   **REMEDY PROTOCOL**:
    Access your database host and update its network firewalls or security groups to list your server's IP address (or allow traffic from any host `0.0.0.0/0` if you are using secure credentials).

### 📌 ISSUE 16: Too Many Connection Pools Overflowing SQL Instance Limit
*   **SYMPTOM**: Calls to the database return the error: `Error: ER_CON_COUNT_ERROR: Too many connections`.
*   **ROOT CAUSE**: The server is spawning brand new database connection instances on every query instead of reusing active connections from a centralized database connection pool.
*   **REMEDY PROTOCOL**:
    Configure a single, shared connection pool of connections when initializing your server, and leverage that same pool for all downstream operations:
    ```typescript
    export const pool = mysql.createPool({
      host: process.env.DB_HOST,
      connectionLimit: 10,
      queueLimit: 0
    });
    ```

### 📌 ISSUE 17: Mismatched Database Schemas Return SQL Query Failures
*   **SYMPTOM**: API requests fail with logs showing: `Error: ER_BAD_FIELD_ERROR: Unknown column 'selected_column' in 'field list'`.
*   **ROOT CAUSE**: The backend application codebase has updated its query definitions, but the live production MySQL database hasn't been migrated to match the new schema.
*   **REMEDY PROTOCOL**:
    Review and update your production database tables to match the schema defined in your application codebase. You can use your terminal CLI to run migrations:
    ```bash
    mysql -u [USER] -p[PASS] -D [DB] < backend/schema.sql
    ```

---

## 🏎️ IV. TESTING INCIDENTS (ISSUES 18 - 21)

### 📌 ISSUE 18: Testing Databases Corrupted by Automated Test Runs
*   **SYMPTOM**: Running unit tests overwrites or deletes active user accounts database tables.
*   **ROOT CAUSE**: The testing process ran assertions on live production database environments, rather than an isolated backup target.
*   **REMEDY PROTOCOL**:
    Enforce dedicated environment configurations during test execution to prevent automated tests from interacting with production resources:
    ```javascript
    process.env.NODE_ENV = 'test';
    // Clear out production variables inside our test setup files
    delete process.env.DB_HOST;
    ```

### 📌 ISSUE 19: JSDOM Tests Crash on Mock Elements: `window.matchMedia is not a function`
*   **SYMPTOM**: Frontend DOM examinations fail with the message: `TypeError: window.matchMedia is not a function`.
*   **ROOT CAUSE**: JSDOM emulates a standard browser environment, but lacks implementations for more complex web systems like `window.matchMedia` or `window.scrollTo`.
*   **REMEDY PROTOCOL**:
    Add fallback mock functions for missing browser features inside your standard testing target setup file (`setupTests.js`):
    ```javascript
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
    ```

### 📌 ISSUE 20: Asynchronous Test Cases Time Out
*   **SYMPTOM**: Asynchronous tests fail with logs showing: `Error: Timeout - Async callback was not invoked within the 5000ms timeout limit`.
*   **ROOT CAUSE**: A mock API wrapper did not resolve or return its promise payload, or a timer callback did not run within the default testing time window.
*   **REMEDY PROTOCOL**:
    1. Confirm that all mocked API endpoints resolve or return mock values during test execution.
    2. Leverage fake timer modules during testing to fast-forward asynchronous delay events:
       ```javascript
       jest.useFakeTimers();
       // trigger async action and fast-forward:
       jest.advanceTimersByTime(3000);
       jest.useRealTimers();
       ```

### 📌 ISSUE 21: Port Binding Crashes During Testing Runs
*   **SYMPTOM**: Running backend tests displays: `Error: listen EADDRINUSE: address already in use :::3000`.
*   **ROOT CAUSE**: The server is booted automatically when testing files load, triggering port configuration conflicts on parallel test runs.
*   **REMEDY PROTOCOL**:
    Modify your server entrypoint file (`server.ts`) to only listen on target ports in development or production modes, while exporting the server application for test isolation environments:
    ```typescript
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server boot successful on port ${PORT}`);
      });
    }
    ```
