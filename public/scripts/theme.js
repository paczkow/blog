const theme = localStorage.getItem("theme");

if (
  theme === "dark" ||
  (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  console.log("dark");
  document.documentElement.classList.add("dark");
}
