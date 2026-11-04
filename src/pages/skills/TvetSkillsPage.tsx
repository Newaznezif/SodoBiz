import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Users,
  Target,
  Clock,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const TvetSkillsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [enrolledInterest, setEnrolledInterest] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('ict');

  const tracks = [
    {
      id: 'ict',
      title: 'Digital Commerce & Mobile App Maintenance',
      provider: 'Wolaita Digital Innovations Hub & TVET Center',
      duration: '3 Months (Level 2 National TVET)',
      seats: '15 Youth in Cohort 1',
      description: 'Computer literacy, telebirr merchant integration, Android tablet maintenance, and digital ledger operations for retail businesses.',
      skills: ['Office Productivity', 'Digital Payments', 'Hardware Troubleshooting', 'Customer Relations'],
    },
    {
      id: 'agro',
      title: 'Agro-Processing, Quality & Packhouse Operations',
      provider: 'Damota Agro-Processing Enterprise',
      duration: '4 Months (On-the-job Apprenticeship)',
      seats: '12 Youth in Cohort 1',
      description: 'Grain sorting, clean hygiene handling, spice processing machine operation, and quality packaging for regional dispatch.',
      skills: ['Food Safety', 'Machine Operation', 'Inventory Control', 'Packaging Standards'],
    },
    {
      id: 'automotive',
      title: 'Bajaj, Motorcycle & EV Mechanics Apprenticeship',
      provider: 'Highlands Automotive & Mechanics Workshop',
      duration: '6 Months (Vocational Apprenticeship)',
      seats: '8 Youth in Cohort 1',
      description: 'Two-stroke and four-stroke three-wheeler engine servicing, electrical troubleshooting, brake maintenance, and tire care.',
      skills: ['Engine Overhaul', 'Wiring Systems', 'Preventive Maintenance', 'Safety Protocols'],
    },
    {
      id: 'barista',
      title: 'Specialty Coffee Barista & Food Service Hospitality',
      provider: 'Sodo City Youth Center Skill Development Center',
      duration: '2 Months (Intensive Practical)',
      seats: '5 Youth in Cohort 1',
      description: 'Traditional and modern Wolaita coffee brewing, espresso calibration, milk steaming, and local hospitality service standards.',
      skills: ['Coffee Extraction', 'Roast Grading', 'Customer Hospitality', 'Cash Handling'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Sodo Innovation HackLab Cohort Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Sodo Innovation HackLab TVET Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Vocational Skills & Apprenticeship Cohorts
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Addressing regional skill gaps and underemployment. Connecting out-of-school youth and certified job seekers directly with accredited TVET institutes and participating local employers.
          </p>
        </div>

        {/* Milestone Goal Progress Bar: 40 Enrolled vs 1,000 Target */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 pb-2">
            <span className="font-semibold text-slate-200">
              Regional Youth TVET Enrollment Tracker: <span className="text-amber-400 font-mono">40 youth in Cohort 1</span>
            </span>
            <span className="text-slate-400">Target: 1,000 Trained Youth across Wolaita Zone</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className="bg-amber-400 h-3 rounded-full" style={{ width: '4%' }}></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cohort 1: 40 active in Sodo</span>
            <span className="text-teal-400 font-medium">Cohort 2 Applications Open</span>
          </div>
        </div>
      </div>

      {/* Cohort Tracks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {track.duration}
                </span>
                <span className="text-xs font-semibold text-slate-600 font-mono">{track.seats}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{track.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{track.provider}</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{track.description}</p>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Core Competencies:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {track.skills.map((skill, idx) => (
                    <span key={idx} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/opportunities')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View Linked Apprenticeships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setEnrolledInterest(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Apply for Cohort 2
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cohort 2 Modal */}
      {enrolledInterest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Cohort 2 TVET Registration</h3>
              <button onClick={() => setEnrolledInterest(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your profile has been logged for Cohort 2 intake screening at the Sodo City Youth Center. You will receive an SMS confirmation at your registered phone number ({currentUser.phone || '+251 91 199 8877'}).
            </p>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Priority given to out-of-school youth and TVET Level 1 candidates.</span>
            </div>

            <button
              onClick={() => setEnrolledInterest(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
