export function greet() {
  // Get the current hour
  const hour = new Date().getHours();

  // Determine the appropriate greeting
  const message =
    hour < 8
      ? "Hello, Early bird  🐦"
      : hour < 12
      ? "Morning, Sunshine ☀️"
      : hour < 16
      ? "Afternoon adventurer 🌞"
      : hour < 18
      ? "Evening, Sunset 🌤️"
      : hour < 19
      ? "Tea break ☕!"
      : hour < 22
      ? "Ready to unwind ✨"
      : "Hey, night owl 🌕";

  return message;
}
