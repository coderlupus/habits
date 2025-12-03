import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { FaTasks, FaLightbulb } from 'react-icons/fa';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>haBITS</title>
        <meta name="description" content="A modern habit tracking application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to haBITS!
        </h1>

        <p className={styles.subtitle}>
          The simple, modern way to build habits and track your progress.
        </p>

        <div className={styles.grid}>
          <Link href="/my-tasks-and-habits" legacyBehavior>
            <a className={styles.card}>
              <FaTasks size={48} color="#222" />
              <h2>My Tasks & Habits &rarr;</h2>
              <p>View and manage your personal tasks and habits.</p>
            </a>
          </Link>

          <Link href="/recommended" legacyBehavior>
            <a className={styles.card}>
              <FaLightbulb size={48} color="#222" />
              <h2>Recommended &rarr;</h2>
              <p>Discover new habits to incorporate into your daily routine.</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
