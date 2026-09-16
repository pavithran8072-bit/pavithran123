import { getDateOffset } from '../utils/dateHelpers';

export const initialStudentProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  academicGoal: "Score >90% in Semester Finals & Build Solid Fundamentals",
  dailyHours: 4,
  preferredTime: "Evening", // Morning, Afternoon, Evening, Night
  streakDays: 7,
  totalHoursStudied: 42.5,
  consistencyScore: 94,
  level: "Senior Undergrad",
  targetExamScore: 90
};

export const initialSubjects = [
  {
    id: "sub-1",
    name: "Mathematics",
    previousMark: 55,
    difficulty: "High", // High, Medium, Low
    examDate: getDateOffset(5), // 5 days from today
    progress: 65,
    totalTopics: 12,
    completedTopics: 8,
    color: "indigo",
    accentBg: "bg-indigo-500",
    topics: [
      { id: "t1", name: "Linear Algebra & Matrices", completed: true, difficulty: "Medium" },
      { id: "t2", name: "Limits and Continuity", completed: true, difficulty: "Medium" },
      { id: "t3", name: "Differential Calculus", completed: true, difficulty: "High" },
      { id: "t4", name: "Integral Calculus & Applications", completed: false, difficulty: "High" },
      { id: "t5", name: "Trigonometric Identities & Equations", completed: false, difficulty: "High" },
      { id: "t6", name: "Probability & Combinatorics", completed: false, difficulty: "Medium" }
    ],
    difficultTopics: ["Integral Calculus & Applications", "Trigonometric Identities", "Differential Calculus"]
  },
  {
    id: "sub-2",
    name: "Programming (Python)",
    previousMark: 88,
    difficulty: "Medium",
    examDate: getDateOffset(14), // 14 days from today
    progress: 82,
    totalTopics: 10,
    completedTopics: 8,
    color: "sky",
    accentBg: "bg-sky-500",
    topics: [
      { id: "t7", name: "Python Syntax & Control Flow", completed: true, difficulty: "Low" },
      { id: "t8", name: "Data Structures (Lists, Dicts, Sets)", completed: true, difficulty: "Low" },
      { id: "t9", name: "Object-Oriented Programming (OOP)", completed: true, difficulty: "Medium" },
      { id: "t10", name: "File I/O and JSON Handling", completed: true, difficulty: "Medium" },
      { id: "t11", name: "Algorithms & Complexity (Big-O)", completed: false, difficulty: "High" },
      { id: "t12", name: "Web Scraping & APIs", completed: false, difficulty: "Medium" }
    ],
    difficultTopics: ["Algorithms & Complexity (Big-O)", "Recursion"]
  },
  {
    id: "sub-3",
    name: "Physics",
    previousMark: 62,
    difficulty: "High",
    examDate: getDateOffset(9), // 9 days from today
    progress: 58,
    totalTopics: 11,
    completedTopics: 6,
    color: "purple",
    accentBg: "bg-purple-500",
    topics: [
      { id: "t13", name: "Kinematics & Newton's Laws", completed: true, difficulty: "Medium" },
      { id: "t14", name: "Work, Energy & Power", completed: true, difficulty: "Medium" },
      { id: "t15", name: "Electromagnetism & Faraday's Law", completed: false, difficulty: "High" },
      { id: "t16", name: "Optics & Wave Interference", completed: false, difficulty: "High" },
      { id: "t17", name: "Thermodynamics & Heat Cycles", completed: false, difficulty: "High" }
    ],
    difficultTopics: ["Electromagnetism", "Optics & Wave Interference", "Thermodynamics"]
  },
  {
    id: "sub-4",
    name: "English Literature",
    previousMark: 92,
    difficulty: "Low",
    examDate: getDateOffset(21), // 21 days from today
    progress: 90,
    totalTopics: 8,
    completedTopics: 7,
    color: "emerald",
    accentBg: "bg-emerald-500",
    topics: [
      { id: "t18", name: "Literary Analysis & Critical Thinking", completed: true, difficulty: "Low" },
      { id: "t19", name: "Shakespearean Drama: Macbeth", completed: true, difficulty: "Medium" },
      { id: "t20", name: "Romantic & Modern Poetry", completed: true, difficulty: "Low" },
      { id: "t21", name: "Academic Essay Writing Structure", completed: false, difficulty: "Medium" }
    ],
    difficultTopics: ["Academic Essay Writing Structure"]
  }
];

