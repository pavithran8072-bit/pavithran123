import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Edit3, 
  Play, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Coffee, 
  BookOpen, 
  ArrowUp, 
  ArrowDown,
  Quote,
  Flame,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motivationalQuotes } from '../../data/defaultData';

export default function TodayPlan({ 
  tasks = [], 
  onToggleTask, 
  onDeleteTask, 
  onOpenTaskModal, 
  onOpenTimer,
  onMoveTask,
  subjects = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all'); // all, High Priority, Medium Priority, Low Priority, breaks
  const [quoteIndex, setQuoteIndex] = useState(0);

  const activeQuote = motivationalQuotes[quoteIndex % motivationalQuotes.length];

  // Handle task completion with celebratory confetti
  const handleCheckboxClick = (taskId, wasCompleted) => {
    onToggleTask(taskId);
    if (!wasCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Filter tasks based on search & priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      (task.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.topic || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterPriority === 'all') return true;
    if (filterPriority === 'breaks') return task.isBreak;
    if (filterPriority === 'study') return !task.isBreak;
    return task.priority === filterPriority;
  });

  const completedCount = tasks.filter(t => t.completed && !t.isBreak).length;
  const totalStudyTasks = tasks.filter(t => !t.isBreak).length;
  const progressPercent = totalStudyTasks > 0 ? Math.round((completedCount / totalStudyTasks) * 100) : 0;

  const getPriorityBadge = (priority, isBreak) => {
    if (isBreak) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Coffee className="w-3 h-3" />
          <span>Health Break</span>
        </span>
      );
    }
    if (priority === 'High Priority') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>High Priority</span>
        </span>
      );
    }
    if (priority === 'Medium Priority') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <span>Medium Priority</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        <span>Low Priority</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Motivational Quote Banner */}
      <div className="glass-card p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
              "{activeQuote.quote}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              — {activeQuote.author}
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuoteIndex(prev => prev + 1)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
        >
          New Quote
        </button>
      </div>

      {/* Main Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Today's Schedule & Focus Plan
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {tasks.length} Sessions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Optimized according to exam dates, subject difficulty, and your evening focus window.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTaskModal(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Session</span>
          </button>
        </div>
      </div>

      {/* Progress Bar of Today */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Today's Target Progress: {progressPercent}%</span>
          </span>
          <span className="text-slate-500">
            {completedCount} of {totalStudyTasks} study sessions completed
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'study', label: 'Study Only' },
            { id: 'High Priority', label: 'High Priority' },
            { id: 'Medium Priority', label: 'Medium' },
            { id: 'breaks', label: 'Breaks' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterPriority(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterPriority === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No tasks found matching your criteria</p>
            <p className="text-xs mt-1">Try resetting the filter or add a new session</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isCompleted = task.completed;
            const isBreak = task.isBreak;

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : isBreak
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                    : task.priority === 'High Priority'
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/70 shadow-sm hover:shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Left: Checkbox + Time + Subject Details */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => handleCheckboxClick(task.id, isCompleted)}
                    className="mt-0.5 sm:mt-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6 hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Time badge */}
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-1 sm:gap-0 min-w-[110px]">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{task.startTime}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {task.endTime} ({task.duration}m)
                    </span>
                  </div>

                  {/* Subject and Topic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm sm:text-base font-bold truncate ${
                        isCompleted 
                          ? 'line-through text-slate-400 dark:text-slate-500' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {task.subject}
                      </h3>
                      {getPriorityBadge(task.priority, isBreak)}
                      {task.missed && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Rescheduled
                        </span>
                      )}
                      {task.earlyFinished && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ⚡ Finished Early!
                        </span>
                      )}
                    </div>

                    <p className={`text-xs mt-1 truncate ${
                      isCompleted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {task.topic}
                    </p>

                    {task.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic line-clamp-1">
                        💡 {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions (Focus Timer, Reorder, Edit, Delete) */}
                <div className="flex items-center justify-end gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  
                  {/* Start Focus Timer */}
                  {!isBreak && !isCompleted && (
                    <button
                      onClick={() => onOpenTimer(task)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Launch Focus / Pomodoro Timer for this session"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden md:inline">Focus</span>
                    </button>
                  )}

                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => onMoveTask(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveTask(index, 1)}
                      disabled={index === tasks.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => onOpenTaskModal(task)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit session details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
