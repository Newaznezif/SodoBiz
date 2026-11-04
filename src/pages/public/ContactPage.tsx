import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../lib/auth-context';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    db.createSupportRequest({
      user_id: currentUser.id,
      subject,
      description: message,
      status: 'open',
    });

    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Contact & Support</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect With the SodoBiz Advisory Team
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have questions about business record-keeping, agent assignments, or institutional referral partnerships in Wolaita Sodo? Send us a message or visit our community hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Field Desk</div>
                  <div className="text-xs text-slate-500">Piazza Area, Wolaita Sodo</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Phone Support</div>
                  <div className="text-xs text-slate-500 font-mono">+251 46 551 0982</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Desk</div>
                  <div className="text-xs text-slate-500 font-mono">support@sodobiz.et</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-2">
              <div className="font-bold text-white text-xs">Pilot Service Hours:</div>
              <p className="leading-relaxed">
                Monday – Saturday: 8:30 AM – 5:30 PM EAT.
                Support agents are active at Wolaita Sodo central market on Tuesday and Saturday market days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your inquiry has been logged in our support management system. An agent or administrator will review it shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-slate-900">Submit an Inquiry or Assistance Request</h2>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subject / Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistance with Omo Bank loan documentation"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Detailed Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your question or the challenge your enterprise is facing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
