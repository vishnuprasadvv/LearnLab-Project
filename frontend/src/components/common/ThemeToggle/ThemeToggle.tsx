import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Set theme on initial load based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Fallback to system preference
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle("dark", prefersDarkMode);
    }
  }, []);

  // Toggle the dark mode and save it to localStorage
  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-2 py-2 hover:text-blue-400 border dark:hover:text-blue-400 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
    >
      {darkMode ? (
        <MdOutlineLightMode  size={20}/>
      ) : (
        <MdOutlineDarkMode size={20}/>
      )}
    </button>
  );
}
