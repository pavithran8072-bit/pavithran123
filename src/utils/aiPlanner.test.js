import { describe, it, expect } from 'vitest';
import { 
  calculateSubjectPriority, 
  generateSchedule, 
  handleMissedSession, 
  handleEarlyCompletion, 
  handleAddAssignmentToSchedule 
} from './aiPlanner';
import { getDaysRemaining, getDateOffset } from './dateHelpers';

describe('AI Planning Engine - Unit Tests', () => {

  describe('calculateSubjectPriority()', () => {
    it('should assign higher priority score to subject with upcoming exam and low past mark', () => {
      const weakSubject = {
        id: 'sub-math',
        name: 'Mathematics',
        previousMark: 55,
        difficulty: 'High',
        examDate: getDateOffset(3)
      };

      const strongSubject = {
        id: 'sub-eng',
        name: 'English Literature',
        previousMark: 92,
        difficulty: 'Low',
        examDate: getDateOffset(20)
      };

      const weakResult = calculateSubjectPriority(weakSubject, []);
      const strongResult = calculateSubjectPriority(strongSubject, []);

      // Mathematics (Exam in 3d: 40pts + mark 55: ~16pts + High diff: 25pts = 81)
      // English (Exam in 20d: 14pts + mark 92: ~3pts + Low diff: 5pts = 22)
      expect(weakResult.score).toBeGreaterThan(strongResult.score);
      expect(weakResult.urgencyLevel).toBe('Critical');
      expect(strongResult.urgencyLevel).toBe('Low');
    });

    it('should apply bonus points when an assignment deadline is within 3 days', () => {
      const subject = {
        id: 'sub-phys',
        name: 'Physics',
        previousMark: 70,
        difficulty: 'Medium',
        examDate: getDateOffset(10)
      };

      const nearAssignment = [
        {
          id: 'asg-1',
          subjectId: 'sub-phys',
          deadline: getDateOffset(2),
          completed: false
        }
      ];

      const scoreWithoutAssignment = calculateSubjectPriority(subject, []).score;
      const scoreWithAssignment = calculateSubjectPriority(subject, nearAssignment).score;

      expect(scoreWithAssignment - scoreWithoutAssignment).toBe(15);
    });

    it('should handle missing or invalid marks gracefully without crashing', () => {
      const invalidSubject = {
        id: 'sub-edge',
        name: 'General Studies',
        previousMark: null,
        difficulty: 'Unknown',
        examDate: ''
      };

      const result = calculateSubjectPriority(invalidSubject);
      expect(result).toBeDefined();
      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThan(0);
    });
  });

  describe('generateSchedule()', () => {
    const mockProfile = {
      name: 'Alex',
      dailyHours: 4,
      preferredTime: 'Evening'
    };

    const mockSubjects = [
      {
        id: 'sub-1',
        name: 'Mathematics',
        previousMark: 55,
        difficulty: 'High',
        examDate: getDateOffset(5),
        difficultTopics: ['Integration']
      },
      {
        id: 'sub-2',
        name: 'Programming',
        previousMark: 85,
        difficulty: 'Medium',
        examDate: getDateOffset(14),
        topics: [{ name: 'OOP', completed: false }]
      }
    ];

    it('should generate a valid array of tasks with interleaved breaks', () => {
      const schedule = generateSchedule(mockProfile, mockSubjects);
      expect(Array.isArray(schedule)).toBe(true);
      expect(schedule.length).toBeGreaterThanOrEqual(4);

      // Verify that breaks are present
      const breaks = schedule.filter(t => t.isBreak);
      expect(breaks.length).toBeGreaterThanOrEqual(1);

      // Verify priority ordering: highest priority subject starts first
      expect(schedule[0].subject).toBe('Mathematics');
      expect(schedule[0].priority).toBe('High Priority');
      expect(schedule[0].duration).toBe(60);
    });

    it('should adjust start hour based on preferred study time', () => {
      const morningSchedule = generateSchedule({ ...mockProfile, preferredTime: 'Morning' }, mockSubjects);
      const eveningSchedule = generateSchedule({ ...mockProfile, preferredTime: 'Evening' }, mockSubjects);

      expect(morningSchedule[0].startTime).toContain('AM');
      expect(eveningSchedule[0].startTime).toContain('PM');
    });

    it('should return an empty array if subjects list is empty', () => {
      const emptySchedule = generateSchedule(mockProfile, []);
      expect(emptySchedule).toEqual([]);
    });
  });

  describe('Dynamic Re-planning Functions', () => {
    const mockTasks = [
      { id: 't1', subject: 'Mathematics', completed: false, duration: 60 },
      { id: 't2', subject: 'Break', isBreak: true, duration: 15 },
      { id: 't3', subject: 'Programming', completed: false, duration: 45 }
    ];

    it('handleMissedSession() should mark missed session without mutating other tasks', () => {
      const updated = handleMissedSession(mockTasks, 't1');
      const missedTask = updated.find(t => t.id === 't1');
      const unaffectedTask = updated.find(t => t.id === 't3');

      expect(missedTask.missed).toBe(true);
      expect(missedTask.notes).toContain('Rescheduled by AI');
      expect(unaffectedTask.missed).toBeUndefined();
    });

    it('handleEarlyCompletion() should mark task completed and set earlyFinished flag', () => {
      const updated = handleEarlyCompletion(mockTasks, 't3');
      const finishedTask = updated.find(t => t.id === 't3');

      expect(finishedTask.completed).toBe(true);
      expect(finishedTask.earlyFinished).toBe(true);
    });

    it('handleAddAssignmentToSchedule() should inject dedicated buffer task', () => {
      const newAsg = {
        subjectId: 'sub-2',
        subjectName: 'Python Project',
        title: 'Automation Script',
        deadline: getDateOffset(2)
      };

      const updated = handleAddAssignmentToSchedule(mockTasks, newAsg);
      expect(updated.length).toBe(mockTasks.length + 1);

      const injectedTask = updated[updated.length - 1];
      expect(injectedTask.subject).toBe('Python Project');
      expect(injectedTask.type).toBe('assignment');
      expect(injectedTask.priority).toBe('High Priority');
    });
  });

});
