import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage } from './storage';
import { initialStudentProfile, initialSubjects, initialAssignments, initialTodayTasks, initialNotifications } from '../data/defaultData';

describe('Storage Layer - Unit Tests', () => {
  let mockStore = {};

  beforeEach(() => {
    mockStore = {};
    const mockLocalStorage = {
      getItem: vi.fn((key) => mockStore[key] ?? null),
      setItem: vi.fn((key, value) => {
        mockStore[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete mockStore[key];
      }),
      clear: vi.fn(() => {
        mockStore = {};
      })
    };

    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('Student Profile Operations', () => {
    it('should return initial profile when storage is empty', () => {
      const profile = Storage.getProfile();
      expect(profile).toEqual(initialStudentProfile);
    });

    it('should save and retrieve modified student profile', () => {
      const customProfile = { ...initialStudentProfile, name: 'Taylor Swift', dailyHours: 6 };
      Storage.saveProfile(customProfile);
      const retrieved = Storage.getProfile();
      expect(retrieved.name).toBe('Taylor Swift');
      expect(retrieved.dailyHours).toBe(6);
    });

    it('should fallback gracefully to initialProfile when storage contains corrupted JSON', () => {
      mockStore['ai_study_planner_profile'] = 'CORRUPTED_JSON{{"';
      const profile = Storage.getProfile();
      expect(profile).toEqual(initialStudentProfile);
    });
  });

  describe('Subjects & Tasks Operations', () => {
    it('should save and retrieve subjects', () => {
      const updatedSubjects = [{ id: 'sub-new', name: 'Neuroscience', previousMark: 95 }];
      Storage.saveSubjects(updatedSubjects);
      expect(Storage.getSubjects()).toEqual(updatedSubjects);
    });

    it('should save and retrieve tasks', () => {
      const updatedTasks = [{ id: 'task-new', subject: 'Math', duration: 45 }];
      Storage.saveTasks(updatedTasks);
      expect(Storage.getTasks()).toEqual(updatedTasks);
    });
  });

  describe('Theme Configuration', () => {
    it('should default theme to light when unset', () => {
      expect(Storage.getTheme()).toBe('light');
    });

    it('should save and retrieve dark theme', () => {
      Storage.saveTheme('dark');
      expect(Storage.getTheme()).toBe('dark');
    });
  });

  describe('Authentication & Session Operations', () => {
    it('should return default authenticated session when storage is empty', () => {
      const session = Storage.getAuthSession();
      expect(session.isAuthenticated).toBe(true);
      expect(session.user.name).toBe(initialStudentProfile.name);
    });

    it('should save and retrieve custom auth session', () => {
      const newSession = {
        isAuthenticated: true,
        user: { name: 'Hermione Granger', email: 'hermione@hogwarts.edu' }
      };
      Storage.saveAuthSession(newSession);
      expect(Storage.getAuthSession()).toEqual(newSession);
    });

    it('should log in a user and set isAuthenticated to true', () => {
      const user = { name: 'John Doe', email: 'john@example.com' };
      const res = Storage.login(user);
      expect(res.isAuthenticated).toBe(true);
      expect(res.user.name).toBe('John Doe');
      expect(Storage.getAuthSession().isAuthenticated).toBe(true);
    });

    it('should log out a user and set isAuthenticated to false', () => {
      Storage.logout();
      const session = Storage.getAuthSession();
      expect(session.isAuthenticated).toBe(false);
      expect(session.user).toBeNull();
    });
  });

  describe('resetToDefault() Mechanism', () => {
    it('should reset all storage keys to initial defaults', () => {
      // Modify store first
      Storage.saveProfile({ name: 'Tampered Name' });
      Storage.saveSubjects([]);
      Storage.saveTasks([]);
      Storage.logout();

      // Reset
      Storage.resetToDefault();

      // Verify re-hydration
      expect(Storage.getProfile()).toEqual(initialStudentProfile);
      expect(Storage.getSubjects()).toEqual(initialSubjects);
      expect(Storage.getAssignments()).toEqual(initialAssignments);
      expect(Storage.getTasks()).toEqual(initialTodayTasks);
      expect(Storage.getNotifications()).toEqual(initialNotifications);
      expect(Storage.getAuthSession().isAuthenticated).toBe(true);
      expect(Storage.getAuthSession().user.name).toBe(initialStudentProfile.name);
    });
  });
});
