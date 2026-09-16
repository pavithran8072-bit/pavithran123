import {
  initialStudentProfile,
  initialSubjects,
  initialAssignments,
  initialTodayTasks,
  initialNotifications
} from '../data/defaultData';

const KEYS = {
  PROFILE: 'ai_study_planner_profile',
  SUBJECTS: 'ai_study_planner_subjects',
  ASSIGNMENTS: 'ai_study_planner_assignments',
  TASKS: 'ai_study_planner_tasks',
  NOTIFICATIONS: 'ai_study_planner_notifications',
  THEME: 'ai_study_planner_theme'
};

export const Storage = {
  getProfile: () => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : initialStudentProfile;
    } catch {
      return initialStudentProfile;
    }
  },
  saveProfile: (profile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getSubjects: () => {
    try {
      const data = localStorage.getItem(KEYS.SUBJECTS);
      return data ? JSON.parse(data) : initialSubjects;
    } catch {
      return initialSubjects;
    }
  },
  saveSubjects: (subjects) => {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getAssignments: () => {
    try {
      const data = localStorage.getItem(KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : initialAssignments;
    } catch {
      return initialAssignments;
    }
  },
  saveAssignments: (assignments) => {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getTasks: () => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : initialTodayTasks;
    } catch {
      return initialTodayTasks;
    }
  },
  saveTasks: (tasks) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getNotifications: () => {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  },
  saveNotifications: (notifications) => {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getTheme: () => {
    return localStorage.getItem(KEYS.THEME) || 'light';
  },
  saveTheme: (theme) => {
    localStorage.setItem(KEYS.THEME, theme);
  },

  resetToDefault: () => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialStudentProfile));
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(initialSubjects));
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(initialAssignments));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(initialTodayTasks));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
};
