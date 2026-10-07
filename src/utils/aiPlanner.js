import { getDaysRemaining } from './dateHelpers';

/**
 * @typedef {Object} Topic
 * @property {string} id - Unique topic identifier
 * @property {string} name - Name/title of the topic
 * @property {boolean} completed - Whether topic is completed
 * @property {'High'|'Medium'|'Low'} [difficulty] - Topic difficulty rating
 */

/**
 * @typedef {Object} Subject
 * @property {string} id - Unique subject identifier
 * @property {string} name - Subject title (e.g., 'Mathematics')
 * @property {number} previousMark - Past academic percentage (0 - 100)
 * @property {'High'|'Medium'|'Low'} difficulty - Inherent subject difficulty
 * @property {string} examDate - ISO format target exam date (YYYY-MM-DD)
 * @property {number} [progress] - Curriculum completion percentage (0 - 100)
 * @property {Topic[]} [topics] - Array of curriculum topics
 * @property {string[]} [difficultTopics] - Identified troublesome topics
 */

/**
 * @typedef {Object} Assignment
 * @property {string} id - Assignment unique ID
 * @property {string} subjectId - Related subject ID
 * @property {string} subjectName - Name of the subject
 * @property {string} title - Assignment title or task name
 * @property {string} deadline - Due date (YYYY-MM-DD)
 * @property {boolean} completed - Completion status
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Task identifier
 * @property {string} [subjectId] - Optional associated subject ID
 * @property {string} subject - Display subject or category name
 * @property {string} topic - Session objective or topic name
 * @property {string} startTime - Formatted 12-hour clock start (e.g., '6:00 PM')
 * @property {string} endTime - Formatted 12-hour clock end (e.g., '7:00 PM')
 * @property {number} duration - Session duration in minutes
 * @property {'High Priority'|'Medium Priority'|'Low Priority'} priority - Priority category
 * @property {boolean} completed - Task completion checkbox state
 * @property {'study'|'revision'|'assignment'|'break'} type - Semantic session category
 * @property {boolean} [isBreak] - Flag indicating health/relaxation interval
 * @property {boolean} [missed] - Flag indicating task was rescheduled by AI
 * @property {boolean} [earlyFinished] - Flag indicating task was finished early
 * @property {string} [notes] - AI instructional notes or diagnostic tips
 */

/**
 * Computes a deterministic multi-factor priority weight for an academic subject.
 * 
 * Mathematical Formulation:
 * PriorityScore = ProximityScore + WeaknessScore + DifficultyScore + AssignmentBoost
 * 
 * Score Components:
 * 1. Proximity Score (0 to 40 pts):
 *    - Exam in <= 3 days: 40 pts
 *    - Exam in <= 7 days: 32 pts
 *    - Exam in <= 14 days: 22 pts
 *    - Exam in <= 30 days: 14 pts
 *    - Exam > 30 days: 10 pts
 * 
 * 2. Weakness Recovery Score (0 to 30 pts):
 *    - Computed as Math.round((100 - previousMark) * 0.35)
 *    - Inversely proportional to past marks to prioritize recovery in struggling domains.
 * 
 * 3. Difficulty Score (5 to 25 pts):
 *    - 'High': 25 pts
 *    - 'Medium': 15 pts
 *    - 'Low': 5 pts
 * 
 * 4. Assignment Urgency Boost (0 or 15 pts):
 *    - Adds 15 bonus points if an active assignment for this subject is due within 3 days.
 * 
 * Complexity: O(A) where A is the count of active assignments.
 * 
 * @param {Subject} subject - The subject entity to evaluate
 * @param {Assignment[]} [assignments=[]] - List of active student assignments
 * @returns {{
 *   subject: Subject,
 *   score: number,
 *   daysUntilExam: number,
 *   urgencyLevel: 'Critical'|'High'|'Medium'|'Low'
 * }} Object containing evaluated priority score and urgency category.
 */
