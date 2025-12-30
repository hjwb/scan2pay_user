import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        id="dark-mode"
        checked={theme == "dark"}
        className="cursor-pointer"
      />
      <Label htmlFor="dark-mode">Dark Mode</Label>
    </div>
    // <button
    //   onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    //   style={{
    //     padding: "8px 12px",
    //     borderRadius: "6px",
    //     border: "1px solid #ccc",
    //     cursor: "pointer",
    //   }}
    // >
    //   {theme === "light" ? "Dark Mode" : "Light Mode"}
    // </button>
  );
}
