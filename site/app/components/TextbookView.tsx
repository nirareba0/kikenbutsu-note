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
    <div className="py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
      {/* サイド目次（PC向け & モバイル上部） */}
      <aside className="rounded-xl border border-[#d4e0f0] bg-white shadow-xs p-4 sticky top-20">
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
          <div className="flex items-center gap-2 text-base font-bold text-[#173052]">
            <BookOpen className="w-5 h-5 text-[#245bdd]" />
            <h3>1. 導入と全体像</h3>
          </div>
          <div className="rounded-xl bg-[#f8fafc] border border-[#d4e0f0] p-4 text-[#173052] text-base leading-relaxed whitespace-pre-line">
            {currentLesson.sections.introduction}
          </div>
        </section>

        {/* 単元別 ビジュアル図解 */}
        <LessonDiagram lessonId={currentLesson.id} />

        {/* ヒナタ先輩のワンポイントアドバイス */}
        <MascotAdvice lessonId={currentLesson.id} />

        {/* 2. 理由・背景 (Reason) */}

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-[#173052]">
            <HelpCircle className="w-5 h-5 text-[#245bdd]" />
            <h3>2. なぜそう決められているのか（理由・原理）</h3>
          </div>
          <div className="text-[#173052] text-base leading-relaxed whitespace-pre-line pl-1">
            {currentLesson.sections.reason}
          </div>
        </section>

        {/* 3. 具体例と実務基準 (Examples) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-[#173052]">
            <Lightbulb className="w-5 h-5 text-[#245bdd]" />
            <h3>3. 具体例と数値・実務上の基準</h3>
          </div>
          <div className="rounded-lg bg-[#edf2f9]/60 border border-[#d4e0f0] p-4 text-[#173052] text-base leading-relaxed whitespace-pre-line font-mono sm:font-sans">
            {currentLesson.sections.examples}
          </div>
        </section>

        {/* 4. 試験でのつまずきポイント (Pitfalls) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-[#d9383a]">
            <AlertTriangle className="w-5 h-5 text-[#d9383a]" />
            <h3>4. 試験でよくある「つまずき・誤認」パターン</h3>
          </div>
          <div className="rounded-lg bg-[#d9383a]/5 border border-[#d9383a]/30 p-4 text-[#173052] text-base leading-relaxed whitespace-pre-line">
            {currentLesson.sections.pitfalls}
          </div>
        </section>

        {/* 5. 要点まとめ (Summary) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-[#173052]">
            <CheckSquare className="w-5 h-5 text-[#245bdd]" />
            <h3>5. 本単元の要点まとめ</h3>
          </div>
          <div className="rounded-lg bg-[#f4c84b]/15 border border-[#f4c84b]/50 p-4 text-[#173052] text-base font-medium leading-relaxed whitespace-pre-line">
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