export function calculateSubjectPriority(subject, assignments = []) {
  const daysUntilExam = getDaysRemaining(subject.examDate);
  
  // 1. Proximity score (0 to 40)
  let proximityScore = 10;
  if (daysUntilExam <= 3) proximityScore = 40;
  else if (daysUntilExam <= 7) proximityScore = 32;
  else if (daysUntilExam <= 14) proximityScore = 22;
  else if (daysUntilExam <= 30) proximityScore = 14;

  // 2. Weakness / Mark score (0 to 30)
  // Low marks indicate student needs more intervention
  const mark = Number(subject.previousMark) || 75;
  const weaknessScore = Math.max(0, Math.min(30, Math.round((100 - mark) * 0.35)));

  // 3. Difficulty score (5 to 25)
  let difficultyScore = 15;
  if (subject.difficulty === 'High') difficultyScore = 25;
  else if (subject.difficulty === 'Medium') difficultyScore = 15;
  else difficultyScore = 5;

  // 4. Assignment urgency boost (0 to 15)
  const hasNearAssignment = assignments.some(a => 
    !a.completed && 
    (a.subjectId === subject.id || a.subjectName?.toLowerCase() === subject.name.toLowerCase()) && 
    getDaysRemaining(a.deadline) <= 3
  );
  const assignmentScore = hasNearAssignment ? 15 : 0;

  const totalScore = proximityScore + weaknessScore + difficultyScore + assignmentScore;
  
  return {
    subject,
    score: totalScore,
    daysUntilExam,
    urgencyLevel: totalScore >= 75 ? 'Critical' : totalScore >= 55 ? 'High' : totalScore >= 35 ? 'Medium' : 'Low'
  };
}

/**
 * Generates an optimized daily study schedule tailored to student constraints.
 * 
 * Scheduling Algorithm:
 * 1. Ranks all enrolled subjects by their computed PriorityScore descending.
 * 2. Selects the primary focus subject (highest priority) and secondary subject.
 * 3. Maps the student's preferred study window (Morning, Afternoon, Evening, Night) to clock hours.
 * 4. Schedules a 60-minute deep work block for the primary subject.
 * 5. Interleaves a mandatory 15-minute health/rest interval to prevent cognitive overload.
 * 6. Schedules a 40-50 minute secondary focus block.
 * 7. Adds a secondary 10-minute break for sessions with >= 3 daily hours.
 * 8. Schedules a 30-minute high-yield active recall / spaced repetition block.
 * 
 * Complexity: O(N log N) where N is the count of enrolled subjects (dominated by sorting).
 * 
 * @param {Object} profile - Student profile configuration
 * @param {string} profile.name - Student's name
 * @param {number} profile.dailyHours - Daily allocated study hours
 * @param {'Morning'|'Afternoon'|'Evening'|'Night'} profile.preferredTime - Peak study window
 * @param {Subject[]} subjects - Enrolled curriculum subjects
 * @param {Assignment[]} [assignments=[]] - Active assignments
 * @returns {Task[]} Ordered array of scheduled study sessions and breaks
 */
