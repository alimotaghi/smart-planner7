
export function getStartOfWeek(offset: number = 0): Date {
  const today = new Date();
  // In JS, 0 is Sunday. Let's adjust for a Persian week starting Saturday (6 in JS)
  // Saturday is 6. If today is Sunday (0), we go back 1 day.
  // If today is Saturday (6), we go back 0.
  const currentDay = today.getDay();
  const daysToSaturday = (currentDay + 1) % 7;
  
  const start = new Date(today);
  start.setDate(today.getDate() - daysToSaturday + (offset * 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function formatDateFA(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function getWeekRangeKey(offset: number): string {
  const start = getStartOfWeek(offset);
  return `week_${start.getFullYear()}_${start.getMonth() + 1}_${start.getDate()}`;
}
