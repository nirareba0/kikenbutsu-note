'use client';

import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../../lib/questions';
import { LESSONS } from '../../lib/curriculum';
import { SUBJECTS, EXAM_CONFIG, isExamExpired, gradeExam } from '../../lib/scoring';
import type { ExamSession, ExamResult, Question } from '../../lib/types';
import {
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Send,
} from 'lucide-react';

interface ExamViewProps {
  currentSession: ExamSession | null;
  viewingResult: ExamResult | null;
  onStartSession: () => void;
  onUpdateSession: (session: ExamSession) => void;
  onSubmitSession: (session: ExamSession) => ExamResult | null;
  onClearViewingResult: () => void;
  onNavigateToLesson: (lessonId: string) => void;
}

export function ExamView({
  currentSession,
  viewingResult,
  onStartSession,
  onUpdateSession,
  onSubmitSession,
  onClearViewingResult,
  onNavigateToLesson,
}: ExamViewProps) {
  // 現在の試験状態: 'intro' (開始前) | 'running' (実施中) | 'result' (結果表示)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(EXAM_CONFIG.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // カウントダウンタイマー（絶対deadlineに基づく）
  useEffect(() => {
    if (viewingResult || !currentSession || currentSession.isCompleted) return;


    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((currentSession.deadline - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        // 制限時間到達 -> 自動提出
        handleAutoSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentSession]);

  const handleAutoSubmit = () => {
    if (!currentSession || currentSession.isCompleted) return;
    const res = onSubmitSession(currentSession);
    if (res) {
      setShowSubmitModal(false);
    }
  };

  const handleManualSubmit = () => {
    if (!currentSession || currentSession.isCompleted) return;
    const res = onSubmitSession(currentSession);
    if (res) {
      setShowSubmitModal(false);
    }
  };


  // 選択肢を選択
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (!currentSession || currentSession.isCompleted) return;
    const updated: ExamSession = {
      ...currentSession,
      answers: {
        ...currentSession.answers,
        [questionId]: optionIndex,
      },
    };
    onUpdateSession(updated);
  };

  // 問題インデックス変更
  const handleSelectQuestionIndex = (index: number) => {
    if (!currentSession) return;
    onUpdateSession({
      ...currentSession,
      currentQuestionIndex: index,
    });
  };

  // 時間フォーマット mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. 結果画面表示中
  if (viewingResult) {
    const result = viewingResult;
    return (
      <div className="py-6 space-y-6">
        {/* 結果サマリーバナー */}
        <div
          className={`rounded-3xl border-3 p-6 md:p-8 text-center shadow-lg relative overflow-hidden ${
            result.isPassed
              ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 via-amber-50 to-white text-slate-800'
              : 'border-blue-300 bg-gradient-to-b from-blue-50 via-slate-50 to-white text-slate-800'
          }`}
        >
          {result.isPassed ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <img
                  src="/assets/trophy.jpg"
                  alt="合格トロフィー"
                  className="h-28 w-28 object-contain drop-shadow-md animate-bounce"
                />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-slate-900 shadow-xs">
                <span>🎉 丙種 合格基準クリア！おめでとう！ 🎉</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                模擬試験 合格判定！！
              </h2>
              <p className="text-sm md:text-base font-bold text-slate-600 max-w-lg mx-auto leading-relaxed">
                全3科目すべてにおいて合格基準（60%以上）を突破しました！この調子で本番試験も一発合格間違いなし！
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/assets/mascot.jpg"
                alt="ヒナタ先輩"
                className="h-20 w-20 rounded-2xl border-2 border-blue-400 object-cover shadow-xs"
              />
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                <span>ヒナタ先輩「お疲れさま！次は絶対いけるよ！」</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                あと一歩！再チャレンジしよう！
              </h2>
              <p className="text-sm font-medium text-slate-600 max-w-lg mx-auto leading-relaxed">
                総合点が高くても、1科目でも60%未満があると不合格判定になります。下の「教科書へ」ボタンから苦手単元を復習しよう！
              </p>
            </div>
          )}

          <div className="mt-6 inline-flex items-center gap-6 rounded-2xl bg-white px-8 py-3.5 border-2 border-slate-200 shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 block">総合得点</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800">
                {result.totalScore} / 25
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-xs font-bold text-slate-400 block">正答率</span>
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  result.isPassed ? 'text-amber-500' : 'text-blue-600'
                }`}
              >
                {result.percentage}%
              </span>
            </div>
          </div>
        </div>


        {/* 科目別得点・合否内訳 */}
        <div className="rounded-xl border border-[#d4e0f0] bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#173052]">科目別 成績内訳</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['law', 'combustion', 'properties'] as const).map((sId) => {
              const sRes = result.subjectScores[sId];
              const sInfo = SUBJECTS[sId];
              return (
                <div
                  key={sId}
                  className={`rounded-lg border p-4 ${
                    sRes.isPassed
                      ? 'border-[#245bdd]/40 bg-[#f8fafc]'
                      : 'border-[#d9383a]/40 bg-[#d9383a]/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#4a5d78]">{sInfo.shortName}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        sRes.isPassed
                          ? 'bg-[#245bdd] text-white'
                          : 'bg-[#d9383a] text-white'
                      }`}
                    >
                      {sRes.isPassed ? '合格基準達成' : '基準未達'}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-[#173052]">
                    {sRes.score} / {sRes.total} 問正解
                  </div>
                  <div className="mt-1 text-xs text-[#4a5d78]">
                    正答率 {sRes.percentage}%（基準: {sInfo.passingScore}問 / 60%以上）
                  </div>
                  {/* プログレスバー */}
                  <div className="mt-2 h-2 w-full rounded-full bg-[#edf2f9] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sRes.isPassed ? 'bg-[#245bdd]' : 'bg-[#d9383a]'
                      }`}
                      style={{ width: `${sRes.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 各問題の振り返りと解説 */}
        <div className="rounded-xl border border-[#d4e0f0] bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2f9] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#173052]">全25問の解答・解説</h3>
              <p className="text-xs text-[#4a5d78]">
                あなたの選んだ選択肢と正解、各選択肢の解説を確認できます。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onClearViewingResult()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4e0f0] bg-white px-3 py-2 text-xs font-bold text-[#4a5d78] hover:bg-[#edf2f9] min-h-[44px]"
              >
                <span>模試トップへ</span>
              </button>
              <button
                onClick={() => {
                  onClearViewingResult();
                  onStartSession();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#245bdd] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f4ebd] min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>もう一度模試を受ける</span>
              </button>
            </div>
          </div>


          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => {
              const userAns = result.answers[q.id];
              const isAnswered = typeof userAns === 'number';
              const isCorrect = isAnswered && userAns === q.correctIndex;
              const lesson = LESSONS.find((l) => l.id === q.lessonId);

              return (
                <div
                  key={q.id}
                  className={`rounded-lg border p-4 ${
                    isCorrect
                      ? 'border-[#245bdd]/40 bg-[#f8fafc]'
                      : 'border-[#d9383a]/40 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs bg-[#173052] text-white px-2 py-0.5 rounded">
                        第 {idx + 1} 問
                      </span>
                      <span className="text-xs font-semibold text-[#4a5d78]">
                        {SUBJECTS[q.subjectId].name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-[#245bdd]/20 text-[#245bdd]'
                            : 'bg-[#d9383a]/20 text-[#d9383a]'
                        }`}
                      >
                        {isCorrect ? '正解' : isAnswered ? '不正解' : '未回答'}
                      </span>
                      {lesson && (
                        <button
                          onClick={() => onNavigateToLesson(lesson.id)}
                          className="text-xs text-[#245bdd] hover:underline flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>教科書へ</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm md:text-base font-bold text-[#173052] mb-3">
                    {q.text}
                  </p>

                  {/* 選択肢と解説 */}
                  <div className="space-y-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAns === optIdx;
                      const isCorrectOpt = optIdx === q.correctIndex;

                      return (
                        <div
                          key={optIdx}
                          className={`rounded p-2.5 border ${
                            isCorrectOpt
                              ? 'border-[#245bdd] bg-[#e5edf8]/60 font-semibold'
                              : isSelected
                              ? 'border-[#d9383a] bg-[#d9383a]/10'
                              : 'border-[#edf2f9] bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-[#173052]">[{optIdx + 1}]</span>
                            <span className="text-[#173052] flex-1">{opt}</span>
                            {isCorrectOpt && (
                              <span className="text-[#245bdd] font-bold shrink-0">【正解】</span>
                            )}
                            {isSelected && !isCorrectOpt && (
                              <span className="text-[#d9383a] font-bold shrink-0">【選択】</span>
                            )}
                          </div>
                          <p className="mt-1 text-[#4a5d78] pl-5 leading-relaxed">
                            {q.explanations[optIdx]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. 開始前画面（説明）
  if (!currentSession || currentSession.isCompleted) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-md space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img
                src="/assets/mascot.jpg"
                alt="ヒナタ先輩"
                className="h-20 w-20 rounded-2xl border-2 border-amber-300 object-cover shadow-xs"
              />
            </div>
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-black text-blue-700 mb-1">
                本番試験シミュレーション
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                丙種 本番形式 模擬試験
              </h2>
              <p className="text-sm text-slate-500 font-bold mt-1">
                試験時間75分・四肢択一25問・全科目60%合格判定
              </p>
            </div>
          </div>


          <div className="rounded-lg bg-[#f8fafc] border border-[#d4e0f0] p-4 text-xs md:text-sm space-y-3 text-[#173052]">
            <h3 className="font-bold text-[#173052] border-b border-[#edf2f9] pb-2">
              【試験の仕様と実施ルール】
            </h3>
            <ul className="space-y-2 list-disc list-inside leading-relaxed text-[#4a5d78]">
              <li>
                <strong className="text-[#173052]">出題数：</strong> 全25問（法令10問、燃焼消火5問、性質消火10問）
              </li>
              <li>
                <strong className="text-[#173052]">試験時間：</strong> 75分（カウントダウン、時間切れで自動提出）
              </li>
              <li>
                <strong className="text-[#173052]">合格基準：</strong> 3科目それぞれで正答率60%以上（法令6問、燃焼消火3問、性消6問以上）。1科目でも下回ると不合格となります。
              </li>
              <li>
                <strong className="text-[#173052]">試験中の採点：</strong> 試験中は正解や解説は一切表示されません。提出後にまとめて採点されます。
              </li>
              <li>
                <strong className="text-[#173052]">未回答の扱い：</strong> 未回答の問題は不正解として処理されます。
              </li>
              <li>
                <strong className="text-[#173052]">中断と再開：</strong> ページを閉じたりリロードしても、期限時刻までは続きから回答を再開できます。
              </li>
            </ul>
          </div>

          <button
            onClick={() => onStartSession()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245bdd] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#1f4ebd] shadow-xs min-h-[48px]"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>模擬試験を開始する（75分）</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. 試験実施中画面
  const qIndex = currentSession.currentQuestionIndex;
  const currentQuestion = QUESTIONS[qIndex];
  const selectedOption = currentSession.answers[currentQuestion.id];
  const answeredCount = Object.keys(currentSession.answers).length;
  const unansweredCount = QUESTIONS.length - answeredCount;

  return (
    <div className="py-6 space-y-6">
      {/* 固定トップバー（残り時間・未回答数・提出ボタン） */}
      <div className="sticky top-16 z-30 rounded-xl border border-[#d4e0f0] bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-base font-bold text-[#173052]">
            <Clock className={`w-5 h-5 ${remainingSeconds < 300 ? 'text-[#d9383a] animate-pulse' : 'text-[#245bdd]'}`} />
            <span className={remainingSeconds < 300 ? 'text-[#d9383a]' : 'text-[#173052]'}>
              残り時間: {formatTime(remainingSeconds)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#4a5d78]">
            <span>回答済み: {answeredCount} / 25</span>
            <span className="text-[#d9383a]">（未回答: {unansweredCount}）</span>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#173052] px-4 py-2 text-xs font-bold text-white hover:bg-[#20406d] min-h-[44px]"
        >
          <Send className="w-4 h-4" />
          <span>試験を終了して提出</span>
        </button>
      </div>

      {/* 問題表示カード */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-[#4a5d78] border-b border-[#edf2f9] pb-3">
          <span className="font-bold text-[#245bdd] bg-[#e5edf8] px-2.5 py-1 rounded">
            {SUBJECTS[currentQuestion.subjectId].name}
          </span>
          <span className="font-bold text-[#173052]">
            問題 {qIndex + 1} / 25
          </span>
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#173052] leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>

        {/* 4つの選択肢 */}
        <div className="space-y-3" role="radiogroup" aria-label="問題の選択肢">
          {currentQuestion.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            return (
              <label
                key={optIdx}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors min-h-[44px] ${
                  isSelected
                    ? 'border-[#245bdd] bg-[#245bdd]/5 ring-2 ring-[#245bdd]'
                    : 'border-[#d4e0f0] bg-white hover:bg-[#f8fafc]'
                }`}
              >
                <input
                  type="radio"
                  name={`exam-q-${currentQuestion.id}`}
                  value={optIdx}
                  checked={isSelected}
                  onChange={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className="mt-1 h-5 w-5 text-[#245bdd] focus:ring-[#245bdd]"
                />
                <div className="text-base text-[#173052] leading-relaxed">
                  <span className="font-bold mr-2 text-[#4a5d78]">[{optIdx + 1}]</span>
                  <span>{opt}</span>
                </div>
              </label>
            );
          })}
        </div>

        {/* 前へ / 次へ ナビゲーション */}
        <div className="pt-4 border-t border-[#edf2f9] flex items-center justify-between">
          <button
            onClick={() => handleSelectQuestionIndex(Math.max(0, qIndex - 1))}
            disabled={qIndex === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#173052] hover:text-[#245bdd] disabled:opacity-30 min-h-[44px] px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>前の問題</span>
          </button>

          <button
            onClick={() => handleSelectQuestionIndex(Math.min(QUESTIONS.length - 1, qIndex + 1))}
            disabled={qIndex === QUESTIONS.length - 1}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#245bdd] hover:underline disabled:opacity-30 min-h-[44px] px-2"
          >
            <span>次の問題</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 問題パレット（1〜25番） */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-[#4a5d78]">
          <span className="font-bold text-[#173052]">問題番号一覧パレット</span>
          <span>青: 回答済み / 灰: 未回答 / 枠線: 現在位置</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-13 gap-2">
          {QUESTIONS.map((q, idx) => {
            const hasAnswered = typeof currentSession.answers[q.id] === 'number';
            const isCurrent = idx === qIndex;

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestionIndex(idx)}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  hasAnswered
                    ? 'bg-[#245bdd] text-white'
                    : 'bg-[#edf2f9] text-[#4a5d78]'
                } ${isCurrent ? 'ring-2 ring-[#173052] ring-offset-2' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* 提出確認モーダル */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4 border border-[#d4e0f0]">
            <h3 className="text-lg font-bold text-[#173052]">試験を終了して提出しますか？</h3>
            {unansweredCount > 0 ? (
              <div className="rounded-lg bg-[#d9383a]/10 border border-[#d9383a]/30 p-3 text-xs text-[#173052] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#d9383a] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#d9383a]">
                    未回答の問題が {unansweredCount} 問あります。
                  </span>
                  <p className="mt-0.5 text-[#4a5d78]">
                    未回答の問題はすべて不正解（0点）として採点されます。
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#4a5d78]">
                すべての問題（25問）に回答済みです。提出すると採点結果が表示されます。
              </p>
            )}

            <div className="pt-3 border-t border-[#edf2f9] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg border border-[#d4e0f0] px-4 py-2 text-xs font-bold text-[#4a5d78] hover:bg-[#edf2f9] min-h-[44px]"
              >
                回答を続ける
              </button>
              <button
                onClick={handleManualSubmit}
                className="rounded-lg bg-[#245bdd] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f4ebd] min-h-[44px]"
              >
                採点する（提出）
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
