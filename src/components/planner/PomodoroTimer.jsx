import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, Sparkles, Coffee, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PomodoroTimer({ isOpen, onClose, activeTask, onCompleteTask }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min default
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Switch presets
  const setTimerPreset = (minutes, newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(minutes * 60);
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Trigger confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (mode === 'focus' && activeTask && onCompleteTask) {
        onCompleteTask(activeTask.id);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, activeTask, onCompleteTask]);

  const formatMinutes = Math.floor(timeLeft / 60);
  const formatSeconds = timeLeft % 60;
  const timeString = `${formatMinutes.toString().padStart(2, '0')}:${formatSeconds.toString().padStart(2, '0')}`;

  const progressPercentage = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Toggles */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setTimerPreset(25, 'focus')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus 25m</span>
          </button>

          <button
            onClick={() => setTimerPreset(50, 'focus')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'focus' && timeLeft > 25 * 60
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Deep 50m</span>
          </button>

          <button
            onClick={() => setTimerPreset(5, 'break')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Break 5m</span>
          </button>
        </div>

        {/* Active Task Info */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Current Focus Task
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {activeTask ? `${activeTask.subject} – ${activeTask.topic}` : 'General Study & Practice'}
          </h3>
          {activeTask?.priority && (
            <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {activeTask.priority}
            </span>
          )}
        </div>

        {/* Big Countdown Timer Display */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-56 h-56 rounded-full border-4 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
            <div 
              className={`text-5xl font-black tracking-tight tabular-nums ${
                mode === 'focus' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {timeString}
            </div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">
              {isRunning ? (mode === 'focus' ? 'Deep Work In Progress' : 'Recharge Interval') : 'Paused'}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Toggle notification chime"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
            }}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Motivation pill */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Scientifically proven 25m/5m cycles prevent mental fatigue</span>
        </div>

      </div>
    </div>
  );
}
