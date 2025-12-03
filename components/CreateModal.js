import { useState } from 'react';
import styles from '../styles/CreateModal.module.css';

export default function CreateModal({ isOpen, onRequestClose, onSave }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('task');
  const [difficulty, setDifficulty] = useState('easy');

  const handleSave = () => {
    if (text.trim()) {
      onSave(text, type, difficulty);
      setText('');
      setType('task');
      setDifficulty('easy');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Create New</h2>
        <input
          type="text"
          placeholder="Enter title..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className={styles.select}>
          <option value="task">Task</option>
          <option value="habit">Habit</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={styles.select}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <div className={styles.buttonContainer}>
          <button onClick={onRequestClose} className={styles.cancelButton}>Cancel</button>
          <button onClick={handleSave} className={styles.saveButton}>Save</button>
        </div>
      </div>
    </div>
  );
}
