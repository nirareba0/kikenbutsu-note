'use client';

import React from 'react';
import { LESSONS } from '../../lib/curriculum';
import { QUESTIONS } from '../../lib/questions';
import { SUBJECTS } from '../../lib/scoring';
import { calculateExpAndLevel, getAchievementBadges } from '../../lib/gamification';
import type { AppStorageData, ExamResult, Question } from '../../lib/types';
import {
  BarChart2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Clock,
  Trash2,
  Award,
  Sparkles,
} from 'lucide-react';


interface RecordsViewProps {
  storageData: AppStorageData;
  onSelectPracticeQuestion: (questionId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onClearReviewMark: (questionId: string) => void;
  onViewExamDetail: (exam: ExamResult) => void;
  onResetAllHistory: () => void;
}

export function RecordsView({
  storageData,
  onSelectPracticeQuestion,
  onSelectLesson,
  onClearReviewMark,
  onViewExamDetail,
  onResetAllHistory,
}: RecordsViewProps) {

  // 読了数
  const totalLessons = LESSONS.length;
  const completedLessons = storageData.completedLessons.length;
  const lessonProgressPercent = Math.round((completedLessons / totalLessons) * 100);

  // 演習集計
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(storageData.practiceAnswers).length;
  const correctCount = Object.values(storageData.practiceAnswers).filter(
    (a) => a.isCorrect
  ).length;
  const practiceAccuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;

  // 要復習問題（不正解 または 自信なし）
  const reviewQuestions = QUESTIONS.filter((q) => {
    const a = storageData.practiceAnswers[q.id];
    return a && (!a.isCorrect || a.isUncertain);
  });

  const levelInfo = calculateExpAndLevel(storageData);
  const badges = getAchievementBadges(storageData);

  return (
    <div className="py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-800">学習記録・実績コレクション</h2>
        <p className="text-sm text-slate-500 mt-1">
          教科書の読了状況、演習の正答率、獲得した称号、模試の過去履歴を一元管理します。
        </p>
      </div>

      {/* 称号・バッジコレクション */}
      <div className="rounded-3xl border-2 border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            <div>
              <h3 className="text-base font-black text-slate-800">称号・実績バッジ</h3>
              <p className="text-xs text-slate-500">
                学習を進めて全バッジのアンロックを目指そう！
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <span>ランク：</span>
            <span>{levelInfo.badgeEmoji} {levelInfo.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl border-2 p-3 text-center space-y-1 transition-all ${
                badge.unlocked
                  ? 'border-amber-300 bg-amber-50/70 shadow-xs'
                  : 'border-slate-200 bg-slate-50 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl my-1">{badge.emoji}</div>
              <h4 className="text-xs font-black text-slate-800 truncate">{badge.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                {badge.description}
              </p>
              <span
                className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full ${
                  badge.unlocked
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {badge.unlocked ? '獲得済み ✓' : '未達成 🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#4a5d78] block">教科書読了率</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#173052]">
              {completedLessons}
            </span>
            <span className="text-sm text-[#4a5d78]">/ {totalLessons} 単元</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-[#edf2f9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#245bdd]"
              style={{ width: `${lessonProgressPercent}%` }}
            />
          </div>
          <span className="text-xs text-[#4a5d78] mt-1 block">
            {lessonProgressPercent}% 完了
          </span>
        </div>

        <div className="rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#4a5d78] block">演習 正答率</span>
          <div className="mt-2 flex items-baseline gap-2">
            {practiceAccuracy !== null ? (
              <>
                <span className="text-3xl font-black text-[#245bdd]">
                  {practiceAccuracy}%
                </span>
                <span className="text-sm text-[#4a5d78]">
                  ({correctCount} / {answeredCount}問正解)
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-[#4a5d78]">—</span>
            )}
          </div>
          <span className="text-xs text-[#4a5d78] mt-3 block">
            {answeredCount === 0 ? '未演習（問題未回答）' : `全${totalQuestions}問中 ${answeredCount}問解答済み`}
          </span>
        </div>

        <div className="rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#4a5d78] block">要復習リスト</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                reviewQuestions.length > 0 ? 'text-[#d9383a]' : 'text-[#245bdd]'
              }`}
            >
              {reviewQuestions.length}
            </span>
            <span className="text-sm text-[#4a5d78]">問</span>
          </div>
          <span className="text-xs text-[#4a5d78] mt-3 block">
            {reviewQuestions.length === 0
              ? '現在、苦手マークの問題はありません'
              : '不正解または「自信なし」と回答した問題'}
          </span>
        </div>
      </div>

      {/* 要復習問題一覧 */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#edf2f9] pb-3">
          <h3 className="text-base font-bold text-[#173052] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#d9383a]" />
            <span>要復習問題（{reviewQuestions.length}問）</span>
          </h3>
          <span className="text-xs text-[#4a5d78]">
            問題をタップして再演習できます
          </span>
        </div>

        {reviewQuestions.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#4a5d78]">
            現在、要復習に指定された問題はありません。演習で間違えた問題や「自信なし」を付けた問題がここに並びます。
          </div>
        ) : (
          <div className="divide-y divide-[#edf2f9]">
            {reviewQuestions.map((q) => {
              const ans = storageData.practiceAnswers[q.id];
              const lesson = LESSONS.find((l) => l.id === q.lessonId);
              const subject = SUBJECTS[q.subjectId];

              return (
                <div
                  key={q.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fafc] px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-[#edf2f9] text-[#173052] px-2 py-0.5 rounded">
                        {subject.shortName}
                      </span>
                      {ans?.isUncertain && (
                        <span className="text-[11px] font-bold bg-[#f4c84b]/30 text-[#173052] px-1.5 py-0.5 rounded">
                          自信なし
                        </span>
                      )}
                      {!ans?.isCorrect && (
                        <span className="text-[11px] font-bold bg-[#d9383a]/15 text-[#d9383a] px-1.5 py-0.5 rounded">
                          直近不正解
                        </span>
                      )}
                      {lesson && (
                        <span className="text-xs text-[#4a5d78]">
                          （単元: {lesson.title}）
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#173052] line-clamp-2">
                      {q.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectPracticeQuestion(q.id)}
                      className="rounded-lg bg-[#245bdd] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1f4ebd] min-h-[44px]"
                    >
                      解き直す
                    </button>
                    {ans && ans.isCorrect && (
                      <button
                        onClick={() => onClearReviewMark(q.id)}
                        className="rounded-lg border border-[#d4e0f0] px-3 py-1.5 text-xs font-semibold text-[#4a5d78] hover:bg-[#edf2f9] min-h-[44px]"
                      >
                        マーク解除
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 模試受験履歴 */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#edf2f9] pb-3">
          <h3 className="text-base font-bold text-[#173052] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#245bdd]" />
            <span>模擬試験の受験履歴（全{storageData.examHistory.length}回）</span>
          </h3>
        </div>

        {storageData.examHistory.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#4a5d78]">
            模試の受験履歴はまだありません。「模擬試験」タブから75分の本番模試に挑戦してみましょう。
          </div>
        ) : (
          <div className="divide-y divide-[#edf2f9]">
            {storageData.examHistory.map((exam, idx) => {
              const dateStr = new Date(exam.submittedAt).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={exam.id || idx}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          exam.isPassed
                            ? 'bg-[#245bdd] text-white'
                            : 'bg-[#d9383a] text-white'
                        }`}
                      >
                        {exam.isPassed ? '合格' : '不合格'}
                      </span>
                      <span className="text-xs text-[#4a5d78]">{dateStr}</span>
                    </div>

                    <div className="text-base font-bold text-[#173052]">
                      得点: {exam.totalScore} / {exam.totalQuestions} 問（{exam.percentage}%）
                    </div>

                    <div className="text-xs text-[#4a5d78] mt-1 flex flex-wrap gap-3">
                      <span>法令: {exam.subjectScores.law.score}/10問 ({exam.subjectScores.law.isPassed ? '達成' : '未達'})</span>
                      <span>燃焼消火: {exam.subjectScores.combustion.score}/5問 ({exam.subjectScores.combustion.isPassed ? '達成' : '未達'})</span>
                      <span>性質消火: {exam.subjectScores.properties.score}/10問 ({exam.subjectScores.properties.isPassed ? '達成' : '未達'})</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => onViewExamDetail(exam)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#245bdd] bg-[#e5edf8]/50 px-3.5 py-2 text-xs font-bold text-[#245bdd] hover:bg-[#245bdd] hover:text-white transition-colors min-h-[44px]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>詳細・全問解説を見る</span>
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* データ初期化（リセット）エリア */}
      <div className="pt-4 border-t border-[#edf2f9] flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('学習記録（読了状況、演習解答、模試履歴）をすべて初期化しますか？')) {
              onResetAllHistory();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-[#4a5d78] hover:text-[#d9383a] min-h-[44px] px-3 rounded hover:bg-[#d9383a]/5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>学習履歴をすべてリセットする</span>
        </button>
      </div>
    </div>
  );
}
