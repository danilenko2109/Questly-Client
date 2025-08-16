import { useState, useEffect } from 'react';
import { useAwards } from '../useAwards';
import AwardCard from '../AwardCard/AwardCard';
import AddAwardModal from '../AddAwardModal/AddAwardModal';
import styles from './AwardsList.module.scss';
import axios from 'axios';

export default function AwardsList() {
  const {
    predefinedAwards,
    userAwards,
    loading,
    error,
    addUserAward,
    updateProgress,
    deleteAward
  } = useAwards();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/users/me', {
        headers: { Authorization: token }
      });
      console.log('User data:', response.data); // Проверьте структуру
      if (!response.data._id) {
        throw new Error('User ID not found in response');
      }
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  fetchCurrentUser();
}, []);

 

  // Сохраняем достижения в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('userAwards', JSON.stringify(userAwards));
  }, [userAwards]);

const handleAddToServer = async (award) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authorization token found');
    if (!currentUser?._id) throw new Error('User ID not available');

    const response = await axios.post(
      `http://localhost:4000/api/awards`,
      {
        title: award.title,
        description: award.description,
        target: award.target || 1,
        current: award.current || 0,
        category: award.category || 'general',
        icon: award.icon || '🏆'
      },
      {
        headers: { 
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
      }
    );

    if (response.status === 201) {
      addUserAward(response.data);
      return response.data;
    }
    throw new Error(`Unexpected status code: ${response.status}`);

  } catch (error) {
    console.error('Failed to add award:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      config: error.config
    });
    
    let errorMessage = 'Failed to add award';
    if (error.response) {
      errorMessage = error.response.data?.error || 
                   error.response.data?.message || 
                   `Server responded with ${error.response.status}`;
    }
    
    alert(errorMessage);
    throw error;
  }
};

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Фильтрация достижений по категории
  const filteredAwards = activeCategory === 'all' 
    ? userAwards
    : userAwards.filter(award => award.category === activeCategory);

  // Фильтрация рекомендованных достижений по категории
  const filteredPredefinedAwards = activeCategory === 'all'
    ? predefinedAwards
    : predefinedAwards.filter(award => award.category === activeCategory);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Achievements</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Create your own
        </button>
      </div>

      <div className={styles.categoryFilter}>
        <button 
          className={activeCategory === 'all' ? styles.active : ''}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button 
          className={activeCategory === 'sport' ? styles.active : ''}
          onClick={() => setActiveCategory('sport')}
        >
          Sports
        </button>
        <button 
          className={activeCategory === 'learning' ? styles.active : ''}
          onClick={() => setActiveCategory('learning')}
        >
          Learning
        </button>
        <button 
          className={activeCategory === 'creativity' ? styles.active : ''}
          onClick={() => setActiveCategory('creativity')}
        >
          Creativity
        </button>
      </div>

      <div className={styles.section}>
        <h2>My Goals ({filteredAwards.length})</h2>
        {filteredAwards.length > 0 ? (
          <div className={styles.awardsGrid}>
            {filteredAwards.map(award => (
              <AwardCard
                key={award.id}
                award={award}
                onUpdateProgress={updateProgress}
                onDelete={deleteAward}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No achievements in this category</p>
        )}
      </div>

      <div className={styles.section}>
        <h2>Recommended ({filteredPredefinedAwards.length})</h2>
        {filteredPredefinedAwards.length > 0 ? (
          <div className={styles.awardsGrid}>
            {filteredPredefinedAwards.map(award => (
              <AwardCard
                key={award.id}
                award={award}
                onAdd={() => handleAddToServer(award)}
                isPredefined
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No recommended achievements in this category</p>
        )}
      </div>

      <AddAwardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newAward) => {
          addUserAward(newAward);
          handleAddToServer(newAward);
        }}
      />
    </div>
  );
}