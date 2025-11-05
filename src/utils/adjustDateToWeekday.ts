export function adjustDateToWeekday(date: Date): Date {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

  if (dayOfWeek === 6) {
    // Saturday → add 2 days
    date.setDate(date.getDate() + 2);
  } else if (dayOfWeek === 0) {
    // Sunday → add 1 day
    date.setDate(date.getDate() + 1);
  }

  return date;
}
