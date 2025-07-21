import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved preference or default to system preference
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = saved ? JSON.parse(saved) : prefersDark;
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative p-3 rounded-xl transition-all duration-500 transform hover:scale-110
        ${isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-500 transform
            ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `} 
        />
        <Moon 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-500 transform
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `} 
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;
