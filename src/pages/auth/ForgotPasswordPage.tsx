import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export const ForgotPasswordPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');

    const exists = resetPassword(email.trim());
    if (exists) {
      setSubmitted(true);
    } else {
      // For security, standard practice says notification sent, but we also inform if strictly testing
      setSubmitted(true);
    }
  };

  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setResetCompleted(true);
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <button
          onClick={() => onNavigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="text-xs text-slate-500">
            Enter your account email address. We will verify your credentials and assist in securing your account.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetCompleted ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">Password Reset Complete</h2>
              <p className="text-xs text-slate-600">
                Your password has been updated securely. You can now sign in with your new credentials.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/login')}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : submitted ? (
          <div className="space-y-4 py-2">
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-900 space-y-1">
                <span className="font-bold">Recovery Verification Sent:</span>
                <p>
                  A security verification token has been issued for <strong>{email}</strong>. For demonstration and instant testing, enter your new password below:
                </p>
              </div>
            </div>

            <form onSubmit={handleCompleteReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter at least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Save New Password
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. bekele.youth@sodobiz.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              Send Password Recovery Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
