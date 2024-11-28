export const formatDateTime = (
  date: Date,
  timeZone: string = "Asia/Kolkata"
) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(date));
};

export const formatISTDateTime = (date: Date) => {
  const utcDate = new Date(date);

  // Add 5 hours and 30 minutes to the UTC date
  const istOffset = 5 * 60 + 30; // IST is UTC+5:30 in minutes
  const istDate = new Date(utcDate.getTime() + istOffset * 60 * 1000);

  // Format the IST date
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(istDate);
};
