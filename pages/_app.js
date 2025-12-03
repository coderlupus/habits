import { useState, useEffect, createContext, useContext } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import '../styles/globals.css';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function MyApp({ Component, pageProps }) {
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: '', show: false, isError: false });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addItem = (text, type, difficulty = 'easy') => {
    if (items.find(item => item.text === text && item.type === type)) {
      setNotification({ message: 'This item is already in your list', show: true, isError: true });
      return;
    }

    const newItem = { id: Date.now().toString(), text, type, difficulty, completed: false };
    setItems([...items, newItem]);
    setNotification({ message: 'Item added successfully', show: true, isError: false });
  };

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateItemDifficulty = (id, newDifficulty) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, difficulty: newDifficulty } : item
    ));
  };

  const clearNotification = () => {
    setNotification({ message: '', show: false, isError: false });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>
        <Navbar />
        <Notification
          message={notification.message}
          show={notification.show}
          isError={notification.isError}
          onClear={clearNotification}
        />
        <Component
          {...pageProps}
          items={items}
          addItem={addItem}
          toggleItem={toggleItem}
          updateItemDifficulty={updateItemDifficulty}
        />
      </div>
    </ThemeContext.Provider>
  );
}

export default MyApp;
