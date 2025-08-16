import React, { useState } from "react";
import styles from './AddAwardModal.module.scss';

const AddAwardModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "sport",
    target: 100,
    icon: "🏆"
  });

  const categories = [
    { value: "sport", label: "Sport", icon: "🏃‍♂️" },
    { value: "learning", label: "Learning", icon: "📚" },
    { value: "creativity", label: "Creativity", icon: "🎨" },
    { value: "health", label: "Health", icon: "💪" },
    { value: "other", label: "Other", icon: "🌟" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "target" ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.target) return;
    onSave({
      ...formData,
      target: Math.max(1, formData.target) // Minimum 1
    });
    setFormData({
      title: "",
      description: "",
      category: "sport",
      target: 100,
      icon: "🏆"
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Create New Challenge</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Example: 100 pushups"
            value={formData.title}
            onChange={handleChange}
            className={styles.textInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description (optional)</label>
          <textarea
            name="description"
            placeholder="Additional details..."
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            rows="3"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category</label>
          <div className={styles.categoryOptions}>
            {categories.map((cat) => (
              <label 
                key={cat.value} 
                className={`${styles.categoryOption} ${formData.category === cat.value ? styles.activeCategory : ''}`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span className={styles.categoryIcon}>{cat.icon}</span>
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Target Value</label>
          <div className={styles.targetInputWrapper}>
            <input
              type="number"
              name="target"
              min="1"
              value={formData.target}
              onChange={handleChange}
              className={styles.numberInput}
            />
            <span className={styles.targetUnit}>times/km/days</span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!formData.title}
          >
            Create Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAwardModal;