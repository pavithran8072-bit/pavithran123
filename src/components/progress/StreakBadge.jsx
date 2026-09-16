import React from 'react';
import { Flame, Award, Zap, Star } from 'lucide-react';

export default function StreakBadge({ streakDays = 7, consistencyScore = 94 }) {
  const milestones = [
    { days: 3, label: '3-Day Starter', achieved: streakDays >= 3, icon: Zap },
    { days: 7, label: '7-Day Scholar', achieved: streakDays >= 7, icon: Flame },
    { days: 14, label: '14-Day Champion', achieved: streakDays >= 14, icon: Star },
    { days: 30, label: '30-Day Master', achieved: streakDays >= 30, icon: Award }
  ];

  return (
    <div className="glass-card p-6 rounded-3xl space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Flame className="w-7 h-7 fill-white animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {streakDays} Day Study Streak!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consistency is your highest leverage study superpower.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Consistency
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {consistencyScore}%
          </span>
        </div>
      </div>

      {/* Milestones row */}
      <div className="pt-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Milestones & Badges
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {milestones.map((m, i) => {
            const Icon = m.icon;
            return (
              <div 
                key={i} 
                className={`p-3 rounded-2xl border text-center transition-all ${
                  m.achieved 
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 shadow-xs' 
                    : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-400 opacity-50'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${m.achieved ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block truncate">{m.label}</span>
                <span className="text-[10px] block opacity-75">{m.days} days</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
