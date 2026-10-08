/**
 * @file storage.js
 * @description LocalStorage Abstraction & Fault-Tolerant Persistence Layer.
 * 
 * Provides an atomic, resilient key-value store for application state:
 * - Student Profile & Learning Preferences
 * - Enrolled Subjects & Syllabi
 * - Upcoming Deadlines & Assignments
 * - Active Daily Schedule Tasks
 * - Notification Feed
 * - Theme Configuration (Dark / Light Mode)
 * 
 * Resilience Features:
 * - Graceful fallback to pre-loaded defaults if storage is empty or unreachable.
 * - JSON parse guardrails: corrupted or malformed payloads in localStorage return default entities without throwing unhandled exceptions.
 * - Atomic resetToDefault() method for ErrorBoundary-driven state recovery.
 */

import {
  initialStudentProfile,
  initialSubjects,
  initialAssignments,
  initialTodayTasks,
  initialNotifications
} from '../data/defaultData';

/**
 * Storage key constants with dedicated application namespace prefixes.
 * Prevents key collision with other local web applications running on the same domain/port.
 * @readonly
 * @enum {string}
 */
const KEYS = {
  PROFILE: 'ai_study_planner_profile',
  SUBJECTS: 'ai_study_planner_subjects',
  ASSIGNMENTS: 'ai_study_planner_assignments',
  TASKS: 'ai_study_planner_tasks',
  NOTIFICATIONS: 'ai_study_planner_notifications',
  THEME: 'ai_study_planner_theme'
};

/**
 * Client-side persistence controller for AI Study Planner.
 */
export const Storage = {
  /**
   * Retrieves the current student profile from storage.
   * If parsing fails or the record is absent, returns the default baseline profile.
   * 
   * @returns {import('../data/defaultData').StudentProfile} Active student profile.
   */
  getProfile: () => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : initialStudentProfile;
    } catch (err) {
      console.warn('[Storage] Failed to read student profile. Defaulting to baseline.', err);
      return initialStudentProfile;
    }
  },

  /**
   * Persists updated student profile entity to storage.
   * 
   * @param {Object} profile - Updated student profile entity.
   */
  saveProfile: (profile) => {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('[Storage] Error persisting student profile:', err);
    }
  },

  /**
   * Retrieves enrolled curriculum subjects from storage.
   * Handles JSON deserialization safely and returns default subjects array upon error.
   * 
   * @returns {Array<Object>} List of student subjects with syllabus metadata.
   */
  getSubjects: () => {
    try {
      const data = localStorage.getItem(KEYS.SUBJECTS);
      return data ? JSON.parse(data) : initialSubjects;
    } catch (err) {
      console.warn('[Storage] Failed to read subjects. Defaulting to baseline.', err);
      return initialSubjects;
    }
  },

  /**
   * Persists array of enrolled subjects to storage.
   * 
   * @param {Array<Object>} subjects - Updated subjects list.
   */
  saveSubjects: (subjects) => {
    try {
      localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (err) {
      console.error('[Storage] Error persisting subjects:', err);
    }
  },

  /**
   * Retrieves pending assignments and deadlines from storage.
   * 
   * @returns {Array<Object>} List of assignments with deadlines and completion flags.
   */
  getAssignments: () => {
    try {
      const data = localStorage.getItem(KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : initialAssignments;
    } catch (err) {
      console.warn('[Storage] Failed to read assignments. Defaulting to baseline.', err);
      return initialAssignments;
    }
  },

  /**
   * Persists updated assignments list to storage.
   * 
   * @param {Array<Object>} assignments - List of assignments to persist.
   */
  saveAssignments: (assignments) => {
    try {
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (err) {
      console.error('[Storage] Error persisting assignments:', err);
    }
  },

  /**
   * Retrieves active scheduled tasks (study blocks, revision sessions, breaks).
   * 
   * @returns {Array<Object>} Ordered timetable tasks.
   */
  getTasks: () => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : initialTodayTasks;
    } catch (err) {
      console.warn('[Storage] Failed to read tasks. Defaulting to baseline.', err);
      return initialTodayTasks;
    }
  },

  /**
   * Persists the active task schedule to storage.
   * 
   * @param {Array<Object>} tasks - Updated tasks array.
   */
  saveTasks: (tasks) => {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.error('[Storage] Error persisting tasks:', err);
    }
  },

  /**
   * Retrieves real-time student notifications feed.
   * 
   * @returns {Array<Object>} List of notification items.
   */
  getNotifications: () => {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : initialNotifications;
    } catch (err) {
      console.warn('[Storage] Failed to read notifications. Defaulting to baseline.', err);
      return initialNotifications;
    }
  },

  /**
   * Persists notifications list to storage.
   * 
   * @param {Array<Object>} notifications - Array of notifications to save.
   */
  saveNotifications: (notifications) => {
    try {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (err) {
      console.error('[Storage] Error persisting notifications:', err);
    }
  },

  /**
   * Retrieves current visual theme preference ('light' | 'dark').
   * Defaults to 'light' if not configured.
   * 
   * @returns {'light'|'dark'} Active visual theme name.
   */
  getTheme: () => {
    try {
      return localStorage.getItem(KEYS.THEME) || 'light';
    } catch {
      return 'light';
    }
  },

  /**
   * Persists selected visual theme mode.
   * 
   * @param {'light'|'dark'} theme - Theme identifier.
   */
  saveTheme: (theme) => {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (err) {
      console.error('[Storage] Error persisting theme:', err);
    }
  },

  /**
   * Hard resets application state back to pristine demo data.
   * Cleanses corrupted or incompatible schemas during emergency recovery from ErrorBoundary.
   * 
   * Operates synchronously across all storage keys.
   */
  resetToDefault: () => {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialStudentProfile));
      localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(initialSubjects));
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(initialAssignments));
      localStorage.setItem(KEYS.TASKS, JSON.stringify(initialTodayTasks));
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      console.info('[Storage] Successfully sanitized local storage and hydrated default baseline.');
    } catch (err) {
      console.error('[Storage] Failed to execute atomic resetToDefault:', err);
    }
  }
};
