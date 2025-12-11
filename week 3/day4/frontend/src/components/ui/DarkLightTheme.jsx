// src/components/DarkLightToggle.jsx
import { Switch, FormControlLabel } from "@mui/material";
import { useThemeStore } from "../../stores/themeStore";

export default function DarkLightToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme} // pass function reference, not called
          color="warning"
        />
      }
      
    />
  );
}
