import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { getDaysRemaining, getRelativeDaysText, formatDate } from '../../utils/dateHelpers';
import SubjectModal from './SubjectModal';

export default function SubjectsList({ 
  subjects = [], 
  onSaveSubject, 
  onDeleteSubject,
  onFocusSubject 
}) {
  const [editingSubject, setEditingSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Academic Subjects & Curricula
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {subjects.length} Enrolled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track previous marks, exam proximity, topics completed, and AI priority weightings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((sub) => {
          const daysRemaining = getDaysRemaining(sub.examDate);
          const isExamUrgent = daysRemaining <= 7 && daysRemaining >= 0;
          const mark = sub.previousMark ?? 70;
          const topicsCompleted = sub.completedTopics ?? 6;
          const totalTopics = sub.totalTopics ?? 10;
          const progress = sub.progress ?? Math.round((topicsCompleted / totalTopics) * 100);

          return (
            <div
              key={sub.id}
              className="glass-card p-5 sm:p-6 rounded-3xl relative flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Header: Title + Difficulty Badge + Edit / Delete */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shadow-xs">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {sub.name}
                      </h3>
                      <span className={`inline-block mt-0.5 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${getDifficultyColor(sub.difficulty)}`}>
                        Difficulty: {sub.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Subject"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics Grid (Previous Mark, Exam, Progress) */}
                <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  
                  {/* Previous Mark */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Previous Mark
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-xl font-black ${
                        mark < 60 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : mark < 80 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {mark}%
                      </span>
                      {mark < 60 && (
                        <span className="text-[10px] font-bold text-rose-500">
                          (High AI Focus)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Exam Countdown */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Exam Date
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className={`text-xs font-bold ${
                        isExamUrgent ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {getRelativeDaysText(daysRemaining)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(sub.examDate)}
                    </span>
                  </div>

                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">
                      Syllabus Progress
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>{topicsCompleted} of {totalTopics} topics completed</span>
                    <span>{totalTopics - topicsCompleted} remaining</span>
                  </div>
                </div>

                {/* Difficult Topics Pill Tags */}
                {sub.difficultTopics && sub.difficultTopics.length > 0 && (
                  <div className="mt-3.5">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      Identified Difficult Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.difficultTopics.map((topic, i) => (
                        <span 
                          key={i}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/50"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                  <span>AI weight: {sub.difficulty === 'High' ? 'Boosted +35%' : 'Standard'}</span>
                </span>

                <button
                  onClick={() => onFocusSubject(sub)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
                >
                  <span>Focus Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveSubject}
        subject={editingSubject}
      />

    </div>
  );
}
