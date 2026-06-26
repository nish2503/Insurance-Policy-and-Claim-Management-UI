import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function useTheme() {
  const context = useContext(ThemeContext);

  // Safety check to alert you if the hook is called outside the Provider element block
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider wrapper!");
  }

  return context; // 👈 Returns the context data object cleanly to JavaScript
}

export default useTheme;
