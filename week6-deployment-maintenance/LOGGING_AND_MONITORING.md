# 📡 [LOGSTREAM_CENTRAL] ENGINE LOGGING AND MONITORING STRATEGY
### SYSTEM PERFORMANCE TELEMETRY // REAL TIME AUDITS // WORKSPACE MONITORS

```
 ==================================================================
| [TELEMETRY_STREAM_MONITOR: MULTI CHANNEL SYSTEM]                 |
| MONITORED_CHANNELS: API_TRAFFIC / REGISTRY / SECURE_AUTHENTICAT  |
| LOGGING_ENGINES   : WINSTON / MORGAN                             |
| MONITOR_PROFILES  : SENTRY SATELLITE ACTIVE                      |
|__________________________________________________________________|
```

---

## 📝 1. APPLICATION LOGGING DESIGN

To capture server events while keeping production runtimes clean, the system uses a decoupled logging architecture featuring **Winston** for structured logs and **Morgan** for HTTP traffic auditing.

### 1.1 Winston Multi-Transport Logger Setup

The setup divides logging output into two primary channels: standard `console` output in color for developers, and persistent `error.log` and `combined.log` files for audits:

```typescript
// backend/utils/logger.ts
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '/var/log/campuslink/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: '/var/log/campuslink/combined.log',
    }),
  ],
});
```

---

## 🚦 2. API TRAFFIC ANALYTICS VIA MORGAN

We configure Morgan middleware in production to log incoming HTTP traffic. The logs exclude sensitive payloads (like passwords or JWTs) to maintain security:

```typescript
// backend/middleware/trafficLogger.ts
import morgan from 'morgan';
import { logger } from '../utils/logger';

export const trafficLogger = morgan(
  ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);
```

### Example Consolidated Log Output (Morgan + Winston)
```text
[2026-06-10 16:55:01:042] [info]: [DATABASE_CONN] Successfully connected to Pool.
[2026-06-10 16:55:02:115] [http]: 127.0.0.1 - GET /api/jobs 200 4502 - 12.04 ms
[2026-06-10 16:55:10:982] [http]: 127.0.0.1 - POST /api/auth/login 200 242 - 45.10 ms
[2026-06-10 16:55:22:108] [http]: 127.0.0.1 - PUT /api/users/profile/student 200 65 - 18.90 ms
[2026-06-10 16:56:00:002] [warn]: [FALLBACK_DB_MODE_ACTIVE] No DB connection detected. Using Mock In-Memory DB Mode.
[2026-06-10 16:56:04:112] [error]: [AUTH_VALIDATION_ERROR] Missing Email Parameter.
```

---

## 🔬 3. CHANNELS AUDIT SPECS & CLASSIFICATION LOGS

The placement system categorizes and levels events as follows:

### 🚨 3.1 AUTHENTICATION DEVIATIONS & ACCESS LOGS
*   **TRIGGER EVENTS**: Failed logins, attempts to register with invalid roles, expired JWT key tokens.
*   **METRIC SCHEME**: Logged as `WARN` level. Include the target IP and hashed email:
    ```text
    [2026-06-10 16:57:01:882] [warn]: [AUTH_FAILURE] Failed sign-in from 192.168.1.1 for user: miles@cyberdyne.org
    ```

### 🛢️ 3.2 TRANSACTION AND DATABASE ERROR LOGS
*   **TRIGGER EVENTS**: Connection pool exhaustion, primary database query failures, unhandled exceptions on write.
*   **METRIC SCHEME**: Logged as `ERROR` level, triggering automated monitoring alerts:
    ```text
    [2026-06-10 16:58:14:022] [error]: [DB_QUERY_FAILURE] ER_BAD_FIELD_ERROR: Unknown column 'invalid_col' in 'field list'
    ```

---

## 🛰️ 4. SENTRY ERROR-CRASH SATELLITE INTEGRATION

To track exceptions in real-time across both frontend and backend deployments, we recommend integrating **Sentry**.

### 4.1 Client Page Diagnostics Injection (React)
Initialize Sentry inside `src/main.tsx` to log uncaught errors and UI crashes automatically:

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://sentry-key@o0.ingest.sentry.io/campuslink-project",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1, // 10% performance tracking sample rate
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // Always record replays on system errors
});
```

### 4.2 API Framework Error Capture Integration (Express)
Mount Sentry middleware at the top of your Express router chains to catch and log backend exceptions:

```typescript
// backend/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://sentry-key@o0.ingest.sentry.io/campuslink-project",
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// Active API routing rules go here...

// The error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());
```
