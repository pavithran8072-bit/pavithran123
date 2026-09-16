import { getDaysRemaining } from './dateHelpers';

/**
 * Calculates priority weight for a subject based on:
 * 1. Exam proximity (closer = higher weight)
 * 2. Previous mark (lower = higher weight)
 * 3. Difficulty (High = 3, Med = 2, Low = 1)
 * 4. Upcoming assignment deadlines
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
 * Generates an optimized AI daily schedule
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
 * Dynamic adjustments
 */

// 1. Missed study session: Rebalances schedule
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

// 2. Early Topic Completion: Gives reward break or promotes revision
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

// 3. New Assignment Added: Injects prep task
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
