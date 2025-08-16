import React, { useState } from 'react';
import styles from './AwardCard.module.scss';

const AwardCard = ({ award, isPredefined, onAdd, onUpdateProgress, onDelete, onComplete, isInProfile }) => {
  const [progressInput, setProgressInput] = useState(award.current || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const progressPercentage = Math.min(100, ((award.current || 0) / award.target) * 100);
  const daysActive = award.createdAt ? Math.floor((new Date() - new Date(award.createdAt)) / (1000 * 60 * 60 * 24)) : 0;

  const handleProgressChange = (e) => {
    const value = Math.min(parseInt(e.target.value || 0), award.target);
    setProgressInput(value);
  };

  const handleSaveProgress = () => {
    onUpdateProgress?.(progressInput);
    setIsEditing(false);
    triggerAnimation();
  };

  const handleComplete = () => {
    onComplete?.();
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className={`${styles.card} ${isPredefined ? styles.predefined : ''} ${isAnimating ? styles.pulse : ''}`}>
      <div className={styles.cardInner}>
        <div className={styles.header}>
          <span className={styles.icon}>{award.icon || '🏆'}</span>
          
          {isInProfile && !isPredefined && (
            <span className={styles.customBadge}>Custom Challenge</span>
          )}
          
          {award.completed && (
            <span className={styles.completedBadge}>Completed!</span>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{award.title}</h3>
          <p className={styles.description}>{award.description}</p>
          
          <div className={styles.meta}>
            <span className={styles.category}>{award.category}</span>
            {daysActive > 0 && (
              <span className={styles.daysActive}>{daysActive} day{daysActive !== 1 ? 's' : ''}</span>
            )}
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressInfo}>
              <span>Progress</span>
              <span>{award.current || 0}/{award.target}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${award.completed ? styles.completed : ''}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className={styles.progressPercentage}>
              {progressPercentage}%
            </div>
          </div>

          {!isPredefined && !award.completed && (
            <div className={styles.actions}>
              {isEditing ? (
                <div className={styles.editMode}>
                  <input
                    type="number"
                    className={styles.progressInput}
                    value={progressInput}
                    min={0}
                    max={award.target}
                    onChange={handleProgressChange}
                  />
                  <div className={styles.editButtons}>
                    <button 
                      className={styles.buttonPrimary}
                      onClick={handleSaveProgress}
                    >
                      Save
                    </button>
                    <button 
                      className={styles.buttonSecondary}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.buttonPrimary}
                    onClick={() => setIsEditing(true)}
                  >
                    Update Progress
                  </button>
                  <button 
                    className={styles.buttonSecondary}
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                  {progressPercentage >= 90 && (
                    <button 
                      className={styles.completeButton}
                      onClick={handleComplete}
                    >
                      Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!isPredefined && award.completed && (
            <div className={styles.completedActions}>
              <div className={styles.completionCelebration}>
                🎉 Challenge completed! 🎉
              </div>
              <button 
                className={styles.buttonSecondary}
                onClick={onDelete}
              >
                Remove
              </button>
            </div>
          )}

          {isPredefined && onAdd && (
            <button 
              className={styles.addButton}
              onClick={() => onAdd(award)}
            >
              Add to My Challenges
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardCard;