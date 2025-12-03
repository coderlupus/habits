import { useTheme } from '../pages/_app';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from '../styles/ThemeToggleButton.module.css';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.toggleButton}>
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
}
