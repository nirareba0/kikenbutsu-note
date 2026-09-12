'use client';

import React, { useState, useEffect } from 'react';
import { HeaderNav, type TabId } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { TextbookView } from './components/TextbookView';
import { PracticeView } from './components/PracticeView';
import { ExamView } from './components/ExamView';
import { RecordsView } from './components/RecordsView';
import { AboutView } from './components/AboutView';

import { LESSONS } from '../lib/curriculum';
import { QUESTIONS } from '../lib/questions';
import { EXAM_CONFIG, gradeExam } from '../lib/scoring';
import { calculateExpAndLevel } from '../lib/gamification';
import {
  DEFAULT_STORAGE_DATA,
  loadStorageData,
  saveStorageData,
  getStorageStatus,
} from '../lib/storage';

import type { AppStorageData, ExamResult, ExamSession, PracticeAnswer } from '../lib/types';

export default function App() {
  const [isClientReady, setIsClientReady] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [storageData, setStorageData] = useState<AppStorageData>(DEFAULT_STORAGE_DATA);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [viewingExamResult, setViewingExamResult] = useState<ExamResult | null>(null);


  // アクティブな単元・問題
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [selectedPracticeQuestionId, setSelectedPracticeQuestionId] = useState<string>(
    QUESTIONS[0].id
  );

  // 初回クライアントマウント時にのみ localStorage から読み込む (SSR対策 & 既存データ保護)
  useEffect(() => {
    const validLessonIds = new Set(LESSONS.map((l) => l.id));
    const validQuestionIds = new Set(QUESTIONS.map((q) => q.id));

    const loaded = loadStorageData(validLessonIds, validQuestionIds);
    let activeData = loaded;

    if (
      loaded.currentExamSession &&
      !loaded.currentExamSession.isCompleted &&
      Date.now() >= loaded.currentExamSession.deadline
    ) {
      const completedSession: ExamSession = {
        ...loaded.currentExamSession,
        isCompleted: true,
        submittedAt: loaded.currentExamSession.deadline,
      };
      const graded = gradeExam(
        completedSession.answers,
        QUESTIONS,
        completedSession.submittedAt,
        completedSession.id
      );
      activeData = {
        ...loaded,
        currentExamSession: completedSession,
        examHistory: [graded, ...loaded.examHistory],
      };
      saveStorageData(activeData);
    }

    setStorageData(activeData);


    if (loaded.lastActiveLessonId) {
      setSelectedLessonId(loaded.lastActiveLessonId);
    }
    if (loaded.lastActivePracticeQuestionId) {
      setSelectedPracticeQuestionId(loaded.lastActivePracticeQuestionId);
    }

    const status = getStorageStatus();
    if (!status.available && status.errorMessage) {
      setStorageWarning(status.errorMessage);
    }

    setIsClientReady(true);
  }, []);

  // 状態変更をストレージに保存するヘルパー
  const updateAndSaveStorage = (updater: (prev: AppStorageData) => AppStorageData) => {
    setStorageData((prev) => {
      const next = updater(prev);
      const res = saveStorageData(next);
      if (!res.success && res.error) {
        setStorageWarning(res.error);
      }
      return next;
    });
  };

  // 1. 教科書の読了トグル
  const handleToggleCompleteLesson = (lessonId: string) => {
    updateAndSaveStorage((prev) => {
      const isCompleted = prev.completedLessons.includes(lessonId);
      const nextCompleted = isCompleted
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return {
        ...prev,
        completedLessons: nextCompleted,
        lastActiveLessonId: lessonId,
      };
    });
  };

  // 単元選択
  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('textbook');
    updateAndSaveStorage((prev) => ({
      ...prev,
      lastActiveLessonId: lessonId,
    }));
  };

  // 2. 単元演習の回答保存
  const handleSavePracticeAnswer = (ans: PracticeAnswer) => {
    updateAndSaveStorage((prev) => ({
      ...prev,
      practiceAnswers: {
        ...prev.practiceAnswers,
        [ans.questionId]: ans,
      },
      lastActivePracticeQuestionId: ans.questionId,
    }));
  };

  // 復習マークの解除
  const handleClearReviewMark = (questionId: string) => {
    updateAndSaveStorage((prev) => {
      const existing = prev.practiceAnswers[questionId];
      if (!existing) return prev;
      return {
        ...prev,
        practiceAnswers: {
          ...prev.practiceAnswers,
          [questionId]: {
            ...existing,
            isUncertain: false,
            isCorrect: true, // 復習達成
          },
        },
      };
    });
  };

  // 演習問題選択
  const handleSelectPracticeQuestion = (questionId: string) => {
    setSelectedPracticeQuestionId(questionId);
    setCurrentTab('practice');
    updateAndSaveStorage((prev) => ({
      ...prev,
      lastActivePracticeQuestionId: questionId,
    }));
  };

  // 教科書から演習への移動
  const handleNavigateToPractice = (questionId?: string) => {
    if (questionId) {
      setSelectedPracticeQuestionId(questionId);
    }
    setCurrentTab('practice');
  };

  // 演習から教科書への移動
  const handleNavigateToLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('textbook');
  };

  // 3. 模試の開始
  const handleStartExamSession = () => {
    const now = Date.now();
    const newSession: ExamSession = {
      id: `exam-${now}`,
      startedAt: now,
      deadline: now + EXAM_CONFIG.durationMs,
      isCompleted: false,
      answers: {},
      currentQuestionIndex: 0,
    };
    setViewingExamResult(null);
    updateAndSaveStorage((prev) => ({
      ...prev,
      currentExamSession: newSession,
    }));
    setCurrentTab('exam');
  };

  // 模試セッション更新
  const handleUpdateExamSession = (session: ExamSession) => {
    updateAndSaveStorage((prev) => ({
      ...prev,
      currentExamSession: session,
    }));
  };

  // 模試の提出と採点
  const handleSubmitExamSession = (session: ExamSession): ExamResult | null => {
    if (session.isCompleted) {
      return null;
    }

    const completedSession: ExamSession = {
      ...session,
      isCompleted: true,
      submittedAt: Date.now(),
    };

    const gradedResult = gradeExam(
      completedSession.answers,
      QUESTIONS,
      completedSession.submittedAt,
      completedSession.id
    );

    setViewingExamResult(gradedResult);
    updateAndSaveStorage((prev) => ({
      ...prev,
      currentExamSession: completedSession,
      examHistory: [gradedResult, ...prev.examHistory],
    }));

    return gradedResult;
  };

  // 4. 学習履歴リセット
  const handleResetAllHistory = () => {
    const resetData: AppStorageData = {
      ...DEFAULT_STORAGE_DATA,
    };
    setViewingExamResult(null);
    setStorageData(resetData);
    saveStorageData(resetData);
  };


  const levelInfo = calculateExpAndLevel(storageData);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-800">
      {/* 共通ヘッダーナビ */}
      <HeaderNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        storageWarning={storageWarning}
        levelInfo={levelInfo}
      />


      {/* メインコンテンツエリア */}
      <main className="app-container flex-1">
        {!isClientReady ? (
          <div className="py-16 text-center text-sm text-[#4a5d78]">
            データを読み込んでいます...
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
          <HomeView
            storageData={storageData}
            onSelectLesson={handleSelectLesson}
            onStartPractice={(qId) => {
              if (qId) setSelectedPracticeQuestionId(qId);
              setCurrentTab('practice');
            }}
            onStartExam={() => {
              if (!storageData.currentExamSession || storageData.currentExamSession.isCompleted) {
                handleStartExamSession();
              } else {
                setCurrentTab('exam');
              }
            }}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'textbook' && (
          <TextbookView
            selectedLessonId={selectedLessonId}
            completedLessonIds={storageData.completedLessons}
            onSelectLesson={handleSelectLesson}
            onToggleCompleteLesson={handleToggleCompleteLesson}
            onNavigateToPractice={handleNavigateToPractice}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            key={selectedPracticeQuestionId}
            currentQuestionId={selectedPracticeQuestionId}
            practiceAnswers={storageData.practiceAnswers}
            onSaveAnswer={handleSavePracticeAnswer}
            onClearReviewMark={handleClearReviewMark}
            onNavigateToLesson={handleNavigateToLesson}
            onSelectQuestion={(qId) => setSelectedPracticeQuestionId(qId)}
          />
        )}


        {currentTab === 'exam' && (
          <ExamView
            currentSession={storageData.currentExamSession}
            viewingResult={viewingExamResult}
            onStartSession={handleStartExamSession}
            onUpdateSession={handleUpdateExamSession}
            onSubmitSession={handleSubmitExamSession}
            onClearViewingResult={() => setViewingExamResult(null)}
            onNavigateToLesson={handleNavigateToLesson}
          />
        )}

        {currentTab === 'records' && (
          <RecordsView
            storageData={storageData}
            onSelectPracticeQuestion={handleSelectPracticeQuestion}
            onSelectLesson={handleSelectLesson}
            onClearReviewMark={handleClearReviewMark}
            onViewExamDetail={(exam) => {
              setViewingExamResult(exam);
              setCurrentTab('exam');
            }}
            onResetAllHistory={handleResetAllHistory}
          />
        )}


        {currentTab === 'about' && <AboutView />}
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-12 border-t border-[#d4e0f0] bg-white py-8 text-center text-xs text-[#4a5d78]">
        <div className="app-container space-y-2">
          <p className="font-semibold text-[#173052]">
            危険物ノート — 危険物取扱者 丙種 先行学習システム
          </p>
          <p>
            本サイトは学習用のオリジナル教材です（専門家による校閲前）。全範囲網羅や合格保証をするものではありません。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('about')}
              className="text-[#245bdd] hover:underline"
            >
              利用規約・一次資料・他区分状況
            </button>
            <span>•</span>
            <a
              href="https://www.shoubo-shiken.or.jp/kikenbutsu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#245bdd] hover:underline"
            >
              消防試験研究センター（公式）
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
