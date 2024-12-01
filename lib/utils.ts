export function greet() {
  // Get the current hour
  const hour = new Date().getHours();

  // Determine the appropriate greeting
  const message =
    4 <= hour && hour < 8
      ? "Hello, Early bird  🐦"
      : 8 <= hour && hour < 12
      ? "Morning, Sunshine ☀️"
      : 12 <= hour && hour < 16
      ? "Afternoon adventurer 🌞"
      : 16 <= hour && hour < 18
      ? "Evening, Sunset 🌤️"
      : 18 <= hour && hour < 19
      ? "Tea break ☕!"
      : 19 <= hour && hour < 22
      ? "Ready to unwind ✨"
      : "Hey, night owl 🌕";

  return message;
}
