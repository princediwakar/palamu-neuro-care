"use client";

import { useTheme } from "next-themes";
import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering the icon
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null to avoid rendering the wrong icon on the server
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-3 rounded-md hover:bg-primary/10 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <SunMedium className="h-5 w-5" />
      )}
    </button>
  );
}