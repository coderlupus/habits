import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Habits.module.css';
import CreateModal from '../components/CreateModal';

export default function MyTasksAndHabits({ items, addItem, toggleItem, updateItemDifficulty }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = (text, type, difficulty) => {
    addItem(text, type, difficulty);
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Tasks and Habits</title>
        <meta name="description" content="Track your habits and tasks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>My Tasks and Habits</h1>

      <div className={styles.content}>
        <div className={styles.listContainer}>
          <h2 className={styles.subtitle}>Habits</h2>
          <ul className={styles.list}>
            {items.filter(item => item.type === 'habit').map(habit => (
              <li key={habit.id} className={`${styles.item} ${habit.completed ? styles.completed : ''} ${styles[habit.difficulty]}`}>
                <span>{habit.text}</span>
                <div className={styles.itemControls}>
                  <select 
                    value={habit.difficulty} 
                    onChange={(e) => updateItemDifficulty(habit.id, e.target.value)}
                    className={styles.difficultySelector}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button onClick={() => toggleItem(habit.id)}>{habit.completed ? 'Undo' : 'Complete'}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.subtitle}>Tasks</h2>
          <ul className={styles.list}>
            {items.filter(item => item.type === 'task').map(task => (
              <li key={task.id} className={`${styles.item} ${task.completed ? styles.completed : ''} ${styles[task.difficulty]}`}>
                <span>{task.text}</span>
                <div className={styles.itemControls}>
                  <select 
                    value={task.difficulty} 
                    onChange={(e) => updateItemDifficulty(task.id, e.target.value)}
                    className={styles.difficultySelector}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button onClick={() => toggleItem(task.id)}>{task.completed ? 'Undo' : 'Complete'}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className={styles.createButton} onClick={() => setModalOpen(true)}>+</button>

      <CreateModal 
        isOpen={isModalOpen} 
        onRequestClose={() => setModalOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}
