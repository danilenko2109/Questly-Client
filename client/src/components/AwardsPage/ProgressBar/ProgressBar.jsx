import styles from './ProgressBar.module.scss';

export default function ProgressBar({ current, max, color = '#4361ee' }) {
  const percent = Math.min(100, (current / max) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={styles.circularProgress}>
      <svg className={styles.progressSvg} width="100" height="100">
        <circle
          className={styles.progressBg}
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className={styles.progressFill}
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: color }}
        />
      </svg>
      <div className={styles.progressText}>
        <span className={styles.percent}>{Math.round(percent)}%</span>
        <span className={styles.values}>{current}/{max}</span>
      </div>
    </div>
  );
}