"use client";

import Moon from "@gravity-ui/icons/Moon";
import Sun from "@gravity-ui/icons/Sun";
import { Switch } from "@heroui/react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Switch
      aria-label="Dark mode"
      size="lg"
      isSelected={resolvedTheme === "dark"}
      onChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
    >
      {({ isSelected }) => (
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb>
              <Switch.Icon>
                {isSelected ? (
                  <Sun className="size-3 text-inherit opacity-100" />
                ) : (
                  <Moon className="size-3 text-inherit opacity-70" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
}
