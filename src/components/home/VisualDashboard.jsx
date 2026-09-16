import React from 'react';
import { 
  Clock, 
  CalendarDays, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  AlertCircle,
  Play,
  Sparkles
} from 'lucide-react';
import { getDaysRemaining } from '../../utils/dateHelpers';

export default function VisualDashboard({ 
  tasks = [], 
  subjects = [], 
  student = {}, 
  onGoToPlanner, 
  onGoToSubjects, 
  onGoToProgress,
  onStartTimer
}) {
  // 1. Calculate Today's study hours
  const totalMinutes = tasks
    .filter(t => !t.isBreak)
    .reduce((acc, t) => acc + (t.duration || 0), 0);
  const completedMinutes = tasks
    .filter(t => !t.isBreak && t.completed)
    .reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedHours = (completedMinutes / 60).toFixed(1);
  const hoursProgress = totalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / totalMinutes) * 100)) : 0;

  // 2. Tasks completed count
  const studyTasks = tasks.filter(t => !t.isBreak);
  const completedTasksCount = studyTasks.filter(t => t.completed).length;
  const tasksProgress = studyTasks.length > 0 ? Math.round((completedTasksCount / studyTasks.length) * 100) : 0;

  // 3. Upcoming exams (sorted by proximity)
  const upcomingExams = [...subjects]
    .map(s => ({
      ...s,
      daysRemaining: getDaysRemaining(s.examDate)
    }))
    .filter(s => s.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 3);

  // 4. Overall progress (average of subject progress)
  const avgProgress = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + (s.progress || 0), 0) / subjects.length)
    : 70;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      
      {/* Visual Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Academic Performance Dashboard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time status based on your active AI timetable
          </p>
        </div>

        <button
          onClick={onGoToPlanner}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>Open Full Planner</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of 4 Key Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Study Hours */}
        <div className="glass-card p-5 border-l-4 border-l-blue-500 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Study Hours
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedHours}
            </span>
            <span className="text-sm font-medium text-slate-500">
              / {totalHours} hrs planned
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${hoursProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
              <span>{hoursProgress}% completed</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Goal: {student.dailyHours || 4}h</span>
            </div>
          </div>
        </div>

        {/* Card 2: Upcoming Exams */}
        <div 
          onClick={onGoToSubjects}
          className="glass-card p-5 border-l-4 border-l-rose-500 cursor-pointer hover:border-rose-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Upcoming Exams
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            {upcomingExams.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate max-w-[130px]">
                    {upcomingExams[0].name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {upcomingExams[0].daysRemaining === 0 ? 'Today' : `${upcomingExams[0].daysRemaining}d left`}
                  </span>
                </div>
                {upcomingExams[1] && (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[130px]">{upcomingExams[1].name}</span>
                    <span>{upcomingExams[1].daysRemaining}d</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No exams scheduled</p>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>High priority subject alerts active</span>
          </div>
        </div>

        {/* Card 3: Tasks Completed */}
        <div className="glass-card p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tasks Completed
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedTasksCount}
            </span>
            <span className="text-sm font-medium text-slate-500">
              / {studyTasks.length} sessions
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${tasksProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
              <span>{tasksProgress}% completed</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {studyTasks.length - completedTasksCount} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Overall Progress */}
        <div 
          onClick={onGoToProgress}
          className="glass-card p-5 border-l-4 border-l-purple-500 cursor-pointer hover:border-purple-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgProgress}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              On Track
            </span>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${avgProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
              <span>Across {subjects.length} subjects</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">View details</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Bar for demonstration */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-200/50 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Next scheduled session: Mathematics – Algebra (6:00 PM)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam in 5 days • Previous mark: 55% • High focus recommended
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartTimer}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Focus Timer</span>
          </button>
          <button
            onClick={onGoToPlanner}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
          >
            View Schedule
          </button>
        </div>
      </div>

    </div>
  );
}
