import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { Storage } from '../../utils/storage';

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in its child component tree, logs the errors,
 * and displays a resilient, student-friendly fallback UI instead of crashing the application.
 * 
 * Provides:
 * 1. Automatic state recovery options (Re-render, Hard Reload, Reset to Default Data)
 * 2. Detailed diagnostics disclosure (Error message and Component Stack Trace)
 * 3. Graceful degradation without data loss
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    });
    // Can also log error to an external logging service (e.g. Sentry)
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleResetState = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  };

  handleResetDataAndReload = () => {
    Storage.resetToDefault();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 space-y-6">
            
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Application Encountered an Issue
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  The AI Study Planner error boundary safely caught a runtime exception. Your data in local storage is preserved.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <p className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300 break-words">
                {this.state.error?.toString() || 'Unknown runtime error occurred.'}
              </p>
            </div>

            {/* Diagnostic Details Toggle */}
            <div>
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{this.state.showDetails ? 'Hide' : 'View'} Technical Diagnostics</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-48 space-y-2">
                  <div>
                    <span className="text-slate-400 font-bold">Stack Trace:</span>
                    <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 font-bold">Component Stack:</span>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recovery Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={this.handleResetDataAndReload}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                title="Clears potentially corrupt storage and restores demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Demo Data</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetState}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
