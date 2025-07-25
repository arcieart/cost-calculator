import { useState, useEffect } from "react";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference or default to system preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
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