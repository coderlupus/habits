import { useState, useEffect } from 'react';
import styles from '../styles/Notification.module.css';

export default function Notification({ message, show, isError, onClear }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClear) {
          onClear();
        }
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClear]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.notification} ${isError ? styles.error : ''}`}>
      {message}
    </div>
  );
}
