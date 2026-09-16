import React from 'react';
import { X, Calendar, Clock, AlertTriangle, FileText, BookOpen, Coffee } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';

export default function DayDetailsModal({ isOpen, onClose, selectedDate, subjects = [], assignments = [], tasks = [] }) {
  if (!isOpen || !selectedDate) return null;

  const dateStr = selectedDate.toISOString().split('T')[0];
  const formattedHeaderDate = formatDate(dateStr);

  // Find exams on this date
  const dayExams = subjects.filter(s => s.examDate === dateStr);
  
  // Find assignments due on this date
  const dayAssignments = assignments.filter(a => a.deadline === dateStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {formattedHeaderDate}
              </h3>
              <p className="text-xs text-slate-500">Planned Activities & Deadlines</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* Exams section if any */}
          {dayExams.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Exams Scheduled ({dayExams.length})</span>
              </h4>
              <div className="space-y-2">
                {dayExams.map(exam => (
                  <div key={exam.id} className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-rose-100 text-sm">{exam.name} Final Exam</p>
                      <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">Difficulty: {exam.difficulty} • Target: &gt;85%</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                      Exam Day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Due */}
          {dayAssignments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Assignments Due ({dayAssignments.length})</span>
              </h4>
              <div className="space-y-2">
                {dayAssignments.map(asg => (
                  <div key={asg.id} className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-amber-100 text-sm">{asg.title}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Subject: {asg.subjectName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      Due Today
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Study Sessions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Timetable Sessions & Breaks</span>
            </h4>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    task.isBreak 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 min-w-[70px]">
                      {task.startTime}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {task.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {task.topic}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                    {task.duration} mins
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
