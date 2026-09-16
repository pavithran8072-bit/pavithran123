import React from 'react';
import { Bell, CheckCheck, X, AlertTriangle, Clock, Award, FileText } from 'lucide-react';

export default function NotificationsDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllRead,
  onDismiss 
}) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'exam':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'assignment':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'session':
        return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'success':
        return <Award className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full flex pl-10">
        <div className="w-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Smart Reminders</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI dynamic alerts & deadlines</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={onMarkAllRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No new reminders right now</p>
                <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.unread 
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60' 
                      : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                    <button
                      onClick={() => onDismiss(item.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ⚡ Automatically updated by AI Study Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
