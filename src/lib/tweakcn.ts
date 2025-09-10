export type ThemePreset = "light" | "dark" | "clinic";

const LS_KEY = "theme:preset";

export function getPreset(): ThemePreset {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(LS_KEY) as ThemePreset | null;
  return v ?? "light";
}

export function setPreset(preset: ThemePreset) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, preset);
}

export function applyPreset(preset: ThemePreset) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = preset;
  if (preset === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

