import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from "use-local-storage";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}  
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
