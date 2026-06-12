export interface JobNode {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  package: string;
  type: 'INTERNSHIP' | 'FULL-TIME' | 'CONTRACT';
  eligibility: string;
  skills: string[];
  description: string;
  securityClearance: string;
  nodesAvailable: number;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  package: string;
  status: 'PENDING_DECISION' | 'SYNCED' | 'REJECTED' | 'INTERVIEW_STAGE';
  timestamp: string;
}

export const MOCK_JOBS: JobNode[] = [
  {
    id: "node-01",
    title: "Software Development Engineer",
    company: "MICROSOFT INDIA",
    logo: "💻",
    location: "Bangalore, India",
    package: "18.4 LPA // ANNUAL",
    type: "FULL-TIME",
    eligibility: "CGPA >= 8.0 // B.Tech/M.Tech Graduation Year 2026/2027",
    skills: ["ReactJS", "C#", "TypeScript", "SQL"],
    description: "Responsible for developing, maintaining, and shipping high-performance web applications and cloud integrations. You will work with a skilled multi-disciplinary team to build user-centric solutions.",
    securityClearance: "None (Standard Onboarding)",
    nodesAvailable: 3
  },
  {
    id: "node-02",
    title: "Data Analyst",
    company: "AMAZON CONTEXT",
    logo: "📈",
    location: "Hyderabad, India",
    package: "12.0 LPA // ANNUAL",
    type: "FULL-TIME",
    eligibility: "CGPA >= 7.5 // Open to All Engineering Branches",
    skills: ["Python", "SQL", "D3.js", "Tableau"],
    description: "Translate complex business matrices and user behaviors into actionable insights. Generate reports regarding placement trend forecasting and corporate workspace efficiency.",
    securityClearance: "Internal Data Access Level",
    nodesAvailable: 5
  },
  {
    id: "node-03",
    title: "Front End Web Intern",
    company: "ADOBE INDIA INC.",
    logo: "🎨",
    location: "Noida, India",
    package: "24.5 LPA // EXPEDITION-CLASS",
    type: "INTERNSHIP",
    eligibility: "CGPA >= 8.5 // Strong CSS and JavaScript Foundation",
    skills: ["ReactJS", "Vite", "Motion/React", "CSS3"],
    description: "Design and implement beautiful user interfaces, interactive components, and responsive pages. Collaborate with UX researchers to test accessibility and optimize load performance.",
    securityClearance: "Creative Cloud Division Support",
    nodesAvailable: 1
  },
  {
    id: "node-04",
    title: "Associate Full Stack Developer",
    company: "TATA CONSULTANCY SERVICES",
    logo: "⚙️",
    location: "Mumbai, India",
    package: "8.5 LPA // BASE",
    type: "INTERNSHIP",
    eligibility: "CGPA >= 6.5 // CS background preferred",
    skills: ["TypeScript", "Node.js", "Express", "PostgreSQL"],
    description: "Support digital transformation services for global retail clients. Build and verify low-latency HTTP REST API pipelines to connect databases with client dashboards.",
    securityClearance: "Standard Enterprise Clearance",
    nodesAvailable: 12
  },
  {
    id: "node-05",
    title: "Generative AI Solutions Architect",
    company: "GOOGLE INDIA",
    logo: "🤖",
    location: "Gurugram, India",
    package: "32.0 LPA // PERFORMANCE-BONUS",
    type: "FULL-TIME",
    eligibility: "CGPA >= 9.0 // Specialized AI/ML Coursework",
    skills: ["ReactJS", "NodeJS", "Google GenAI SDK", "Python", "LLMs"],
    description: "Develop cutting-edge smart assistants and natural language tooling using Google Gemini. Ensure model prompts and server-side logic are securely integrated under structured safety guidelines.",
    securityClearance: "AI Labs Internal Access",
    nodesAvailable: 2
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "app-101",
    jobId: "node-01",
    jobTitle: "Software Development Engineer",
    company: "MICROSOFT INDIA",
    package: "18.4 LPA",
    status: "SYNCED",
    timestamp: "2026-06-08 // 04:12"
  },
  {
    id: "app-102",
    jobId: "node-03",
    jobTitle: "Front End Web Intern",
    company: "ADOBE INDIA INC.",
    package: "24.5 LPA",
    status: "INTERVIEW_STAGE",
    timestamp: "2026-06-09 // 19:44"
  },
  {
    id: "app-103",
    jobId: "node-04",
    jobTitle: "Associate Full Stack Developer",
    company: "TATA CONSULTANCY SERVICES",
    package: "8.5 LPA",
    status: "PENDING_DECISION",
    timestamp: "2026-06-10 // 11:02"
  }
];
