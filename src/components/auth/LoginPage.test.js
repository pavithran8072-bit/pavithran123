import { describe, it, expect, vi, beforeEach } from 'vitest';
import { demoAccounts } from '../../data/defaultData';
import { Storage } from '../../utils/storage';

describe('Auth & LoginPage Core Logic - Unit Tests', () => {
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

  it('should supply valid predefined student demo accounts', () => {
    expect(demoAccounts.length).toBeGreaterThanOrEqual(2);

    demoAccounts.forEach(account => {
      expect(account.id).toBeDefined();
      expect(account.name).toBeTruthy();
      expect(account.email).toContain('@');
      expect(account.dailyHours).toBeGreaterThan(0);
      expect(account.role).toBeTruthy();
    });
  });

  it('should find matching demo student Alex Rivera', () => {
    const alex = demoAccounts.find(a => a.name.includes('Alex Rivera'));
    expect(alex).toBeDefined();
    expect(alex.email).toBe('alex.rivera@university.edu');
    expect(alex.dailyHours).toBe(4);
  });

  it('should find matching demo student Maya Patel', () => {
    const maya = demoAccounts.find(a => a.name.includes('Maya Patel'));
    expect(maya).toBeDefined();
    expect(maya.email).toBe('maya.patel@medschool.edu');
    expect(maya.dailyHours).toBe(5);
  });

  it('should accurately authenticate demo student through Storage.login()', () => {
    const alex = demoAccounts[0];
    const session = Storage.login({
      id: alex.id,
      name: alex.name,
      email: alex.email,
      role: alex.role,
      dailyHours: alex.dailyHours
    });

    expect(session.isAuthenticated).toBe(true);
    expect(session.user.name).toBe(alex.name);
    expect(session.user.email).toBe(alex.email);
  });

  it('should properly log out and clear active session', () => {
    Storage.logout();
    const session = Storage.getAuthSession();
    expect(session.isAuthenticated).toBe(false);
    expect(session.user).toBeNull();
  });

  it('should support dynamic registration of new student accounts', () => {
    const newStudent = {
      id: 'user-new-99',
      name: 'Sarah Connor',
      email: 'sarah@mit.edu',
      role: 'Junior Undergrad',
      academicGoal: 'Ace Robotics & AI Exams',
      dailyHours: 5,
      preferredTime: 'Morning'
    };

    const session = Storage.login(newStudent);
    expect(session.isAuthenticated).toBe(true);
    expect(session.user.name).toBe('Sarah Connor');
    expect(session.user.email).toBe('sarah@mit.edu');
    expect(session.user.dailyHours).toBe(5);
  });
});

