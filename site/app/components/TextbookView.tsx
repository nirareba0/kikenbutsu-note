'use client';

import React, { useState } from 'react';
import { LESSONS } from '../../lib/curriculum';
import { QUESTIONS } from '../../lib/questions';
import { SUBJECTS } from '../../lib/scoring';
import type { Lesson, SubjectId } from '../../lib/types';
import { LessonDiagram } from './LessonDiagram';
import { MascotAdvice } from './MascotAdvice';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckSquare,
} from 'lucide-react';


interface TextbookViewProps {
  selectedLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (id: string) => void;
  onToggleCompleteLesson: (id: string) => void;
  onNavigateToPractice: (questionId?: string) => void;
}

export function TextbookView({
  selectedLessonId,
  completedLessonIds,
  onSelectLesson,
  onToggleCompleteLesson,
  onNavigateToPractice,
}: TextbookViewProps) {
  const currentLessonIndex = LESSONS.findIndex((l) => l.id === selectedLessonId);
  const currentLesson: Lesson =
    currentLessonIndex >= 0 ? LESSONS[currentLessonIndex] : LESSONS[0];

  const prevLesson = currentLessonIndex > 0 ? LESSONS[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < LESSONS.length - 1 ? LESSONS[currentLessonIndex + 1] : null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // この単元に関連する問題
  const relatedQuestions = QUESTIONS.filter((q) => q.lessonId === currentLesson.id);

  // 科目ごとのグループ化
  const subjects: { id: SubjectId; name: string }[] = [
    { id: 'law', name: '危険物に関する法令' },
    { id: 'combustion', name: '燃焼及び消火に関する基礎知識' },
    { id: 'properties', name: '危険物の性質並びにその火災予防及び消火の方法' },
  ];

  return (
    <div className="py-4 sm:py-6 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
      {/* モバイル向け：折りたたみ式コンパクト目次セレクター（スマホの邪魔をしない） */}
      <div className="lg:hidden rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 rounded-lg bg-blue-600 px-2 py-1 text-xs font-black text-white">
              第{currentLesson.order}単元
            </span>
            <span className="truncate text-xs sm:text-sm font-bold text-slate-800">
              {currentLesson.title}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 min-h-[40px] transition-colors"
          >
            <span>{isMobileMenuOpen ? '目次を閉じる' : '目次を開く'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* タップ時のみ展開される単元一覧 */}
        {isMobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-bold">
              <span>学習する単元をタップして選択</span>
              <span>{completedLessonIds.length} / {LESSONS.length} 読了</span>
            </div>
            {subjects.map((subj) => {
              const subjLessons = LESSONS.filter((l) => l.subjectId === subj.id);
              return (
                <div key={subj.id} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 px-2 block">
                    {subj.name}
                  </span>
                  <div className="space-y-1">
                    {subjLessons.map((l) => {
                      const isSelected = l.id === currentLesson.id;
                      const isDone = completedLessonIds.includes(l.id);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            onSelectLesson(l.id);
                            setIsMobileMenuOpen(false); // 選択したら自動で閉じて本文に集中！
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors min-h-[44px] ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-800 hover:bg-slate-100 bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">
                            {l.order}. {l.title}
                          </span>
                          {isDone && (
                            <span
                              className={`shrink-0 text-xs font-black ${
                                isSelected ? 'text-white' : 'text-blue-600'
                              }`}
                            >
                              ✓ 読了
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PC向け：常時表示サイドバー目次（画面幅1024px以上） */}
      <aside className="hidden lg:block rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-4 sticky top-20">
        <h3 className="text-sm font-bold text-[#173052] pb-3 border-b border-[#edf2f9] flex items-center justify-between">
          <span>教科書 目次</span>
          <span className="text-xs text-[#4a5d78] font-normal">
            {completedLessonIds.length} / {LESSONS.length} 読了
          </span>
        </h3>

        <div className="mt-3 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {subjects.map((subj) => {
            const subjLessons = LESSONS.filter((l) => l.subjectId === subj.id);
            return (
              <div key={subj.id} className="space-y-1">
                <span className="text-xs font-bold text-[#4a5d78] px-2 block">
                  {subj.name}
                </span>
                <div className="space-y-0.5">
                  {subjLessons.map((l) => {
                    const isSelected = l.id === currentLesson.id;
                    const isDone = completedLessonIds.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => onSelectLesson(l.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] ${
                          isSelected
                            ? 'bg-[#173052] text-white'
                            : 'text-[#173052] hover:bg-[#edf2f9]'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {l.order}. {l.title}
                        </span>
                        {isDone && (
                          <span
                            className={`shrink-0 text-xs ${
                              isSelected ? 'text-white' : 'text-[#245bdd]'
                            }`}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* 教科書本文メインカラム */}
      <main className="rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-6 md:p-8 space-y-8">
        {/* 単元ヘッダー */}
        <div className="border-b border-[#edf2f9] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
            <span className="font-bold text-[#245bdd] bg-[#e5edf8] px-2.5 py-1 rounded">
              {SUBJECTS[currentLesson.subjectId].name}
            </span>
            <div className="flex items-center gap-3 text-[#4a5d78]">
              <span>目安: 約{currentLesson.estimatedMinutes}分</span>
              <button
                onClick={() => onToggleCompleteLesson(currentLesson.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border transition-colors min-h-[44px] ${
                  isCompleted
                    ? 'border-[#245bdd] bg-[#245bdd]/10 text-[#245bdd]'
                    : 'border-[#d4e0f0] bg-white text-[#4a5d78] hover:bg-[#edf2f9]'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isCompleted ? '読了済み (解除)' : '読了にする'}</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#173052] leading-tight">
            第{currentLesson.order}単元: {currentLesson.title}
          </h2>
        </div>

        {/* 1. 導入 (Introduction) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">
              1
            </span>
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg">導入と身近なイメージ</h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              まずはここから！
            </span>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-2 border-blue-200 p-5 text-slate-800 text-base leading-relaxed whitespace-pre-line shadow-2xs">
            {currentLesson.sections.introduction}
          </div>
        </section>

        {/* 単元別 ビジュアル図解 */}
        <LessonDiagram lessonId={currentLesson.id} />

        {/* ヒナタ先輩のワンポイントアドバイス */}
        <MascotAdvice lessonId={currentLesson.id} />

        {/* 2. 理由・背景 (Reason) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-black">
              2
            </span>
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg">なぜそう決まっているの？（理由と仕組み）</h3>
          </div>
          <div className="rounded-2xl bg-white border-2 border-slate-200 p-5 text-slate-800 text-base leading-relaxed whitespace-pre-line shadow-2xs">
            {currentLesson.sections.reason}
          </div>
        </section>

        {/* 3. 具体例と実務基準 (Examples) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-black">
              3
            </span>
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg">具体例と覚えるべき基準・数値</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              試験によく出る！
            </span>
          </div>
          <div className="rounded-2xl bg-emerald-50/40 border-2 border-emerald-200/80 p-5 text-slate-800 text-base leading-relaxed whitespace-pre-line shadow-2xs">
            {currentLesson.sections.examples}
          </div>
        </section>

        {/* 4. 試験でのつまずきポイント (Pitfalls) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-black text-rose-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white text-xs font-black">
              4
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg">ここが危ない！試験の超ひっかけ罠</h3>
            <span className="text-xs bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full">
              高校生が一番ハマる！
            </span>
          </div>
          <div className="rounded-2xl bg-rose-50/70 border-2 border-rose-300 p-5 text-slate-900 text-base leading-relaxed whitespace-pre-line shadow-2xs">
            {currentLesson.sections.pitfalls}
          </div>
        </section>

        {/* 5. 要点まとめ (Summary) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-black text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white text-xs font-black">
              5
            </span>
            <CheckSquare className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg">本単元のまとめ（暗記チェック）</h3>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 p-5 text-slate-900 text-base font-medium leading-relaxed whitespace-pre-line shadow-2xs">
            {currentLesson.sections.summary}
          </div>
        </section>

        {/* この単元の演習へジャンプ */}
        {relatedQuestions.length > 0 && (
          <div className="rounded-xl border border-[#245bdd]/40 bg-[#e5edf8]/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#245bdd] uppercase tracking-wider block">
                理解度チェック
              </span>
              <h4 className="text-base font-bold text-[#173052] mt-0.5">
                この単元の練習問題（全 {relatedQuestions.length} 問）
              </h4>
              <p className="text-xs text-[#4a5d78] mt-0.5">
                学んだ知識をすぐに一問一答で確認できます。教科書へはいつでも戻れます。
              </p>
            </div>
            <button
              onClick={() => onNavigateToPractice(relatedQuestions[0].id)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#245bdd] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1f4ebd] transition-colors min-h-[44px] shrink-0"
            >
              <CheckSquare className="w-4 h-4" />
              <span>単元演習を解く</span>
            </button>
          </div>
        )}

        {/* 出典・確認日（一次資料の明示） */}
        <div className="pt-4 border-t border-[#edf2f9] text-xs text-[#4a5d78] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span>一次資料：</span>
            <a
              href={currentLesson.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#245bdd] hover:underline inline-flex items-center gap-1"
            >
              <span>{currentLesson.source.title}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span>確認日: {currentLesson.source.checkedAt}</span>
        </div>

        {/* 前後ナビゲーション */}
        <div className="pt-4 border-t border-[#edf2f9] flex items-center justify-between">
          {prevLesson ? (
            <button
              onClick={() => onSelectLesson(prevLesson.id)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#173052] hover:text-[#245bdd] min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>第{prevLesson.order}単元へ</span>
            </button>
          ) : (
            <span />
          )}

          {nextLesson ? (
            <button
              onClick={() => onSelectLesson(nextLesson.id)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#245bdd] hover:underline min-h-[44px]"
            >
              <span>第{nextLesson.order}単元へ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
