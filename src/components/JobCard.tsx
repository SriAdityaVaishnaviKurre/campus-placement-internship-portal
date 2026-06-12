import { Link } from 'react-router-dom';

interface JobCardProps {
  key?: any;
  job: {
    id: number | string;
    title: string;
    description: string;
    location: string;
    salary?: string;
    package?: string;
    company?: string;
    company_name?: string;
    deadline?: string;
    logo?: string;
    skills?: string[];
    nodesAvailable?: number;
    type?: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const company = job.company_name || job.company || 'Enterprise Company';
  const logo = job.logo || '🌐';
  const salary = job.salary || job.package || 'Competitive Salary';
  const skills = job.skills || ['Core Skillset', 'General Technology'];
  const openings = job.nodesAvailable || 2;
  const type = job.type || 'Full-Time';

  return (
    <div className="job-card" id={`job-node-${job.id}`}>
      <div>
        <div className="job-card-header">
          <div className="comp-badge">{company}</div>
          <div className="comp-logo-box text-xl">{logo}</div>
        </div>

        <h3 className="job-title-card" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>

        <div className="job-meta-row">
          <div>
            <span className="job-comp-name" style={{ marginRight: '0.25rem' }}>Salary Package:</span>
            <span style={{ color: 'var(--cyber-yellow)', fontWeight: '600' }}> {salary}</span>
          </div>
          <div>
            <span className="job-comp-name" style={{ marginRight: '0.25rem' }}>Primary Location:</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}> {job.location}</span>
          </div>
        </div>

        <div className="job-node-limit" style={{ color: 'var(--cyber-cyan)', backgroundColor: '#f0f2ff', border: '1px solid #e0e4ff' }}>
          Openings Available: {openings}
        </div>

        <div style={{ margin: '1rem 0' }}>
          <span className="job-comp-name">Required Skills:</span>
          <div className="skills-tags" style={{ marginTop: '0.4rem' }}>
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--text-primary)' }}>
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="skill-tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderColor: 'var(--cyber-magenta)', color: 'var(--cyber-magenta)' }}>
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="job-card-bottom">
        <span className="job-tier" style={{ backgroundColor: '#ecfdf5', color: 'var(--cyber-green)', border: '1px solid #a7f3d0' }}>{type}</span>
        <Link to={`/job-details?id=${job.id}`} className="cyber-btn cyber-btn-small">
          View Details
        </Link>
      </div>
    </div>
  );
}
