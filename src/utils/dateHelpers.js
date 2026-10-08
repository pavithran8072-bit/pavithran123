/**
 * @file dateHelpers.js
 * @description Date and Time Arithmetic Utilities for Adaptive Academic Scheduling.
 * 
 * Provides deterministic time calculations for:
 * - Exam Proximity Countdown (Days remaining until exam date)
 * - Human-Friendly Relative Day Labels ("Today", "Tomorrow", "Passed")
 * - 7-Day Continuous Academic Week Generators
 * - Iso Date String Offsetting for Dynamic Simulation
 * - Formatted Time Range Display (12-hour intervals)
 */

/**
 * Computes the integer number of calendar days remaining between current date and a target date.
 * Normalizes both timestamps to midnight (00:00:00.000) to ensure accurate day intervals
 * regardless of daylight saving time or execution hour.
 * 
 * Edge cases:
 * - Returns 0 if targetDateStr is empty, null, or undefined.
 * - Returns negative integers for past dates (indicating overdue deadlines or elapsed exams).
 * - Returns 0 for target dates falling on the current calendar day.
 * 
 * @param {string} targetDateStr - Target date in ISO 8601 or parseable format (e.g., 'YYYY-MM-DD').
 * @returns {number} Integer day difference (positive = future, 0 = today, negative = past).
 */
export function getDaysRemaining(targetDateStr) {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const today = new Date();
  
  // Normalize both dates to midnight local time to avoid fractional day inaccuracies
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats an ISO date string into standard US Long Date format.
 * Example: '2026-10-15' -> 'Oct 15, 2026'
 * 
 * @param {string} dateStr - Target date string
 * @returns {string} Formatted localized string or empty string if input is falsy
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats a Date object or date string into short month/day format.
 * Example: Date object -> 'Oct 15'
 * 
 * @param {Date|string} date - Date object or parseable date string
 * @returns {string} Formatted month and day
 */
export function formatShortDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Translates day differential integer into contextual student-friendly labels.
 * Used across dashboard countdown chips, task cards, and alert drawers.
 * 
 * @param {number} days - Integer day count (from getDaysRemaining)
 * @returns {string} Contextual status label ('Passed', 'Today', 'Tomorrow', or 'N days remaining')
 */
export function getRelativeDaysText(days) {
  if (days < 0) return 'Passed';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days remaining`;
}

/**
 * Generates an ISO 8601 formatted date string offset from today by X days (YYYY-MM-DD).
 * Useful for seeding dynamic test fixtures and testing upcoming deadline simulations.
 * 
 * @param {number} days - Number of days to offset from today (+/- integer)
 * @returns {string} ISO Date string formatted as 'YYYY-MM-DD'
 */
export function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Generates an array of 7 consecutive Date objects representing the current calendar week,
 * standardized to begin on Monday.
 * 
 * Algorithm:
 * 1. Computes current day of week (0 = Sunday, 1 = Monday, ... 6 = Saturday).
 * 2. Calculates distance to previous Monday.
 * 3. Sequentially populates 7 date objects from Monday through Sunday.
 * 
 * @returns {Date[]} Array of 7 Date instances for the active week.
 */
export function getCurrentWeekDays() {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
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

/**
 * Formats start and end times into a standardized display range using an en-dash.
 * Example: ('6:00 PM', '7:00 PM') -> '6:00 PM – 7:00 PM'
 * 
 * @param {string} startStr - Formatted start time string
 * @param {string} endStr - Formatted end time string
 * @returns {string} Uniform time range string
 */
export function formatTimeRange(startStr, endStr) {
  return `${startStr} – ${endStr}`;
}