export const initialAssignments = [
  {
    id: "asg-1",
    subjectId: "sub-3",
    subjectName: "Physics",
    title: "Electromagnetism Lab Report",
    deadline: getDateOffset(2),
    estimatedHours: 2.5,
    completed: false,
    priority: "High"
  },
  {
    id: "asg-2",
    subjectId: "sub-2",
    subjectName: "Programming (Python)",
    title: "Mini Project: Task Automation Script",
    deadline: getDateOffset(5),
    estimatedHours: 3.0,
    completed: false,
    priority: "Medium"
  },
  {
    id: "asg-3",
    subjectId: "sub-1",
    subjectName: "Mathematics",
    title: "Problem Set 4: Integration Review",
    deadline: getDateOffset(7),
    estimatedHours: 2.0,
    completed: false,
    priority: "High"
  }
];

export const initialTodayTasks = [
  {
    id: "task-1",
    subjectId: "sub-1",
    subject: "Mathematics",
    topic: "Algebra & Differential Calculus Formulas",
    startTime: "6:00 PM",
    endTime: "7:00 PM",
    duration: 60,
    priority: "High Priority",
    completed: false,
    type: "study",
    notes: "Review practice problems #14-25. Exam is in 5 days!"
  },
  {
    id: "task-2",
    subject: "Break",
    topic: "Hydration, light snack & eye rest",
    startTime: "7:00 PM",
    endTime: "7:15 PM",
    duration: 15,
    priority: "Low Priority",
    completed: false,
    type: "break",
    isBreak: true
  },
  {
    id: "task-3",
    subjectId: "sub-2",
    subject: "Programming",
    topic: "Python – OOP Principles & Classes",
    startTime: "7:15 PM",
    endTime: "8:00 PM",
    duration: 45,
    priority: "Medium Priority",
    completed: false,
    type: "study",
    notes: "Implement class hierarchy for the automation assignment"
  },
  {
    id: "task-4",
    subject: "Break",
    topic: "Stretch & walk away from screen",
    startTime: "8:00 PM",
    endTime: "8:15 PM",
    duration: 15,
    priority: "Low Priority",
    completed: false,
    type: "break",
    isBreak: true
  },
  {
    id: "task-5",
    subjectId: "sub-1",
    subject: "Revision",
    topic: "Mathematics – High-yield Practice Questions & Formulas",
    startTime: "8:15 PM",
    endTime: "8:45 PM",
    duration: 30,
    priority: "High Priority",
    completed: false,
    type: "revision",
    notes: "Active recall and spaced repetition flashcards"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    type: "exam",
    title: "Exam Countdown Alert",
    message: "Mathematics exam is in 5 days. AI has shifted +40% study allocation to Math.",
    time: "10m ago",
    unread: true,
    urgent: true
  },
  {
    id: "notif-2",
    type: "assignment",
    title: "Assignment Due Soon",
    message: "Physics Lab Report is due in 2 days. Don't forget your conclusion write-up.",
    time: "1h ago",
    unread: true,
    urgent: true
  },
  {
    id: "notif-3",
    type: "session",
    title: "Upcoming Study Session",
    message: "You have a study session at 6:00 PM: Mathematics – Algebra.",
    time: "2h ago",
    unread: false,
    urgent: false
  },
  {
    id: "notif-4",
    type: "success",
    title: "Milestone Achieved!",
    message: "Great! You maintained a 7-day study streak. Keep up the high momentum!",
    time: "Yesterday",
    unread: false,
    urgent: false
  }
];

export const motivationalQuotes = [
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson" },
  { quote: "Focus on progress, not perfection.", author: "Bill Phillips" },
  { quote: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { quote: "You don't have to be extreme, just consistent.", author: "Anonymous" }
];