export function generateSchedule(profile, subjects, assignments = []) {
  if (!subjects || subjects.length === 0) return [];

  const dailyHours = Number(profile.dailyHours) || 4;
  const preferredTime = profile.preferredTime || 'Evening';

  // Rank subjects by AI Priority
  const ranked = subjects.map(sub => calculateSubjectPriority(sub, assignments))
    .sort((a, b) => b.score - a.score);

  const primary = ranked[0]?.subject || subjects[0];
  const secondary = ranked[1]?.subject || subjects[1] || primary;

  // Determine starting hour based on preferred time
  let startHour = 18; // 6:00 PM default for Evening
  if (preferredTime.includes('Morning')) startHour = 9;
  else if (preferredTime.includes('Afternoon')) startHour = 14;
  else if (preferredTime.includes('Night')) startHour = 20;

  const tasks = [];
  let currentHour = startHour;
  let currentMinute = 0;

  const formatClock = (h, m) => {
    const period = h >= 12 && h < 24 ? 'PM' : 'AM';
    let displayH = h % 12;
    if (displayH === 0) displayH = 12;
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${period}`;
  };

  const addMinutes = (h, m, mins) => {
    let newM = m + mins;
    let newH = h + Math.floor(newM / 60);
    newM = newM % 60;
    return { h: newH, m: newM };
  };

  // Helper to pick a topic for study
  const getTopicToStudy = (subj) => {
    if (subj.difficultTopics && subj.difficultTopics.length > 0) {
      return subj.difficultTopics[0];
    }
    const uncompleted = (subj.topics || []).find(t => !t.completed);
    return uncompleted ? uncompleted.name : `Core Concepts & Problem Solving`;
  };

  // Block 1: High Priority Focus (60 min)
  let nextTime = addMinutes(currentHour, currentMinute, 60);
  tasks.push({
    id: `task-${Date.now()}-1`,
    subjectId: primary.id,
    subject: primary.name,
    topic: `${getTopicToStudy(primary)} (Deep Work)`,
    startTime: formatClock(currentHour, currentMinute),
    endTime: formatClock(nextTime.h, nextTime.m),
    duration: 60,
    priority: "High Priority",
    completed: false,
    type: "study",
    notes: `High priority session. Exam in ${getDaysRemaining(primary.examDate)} days. Focus on high-yield questions.`
  });
  currentHour = nextTime.h;
  currentMinute = nextTime.m;

  // Break 1: 15 min
  nextTime = addMinutes(currentHour, currentMinute, 15);
  tasks.push({
    id: `task-${Date.now()}-2`,
    subject: "Break",
    topic: "Hydration, light stretch & eye rest",
    startTime: formatClock(currentHour, currentMinute),
    endTime: formatClock(nextTime.h, nextTime.m),
    duration: 15,
    priority: "Low Priority",
    completed: false,
    type: "break",
    isBreak: true
  });
  currentHour = nextTime.h;
  currentMinute = nextTime.m;

  // Block 2: Secondary Focus or Assignment (45-50 min)
  const secondaryDuration = dailyHours >= 3 ? 50 : 35;
  nextTime = addMinutes(currentHour, currentMinute, secondaryDuration);
  tasks.push({
    id: `task-${Date.now()}-3`,
    subjectId: secondary.id,
    subject: secondary.name,
    topic: getTopicToStudy(secondary),
    startTime: formatClock(currentHour, currentMinute),
    endTime: formatClock(nextTime.h, nextTime.m),
    duration: secondaryDuration,
    priority: ranked[1]?.score >= 60 ? "High Priority" : "Medium Priority",
    completed: false,
    type: "study",
    notes: `Previous mark: ${secondary.previousMark}%. Practice conceptual exercises.`
  });
  currentHour = nextTime.h;
  currentMinute = nextTime.m;

  // Break 2 (if daily hours >= 3): 10 min
  if (dailyHours >= 3) {
    nextTime = addMinutes(currentHour, currentMinute, 10);
    tasks.push({
      id: `task-${Date.now()}-4`,
      subject: "Break",
      topic: "Step outside or relax your posture",
      startTime: formatClock(currentHour, currentMinute),
      endTime: formatClock(nextTime.h, nextTime.m),
      duration: 10,
      priority: "Low Priority",
      completed: false,
      type: "break",
      isBreak: true
    });
    currentHour = nextTime.h;
    currentMinute = nextTime.m;
  }

  // Block 3: High-yield Revision / Spaced Repetition (30 min)
  nextTime = addMinutes(currentHour, currentMinute, 30);
  tasks.push({
    id: `task-${Date.now()}-5`,
    subjectId: primary.id,
    subject: "Revision",
    topic: `${primary.name} – Formula Sheet & Active Recall`,
    startTime: formatClock(currentHour, currentMinute),
    endTime: formatClock(nextTime.h, nextTime.m),
    duration: 30,
    priority: "High Priority",
    completed: false,
    type: "revision",
    notes: `Active recall and spaced repetition flashcards for ${primary.name}.`
  });

  return tasks;
}

/**
 * Dynamically rebalances schedule when a scheduled session is missed.
 * Immutably returns an updated schedule with diagnostic guidance for recovery.
 * 
 * @param {Task[]} tasks - Current active daily tasks
 * @param {string} missedTaskId - The unique ID of the missed task
 * @returns {Task[]} Updated tasks with reassigned priority instructions
 */
export function handleMissedSession(tasks, missedTaskId) {
  return tasks.map(t => {
    if (t.id === missedTaskId) {
      return {
        ...t,
        missed: true,
        notes: `Rescheduled by AI to prevent learning gap: review key formulas tomorrow morning.`
      };
    }
    return t;
  });
}

/**
 * Dynamically updates task when a student completes a topic earlier than expected.
 * Awards early-finish bonus flag and positive cognitive reinforcement.
 * 
 * @param {Task[]} tasks - Current active daily tasks
 * @param {string} completedTaskId - ID of the completed task
 * @returns {Task[]} Updated tasks list
 */
export function handleEarlyCompletion(tasks, completedTaskId) {
  return tasks.map(t => {
    if (t.id === completedTaskId) {
      return {
        ...t,
        completed: true,
        earlyFinished: true,
        notes: `🎉 Finished early! High focus score awarded.`
      };
    }
    return t;
  });
}

/**
 * Inserts a dedicated deadline-buffer study session into the current schedule
 * upon creation of a new urgent assignment.
 * 
 * @param {Task[]} tasks - Current active daily tasks
 * @param {Assignment} newAssignment - The newly created assignment
 * @returns {Task[]} New array with injected buffer session
 */
export function handleAddAssignmentToSchedule(tasks, newAssignment) {
  const newTask = {
    id: `task-asg-${Date.now()}`,
    subjectId: newAssignment.subjectId,
    subject: newAssignment.subjectName || "Assignment Prep",
    topic: `Work on ${newAssignment.title}`,
    startTime: "9:00 PM",
    endTime: "9:45 PM",
    duration: 45,
    priority: "High Priority",
    completed: false,
    type: "assignment",
    notes: `Due in ${getDaysRemaining(newAssignment.deadline)} days. Deadline buffer allocated.`
  };
  return [...tasks, newTask];
}
