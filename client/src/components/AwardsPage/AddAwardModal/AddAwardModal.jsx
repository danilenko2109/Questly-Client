import { useState } from 'react';
import styles from './AddAwardModal.module.scss';

const categories = [
  { value: 'sport', label: 'Спорт', icon: '🏃‍♂️' },
  { value: 'learning', label: 'Обучение', icon: '📚' },
  { value: 'creativity', label: 'Творчество', icon: '🎨' },
  { value: 'other', label: 'Другое', icon: '🌟' }
];

export default function AddAwardModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState(1);
  const [category, setCategory] = useState('sport');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      target: Number(target),
      category,
      icon: categories.find(c => c.value === category)?.icon || '🏆'
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTarget(1);
    setCategory('sport');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Новое достижение</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Цель</label>
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.cancelButton}>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}