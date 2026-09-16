import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Coffee,
  Sparkles
} from 'lucide-react';
import DayDetailsModal from './DayDetailsModal';
import { formatDate } from '../../utils/dateHelpers';

export default function CalendarView({ 
  tasks = [], 
  subjects = [], 
  assignments = [], 
  onSelectDate 
}) {
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedModalDate, setSelectedModalDate] = useState(null);

  // Helper to format date string YYYY-MM-DD
  const toISODate = (d) => d.toISOString().split('T')[0];

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setMonth(next.getMonth() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get week days (Monday - Sunday)
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(curr.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  // Get month days grid
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    // Pad previous month days to align with Monday
    const startPadding = (firstDayOfMonth.getDay() + 6) % 7;
    for (let i = startPadding; i > 0; i--) {
      const padDate = new Date(year, month, 1 - i);
      days.push({ date: padDate, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Pad next month days to fill 35 or 42 cells
    const remaining = 35 - days.length;
    if (remaining > 0) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
    }

    return days;
  };

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();

  // Find items on any given date
  const getActivitiesForDate = (dateObj) => {
    const dateStr = toISODate(dateObj);
    const dayExams = subjects.filter(s => s.examDate === dateStr);
    const dayAssignments = assignments.filter(a => a.deadline === dateStr);
    return {
      exams: dayExams,
      assignments: dayAssignments,
      hasTasks: true // active daily schedule
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Study Calendar & Deadlines
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Interactive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any date to inspect scheduled sessions, exams, revision blocks, and breaks.
          </p>
        </div>

        {/* View Mode and Navigation controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Week / Month Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Navigation Prev / Next / Today */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 glass-card p-3 rounded-xl">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span>Study Sessions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Exams</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Assignments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>Revision</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Breaks</span>
        </div>
      </div>

      {/* WEEKLY VIEW */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day, idx) => {
            const dateStr = toISODate(day);
            const { exams, assignments: dayAsgs } = getActivitiesForDate(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedModalDate(day)}
                className={`glass-card p-3.5 rounded-2xl cursor-pointer min-h-[220px] flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md ${
                  isCurrentDay
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCurrentDay 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day.getDate()}
                    </span>
                  </div>

                  {/* Day badges */}
                  <div className="mt-2.5 space-y-1.5">
                    
                    {/* Exam chip */}
                    {exams.map(ex => (
                      <div 
                        key={ex.id}
                        className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1 truncate"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{ex.name} Exam</span>
                      </div>
                    ))}

                    {/* Assignment chip */}
                    {dayAsgs.map(asg => (
                      <div 
                        key={asg.id}
                        className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 truncate"
                      >
                        <FileText className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">Due: {asg.title}</span>
                      </div>
                    ))}

                    {/* Scheduled Daily study session badges */}
                    <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>4h Daily Study</span>
                    </div>

                    <div className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 text-[11px] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
                      <span>Formula Revision</span>
                    </div>

                    <div className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>2 Smart Breaks</span>
                    </div>

                  </div>
                </div>

                <span className="text-[10px] text-slate-400 text-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                  Click to inspect
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* MONTHLY VIEW */
        <div className="glass-card rounded-3xl p-4 overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((item, index) => {
              const { date, isCurrentMonth } = item;
              const dateStr = toISODate(date);
              const { exams, assignments: dayAsgs } = getActivitiesForDate(date);
              const isCurrentDay = isToday(date);

              return (
                <div
                  key={index}
                  onClick={() => setSelectedModalDate(date)}
                  className={`p-2 rounded-xl sm:rounded-2xl min-h-[75px] sm:min-h-[90px] border transition-all cursor-pointer flex flex-col justify-between ${
                    !isCurrentMonth 
                      ? 'opacity-30 border-transparent bg-slate-50/50 dark:bg-slate-900/30' 
                      : isCurrentDay
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                      isCurrentDay ? 'px-1.5 py-0.5 rounded-full bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {date.getDate()}
                    </span>

                    {/* Quick indicator dots */}
                    <div className="flex items-center gap-1">
                      {exams.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Exam scheduled" />
                      )}
                      {dayAsgs.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Assignment due" />
                      )}
                    </div>
                  </div>

                  {/* Micro chips */}
                  <div className="space-y-1 mt-1 hidden sm:block">
                    {exams.slice(0, 1).map(ex => (
                      <div key={ex.id} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 truncate">
                        {ex.name}
                      </div>
                    ))}
                    {dayAsgs.slice(0, 1).map(asg => (
                      <div key={asg.id} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 truncate">
                        {asg.title}
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] text-slate-400 hidden sm:block">
                    {isCurrentMonth ? 'Active' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={Boolean(selectedModalDate)}
        onClose={() => setSelectedModalDate(null)}
        selectedDate={selectedModalDate}
        subjects={subjects}
        assignments={assignments}
        tasks={tasks}
      />

    </div>
  );
}
