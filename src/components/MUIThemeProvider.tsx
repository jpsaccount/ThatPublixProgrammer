import useThemeDetector from "@/customHooks/useThemeDetector";
import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";

export default function MUIThemeProvider({ children }) {
  const darkMode = useThemeDetector();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {},
    components: {},
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
