'use client';

import React, { useState } from 'react';
import { QUESTIONS } from '../../lib/questions';
import { LESSONS } from '../../lib/curriculum';
import { SUBJECTS } from '../../lib/scoring';
import type { PracticeAnswer, Question, SubjectId } from '../../lib/types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

interface PracticeViewProps {
  currentQuestionId: string;
  practiceAnswers: Record<string, PracticeAnswer>;
  onSaveAnswer: (ans: PracticeAnswer) => void;
  onClearReviewMark: (questionId: string) => void;
  onNavigateToLesson: (lessonId: string) => void;
  onSelectQuestion: (questionId: string) => void;
}

export function PracticeView({
  currentQuestionId,
  practiceAnswers,
  onSaveAnswer,
  onClearReviewMark,
  onNavigateToLesson,
  onSelectQuestion,
}: PracticeViewProps) {
  // 現在の問題
  const currentQuestionIndex = QUESTIONS.findIndex((q) => q.id === currentQuestionId);
  const question: Question =
    currentQuestionIndex >= 0 ? QUESTIONS[currentQuestionIndex] : QUESTIONS[0];

  // 過去の回答記録があるか
  const recordedAnswer = practiceAnswers[question.id];

  // ローカル入力状態
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    recordedAnswer ? recordedAnswer.selectedIndex : null
  );
  const [isConfirmed, setIsConfirmed] = useState<boolean>(!!recordedAnswer);
  const [isUncertain, setIsUncertain] = useState<boolean>(
    recordedAnswer ? recordedAnswer.isUncertain : false
  );

  // 問題切り替え時のリセット（または記録読み込み）
  const handleSelectQuestion = (qId: string) => {
    onSelectQuestion(qId);
    const existing = practiceAnswers[qId];
    if (existing) {
      setSelectedIndex(existing.selectedIndex);
      setIsConfirmed(true);
      setIsUncertain(existing.isUncertain);
    } else {
      setSelectedIndex(null);
      setIsConfirmed(false);
      setIsUncertain(false);
    }
  };

  // 解答確定
  const handleConfirmAnswer = () => {
    if (selectedIndex === null) return;
    const isCorrect = selectedIndex === question.correctIndex;
    const answerData: PracticeAnswer = {
      questionId: question.id,
      selectedIndex,
      isCorrect,
      isUncertain,
      answeredAt: Date.now(),
    };
    onSaveAnswer(answerData);
    setIsConfirmed(true);
  };

  // 自信なしトグル更新
  const handleToggleUncertain = (checked: boolean) => {
    setIsUncertain(checked);
    if (isConfirmed && selectedIndex !== null) {
      const isCorrect = selectedIndex === question.correctIndex;
      onSaveAnswer({
        questionId: question.id,
        selectedIndex,
        isCorrect,
        isUncertain: checked,
        answeredAt: Date.now(),
      });
    }
  };

  // やり直し
  const handleRetry = () => {
    setSelectedIndex(null);
    setIsConfirmed(false);
  };

  // 間違い・自信なしの解消
  const handleResolveReview = () => {
    if (recordedAnswer && recordedAnswer.isCorrect) {
      onClearReviewMark(question.id);
      setIsUncertain(false);
    }
  };

  const currentLesson = LESSONS.find((l) => l.id === question.lessonId);
  const subject = SUBJECTS[question.subjectId];

  // 前後の問題
  const prevQuestion = currentQuestionIndex > 0 ? QUESTIONS[currentQuestionIndex - 1] : null;
  const nextQuestion =
    currentQuestionIndex < QUESTIONS.length - 1 ? QUESTIONS[currentQuestionIndex + 1] : null;

  return (
    <div className="py-6 space-y-6">
      {/* 上部バー：科目・問題番号・単元情報 */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xs bg-[#e5edf8] text-[#245bdd] px-2.5 py-1 rounded">
            {subject.name}
          </span>
          <span className="text-sm font-bold text-[#173052]">
            第 {currentQuestionIndex + 1} 問 / 全 {QUESTIONS.length} 問
          </span>
        </div>

        {currentLesson && (
          <button
            onClick={() => onNavigateToLesson(currentLesson.id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245bdd] hover:underline min-h-[44px] px-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>教科書: {currentLesson.title}</span>
          </button>
        )}
      </div>

      {/* 問題本体カード */}
      <div className="rounded-3xl border-2 border-slate-200/80 bg-white shadow-sm p-6 md:p-8 space-y-6">
        {/* 解答確定後のフィードバックバナー */}
        {isConfirmed && selectedIndex !== null && (
          selectedIndex === question.correctIndex ? (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white font-black flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎉</span>
                <div>
                  <span className="text-base block">ナイス正解！お見事！</span>
                  <span className="text-xs text-emerald-100 font-bold">全選択肢の理由・解説を確認してみよう</span>
                </div>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black text-white">
                +20 EXP 獲得 🔥
              </span>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-white font-black flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💡</span>
                <div>
                  <span className="text-base block">惜しい！解説をチェックしよう</span>
                  <span className="text-xs text-rose-100 font-bold">間違えた問題は教科書に戻って復習できるよ</span>
                </div>
              </div>
              {currentLesson && (
                <button
                  onClick={() => onNavigateToLesson(currentLesson.id)}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-black text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  教科書へ飛ぶ 📖
                </button>
              )}
            </div>
          )
        )}

        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-wider block mb-1">【四肢択一問題】</span>
          <h3 className="text-lg md:text-xl font-black text-slate-800 leading-relaxed">
            {question.text}
          </h3>
        </div>

        {/* 選択肢リスト */}
        <div className="space-y-3" role="radiogroup" aria-label="選択肢">

          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === question.correctIndex;

            let borderClass = 'border-[#d4e0f0] bg-white hover:bg-[#f8fafc]';
            let badgeText = `${idx + 1}`;

            if (isConfirmed) {
              if (isCorrectOption) {
                borderClass = 'border-[#245bdd] bg-[#e5edf8]/60 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                borderClass = 'border-[#d9383a] bg-[#d9383a]/10';
              } else {
                borderClass = 'border-[#edf2f9] bg-gray-50 opacity-75';
              }
            } else if (isSelected) {
              borderClass = 'border-[#245bdd] bg-[#245bdd]/5 ring-2 ring-[#245bdd]';
            }

            return (
              <div
                key={idx}
                className={`rounded-lg border p-4 transition-all min-h-[44px] ${borderClass}`}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={idx}
                    checked={isSelected}
                    onChange={() => {
                      if (!isConfirmed) setSelectedIndex(idx);
                    }}
                    disabled={isConfirmed}
                    className="mt-1 h-5 w-5 text-[#245bdd] focus:ring-[#245bdd]"
                  />
                  <div className="flex-1 text-base text-[#173052] leading-relaxed">
                    <span className="font-bold mr-2 text-[#4a5d78]">[{badgeText}]</span>
                    <span>{option}</span>
                  </div>
                </label>

                {/* 確定後：選択肢ごとの解説 */}
                {isConfirmed && (
                  <div className="mt-3 pt-3 border-t border-black/5 text-sm pl-8">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {isCorrectOption ? (
                        <span className="text-[#245bdd] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 【正解】
                        </span>
                      ) : (
                        <span className="text-[#4a5d78]">【選択肢 {idx + 1} の解説】</span>
                      )}
                    </div>
                    <p className="text-[#173052] leading-relaxed">
                      {question.explanations[idx]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 自信なしトグル & 操作アクション */}
        <div className="pt-4 border-t border-[#edf2f9] flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none min-h-[44px] px-2 py-1 rounded hover:bg-[#edf2f9]">
            <input
              type="checkbox"
              checked={isUncertain}
              onChange={(e) => handleToggleUncertain(e.target.checked)}
              className="h-5 w-5 rounded border-[#d4e0f0] text-[#f4c84b] focus:ring-[#245bdd]"
            />
            <span className="text-sm font-semibold text-[#173052]">
              自信がない（要復習にマークする）
            </span>
          </label>

          <div className="flex items-center gap-3">
            {!isConfirmed ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedIndex === null}
                className="inline-flex items-center justify-center rounded-lg bg-[#245bdd] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1f4ebd] disabled:opacity-40 min-h-[44px]"
              >
                解答を確定する
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4e0f0] bg-white px-3.5 py-2 text-xs font-semibold text-[#4a5d78] hover:bg-[#edf2f9] min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>もう一度解く</span>
                </button>

                {recordedAnswer && recordedAnswer.isCorrect && (recordedAnswer.isUncertain || !recordedAnswer.isCorrect) && (
                  <button
                    onClick={handleResolveReview}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#e5edf8] px-3.5 py-2 text-xs font-bold text-[#245bdd] hover:bg-[#d0e0f5] min-h-[44px]"
                  >
                    <span>復習マークを解除</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 出典情報 */}
        <div className="text-xs text-[#4a5d78] pt-2 flex items-center justify-between border-t border-[#edf2f9]">
          <div className="flex items-center gap-1">
            <span>出題基準・法令：</span>
            <a
              href={question.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#245bdd] hover:underline inline-flex items-center gap-1"
            >
              <span>{question.source.title}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span>確認日: {question.source.checkedAt}</span>
        </div>
      </div>

      {/* 問題ナビゲーションパレットと前後移動 */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#173052]">問題一覧</h4>
          <span className="text-xs text-[#4a5d78]">
            緑: 正解 / 赤: 不正解 / 黄: 自信なし / 灰: 未解答
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-13 gap-2">
          {QUESTIONS.map((q, idx) => {
            const ans = practiceAnswers[q.id];
            const isCurrent = q.id === question.id;

            let btnBg = 'bg-[#edf2f9] text-[#4a5d78]';
            if (ans) {
              if (ans.isUncertain) {
                btnBg = 'bg-[#f4c84b] text-[#173052] font-bold';
              } else if (ans.isCorrect) {
                btnBg = 'bg-[#245bdd] text-white font-bold';
              } else {
                btnBg = 'bg-[#d9383a] text-white font-bold';
              }
            }

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q.id)}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-xs transition-all min-h-[44px] ${btnBg} ${
                  isCurrent ? 'ring-2 ring-[#173052] ring-offset-2' : ''
                }`}
                aria-label={`第${idx + 1}問`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#edf2f9] flex items-center justify-between">
          {prevQuestion ? (
            <button
              onClick={() => handleSelectQuestion(prevQuestion.id)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#173052] hover:text-[#245bdd] min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>第{currentQuestionIndex}問へ</span>
            </button>
          ) : (
            <span />
          )}

          {nextQuestion ? (
            <button
              onClick={() => handleSelectQuestion(nextQuestion.id)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#245bdd] hover:underline min-h-[44px]"
            >
              <span>第{currentQuestionIndex + 2}問へ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
