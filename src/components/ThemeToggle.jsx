import { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme, toggleTheme } from '../theme/theme';

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
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-indigo-400"></span>
      <span className="text-sm font-medium capitalize">{theme} mode</span>
    </button>
  );
}
