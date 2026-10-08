/**
 * @file App.jsx
 * @description Root Application Controller & State Orchestration Layer.
 * 
 * Orchestrates:
 * 1. Reactive State Management:
 *    - User Authentication Session (Student account, login state, role)
 *    - Student Profile (daily hours, exam goal, time preferences)
 *    - Enrolled Subjects & Syllabi (progress, marks, difficulty, exam dates)
 *    - Assignments & Deadlines
 *    - Scheduled Timetable Tasks (study blocks, revision sessions, breaks)
 *    - Notifications & Urgency Feed
 * 2. Automated Persistence & Hydration:
 *    - Syncs state changes to window.localStorage via Storage abstraction.
 *    - Automatic dark/light theme toggling and class injection on documentElement.
 * 3. Dynamic Re-planning Pipeline:
 *    - Trigger-based schedule readjustments (Missed sessions, shifted exams, early topic completions, urgent assignments).
 * 4. Modal & View Navigation Routing:
 *    - Primary tabs ('home', 'login', 'planner', 'subjects', 'progress', 'assistant', 'profile')
 *    - Sub-views ('today' vs 'calendar')
 *    - Modals (PlanGeneratorModal, PomodoroTimer, TaskModal, NotificationsDrawer)
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationsDrawer from './components/layout/NotificationsDrawer';

// Auth components
import LoginPage from './components/auth/LoginPage';

// Home components
import HeroSection from './components/home/HeroSection';
import VisualDashboard from './components/home/VisualDashboard';
import FeaturesGrid from './components/home/FeaturesGrid';

// Planner components
import TodayPlan from './components/planner/TodayPlan';
import PomodoroTimer from './components/planner/PomodoroTimer';
import TaskModal from './components/planner/TaskModal';
import ReplanBanner from './components/planner/ReplanBanner';

// Calendar components
import CalendarView from './components/calendar/CalendarView';

// Other page components
import SubjectsList from './components/subjects/SubjectsList';
import ProgressDashboard from './components/progress/ProgressDashboard';
import AiAssistant from './components/assistant/AiAssistant';
import ProfileView from './components/profile/ProfileView';
import PlanGeneratorModal from './components/generator/PlanGeneratorModal';

// Storage and AI Engine
import { Storage } from './utils/storage';
import { 
  generateSchedule, 
  handleMissedSession, 
  handleEarlyCompletion, 
  handleAddAssignmentToSchedule 
} from './utils/aiPlanner';
import { getDateOffset } from './utils/dateHelpers';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme state: reads persisted preference or defaults to light
  const [isDarkMode, setIsDarkMode] = useState(() => Storage.getTheme() === 'dark');

  // Active Navigation Tab ('home' | 'login' | 'planner' | 'subjects' | 'progress' | 'assistant' | 'profile')
  const [activeTab, setActiveTab] = useState('home');

  // Auth Session
  const [authSession, setAuthSession] = useState(() => Storage.getAuthSession());

  // Core Data
  const [student, setStudent] = useState(() => Storage.getProfile());
  const [subjects, setSubjects] = useState(() => Storage.getSubjects());
  const [assignments, setAssignments] = useState(() => Storage.getAssignments());
  const [tasks, setTasks] = useState(() => Storage.getTasks());
  const [notifications, setNotifications] = useState(() => Storage.getNotifications());

  // Planner Tab Sub-view ('today' | 'calendar')
  const [plannerSubView, setPlannerSubView] = useState('today');

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerActiveTask, setTimerActiveTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize theme to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      Storage.saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      Storage.saveTheme('light');
    }
  }, [isDarkMode]);

  // Save changes to localStorage
  useEffect(() => {
    Storage.saveProfile(student);
  }, [student]);

  useEffect(() => {
    Storage.saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    Storage.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveNotifications(notifications);
  }, [notifications]);

  // Auth handlers
  const handleLogin = (userData) => {
    const session = Storage.login(userData);
    setAuthSession(session);
    setStudent(prev => ({
      ...prev,
      name: userData.name || prev.name,
      email: userData.email || prev.email,
      academicGoal: userData.academicGoal || prev.academicGoal,
      dailyHours: userData.dailyHours || prev.dailyHours,
      preferredTime: userData.preferredTime || prev.preferredTime,
      level: userData.role || prev.level
    }));
    showToast(`Welcome back, ${userData.name}!`);
    setActiveTab('planner');
  };

  const handleLogout = () => {
    const session = Storage.logout();
    setAuthSession(session);
    showToast("Signed out successfully.");
    setActiveTab('login');
  };

  // Unread notification count
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  // Task Handlers
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast("Task deleted from schedule");
  };

  const handleSaveTask = (savedTask) => {
    setTasks(prev => {
      const exists = prev.some(t => t.id === savedTask.id);
      if (exists) {
        return prev.map(t => t.id === savedTask.id ? savedTask : t);
      } else {
        return [...prev, savedTask];
      }
    });
    showToast("Schedule updated successfully");
  };

  const handleMoveTask = (index, direction) => {
    const newTasks = [...tasks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;
    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIndex];
    newTasks[targetIndex] = temp;
    setTasks(newTasks);
  };

  // Timer handlers
  const handleStartTimer = (task = null) => {
    const defaultStudyTask = task || tasks.find(t => !t.isBreak && !t.completed) || tasks[0];
    setTimerActiveTask(defaultStudyTask);
    setIsTimerOpen(true);
  };

  // Subject Handlers
  const handleSaveSubject = (savedSubject) => {
    setSubjects(prev => {
      const exists = prev.some(s => s.id === savedSubject.id);
      if (exists) {
        return prev.map(s => s.id === savedSubject.id ? savedSubject : s);
      } else {
        return [...prev, savedSubject];
      }
    });
    showToast(`Subject "${savedSubject.name}" saved`);
  };

  const handleDeleteSubject = (subjectId) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    showToast("Subject removed");
  };

  const handleFocusSubject = (subject) => {
    setActiveTab('planner');
    setPlannerSubView('today');
    showToast(`Focusing on ${subject.name}`);
  };

  // ========================================================
  // Dynamic Re-planning Simulations & Reactive Triggers
  // ========================================================

  const handleSimulateMissedSession = () => {
    const uncompleted = tasks.find(t => !t.isBreak && !t.completed);
    if (uncompleted) {
      setTasks(handleMissedSession(tasks, uncompleted.id));
      const notif = {
        id: `notif-${Date.now()}`,
        type: 'session',
        title: 'Adaptive Re-plan Triggered',
        message: `Missed session "${uncompleted.subject}" re-queued into tomorrow's priority revision block.`,
        time: 'Just now',
        unread: true
      };
      setNotifications(prev => [notif, ...prev]);
      showToast(`AI rebalanced schedule: Missed "${uncompleted.subject}" moved to tomorrow's priority`);
    } else {
      showToast("All sessions currently completed! Uncheck a task to test missed session.");
    }
  };

  const handleSimulateExamChange = () => {
    const updatedSubjects = subjects.map(s => {
      if (s.name.toLowerCase().includes('math')) {
        return { ...s, examDate: getDateOffset(3) };
      }
      return s;
    });
    setSubjects(updatedSubjects);

    const newSchedule = generateSchedule(student, updatedSubjects, assignments);
    setTasks(newSchedule);

    const notif = {
      id: `notif-${Date.now()}`,
      type: 'exam',
      title: 'Exam Date Updated',
      message: 'Mathematics exam shifted to 3 days remaining! Daily allocation boosted to 2.5 hours.',
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [notif, ...prev]);
    showToast("⚡ Mathematics exam moved to 3 days! AI automatically boosted Math priority.");
  };

  const handleSimulateNewAssignment = () => {
    const newAsg = {
      id: `asg-${Date.now()}`,
      subjectId: 'sub-2',
      subjectName: 'Programming (Python)',
      title: 'Data Structures Lab Milestone 2',
      deadline: getDateOffset(2),
      estimatedHours: 2.0,
      completed: false,
      priority: 'High'
    };
    setAssignments(prev => [newAsg, ...prev]);
    setTasks(handleAddAssignmentToSchedule(tasks, newAsg));

    const notif = {
      id: `notif-${Date.now()}`,
      type: 'assignment',
      title: 'New Deadline Added',
      message: `Assignment "${newAsg.title}" due in 2 days. Prep block inserted at 9:00 PM.`,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [notif, ...prev]);
    showToast(`New assignment added! Dedicated 45m prep block scheduled.`);
  };

  const handleSimulateEarlyFinish = () => {
    const activeStudyTask = tasks.find(t => !t.isBreak && !t.completed);
    if (activeStudyTask) {
      setTasks(handleEarlyCompletion(tasks, activeStudyTask.id));
      confetti({ particleCount: 70, spread: 60 });
      showToast(`🎉 "${activeStudyTask.subject}" finished early! AI added bonus rest interval.`);
    } else {
      showToast("No active uncompleted task found to finish early.");
    }
  };

  const handleRegenerateFreshPlan = () => {
    const freshSchedule = generateSchedule(student, subjects, assignments);
    setTasks(freshSchedule);
    confetti({ particleCount: 80, spread: 70 });
    showToast("Schedule re-optimized by AI engine!");
  };

  const handleGeneratePlanCallback = ({ profile: newProfile, subjects: newSubjects }) => {
    setStudent(newProfile);
    setSubjects(newSubjects);
    const newSchedule = generateSchedule(newProfile, newSubjects, assignments);
    setTasks(newSchedule);
    setActiveTab('planner');
    setPlannerSubView('today');
    showToast("🎉 Personalized AI Study Plan generated successfully!");
  };

  const handleApplyAssistantPlan = (actionType) => {
    if (actionType === 'apply_2hr') {
      const mathSub = subjects.find(s => s.name.toLowerCase().includes('math')) || subjects[0];
      const twoHourTasks = [
        {
          id: `task-2hr-1`,
          subject: mathSub.name,
          topic: "Differential Calculus & High-yield Formula Review",
          startTime: "6:00 PM",
          endTime: "6:50 PM",
          duration: 50,
          priority: "High Priority",
          completed: false,
          type: "study"
        },
        {
          id: `task-2hr-2`,
          subject: "Break",
          topic: "Mindful rest & eye relaxation",
          startTime: "6:50 PM",
          endTime: "7:00 PM",
          duration: 10,
          priority: "Low Priority",
          completed: false,
          type: "break",
          isBreak: true
        },
        {
          id: `task-2hr-3`,
          subject: "Programming",
          topic: "Python OOP & Function Exercises",
          startTime: "7:00 PM",
          endTime: "7:40 PM",
          duration: 40,
          priority: "Medium Priority",
          completed: false,
          type: "study"
        },
        {
          id: `task-2hr-4`,
          subject: "Revision",
          topic: "Rapid Flashcards & Formula Quiz",
          startTime: "7:40 PM",
          endTime: "8:00 PM",
          duration: 20,
          priority: "High Priority",
          completed: false,
          type: "revision"
        }
      ];
      setTasks(twoHourTasks);
      setActiveTab('planner');
      showToast("Applied 2-Hour High-Yield Sprint to your schedule!");
    } else if (actionType === 'open_timer') {
      setIsTimerOpen(true);
    } else {
      setActiveTab('planner');
    }
  };

  const handleResetDefaultData = () => {
    Storage.resetToDefault();
    setStudent(Storage.getProfile());
    setSubjects(Storage.getSubjects());
    setAssignments(Storage.getAssignments());
    setTasks(Storage.getTasks());
    setNotifications(Storage.getNotifications());
    setAuthSession(Storage.getAuthSession());
    showToast("Reset to pristine demonstration data!");
  };

  const isUserAuthenticated = authSession?.isAuthenticated ?? true;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2">
            <span>⚡</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        openPlanModal={() => setIsPlanModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        toggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        streakDays={student.streakDays || 7}
        currentUser={authSession?.user || student}
        isAuthenticated={isUserAuthenticated}
        onLogout={handleLogout}
        onOpenLogin={() => setActiveTab('login')}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />

      {/* Main Page Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Guest Mode Notice Banner */}
        {!isUserAuthenticated && activeTab !== 'login' && activeTab !== 'home' && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-medium text-center sm:text-left">
              <span className="px-2 py-0.5 rounded-md bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider">
                Guest Demo
              </span>
              <span>You are viewing preview data. Sign in to save and sync your personal study schedule.</span>
            </div>
            <button
              onClick={() => setActiveTab('login')}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 shadow-sm transition-all"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* TAB 0: LOGIN & CREATE ACCOUNT */}
        {activeTab === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onCancel={() => setActiveTab('home')}
            initialMode="login"
          />
        )}
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <HeroSection
              onOpenPlanModal={() => setIsPlanModalOpen(true)}
              onExploreFeatures={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onGoToPlanner={() => setActiveTab('planner')}
            />

            <VisualDashboard
              tasks={tasks}
              subjects={subjects}
              student={student}
              onGoToPlanner={() => setActiveTab('planner')}
              onGoToSubjects={() => setActiveTab('subjects')}
              onGoToProgress={() => setActiveTab('progress')}
              onStartTimer={() => handleStartTimer()}
            />

            <FeaturesGrid
              onNavigate={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* TAB 2: MY PLANNER (Today's Plan + Weekly/Monthly Calendar) */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            
            {/* Dynamic Re-planning Simulation Bar */}
            <ReplanBanner
              onSimulateMissedSession={handleSimulateMissedSession}
              onSimulateExamChange={handleSimulateExamChange}
              onSimulateNewAssignment={handleSimulateNewAssignment}
              onSimulateEarlyFinish={handleSimulateEarlyFinish}
              onRegenerateFreshPlan={handleRegenerateFreshPlan}
            />

            {/* Sub-view Switcher: Today's Plan vs Calendar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlannerSubView('today')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    plannerSubView === 'today'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Today's Hourly Schedule
                </button>
                <button
                  onClick={() => setPlannerSubView('calendar')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    plannerSubView === 'calendar'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Weekly & Monthly Calendar
                </button>
              </div>
            </div>

            {plannerSubView === 'today' ? (
              <TodayPlan
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onOpenTaskModal={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onOpenTimer={(task) => handleStartTimer(task)}
                onMoveTask={handleMoveTask}
                subjects={subjects}
              />
            ) : (
              <CalendarView
                tasks={tasks}
                subjects={subjects}
                assignments={assignments}
              />
            )}
          </div>
        )}

        {/* TAB 3: SUBJECTS */}
        {activeTab === 'subjects' && (
          <SubjectsList
            subjects={subjects}
            onSaveSubject={handleSaveSubject}
            onDeleteSubject={handleDeleteSubject}
            onFocusSubject={handleFocusSubject}
          />
        )}

        {/* TAB 4: PROGRESS */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            student={student}
            subjects={subjects}
            tasks={tasks}
          />
        )}

        {/* TAB 5: AI ASSISTANT */}
        {activeTab === 'assistant' && (
          <AiAssistant
            student={student}
            subjects={subjects}
            tasks={tasks}
            onApplyAssistantPlan={handleApplyAssistantPlan}
          />
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <ProfileView
            student={student}
            subjects={subjects}
            onUpdateProfile={(updated) => {
              setStudent(prev => ({ ...prev, ...updated }));
              if (authSession?.user) {
                const updatedUser = { ...authSession.user, ...updated };
                Storage.saveAuthSession({ ...authSession, user: updatedUser });
                setAuthSession(prev => ({ ...prev, user: updatedUser }));
              }
              showToast("Profile updated!");
            }}
            onResetDefaultData={handleResetDefaultData}
            onLogout={handleLogout}
            onSwitchAccount={() => setActiveTab('login')}
          />
        )}

      </main>

      {/* Modals */}
      <PlanGeneratorModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        initialProfile={student}
        initialSubjectsList={subjects}
        onGeneratePlan={handleGeneratePlanCallback}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        subjects={subjects}
      />

      <PomodoroTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        activeTask={timerActiveTask}
        onCompleteTask={(taskId) => {
          handleToggleTask(taskId);
          showToast("Focus session completed!");
        }}
      />

      {/* Footer */}
      <Footer onOpenPlannerModal={() => setIsPlanModalOpen(true)} />

    </div>
  );
}
