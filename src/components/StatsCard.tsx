interface StatsCardProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  subText?: string;
}

export default function StatsCard({ label, value, highlightColor = 'var(--cyber-cyan)', subText }: StatsCardProps) {
  return (
    <div className="stat-unit" style={{ borderLeftColor: highlightColor }} id={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="stat-value" style={{ color: highlightColor }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {subText && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.4rem' }}>
          {subText}
        </span>
      )}
    </div>
  );
}
