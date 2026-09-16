import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  Lightbulb,
  Clock,
  BookOpen
} from 'lucide-react';
import { getDaysRemaining } from '../../utils/dateHelpers';

export default function AiAssistant({ 
  student = {}, 
  subjects = [], 
  tasks = [], 
  onApplyAssistantPlan 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello ${student.name || 'there'}! 👋 I'm your **AI Study Assistant**. I continuously monitor your upcoming exams, past marks, and deadlines to give you laser-focused study advice.\n\nHow can I help you accelerate your learning today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What should I study today?",
    "I have only 2 hours. Make a study plan.",
    "My Mathematics exam is in 5 days. What should I focus on?",
    "Give me a revision plan.",
    "When should I take breaks?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    // 1. "What should I study today?"
    if (q.includes('what should i study today') || q.includes('study today')) {
      const mathSub = subjects.find(s => s.name.toLowerCase().includes('math')) || subjects[0];
      const days = mathSub ? getDaysRemaining(mathSub.examDate) : 5;

      return {
        text: `Based on my priority algorithm, **${mathSub ? mathSub.name : 'Mathematics'}** is your #1 priority right now because:\n\n` +
          `• 📅 **Exam in ${days} days**\n` +
          `• 📉 **Past mark: ${mathSub?.previousMark || 55}%** (needs reinforcement)\n` +
          `• ⚡ **Identified weak topic**: Algebra & Differential Calculus\n\n` +
          `**Today's Recommended Flow:**\n` +
          `1. **6:00 PM - 7:00 PM**: Mathematics – Algebra Deep Work\n` +
          `2. **7:00 PM - 7:15 PM**: Health & hydration break\n` +
          `3. **7:15 PM - 8:00 PM**: Programming (Python) – OOP practice\n` +
          `4. **8:15 PM - 8:45 PM**: Mathematics Formula Sheet Revision`,
        hasAction: true,
        actionLabel: "View Today's Plan",
        actionType: "view_planner"
      };
    }

    // 2. "I have only 2 hours. Make a study plan."
    if (q.includes('only 2 hours') || q.includes('2 hours')) {
      return {
        text: `Here is a high-efficiency **Condensed 2-Hour High-Yield Sprint**:\n\n` +
          `• **50 mins (Focus Block 1)**: Mathematics – Integration & High-yield exam formulas\n` +
          `• **10 mins (Smart Break)**: Rest your eyes & stretch\n` +
          `• **40 mins (Focus Block 2)**: Physics Lab Report / Python OOP\n` +
          `• **20 mins (Rapid Active Recall)**: Flashcards & self-quiz on tricky concepts\n\n` +
          `Would you like me to compress your daily timetable to this 2-hour schedule?`,
        hasAction: true,
        actionLabel: "Apply 2-Hour Plan to Timetable",
        actionType: "apply_2hr"
      };
    }

    // 3. "My Mathematics exam is in 5 days. What should I focus on?"
    if (q.includes('math') || q.includes('mathematics') || q.includes('5 days')) {
      return {
        text: `With **Mathematics in 5 days** and a previous mark of **55%**, we need an active recall recovery strategy:\n\n` +
          `1. **Days 1-2 (Today & Tomorrow)**: Master Algebra & Differential Calculus formulas. Redo past exam questions you got wrong.\n` +
          `2. **Day 3**: Integral Calculus & Trigonometric identities. Time yourself solving 5-mark questions.\n` +
          `3. **Day 4**: Full timed mock exam under real test conditions.\n` +
          `4. **Day 5**: Light formula sheet review and restorative sleep.\n\n` +
          `*Avoid passive reading! Write formulas from memory without peeking.*`,
        hasAction: false
      };
    }

    // 4. "Give me a revision plan."
    if (q.includes('revision plan') || q.includes('revision')) {
      return {
        text: `Here is an **AI Spaced Repetition Revision Plan**:\n\n` +
          `• **Immediate Recall (End of session - 15m)**: Write 3 key concepts learned on a blank sheet.\n` +
          `• **1-Day Spacing (Tomorrow 8:15 PM)**: 20-minute rapid review of today's Mathematics algebra formulas.\n` +
          `• **3-Day Spacing (Weekend)**: Practice mixed difficulty problem sets combining Physics & Mathematics.\n` +
          `• **Feynman Technique**: Explain 1 difficult concept in plain English as if teaching a beginner.`,
        hasAction: false
      };
    }

    // 5. "When should I take breaks?"
    if (q.includes('break') || q.includes('breaks') || q.includes('rest')) {
      return {
        text: `Based on cognitive science and our built-in study timer:\n\n` +
          `• **Optimal Ratio**: 45 to 50 minutes of deep focus followed by **10 to 15 minutes of rest**.\n` +
          `• **Never skip breaks**: Brains require downtime to consolidate memory from working memory into long-term retention.\n` +
          `• **Healthy Break Tips**: Step away from screens, drink a glass of water, do a quick posture stretch, or take a short walk.\n\n` +
          `*Your current planner automatically schedules breaks after every focus block!*`,
        hasAction: true,
        actionLabel: "Launch Focus & Break Timer",
        actionType: "open_timer"
      };
    }

    // Generic fallback response
    return {
      text: `That's a great question! Based on your current profile (Daily target: ${student.dailyHours || 4}h, ${subjects.length} subjects enrolled), I suggest prioritizing tasks that have upcoming exam deadlines within the next 7 days.\n\nWould you like me to adjust your timetable or prioritize a specific subject?`,
      hasAction: false
    };
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const replyData = generateBotReply(text);
      const botMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: replyData.text,
        hasAction: replyData.hasAction,
        actionLabel: replyData.actionLabel,
        actionType: replyData.actionType,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Study Assistant
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Context-aware study coach connected to your active syllabi and exam dates.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Ask Recommendations:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] text-left"
            >
              💬 "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col h-[520px] overflow-hidden shadow-sm">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot 
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                  isBot 
                    ? 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-xs' 
                    : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                }`}>
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Action button inside message if applicable */}
                  {msg.hasAction && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
                      <button
                        onClick={() => onApplyAssistantPlan(msg.actionType)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{msg.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[10px] block opacity-60 ${isBot ? 'text-slate-400' : 'text-indigo-100 text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-400 text-[11px]">AI analyzing syllabi...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'I only have 2 hours', 'Math exam in 5 days')..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
