import React from 'react';
import { 
  Sparkles, 
  RotateCw, 
  AlertOctagon, 
  CalendarClock, 
  PlusCircle, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';

export default function ReplanBanner({ 
  onSimulateMissedSession, 
  onSimulateExamChange, 
  onSimulateNewAssignment,
  onSimulateEarlyFinish,
  onRegenerateFreshPlan 
}) {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-5 border border-indigo-700/50 shadow-lg relative overflow-hidden mb-6">
      
      {/* Background glow decoration */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/30 border border-indigo-400/30 text-amber-300">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </span>
            <h3 className="font-bold text-base text-white">
              Dynamic AI Adaptive Engine Active
            </h3>
            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Recalibration
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
            The AI monitors your study pace and automatically balances your timetable when circumstances change. Test instant scenarios below:
          </p>
        </div>

        {/* Dynamic Simulation Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* 1. Missed Session */}
          <button
            onClick={onSimulateMissedSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all hover:scale-105 active:scale-95"
            title="AI redistributes missed topic into tomorrow's priority slots"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>Missed a Session?</span>
          </button>

          {/* 2. Exam Date Changed */}
          <button
            onClick={onSimulateExamChange}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all hover:scale-105 active:scale-95"
            title="Mathematics exam pushed closer: increases daily Math study hours"
          >
            <CalendarClock className="w-3.5 h-3.5 text-rose-400" />
            <span>Exam Date Shifted</span>
          </button>

          {/* 3. New Assignment Added */}
          <button
            onClick={onSimulateNewAssignment}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all hover:scale-105 active:scale-95"
            title="Injects assignment buffer session before deadline"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>New Assignment</span>
          </button>

          {/* 4. Completed Early */}
          <button
            onClick={onSimulateEarlyFinish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all hover:scale-105 active:scale-95"
            title="Rewards bonus break and pulls forward revision"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed Early!</span>
          </button>

          {/* Recalculate / Reset Fresh Plan */}
          <button
            onClick={onRegenerateFreshPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Re-run AI schedule optimization algorithm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-Optimize Plan</span>
          </button>

        </div>
      </div>
    </div>
  );
}
