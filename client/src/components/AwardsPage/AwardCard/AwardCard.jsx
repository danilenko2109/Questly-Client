import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './AwardCard.module.scss';
import { useState } from 'react';

export default function AwardCard({
  award,
  onUpdateProgress,
  onDelete,
  onAdd,
  isPredefined = false,
  isInProfile = false
}) {
  const [current, setCurrent] = useState(award.current || 0);
  const isCompleted = current >= (award.target || 1);

  const handleIncrement = () => {
    if (isCompleted) return;
    const newProgress = current + 1;
    setCurrent(newProgress);
    if (onUpdateProgress) onUpdateProgress(newProgress);
  };

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{award.icon || '🏆'}</span>
        <h3>{award.title}</h3>
      </div>
      
      {award.description && (
        <p className={styles.description}>{award.description}</p>
      )}
      
      {!isPredefined && (
        <>
          <ProgressBar 
            current={current} 
            max={award.target || 1} 
            color={isCompleted ? '#4cc9f0' : '#4361ee'}
          />
          <div className={styles.actions}>
            {!isCompleted && (
              <button 
                className={styles.progressButton}
                onClick={handleIncrement}
              >
                +1
              </button>
            )}
            {!isInProfile && (
              <button 
                className={styles.deleteButton}
                onClick={onDelete}
              >
                Удалить
              </button>
            )}
          </div>
        </>
      )}
      
      {isPredefined && !isInProfile && (
        <button 
          className={styles.addButton}
          onClick={onAdd}
        >
          Добавить цель
        </button>
      )}
      
      {isCompleted && (
        <div className={styles.completedBadge}>
          <span>✅ Выполнено!</span>
        </div>
      )}
    </div>
  );
}