import { useState, useEffect } from 'react';
import AwardCard from '../../components/AwardCard';
import AddAwardModal from '../../components/AddAwardModal';
import styles from './ChallengesPage.module.scss';

export default function ChallengesPage() {
  const [user, setUser] = useState(null);
  const [userChallenges, setUserChallenges] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-challenges');

  useEffect(() => {
    const mockUser = { 
      id: 'user1', 
      name: 'Demo User',
      streak: 7,
      level: 3,
      points: 450
    };
    setUser(mockUser);
  }, []);

  useEffect(() => {
    const mockUserChallenges = [
      {
        id: '1',
        title: '100 Pushups',
        description: 'Complete 100 pushups',
        target: 100,
        current: 20,
        icon: '💪',
        category: 'fitness',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completed: false
      },
      {
        id: '2',
        title: 'Run 10km',
        description: 'Run a total of 10 kilometers',
        target: 10,
        current: 3.5,
        icon: '🏃‍♂️',
        category: 'running',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completed: false
      }
    ];
    setUserChallenges(mockUserChallenges);
  }, []);

  useEffect(() => {
    const mockRecommended = [
      {
        id: 'r1',
        title: '30-Day Yoga Challenge',
        description: 'Complete 30 days of yoga practice',
        target: 30,
        icon: '🧘‍♀️',
        category: 'fitness',
        popularity: 85
      },
      {
        id: 'r2',
        title: 'Learn a New Language',
        description: 'Study a new language for 30 minutes daily',
        target: 30,
        icon: '🗣️',
        category: 'learning',
        popularity: 78
      }
    ];
    setRecommendedChallenges(mockRecommended);
    setLoading(false);
  }, []);

  const updateProgress = (id, newProgress) => {
    setUserChallenges(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, current: newProgress };
          if (newProgress >= c.target) updated.completed = true;
          return updated;
        }
        return c;
      })
    );
  };

  const deleteChallenge = (id) => {
    setUserChallenges(prev => prev.filter(c => c.id !== id));
  };

  const addChallenge = (challenge) => {
    const newChallenge = { 
      ...challenge, 
      id: Date.now().toString(), 
      current: 0,
      createdAt: new Date(),
      completed: false
    };
    setUserChallenges(prev => [...prev, newChallenge]);
  };

  const completeChallenge = (id) => {
    setUserChallenges(prev =>
      prev.map(c => 
        c.id === id ? { ...c, completed: true, current: c.target } : c
      )
    );
  };

  const calculateCompletion = () => {
    const completed = userChallenges.filter(c => c.completed).length;
    return userChallenges.length > 0 
      ? Math.round((completed / userChallenges.length) * 100)
      : 0;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Challenge Tracker</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{userChallenges.length}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {userChallenges.filter(c => c.completed).length}
            </span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{calculateCompletion()}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'my-challenges' ? styles.active : ''}`}
          onClick={() => setActiveTab('my-challenges')}
        >
          My Challenges
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'recommended' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
      </div>

      <button 
        className={styles.createButton}
        onClick={() => setIsModalOpen(true)}
      >
        + Create Custom Challenge
      </button>

      {activeTab === 'my-challenges' && (
        <section className={styles.section}>
          {userChallenges.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No active challenges yet</p>
              <button 
                className={styles.ctaButton}
                onClick={() => setActiveTab('recommended')}
              >
                Browse Recommended Challenges
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {userChallenges.map((challenge) => (
                <AwardCard
                  key={challenge.id}
                  award={challenge}
                  onUpdateProgress={(newProgress) => updateProgress(challenge.id, newProgress)}
                  onDelete={() => deleteChallenge(challenge.id)}
                  onComplete={() => completeChallenge(challenge.id)}
                  isInProfile
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'recommended' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular Challenges</h2>
          <div className={styles.grid}>
            {recommendedChallenges.map((challenge) => (
              <AwardCard
                key={challenge.id}
                award={challenge}
                isPredefined
                onAdd={() => addChallenge(challenge)}
              />
            ))}
          </div>
        </section>
      )}

      <AddAwardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newChallenge) => {
          const challengeWithId = { 
            ...newChallenge, 
            id: Date.now().toString(), 
            current: 0,
            createdAt: new Date(),
            completed: false
          };
          setUserChallenges(prev => [...prev, challengeWithId]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}