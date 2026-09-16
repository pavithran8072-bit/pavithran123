import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Target, Clock, BookMarked, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onOpenPlanModal, onExploreFeatures, onGoToPlanner }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Decorative gradient glow bubbles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 dark:opacity-20 blur-3xl -z-10 flex justify-between">
        <div className="w-72 h-72 rounded-full bg-blue-400" />
        <div className="w-96 h-96 rounded-full bg-indigo-500" />
        <div className="w-80 h-80 rounded-full bg-purple-500" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Next-Gen Adaptive AI Scheduling for Students</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Study Smarter with Your <br className="hidden sm:inline" />
          <span className="gradient-text">
            Personal AI Study Planner
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Plan your study time intelligently, focus on difficult subjects, manage deadlines, and achieve your academic goals with an AI-powered personalised study plan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenPlanModal}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Study Plan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-base border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
          </button>
        </div>

        {/* Quick Highlights list */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Dynamic exam proximity balancing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <span>Smart break & focus intervals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Auto-adjusts if sessions missed</span>
          </div>
        </div>

      </div>
    </section>
  );
}
