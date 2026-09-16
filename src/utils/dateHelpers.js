/**
 * Date and time helper utilities for AI Study Planner
 */

export function getDaysRemaining(targetDateStr) {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function getRelativeDaysText(days) {
  if (days < 0) return 'Passed';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days remaining`;
}

// Generate an ISO date string offset from today by X days (YYYY-MM-DD)
export function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Get array of 7 days for the current week starting from Monday or Sunday
export function getCurrentWeekDays() {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

// Format 24hr or time strings nicely
export function formatTimeRange(startStr, endStr) {
  return `${startStr} – ${endStr}`;
}
