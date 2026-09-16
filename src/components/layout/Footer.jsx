import React from 'react';
import { Sparkles, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function Footer({ onOpenPlannerModal }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              AI Study Planner
            </span>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} – Intelligent Academic Success Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-500" /> Real-time Dynamic Scheduling
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Local & Private
            </span>
            <button 
              onClick={onOpenPlannerModal}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Generate New Plan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
