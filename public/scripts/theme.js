// Apply theme based on system preference
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
}

// Apply initial theme
applyTheme(darkModeQuery.matches);

// Listen for system preference changes
darkModeQuery.addEventListener("change", (e) => {
  applyTheme(e.matches);
});
