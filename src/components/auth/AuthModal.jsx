import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Clock, 
  GraduationCap, 
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { demoAccounts } from '../../data/defaultData';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  initialMode = 'login' 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Forgot password sub-state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    academicGoal: 'Score >90% in Semester Finals',
    dailyHours: 4,
    preferredTime: 'Evening',
    level: 'Undergraduate',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  // Synchronize initial mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setIsForgotPassword(false);
      setForgotSuccess(false);
    }
  }, [isOpen, initialMode]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Quick Demo Login (1-Click)
  const handleQuickDemoLogin = (account) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      onLogin({
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role || 'Student',
        academicGoal: account.academicGoal,
        dailyHours: account.dailyHours,
        preferredTime: account.preferredTime,
        streakDays: 7,
        totalHoursStudied: 42.5,
        consistencyScore: 94
      });
      onClose?.();
    }, 450);
  };

  // Handle Sign In Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!loginEmail.includes('@') || !loginEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const matchedDemo = demoAccounts.find(
        acc => acc.email.toLowerCase() === loginEmail.trim().toLowerCase()
      );

      const userSession = matchedDemo ? {
        id: matchedDemo.id,
        name: matchedDemo.name,
        email: matchedDemo.email,
        role: matchedDemo.role || 'Student',
        academicGoal: matchedDemo.academicGoal,
        dailyHours: matchedDemo.dailyHours,
        preferredTime: matchedDemo.preferredTime,
        streakDays: 7,
        totalHoursStudied: 42.5,
        consistencyScore: 94
      } : {
        id: `user-${Date.now()}`,
        name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: loginEmail.trim(),
        role: 'Student',
        academicGoal: 'Score >90% in Semester Finals',
        dailyHours: 4,
        preferredTime: 'Evening',
        streakDays: 1,
        totalHoursStudied: 0,
        consistencyScore: 100
      };

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      onLogin(userSession);
      onClose?.();
    }, 550);
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupForm.name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!signupForm.email.trim() || !signupForm.email.includes('@')) {
      setErrorMessage('Please provide a valid student email.');
      return;
    }
    if (!signupForm.password || signupForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!signupForm.agreeTerms) {
      setErrorMessage('Please agree to the Academic Code of Conduct.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const newUser = {
        id: `user-${Date.now()}`,
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        role: signupForm.level,
        academicGoal: signupForm.academicGoal,
        dailyHours: Number(signupForm.dailyHours) || 4,
        preferredTime: signupForm.preferredTime,
        streakDays: 1,
        totalHoursStudied: 0,
        consistencyScore: 100
      };

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });

      onLogin(newUser);
      onClose?.();
    }, 650);
  };

  // Handle Social Login (SSO)
  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      const socialUser = {
        id: `user-${provider}-${Date.now()}`,
        name: provider === 'Google' ? 'Alex Rivera (Google)' : 'Dev Student (GitHub)',
        email: provider === 'Google' ? 'alex.rivera@gmail.com' : 'student@github.com',
        role: 'Verified Student',
        academicGoal: 'Score >90% in Semester Finals',
        dailyHours: 4,
        preferredTime: 'Evening',
        streakDays: 7,
        totalHoursStudied: 42.5,
        consistencyScore: 94
      };

      confetti({
        particleCount: 65,
        spread: 65,
        origin: { y: 0.6 }
      });

      onLogin(socialUser);
      onClose?.();
    }, 600);
  };

  // Handle Forgot Password dispatch
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setIsForgotPassword(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="relative w-full max-w-lg my-8 rounded-3xl overflow-hidden glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
        
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close popup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 mb-1">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isForgotPassword ? 'Reset Password' : mode === 'login' ? 'Sign In to Your Planner' : 'Create Student Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isForgotPassword 
                ? 'Enter your student email and we’ll send a secure password reset link.'
                : mode === 'login'
                ? 'Access your personalised timetable, exam countdowns, and adaptive AI schedule.'
                : 'Build your adaptive study plan with spaced repetition and automatic balancing.'
              }
            </p>
          </div>

          {/* Mode Tabs (Sign In vs Create Account) */}
          {!isForgotPassword && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* 1-CLICK INSTANT DEMO ACCESS */}
          {!isForgotPassword && (
            <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Instant Demo Access (1-Click)
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                  No Password
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(account)}
                    disabled={isLoading}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200/60 dark:border-indigo-800/60 text-left transition-all hover:scale-[1.01] group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {account.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {account.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {account.role}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SSO Buttons */}
          {!isForgotPassword && (
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Or with email
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {isForgotPassword ? (
            <div className="space-y-4">
              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>
                    A password recovery link has been dispatched to <strong>{forgotEmail}</strong>.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      ← Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : mode === 'login' ? (
            /* VIEW: SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alex.rivera@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Remember me
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Timetable</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* VIEW: CREATE ACCOUNT FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="alex@univ.edu"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Study Hours
                  </label>
                  <select
                    value={signupForm.dailyHours}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, dailyHours: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={2}>2 Hours / day</option>
                    <option value={3}>3 Hours / day</option>
                    <option value={4}>4 Hours (Standard)</option>
                    <option value={5}>5 Hours / day</option>
                    <option value={6}>6+ Hours / day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peak Study Time
                  </label>
                  <select
                    value={signupForm.preferredTime}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night Owl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password (min 6)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeTerms}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    I agree to the Academic Code of Conduct & Terms
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Start Learning</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer: Dismiss / Guest Option */}
          <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium underline underline-offset-2"
            >
              Continue as Guest
            </button>

            {!isForgotPassword && (
              <div>
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(''); }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Need an account? Sign Up
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Have an account? Sign In
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
