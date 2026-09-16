import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, AlertCircle, Save } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task, subjects = [] }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    startTime: '6:00 PM',
    endTime: '7:00 PM',
    duration: 60,
    priority: 'Medium Priority',
    notes: '',
    type: 'study'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        subject: task.subject || '',
        topic: task.topic || '',
        startTime: task.startTime || '6:00 PM',
        endTime: task.endTime || '7:00 PM',
        duration: task.duration || 60,
        priority: task.priority || 'Medium Priority',
        notes: task.notes || '',
        type: task.type || 'study'
      });
    } else {
      setFormData({
        subject: subjects[0]?.name || 'Mathematics',
        topic: '',
        startTime: '6:00 PM',
        endTime: '7:00 PM',
        duration: 60,
        priority: 'High Priority',
        notes: '',
        type: 'study'
      });
    }
  }, [task, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.topic.trim()) return;

    onSave({
      ...(task || { id: `task-custom-${Date.now()}`, completed: false }),
      ...formData,
      isBreak: formData.type === 'break'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {task ? 'Edit Study Session' : 'Add Study Session'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Subject Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Subject / Category
            </label>
            <input
              type="text"
              list="subject-options"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Mathematics, Programming, Break, Revision"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <datalist id="subject-options">
              {subjects.map(s => <option key={s.id} value={s.name} />)}
              <option value="Break" />
              <option value="Revision" />
            </datalist>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Topic or Objective
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g. Differential Equations Practice #1-10"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={`${formData.startTime} – ${formData.endTime}`}
                onChange={(e) => {
                  const parts = e.target.value.split('–').map(s => s.trim());
                  if (parts.length === 2) {
                    setFormData({ ...formData, startTime: parts[0], endTime: parts[1] });
                  }
                }}
                placeholder="6:00 PM – 7:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="High Priority">High Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="Low Priority">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Session Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="study">Study Session</option>
                <option value="revision">Revision</option>
                <option value="assignment">Assignment</option>
                <option value="break">Health Break</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Notes / AI Instructions
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Focus on active recall and practice problems"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Session</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
