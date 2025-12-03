import Head from 'next/head';
import styles from '../styles/Habits.module.css';

export default function Recommended({ recommendedHabits, addItem }) {

  const handleAddHabit = (habitText) => {
    if (addItem) {
      addItem(habitText, 'habit', 'easy');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Recommended Habits</title>
        <meta name="description" content="Discover new habits to build" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Recommended Habits</h1>

      <div className={styles.content}>
        <div className={styles.listContainer}>
          <ul className={styles.list}>
            {recommendedHabits.map(habit => (
              <li key={habit.id} className={styles.item}>
                <span>{habit.text}</span>
                <button onClick={() => handleAddHabit(habit.text)}>+</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // In a real application, you would fetch this data from an API or database.
  const recommendedHabits = [
    { id: 1, text: 'Read for 15 minutes every day' },
    { id: 2, text: 'Go for a 30-minute walk' },
    { id: 3, text: 'Drink 8 glasses of water' },
    { id: 4, text: 'Practice mindfulness for 10 minutes' },
    { id: 5, text: 'Write down three things you are grateful for' },
  ];

  return {
    props: {
      recommendedHabits,
    },
  };
}
