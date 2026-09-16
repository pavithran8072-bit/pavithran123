import React from 'react';
import { 
  BrainCircuit, 
  RefreshCw, 
  Calendar, 
  Timer, 
  Bot, 
  BarChart3,
  Check,
  Sparkles
} from 'lucide-react';

export default function FeaturesGrid({ onNavigate }) {
  const features = [
    {
      id: 'algorithm',
      icon: BrainCircuit,
      title: "Smart AI Priority Balancing",
      description: "Automatically analyzes exam proximity, previous grades, and difficulty to allocate more study time to weaker subjects like Mathematics.",
      badge: "Core AI Engine",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60"
    },
    {
      id: 'dynamic',
      icon: RefreshCw,
      title: "Dynamic Real-Time Re-planning",
      description: "Missed a session or got a sudden deadline? The AI recalculates remaining sessions immediately to keep you on track without burnout.",
      badge: "Adaptive",
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: "Weekly & Monthly Timetable",
      description: "Visual time-blocked calendar that displays study sessions, exams, assignment deadlines, and scheduled breaks at a single glance.",
      badge: "Calendar",
      color: "from-sky-600 to-blue-600",
      accent: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60"
    },
    {
      id: 'pomodoro',
      icon: Timer,
      title: "Focus & Pomodoro Timer",
      description: "Integrated study timer with structured 45-60 min focus blocks and 10-15 min health breaks to maintain peak cognitive retention.",
      badge: "Productivity",
      color: "from-amber-600 to-orange-600",
      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
    },
    {
      id: 'assistant',
      icon: Bot,
      title: "Interactive AI Study Assistant",
      description: "Chatbot companion that provides tailored revision advice, answers queries like 'I only have 2 hours', and dynamically updates your planner.",
      badge: "Assistant",
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: "Progress Analytics & Streaks",
      description: "Visualize completed hours, subject mastery percentages, exam readiness scores, and daily study streaks with celebratory milestones.",
      badge: "Analytics",
      color: "from-indigo-600 to-purple-600",
      accent: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60"
    }
  ];

  return (
    <section id="features-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-900/50">
          Engineered for Academic Excellence
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Ace Your Exams
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          A truly intelligent system that transforms messy syllabi into a clear, stress-free daily roadmap.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active in your personal plan</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
