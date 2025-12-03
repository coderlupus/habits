import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ThemeToggleButton />
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/my-tasks-and-habits">
            My Tasks and Habits
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/recommended">
            Recommended
          </Link>
        </li>
      </ul>
    </nav>
  );
}
