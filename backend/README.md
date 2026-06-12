# Campus Placement & Internship Portal - Back-End API (Week 3)

The complete Express-based RESTful backend API supporting the Campus Placement & Internship Portal. This backend introduces a robust MVC directory pattern, JWT authentication session scopes, hashed credentials protection, input payload validation, and dual-mode database operations (Production MySQL + In-Memory Fallback Client).

---

## 🚀 [TECHNOLOGY_STACK]

- **Runtime Environment:** Node.js v18+
- **Server Framework:** Express.js v4+
- **Database Engine:** MySQL 8.x (with a local memory database fallback logic for zero-config evaluation)
- **Security:** JWT Authentication + Password Hashing using `bcryptjs`
- **Validation Engine:** `express-validator`
- **CORS Support:** `cors` middleware
- **Dev-Bootloader:** `tsx` & `esbuild` Compilation
- **Testing Engine:** Jest + `supertest`

---

## 📂 [BACKEND_DIRECTORY_HIERARCHY]

The directory maps exactly to the requested modular MVC standard structure:

```
backend/
├── config/
│   └── db.ts                   # Dual-mode MySQL link/Mock Storage
│
├── controllers/
│   ├── authController.ts       # Register, login, session handlers
│   ├── userController.ts       # Student & Recruiter profiles CRUD
│   ├── jobController.ts        # Recruitment postings CRUD
│   └── applicationController.ts # Applying, pipeline status updates, and reports
│
├── middleware/
│   ├── authMiddleware.ts       # Token assertions & role validations
│   └── errorMiddleware.ts      # Exception trap formats
│
├── models/
│   ├── User.ts                 # SQL schemas for base accounts, student & recruiter
│   ├── Job.ts                  # SQL queries for job indices
│   └── Application.ts          # SQL queries for tracking applications & admin reports
│
├── routes/
│   ├── authRoutes.ts           # /api/auth registration/login loops
│   ├── userRoutes.ts           # /api/users profiles directories
│   ├── jobRoutes.ts            # /api/jobs core postings
│   └── applicationRoutes.ts    # /api/applications status and reports
│
├── tests/
│   ├── auth.test.ts            # Authentication integration suites
│   └── jobs.test.ts            # Job CRUD validation suites
│
├── schema.sql                  # Production MySQL installation schema
├── API_DOCUMENTATION.md        # Complete endpoint mock specification sheet
└── README.md                   # This instruction panel
```

---

## ⚙️ [SYSTEM_INSTALLATION_AND_SETUP]

### 1. Repository Setup
Verify that all packages are registered:
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the root directory (using `.env.example` as a layout template):
```env
PORT=3000
JWT_SECRET="JWT_SECRET_PASSPHRASE_VAL_2026_PORTAL_SECURE"

# MySQL Settings (If blank, database operations automatically route to local mock storage!)
DB_HOST=""
DB_USER=""
DB_PASSWORD=""
DB_NAME="campus_placement_db"
```

### 3. Deploy MySQL Schema
If using a live MySQL instance, connect and source `/backend/schema.sql`:
```bash
mysql -u root -p < backend/schema.sql
```

### 4. Direct Boot Sequence
To launch the full-stack server (serving both the API and Vite-engineered assets):
```bash
npm run dev
```
The console will outline:
```
[MySQL] Credentials not fully configured in environment. Using robust mock database mode.
[Express Server] Mounting Vite development live middleware mode...
[Express Server] Server running on port 3000
[Express Server] Local access url: http://localhost:3000
```

---

## 🛡️ [SECURITY_IMPLEMENTATIONS]

1. **JSON Web Tokens (JWT):** Signed payloads with 24-hour expiration limits. Extracted via Bearer header tokens on protected scopes.
2. **Password Cryptography:** Cryptographic hashes computed using `bcryptjs` before committing accounts to the storage state.
3. **Role-checking Guards (`requireRole`):** Locked administrative/recruiting endpoints. Returns `403 Forbidden` if low-clearance students attempt to alter parameters.
4. **Input Payload Sanitization:** Intercepts wrong formats (such as malformed emails or short passwords) before querying databases.

---

## 🧪 [RUNNING_UNIT_TEST_SUITES]

Integration endpoints are validated against Jest and `supertest`. To test, configure `NODE_ENV=test` and run the tests:
```bash
npx jest --config='{"preset":"ts-jest"}' backend/tests/
```
The suite compiles and tests:
- Base student registration
- Token generations on login
- Failed authentication blocks
- Public job listings availability
- Blockade checks for unauthorized listings
