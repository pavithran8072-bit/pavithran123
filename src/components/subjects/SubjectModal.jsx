import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, Award, AlertCircle, Save, Plus, Trash2 } from 'lucide-react';
import { getDateOffset } from '../../utils/dateHelpers';

export default function SubjectModal({ isOpen, onClose, onSave, subject }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    previousMark: 75,
    difficulty: 'Medium',
    examDate: getDateOffset(10),
    progress: 50,
    difficultTopicsText: ''
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        previousMark: subject.previousMark ?? 75,
        difficulty: subject.difficulty || 'Medium',
        examDate: subject.examDate || getDateOffset(10),
        progress: subject.progress ?? 50,
        difficultTopicsText: (subject.difficultTopics || []).join(', ')
      });
    } else {
      setFormData({
        name: '',
        previousMark: 75,
        difficulty: 'Medium',
        examDate: getDateOffset(10),
        progress: 0,
        difficultTopicsText: ''
      });
    }
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const difficultTopics = formData.difficultTopicsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      ...(subject || { id: `sub-${Date.now()}`, totalTopics: 8, completedTopics: 0 }),
      name: formData.name.trim(),
      previousMark: Number(formData.previousMark),
      difficulty: formData.difficulty,
      examDate: formData.examDate,
      progress: Number(formData.progress),
      difficultTopics
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {subject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mathematics, Organic Chemistry, World History"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Previous Mark & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Previous Mark (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.previousMark}
                onChange={(e) => setFormData({ ...formData, previousMark: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-400">Lower marks get higher AI study weight</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="High">High (Hard)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low (Easy)</option>
              </select>
            </div>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Final Exam Date
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Difficult Topics */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Difficult Topics / Focus Areas
            </label>
            <textarea
              rows={2}
              value={formData.difficultTopicsText}
              onChange={(e) => setFormData({ ...formData, difficultTopicsText: e.target.value })}
              placeholder="Comma separated: Integration, Trigonometry, Matrices"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">AI schedules these during peak energy hours</span>
          </div>

          {/* Current Progress Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Syllabus Coverage</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formData.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Subject</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
