import { useState, useEffect } from "react";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved preference or default to dark mode
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference, but default to dark if unavailable
      try {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(systemPrefersDark);
      } catch {
        // If system preference check fails, stay with dark mode default
        setDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save preference
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
} 