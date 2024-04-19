import { useState, useEffect, useLayoutEffect } from "react";

export default function useThemeDetector() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    if (mq.matches) {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }

    // This callback will fire if the perferred color scheme changes without a reload
    mq.addEventListener("change", (evt) => {
      setIsDarkTheme(evt.matches);
      console.log(evt.matches ? "dark mode request" : "light mode requested");
    });
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  return isDarkTheme;
}
