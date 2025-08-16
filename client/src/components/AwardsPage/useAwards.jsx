import { useState, useEffect } from 'react';

export function useAwards() {
  const [awardsData, setAwardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAwards, setUserAwards] = useState([]);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/awards');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Expected JSON response');
        }

        const data = await response.json();
        setAwardsData(data[0]); // Берем первый элемент массива
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Загрузка пользовательских достижений из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userAwards');
    if (saved) setUserAwards(JSON.parse(saved));
  }, []);

  // Сохранение пользовательских достижений
  useEffect(() => {
    localStorage.setItem('userAwards', JSON.stringify(userAwards));
  }, [userAwards]);

  // Объединение всех категорий достижений
  const getAllPredefinedAwards = () => {
    if (!awardsData) return [];
    return [
      ...(awardsData.sport || []),
      ...(awardsData.learning || []),
      ...(awardsData.creativity || [])
    ];
  };

  // Добавление пользовательского достижения
  const addUserAward = (newAward) => {
    const updated = [...userAwards, {
      ...newAward,
      id: `user-${Date.now()}`,
      current: 0,
      date: new Date().toISOString()
    }];
    setUserAwards(updated);
  };

  // Обновление прогресса
  const updateProgress = (id, newProgress) => {
    setUserAwards(userAwards.map(award => 
      award.id === id ? { ...award, current: newProgress } : award
    ));
  };

  // Удаление достижения
  const deleteAward = (id) => {
    setUserAwards(userAwards.filter(award => award.id !== id));
  };

  return {
    predefinedAwards: getAllPredefinedAwards(),
    userAwards,
    loading,
    error,
    addUserAward,
    updateProgress,
    deleteAward
  };
}