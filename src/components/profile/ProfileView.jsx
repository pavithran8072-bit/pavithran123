import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Clock, 
  SunMedium, 
  BookOpen, 
  Award, 
  RotateCcw, 
  Save, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Calendar,
  LogOut,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfileView({ 
  student = {}, 
  subjects = [], 
  onUpdateProfile, 
  onResetDefaultData,
  onLogout,
  onSwitchAccount
}) {
  const [formData, setFormData] = useState({
    name: student.name || 'Alex Rivera',
    email: student.email || 'alex.rivera@university.edu',
    academicGoal: student.academicGoal || 'Score >90% in Semester Finals',
    dailyHours: student.dailyHours || 4,
    preferredTime: student.preferredTime || 'Evening',
    targetExamScore: student.targetExamScore || 90
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Profile & Study Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal goals, daily study constraints, and enrolled subjects.
        </p>
      </div>

      {/* Main Profile Card Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-500/25 shrink-0">
          {formData.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formData.name}
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {student.level || 'Senior Undergrad'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formData.email} • Active AI Personalized Timetable
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <strong>{student.streakDays || 7} Day</strong> Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <strong>{student.totalHoursStudied || 42.5}h</strong> Total Studied
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
              <strong>{subjects.length}</strong> Subjects
            </span>
          </div>
        </div>

        {/* Quick Auth Actions */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={onSwitchAccount}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            title="Switch student profile"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
            <span>Switch Account</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors"
            title="Sign out of current profile"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="glass-card p-6 rounded-3xl space-y-6">
        <h4 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Academic Goals & Parameters
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Registered Student Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Primary Academic Goal & Objective
          </label>
          <input
            type="text"
            value={formData.academicGoal}
            onChange={(e) => setFormData({ ...formData, academicGoal: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Daily Hours (hrs/day)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={formData.dailyHours}
              onChange={(e) => setFormData({ ...formData, dailyHours: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Preferred Study Peak Period
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Morning">Morning (8 AM - 12 PM)</option>
              <option value="Afternoon">Afternoon (1 PM - 5 PM)</option>
              <option value="Evening">Evening (6 PM - 10 PM)</option>
              <option value="Night">Night (10 PM - 2 AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Final Exam Score (%)
            </label>
            <input
              type="number"
              min={50}
              max={100}
              value={formData.targetExamScore}
              onChange={(e) => setFormData({ ...formData, targetExamScore: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDefaultData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset to clean demonstration sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Demo Data</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

      </form>

      {/* Enrolled Subjects Summary */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Active Enrolled Subjects ({subjects.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map(s => (
            <div key={s.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.name}</p>
                <p className="text-[11px] text-slate-500">Exam: {s.examDate} • Mark: {s.previousMark}%</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {s.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
