import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../lib/auth-context';
import { BookOpen, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { LearningLesson } from '../../types';

export const FinancialLiteracyPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const lessons = db.getLessons();
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson>(lessons[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Educational Resources</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Literacy for Micro-Enterprises
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Short, practical lessons designed for everyday shopkeepers and traders in Wolaita Sodo. Master cash management, pricing margins, and credit safety without complex jargon.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lesson List Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Available Lessons ({lessons.length})
            </h2>
            <div className="space-y-1">
              {lessons.map((lesson, idx) => {
                const isSelected = selectedLesson.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setSelectedAnswers({});
                      setShowResults(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-teal-400 font-bold shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                    <div>
                      <div className="leading-snug">{lesson.title}</div>
                      <div className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {lesson.summary}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Reader Area */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="text-xs text-teal-700 font-semibold uppercase tracking-wider capitalize">
                Category: {selectedLesson.category.replace('_', ' ')}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedLesson.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{selectedLesson.summary}</p>
            </div>

            {/* Main Lesson Content */}
            <div className="prose prose-sm max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {selectedLesson.content}
            </div>

            {/* Practical Example */}
            {selectedLesson.practical_example && (
              <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Real Wolaita Sodo Example (ETB)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedLesson.practical_example}
                </p>
              </div>
            )}

            {/* Review Questions & Knowledge Check */}
            {selectedLesson.review_questions && selectedLesson.review_questions.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Review Questions</span>
                </div>

                <div className="space-y-5">
                  {selectedLesson.review_questions.map((q, qIdx) => {
                    const answered = selectedAnswers[qIdx] !== undefined;
                    const isCorrect = selectedAnswers[qIdx] === q.correct_index;

                    return (
                      <div key={qIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selectedAnswers[qIdx] === optIdx;
                            let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                            if (showResults) {
                              if (optIdx === q.correct_index) {
                                btnStyle = 'bg-teal-50 border-teal-500 text-teal-900 font-semibold';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                              }
                            } else if (isChosen) {
                              btnStyle = 'bg-slate-900 text-white font-semibold border-slate-900';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {showResults && optIdx === q.correct_index && (
                                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {showResults && (
                          <div className={`p-3 rounded text-xs leading-relaxed ${isCorrect ? 'bg-teal-50 text-teal-900' : 'bg-slate-100 text-slate-700'}`}>
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {!showResults ? (
                    <button
                      onClick={() => setShowResults(true)}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium"
                    >
                      Reset Quiz
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('/dashboard/learning')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                  >
                    <span>Track Progress in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
