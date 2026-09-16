import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  BrainCircuit, 
  Target, 
  Award,
  Sparkles
} from 'lucide-react';
import StreakBadge from './StreakBadge';

export default function ProgressDashboard({ 
  student = {}, 
  subjects = [], 
  tasks = [] 
}) {
  // Weekly hours mockup
  const weeklyData = [
    { day: 'Mon', hours: 3.5, target: 4 },
    { day: 'Tue', hours: 4.0, target: 4 },
    { day: 'Wed', hours: 4.5, target: 4 },
    { day: 'Thu', hours: 3.0, target: 4 },
    { day: 'Fri', hours: 4.0, target: 4 },
    { day: 'Sat', hours: 5.0, target: 4 },
    { day: 'Sun', hours: 3.5, target: 4 },
  ];

  const totalWeeklyHours = weeklyData.reduce((acc, d) => acc + d.hours, 0);

  // Overall preparation readiness
  const avgReadiness = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + (s.progress || 0), 0) / subjects.length)
    : 72;

  // Study tasks stats
  const studyTasks = tasks.filter(t => !t.isBreak);
  const completedTasks = studyTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Performance & Analytics
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Real-time Telemetry
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your study consistency, weekly hours, exam readiness, and subject mastery.
        </p>
      </div>

      {/* Streak & Consistency Highlight */}
      <StreakBadge 
        streakDays={student.streakDays || 7} 
        consistencyScore={student.consistencyScore || 94} 
      />

      {/* Top 4 Quick Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Hours</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalWeeklyHours}h
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            +12% vs last week
          </span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Exam Readiness</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {avgReadiness}%
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
            Target Score: {student.targetExamScore || 90}%
          </span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tasks Done</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {completedTasks} / {studyTasks.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Today's planned sessions
          </span>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Studied</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {student.totalHoursStudied || 42.5}h
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
            Lifetime session log
          </span>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Study Hours Chart (Visual SVG/Tailwind Bar Chart) */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Study Hours Distribution
              </h3>
              <p className="text-xs text-slate-500">Actual study hours logged vs 4h daily target</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Avg 3.9h / day
            </span>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2">
              {weeklyData.map((item, i) => {
                const maxH = 6; // max scale hours
                const barHeightPercent = Math.min(100, Math.round((item.hours / maxH) * 100));
                const targetHeightPercent = Math.round((item.target / maxH) * 100);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    
                    {/* Hour tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-1.5 py-0.5 rounded shadow-xs pointer-events-none mb-1">
                      {item.hours}h
                    </div>

                    {/* Bar container */}
                    <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-xl relative flex items-end h-full overflow-hidden">
                      {/* Target line indicator */}
                      <div 
                        className="absolute w-full border-t border-dashed border-slate-400/60 z-10" 
                        style={{ bottom: `${targetHeightPercent}%` }}
                        title="Target 4h"
                      />

                      {/* Actual hours filled bar */}
                      <div 
                        className="w-full rounded-xl bg-gradient-to-t from-blue-600 via-indigo-600 to-purple-600 transition-all duration-700 group-hover:brightness-110"
                        style={{ height: `${barHeightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-600 to-indigo-600" />
                <span>Logged Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 border-t-2 border-dashed border-slate-400" />
                <span>Daily Target (4.0h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Mastery & Progress */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Subject-Wise Syllabus Mastery
              </h3>
              <p className="text-xs text-slate-500">Progress across all curriculum domains</p>
            </div>
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-4 pt-2">
            {subjects.map((sub) => {
              const mark = sub.previousMark ?? 70;
              const progress = sub.progress ?? 60;

              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {sub.name}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        sub.difficulty === 'High' 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {sub.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Past Mark: {mark}%</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {progress}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        progress >= 80 
                          ? 'bg-emerald-500' 
                          : progress >= 60 
                          ? 'bg-indigo-600' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2 mt-4">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
            <span>AI recommendation: Allocate +1.5 hrs to Mathematics before the exam in 5 days.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
