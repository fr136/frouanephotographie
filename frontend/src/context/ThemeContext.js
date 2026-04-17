import React, { createContext, useContext, useState, useLayoutEffect } from 'react';

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

const isDarkHour = () => {
  const h = new Date().getHours();
  return h >= 20 || h < 7;
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme-preference');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch {}
  return isDarkHour();
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // useLayoutEffect to apply before paint — avoids flash
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem('theme-preference', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
