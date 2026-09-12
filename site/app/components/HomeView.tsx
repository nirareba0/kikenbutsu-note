'use client';

import React from 'react';
import { LESSONS } from '../../lib/curriculum';
import { QUESTIONS } from '../../lib/questions';
import { SUBJECTS } from '../../lib/scoring';
import { calculateExpAndLevel } from '../../lib/gamification';
import type { AppStorageData, Lesson } from '../../lib/types';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Play,
  AlertCircle,
  Award,
  Sparkles,
  Flame,
  Zap,
  GraduationCap,
  Target,
  Trophy,
} from 'lucide-react';

interface HomeViewProps {
  storageData: AppStorageData;
  onSelectLesson: (lessonId: string) => void;
  onStartPractice: (questionId?: string) => void;
  onStartExam: () => void;
  onNavigateTab: (tab: 'textbook' | 'practice' | 'exam' | 'records') => void;
}

export function HomeView({
  storageData,
  onSelectLesson,
  onStartPractice,
  onStartExam,
  onNavigateTab,
}: HomeViewProps) {
  // レベルとEXP計算
  const levelInfo = calculateExpAndLevel(storageData);

  // 未読了の最初の単元を「今日学ぶ単元」として提案
  const nextLesson =
    LESSONS.find((l) => !storageData.completedLessons.includes(l.id)) || LESSONS[0];

  // 復習対象（間違えたか、自信なしの問題）
  const reviewQuestions = QUESTIONS.filter((q) => {
    const ans = storageData.practiceAnswers[q.id];
    return ans && (!ans.isCorrect || ans.isUncertain);
  });

  const totalLessons = LESSONS.length;
  const completedLessonsCount = storageData.completedLessons.length;
  const answeredPracticeCount = Object.keys(storageData.practiceAnswers).length;
  const latestExam = storageData.examHistory[0];

  return (
    <div className="space-y-8 py-6">
      {/* 1. 高校生向け ヒーローウェルカムバナー */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-blue-200/80 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 md:p-8 text-white shadow-lg">
        {/* 装飾の背景グラフィック */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-black tracking-wide text-yellow-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>高校生・初学者のための丙種合格ナビ 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
              スキマ時間でサクッと！<br className="hidden sm:inline" />
              危険物<span className="text-yellow-300"> 丙種 </span>一発合格ノート
            </h1>

            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-xl">
              ガソリンスタンドや工場で大活躍の国家資格！難しい法律や化学式も、フルカラーの図解とヒナタ先輩のアドバイスで直感的にマスターできるよ。
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectLesson(nextLesson.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-slate-900 shadow-md transition-transform hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-slate-900" />
                <span>図解で学習を始める</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartExam()}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-3 text-sm font-bold text-white transition-colors min-h-[44px]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>75分模試を受ける</span>
              </button>
            </div>
          </div>

          {/* ヒーロー画像 */}
          <div className="hidden md:flex justify-center">
            <div className="relative overflow-hidden rounded-2xl border-4 border-white/30 shadow-xl max-w-[280px]">
              <img
                src="./assets/hero_banner.jpg"
                alt="勉強する高校生"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. ゲーミフィケーション ステータスバー（レベル & EXP & クエスト） */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        {/* レベル & EXPカード */}
        <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src="./assets/mascot.jpg"
              alt="ヒナタ先輩"
              className="h-16 w-16 rounded-2xl border-2 border-amber-300 object-cover shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white shadow-xs">
              {levelInfo.level}
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">あなたのランク</span>
              <span className="text-xs font-black text-blue-600">
                {levelInfo.currentExp} EXP
              </span>
            </div>
            <h3 className="text-base font-black text-slate-800">
              {levelInfo.badgeEmoji} {levelInfo.title}
            </h3>
            {/* EXPプログレスバー */}
            <div className="space-y-1 pt-1">
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>次のLvまで {levelInfo.nextLevelExp - levelInfo.currentExp} EXP</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 今日のデイリークエストカード */}
        <div className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                本日のデイリーミッション
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
              毎日更新
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-800">
            <div
              onClick={() => onSelectLesson(nextLesson.id)}
              className="rounded-xl bg-white/90 p-2.5 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">📖</span>
                <span className="truncate">単元「{nextLesson.title}」を読む</span>
              </div>
              <span className="text-[11px] text-blue-600 font-black shrink-0">+50 EXP</span>
            </div>

            <div
              onClick={() => {
                const q = QUESTIONS.find((question) => question.lessonId === nextLesson.id);
                if (q) onStartPractice(q.id);
                else onStartPractice();
              }}
              className="rounded-xl bg-white/90 p-2.5 border border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">⚡️</span>
                <span className="truncate">単元問題を1問解いてみる</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-black shrink-0">+20 EXP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 3大学習モードへのクイックアクセス */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 教科書 */}
        <div
          onClick={() => onSelectLesson(nextLesson.id)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-blue-100 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-black text-xl group-hover:scale-110 transition-transform">
                📘
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {completedLessonsCount}/{totalLessons} 読了
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
              図解で学ぶ教科書
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              全9単元をカラー図解とヒナタ先輩のワンポイント解説で楽しく読破！
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs font-black text-blue-600">
            <span>続きを読む</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 単元演習 */}
        <div
          onClick={() => onStartPractice()}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-indigo-100 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-black text-xl group-hover:scale-110 transition-transform">
                ⚡️
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                全 {QUESTIONS.length} 問収録
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
              サクッと一問一答
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              電車や通学中のスキマ時間にぴったり。全選択肢に理由つき解説あり！
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs font-black text-indigo-600">
            <span>問題を解く</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 模擬試験 */}
        <div
          onClick={() => onStartExam()}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-amber-100 bg-gradient-to-br from-white to-amber-50/40 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-black text-xl group-hover:scale-110 transition-transform">
                🏆
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                本番同等 75分
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-700 transition-colors">
              本番形式 模擬試験
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              全25問の本格模試！科目別60%基準クリアで合格トロフィー獲得を目指そう！
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs font-black text-amber-700">
            <span>模試に挑戦</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. 学習進捗サマリー & 要復習アラート */}
      {reviewQuestions.length > 0 && (
        <div className="rounded-2xl border-2 border-rose-300/80 bg-rose-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-black text-xl shadow-xs">
              ⚠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
                  要復習アラート
                </span>
                <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-black text-rose-800">
                  {reviewQuestions.length} 問
                </span>
              </div>
              <h4 className="text-base font-black text-slate-800 mt-0.5">
                間違えた問題・自信がない問題がたまっています！
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                忘れないうちに解き直して、弱点を克服しておこう。
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartPractice(reviewQuestions[0].id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white hover:bg-rose-700 transition-colors shadow-xs min-h-[44px] shrink-0"
          >
            <span>要復習問題を今すぐ解く</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. 教科書 全9単元のカラフル目次カード */}
      <div className="rounded-3xl border-2 border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📚</span>
              <h3 className="text-lg font-black text-slate-800">丙種 カリキュラム（全9単元）</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              法令・燃焼消火・性質消火の重要ポイントを完全網羅！
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('textbook')}
            className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1 min-h-[44px]"
          >
            <span>教科書を開く</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['law', 'combustion', 'properties'] as const).map((sId) => {
            const subj = SUBJECTS[sId];
            const subjLessons = LESSONS.filter((l) => l.subjectId === sId);

            let themeBg = 'bg-blue-50/70 border-blue-200 text-blue-800';
            let badgeBg = 'bg-blue-600 text-white';
            if (sId === 'combustion') {
              themeBg = 'bg-orange-50/70 border-orange-200 text-orange-800';
              badgeBg = 'bg-orange-600 text-white';
            } else if (sId === 'properties') {
              themeBg = 'bg-emerald-50/70 border-emerald-200 text-emerald-800';
              badgeBg = 'bg-emerald-600 text-white';
            }

            return (
              <div key={sId} className={`rounded-2xl border-2 p-4 space-y-3 ${themeBg}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${badgeBg}`}>
                    {subj.name}
                  </span>
                  <span className="text-[11px] font-bold opacity-75">全3単元</span>
                </div>

                <div className="space-y-2">
                  {subjLessons.map((l) => {
                    const isDone = storageData.completedLessons.includes(l.id);
                    return (
                      <div
                        key={l.id}
                        onClick={() => onSelectLesson(l.id)}
                        className="rounded-xl bg-white/95 p-3 border border-slate-200/70 shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                              isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓' : l.order}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {l.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          約{l.estimatedMinutes}分
                        </span>
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
