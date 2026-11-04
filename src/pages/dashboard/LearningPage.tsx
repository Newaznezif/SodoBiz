import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { LearningLesson } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const LearningPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const lessons = db.getLessons();
  const progressList = db.getLessonProgress(currentUser.id);

  const [selectedLesson, setSelectedLesson] = useState<LearningLesson>(lessons[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const getProgress = (lessonId: string) => {
    return progressList.find((p) => p.lesson_id === lessonId);
  };

  const completedCount = progressList.filter((p) => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCompleteQuiz = () => {
    if (!selectedLesson.review_questions || selectedLesson.review_questions.length === 0) return;

    let correct = 0;
    selectedLesson.review_questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedLesson.review_questions.length) * 100);
    setQuizSubmitted(true);

    db.saveLessonProgress(currentUser.id, selectedLesson.id, 'completed', score);
    refreshData();
  };

  const handleMarkCompletedDirect = () => {
    db.saveLessonProgress(currentUser.id, selectedLesson.id, 'completed', 100);
    refreshData();
  };

  const currentProgress = getProgress(selectedLesson.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Literacy & Business Education
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            12 practical lessons with Ethiopian Birr calculations, cash separation, and credit safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 font-mono tabular-nums">
              {completedCount} of {lessons.length} Completed
            </div>
            <div className="text-[11px] text-teal-700 font-medium">Curriculum Progress ({progressPercent}%)</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-teal-600 flex items-center justify-center font-bold text-xs text-teal-800 font-mono">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lesson Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
            Lesson Modules
          </div>
          <div className="space-y-1">
            {lessons.map((lesson, idx) => {
              const isSelected = selectedLesson.id === lesson.id;
              const prog = getProgress(lesson.id);
              const isDone = prog?.status === 'completed';

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-teal-400 font-bold shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div>
                      <div className="leading-snug">{lesson.title}</div>
                      <div className={`text-[10px] mt-0.5 capitalize ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {lesson.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {isDone && (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Reader */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider capitalize">
                Category: {selectedLesson.category.replace('_', ' ')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {selectedLesson.title}
              </h2>
            </div>

            {currentProgress?.status === 'completed' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 text-teal-800 text-xs font-semibold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            )}
          </div>

          {/* Lesson Body */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {selectedLesson.content}
          </div>

          {/* Practical Example Box */}
          {selectedLesson.practical_example && (
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Wolaita Sodo Market Scenario</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedLesson.practical_example}
              </p>
            </div>
          )}

          {/* Review Quiz */}
          {selectedLesson.review_questions && selectedLesson.review_questions.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Knowledge Check</span>
                </div>
                {quizSubmitted && (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {selectedLesson.review_questions.map((q, qIdx) => {
                  const answered = selectedAnswers[qIdx] !== undefined;
                  const isCorrect = selectedAnswers[qIdx] === q.correct_index;

                  return (
                    <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="text-xs font-semibold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isChosen = selectedAnswers[qIdx] === optIdx;
                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                          if (quizSubmitted) {
                            if (optIdx === q.correct_index) {
                              btnStyle = 'bg-teal-50 border-teal-500 text-teal-900 font-bold';
                            } else if (isChosen && !isCorrect) {
                              btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-slate-900 text-white font-semibold border-slate-900';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correct_index && (
                                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 bg-teal-50/60 rounded text-xs text-teal-950">
                          <strong>Rationale:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCompleteQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length <
                      selectedLesson.review_questions.length
                    }
                    className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs shadow-xs"
                  >
                    Submit Quiz & Record Completion
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div className="text-xs text-teal-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Lesson marked as completed in your profile!</span>
                  </div>
                  <button
                    onClick={() => {
                      const nextIdx = lessons.findIndex((l) => l.id === selectedLesson.id) + 1;
                      if (nextIdx < lessons.length) {
                        setSelectedLesson(lessons[nextIdx]);
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
