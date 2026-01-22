import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ onLogin, onSignup, theme, toggleTheme }: HeaderProps) {
  const [activeLink, setActiveLink] = useState("");

  const scrollToSection = (id: string) => {
    setActiveLink(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <img
              src="/assets/logo.png"
              alt="THE PASS Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              THE PASS
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {["about", "features", "contact"].map((item) => (
                <li key={item}>
                  <motion.button
                    onClick={() => scrollToSection(item)}
                    className={`capitalize font-medium relative transition-colors ${
                      activeLink === item
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Login & Signup Buttons + Theme Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-6 py-3 rounded-full font-semibold border-2 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignup}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg text-white hover:shadow-xl transition-shadow"
            >
              Sign Up
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="bg-gray-800 dark:bg-gray-200 p-3 rounded-full shadow-lg"
              transition={{ duration: 0.3 }}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-yellow-300" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Separator Line */}
      <div className="fixed top-[76px] left-0 right-0 z-40 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
    </>
  );
}
