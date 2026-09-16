import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDateOffset } from '../../utils/dateHelpers';

export default function PlanGeneratorModal({ 
  isOpen, 
  onClose, 
  initialProfile, 
  initialSubjectsList = [],
  onGeneratePlan 
}) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialProfile.name || 'Alex Rivera');
  const [goal, setGoal] = useState(initialProfile.academicGoal || 'Score >90% in Semester Finals');
  const [dailyHours, setDailyHours] = useState(initialProfile.dailyHours || 4);
  const [preferredTime, setPreferredTime] = useState(initialProfile.preferredTime || 'Evening');
  
  // Editable subjects list
  const [subjects, setSubjects] = useState(
    initialSubjectsList.length > 0 ? initialSubjectsList : [
      {
        id: 'sub-1',
        name: 'Mathematics',
        previousMark: 55,
        difficulty: 'High',
        examDate: getDateOffset(5),
        difficultTopicsText: 'Integration, Differential Equations, Trigonometry'
      },
      {
        id: 'sub-2',
        name: 'Programming (Python)',
        previousMark: 88,
        difficulty: 'Medium',
        examDate: getDateOffset(14),
        difficultTopicsText: 'OOP, Algorithms'
      },
      {
        id: 'sub-3',
        name: 'Physics',
        previousMark: 62,
        difficulty: 'High',
        examDate: getDateOffset(9),
        difficultTopicsText: 'Electromagnetism, Optics'
      }
    ]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: `sub-${Date.now()}`,
        name: '',
        previousMark: 70,
        difficulty: 'Medium',
        examDate: getDateOffset(14),
        difficultTopicsText: ''
      }
    ]);
  };

  const handleRemoveSubject = (index) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulated AI Reasoning Pipeline
    setTimeout(() => setGenerationStep(2), 700);
    setTimeout(() => setGenerationStep(3), 1400);
    setTimeout(() => {
      setIsGenerating(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Prepare normalized data
      const normalizedSubjects = subjects.map(s => ({
        ...s,
        previousMark: Number(s.previousMark) || 70,
        difficultTopics: typeof s.difficultTopicsText === 'string' 
          ? s.difficultTopicsText.split(',').map(t => t.trim()).filter(Boolean)
          : (s.difficultTopics || [])
      }));

      onGeneratePlan({
        profile: {
          ...initialProfile,
          name,
          academicGoal: goal,
          dailyHours: Number(dailyHours),
          preferredTime
        },
        subjects: normalizedSubjects
      });

      onClose();
    }, 2100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Create My AI Study Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Personalise your schedule using intelligent workload & exam proximity balancing
            </p>
          </div>
        </div>

        {/* If Generating: Show AI Animation */}
        {isGenerating ? (
          <div className="py-12 px-4 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Scheduling Engine In Progress...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Optimizing workload distribution and spaced repetition intervals
              </p>
            </div>

            {/* Progress steps */}
            <div className="max-w-md mx-auto space-y-2.5 text-left text-xs">
              <div className={`p-3 rounded-xl flex items-center gap-2.5 transition-all ${
                generationStep >= 1 ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 1 ? 'text-indigo-600' : 'text-slate-300'}`} />
                <span>Analyzing exam proximity & past grade weaknesses (Mathematics boost +40%)</span>
              </div>

              <div className={`p-3 rounded-xl flex items-center gap-2.5 transition-all ${
                generationStep >= 2 ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 2 ? 'text-indigo-600' : 'text-slate-300'}`} />
                <span>Aligning deep work blocks with your {preferredTime} study preferences</span>
              </div>

              <div className={`p-3 rounded-xl flex items-center gap-2.5 transition-all ${
                generationStep >= 3 ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-400'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${generationStep >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Interleaving 10-15 min health breaks & formula recall blocks</span>
              </div>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Student Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Academic Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Score >90% in Semester Finals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Daily Hours & Preferred Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Daily Available Hours
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dailyHours} Hours/Day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Recommended: 3 to 5 hours</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Preferred Study Window
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Morning">Morning (8:00 AM – 12:00 PM)</option>
                  <option value="Afternoon">Afternoon (2:00 PM – 6:00 PM)</option>
                  <option value="Evening">Evening (6:00 PM – 10:00 PM)</option>
                  <option value="Night">Night (8:00 PM – 12:00 AM)</option>
                </select>
              </div>
            </div>

            {/* Subjects List Repeater */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subjects, Exam Dates & Past Marks
                </label>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {subjects.map((sub, index) => (
                  <div 
                    key={sub.id || index}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2 relative group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Subject Name (e.g. Mathematics)"
                        value={sub.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />

                      <select
                        value={sub.difficulty}
                        onChange={(e) => handleSubjectChange(index, 'difficulty', e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="High">Hard</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Easy</option>
                      </select>

                      {subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Previous Mark (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sub.previousMark}
                          onChange={(e) => handleSubjectChange(index, 'previousMark', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
                          required
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Exam Date</span>
                        <input
                          type="date"
                          value={sub.examDate}
                          onChange={(e) => handleSubjectChange(index, 'examDate', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Difficult topics (e.g. Algebra, Calculus)"
                        value={sub.difficultTopicsText || (sub.difficultTopics ? sub.difficultTopics.join(', ') : '')}
                        onChange={(e) => handleSubjectChange(index, 'difficultTopicsText', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate AI Study Plan</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
