import { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme, toggleTheme } from '../theme/theme';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const onToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center justify-center p-2 rounded-full border border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FiMoon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
}
