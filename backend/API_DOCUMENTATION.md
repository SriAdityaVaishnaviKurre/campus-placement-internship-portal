# Campus Placement & Internship Portal - API Specification (Week 3)

Secure RESTful services backing the Campus Portal platform.
**Default Context Root:** `http://localhost:3000/api`

---

## 1. Authentication Services (`/api/auth`)

### Endpoint: `POST /auth/register`
* **Description:** Creates and initializes a new user portal credential (student or recruiter).
* **Request:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.student@campuslink.edu",
    "password": "passcode_secure_123",
    "role": "student"
  }
  ```
* **Success Response (Code Match: `211`):**
  ```json
  {
    "message": "Account registered successfully.",
    "user": {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane.student@campuslink.edu",
      "role": "student"
    }
  }
  ```
* **Error Response (Code Match: `400`):**
  ```json
  {
    "error": "Validation Error: Email is already registered on this portal."
  }
  ```

---

### Endpoint: `POST /auth/login`
* **Description:** Auths user email and password, returning signed authorization JSON Web Tokens (JWT).
* **Request:**
  ```json
  {
    "email": "jane.student@campuslink.edu",
    "password": "passcode_secure_123"
  }
  ```
* **Success Response (Code Match: `200`):**
  ```json
  {
    "message": "Authentication successful. Welcome to CampusLink Portal.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane.student@campuslink.edu",
      "role": "student"
    }
  }
  ```
* **Error Response (Code Match: `401`):**
  ```json
  {
    "error": "Authentication Failed: Invalid email or password."
  }
  ```

---

### Endpoint: `POST /auth/logout`
* **Description:** Deauthorizes and terminates the active passport session.
* **Request:** `Header: Authorization: Bearer <token>`
* **Success Response (Code Match: `200`):**
  ```json
  {
    "message": "Logged out successfully. Secure portal session terminated."
  }
  ```

---

## 2. Profile Management Utility (`/api/users`)

### Endpoint: `GET /users/profile/student`
* **Description:** Resolves the student metadata belonging to the current session.
* **Request:** `Header: Authorization: Bearer <token>`
* **Success Response (Code Match: `200`):**
  ```json
  {
    "student": {
      "id": 2,
      "user_id": 4,
      "resume_url": "https://campuslink.edu/resumes/jane_doe_cv.pdf",
      "skills": "React, Express, MySQL",
      "cgpa": 9.15
    }
  }
  ```

---

### Endpoint: `PUT /users/profile/student`
* **Description:** Modifies resume indices, academic CGPAs, and professional skill tags.
* **Request:**
  ```json
  {
    "resumeUrl": "https://campuslink.edu/resumes/cv_v2.pdf",
    "skills": "ReactJS, Vite, TypeScript, SQL Databases",
    "cgpa": 9.25
  }
  ```
* **Success Response (Code Match: `200`):**
  ```json
  {
    "message": "Student profile updated successfully."
  }
  ```

---

### Endpoint: `GET /users/profile/recruiter`
* **Description:** Retreives detailed hiring info for the recruiter context.
* **Request:** `Header: Authorization: Bearer <token>`
* **Success Response (Code Match: `200`):**
  ```json
  {
    "recruiter": {
      "id": 1,
      "user_id": 3,
      "company_name": "Microsoft India",
      "company_email": "microsoft.careers@microsoft.com"
    }
  }
  ```

---

### Endpoint: `GET /users/admin/users`
* **Description:** Allows administrators to view a directory of all registered accounts.
* **Request:** `Header: Authorization: Bearer <token>`
* **Success Response (Code Match: `200`):**
  ```json
  {
    "users": [
      {
        "id": 1,
        "name": "Placement Officer Admin",
        "email": "admin@campuslink.edu",
        "role": "admin",
        "created_at": "2026-06-10T14:41:51.000Z"
      }
    ]
  }
  ```

---

## 3. Placement Opportunities (`/api/jobs`)

### Endpoint: `GET /jobs`
* **Description:** Public directory browsing of open jobs and internships (no token required).
* **Success Response (Code Match: `200`):**
  ```json
  {
    "jobs": [
      {
        "id": 1,
        "recruiter_id": 1,
        "title": "Software Development Engineer",
        "description": "Responsible for building high-scale Azure and web application frontends.",
        "location": "Bangalore, India",
        "salary": "18.4 LPA",
        "deadline": "2026-07-15",
        "company_name": "Microsoft India"
      }
    ]
  }
  ```

---

### Endpoint: `POST /jobs`
* **Description:** Registers a new career opportunity (Recruiter or Admin only).
* **Request:**
  ```json
  {
    "title": "Backend Systems Architect",
    "description": "Orchestrates database shards, caching nodes, and microservice structures.",
    "location": "Hyderabad, India",
    "salary": "24.0 LPA",
    "deadline": "2026-08-30"
  }
  ```
* **Success Response (Code Match: `211`):**
  ```json
  {
    "message": "Job posting published successfully.",
    "jobId": 3,
    "job": {
      "id": 3,
      "recruiterId": 1,
      "title": "Backend Systems Architect",
      "location": "Hyderabad, India",
      "salary": "24.0 LPA",
      "deadline": "2026-08-30"
    }
  }
  ```

---

## 4. Application Workflows (`/api/applications`)

### Endpoint: `POST /applications`
* **Description:** Routes active resume modules to the specified target job (Student only).
* **Request:**
  ```json
  {
    "jobId": 1
  }
  ```
* **Success Response (Code Match: `211`):**
  ```json
  {
    "message": "Application successfully registered and routed to recruiter.",
    "applicationId": 2,
    "details": {
      "id": 2,
      "jobTitle": "Software Development Engineer",
      "status": "pending"
    }
  }
  ```

---

### Endpoint: `PUT /applications/:id`
* **Description:** Promotes or changes application status (Recruiter/Admin only).
* **Request:**
  ```json
  {
    "status": "shortlisted"
  }
  ```
* **Success Response (Code Match: `200`):**
  ```json
  {
    "message": "Candidate application status updated successfully."
  }
  ```

---

### Endpoint: `GET /applications/admin/reports`
* **Description:** Central institutional success metric reports (Admin only).
* **Request:** `Header: Authorization: Bearer <token>`
* **Success Response (Code Match: `200`):**
  ```json
  {
    "report": {
      "totalApplications": 2,
      "shortlistedCount": 1,
      "interviewingCount": 0,
      "pendingCount": 1,
      "totalJobsActive": 2,
      "totalStudentsRegistered": 1,
      "placementRate": "100%"
    }
  }
  ```
