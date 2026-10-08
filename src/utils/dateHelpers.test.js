import { describe, it, expect } from 'vitest';
import { 
  getDaysRemaining, 
  formatDate, 
  formatShortDate, 
  getRelativeDaysText, 
  getDateOffset, 
  getCurrentWeekDays, 
  formatTimeRange 
} from './dateHelpers';

describe('Date & Time Helper Utilities - Unit Tests', () => {

  describe('getDaysRemaining()', () => {
    it('should return 0 for empty or undefined target dates', () => {
      expect(getDaysRemaining('')).toBe(0);
      expect(getDaysRemaining(null)).toBe(0);
      expect(getDaysRemaining(undefined)).toBe(0);
    });

    it('should calculate remaining days correctly for future dates', () => {
      const fiveDaysOut = getDateOffset(5);
      expect(getDaysRemaining(fiveDaysOut)).toBe(5);

      const tenDaysOut = getDateOffset(10);
      expect(getDaysRemaining(tenDaysOut)).toBe(10);
    });

    it('should return 0 for today', () => {
      const today = getDateOffset(0);
      expect(getDaysRemaining(today)).toBe(0);
    });

    it('should return negative values for past dates', () => {
      const threeDaysAgo = getDateOffset(-3);
      expect(getDaysRemaining(threeDaysAgo)).toBe(-3);
    });
  });

  describe('getRelativeDaysText()', () => {
    it('should format past days as "Passed"', () => {
      expect(getRelativeDaysText(-1)).toBe('Passed');
      expect(getRelativeDaysText(-5)).toBe('Passed');
    });

    it('should format 0 days as "Today"', () => {
      expect(getRelativeDaysText(0)).toBe('Today');
    });

    it('should format 1 day as "Tomorrow"', () => {
      expect(getRelativeDaysText(1)).toBe('Tomorrow');
    });

    it('should format multi-day values as "X days remaining"', () => {
      expect(getRelativeDaysText(7)).toBe('7 days remaining');
      expect(getRelativeDaysText(30)).toBe('30 days remaining');
    });
  });

  describe('getDateOffset()', () => {
    it('should return an ISO formatted date string (YYYY-MM-DD)', () => {
      const offsetDate = getDateOffset(3);
      expect(offsetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getCurrentWeekDays()', () => {
    it('should return an array of 7 consecutive Date objects', () => {
      const week = getCurrentWeekDays();
      expect(Array.isArray(week)).toBe(true);
      expect(week.length).toBe(7);

      for (let i = 0; i < 6; i++) {
        const diff = (week[i + 1].getTime() - week[i].getTime()) / (1000 * 60 * 60 * 24);
        expect(Math.round(diff)).toBe(1);
      }
    });
  });

  describe('formatTimeRange()', () => {
    it('should format time ranges with an en-dash separator', () => {
      expect(formatTimeRange('6:00 PM', '7:00 PM')).toBe('6:00 PM – 7:00 PM');
      expect(formatTimeRange('09:00 AM', '10:30 AM')).toBe('09:00 AM – 10:30 AM');
    });
  });

  describe('formatDate() and formatShortDate()', () => {
    it('should return empty string for falsy dates in formatDate', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
    });

    it('should format valid date strings into localized month, day, year', () => {
      const formatted = formatDate('2026-10-15');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('15');
    });
  });

});
