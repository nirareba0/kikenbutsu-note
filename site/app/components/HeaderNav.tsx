'use client';

import React from 'react';
import { BookOpen, CheckSquare, GraduationCap, BarChart2, Info, Home as HomeIcon, Sparkles } from 'lucide-react';
import type { LevelInfo } from '../../lib/gamification';

export type TabId = 'home' | 'textbook' | 'practice' | 'exam' | 'records' | 'about';

interface HeaderNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  storageWarning: string | null;
  levelInfo?: LevelInfo;
}

export function HeaderNav({ currentTab, onTabChange, storageWarning, levelInfo }: HeaderNavProps) {
  const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'ホーム', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'textbook', label: '教科書', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice', label: '一問一答', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'exam', label: '模擬試験', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'records', label: '学習記録', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'about', label: '情報', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      {storageWarning && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900 font-bold flex items-center justify-between">
          <span>⚠️ {storageWarning}</span>
        </div>
      )}

      <div className="app-container flex h-16 items-center justify-between">
        {/* Logo & Mascot Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 transition-transform hover:scale-102"
          >
            <div className="relative">
              <img
                src="/assets/mascot.jpg"
                alt="危険物ノート"
                className="h-10 w-10 rounded-xl border-2 border-amber-400 object-cover shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-black text-white">
                丙
              </span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight block leading-none">
                危険物ノート
              </span>
              <span className="text-[10px] font-bold text-blue-600 block mt-0.5">
                高校生のための丙種合格ナビ
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="メインナビゲーション">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* ユーザーレベルバッジ */}
          {levelInfo && (
            <div className="ml-2 flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-black text-amber-800">
              <span>{levelInfo.badgeEmoji}</span>
              <span>Lv.{levelInfo.level}</span>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Bottom/Sub Navigation Bar */}
      <nav className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-1 py-1 flex justify-around shadow-xs" aria-label="モバイルナビゲーション">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-black transition-all min-h-[44px] min-w-[48px] ${
                isActive ? 'text-blue-600 bg-blue-50/80' : 'text-slate-500'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
