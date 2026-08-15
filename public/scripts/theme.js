const STORAGE_KEY = "theme";

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored === "dark") applyTheme(true);
  else if (stored === "light") applyTheme(false);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
}

initTheme();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!getStoredTheme()) applyTheme(e.matches);
  });
