import type { AppStorageData } from './types';

export interface LevelInfo {
  level: number;
  title: string;
  badgeEmoji: string;
  currentExp: number;
  nextLevelExp: number;
  progressPercent: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: '危険物ビギナー', badgeEmoji: '🔰', minExp: 0, nextExp: 200 },
  { level: 2, title: '危険物ルーキー', badgeEmoji: '🧪', minExp: 200, nextExp: 500 },
  { level: 3, title: 'スタンド見習い', badgeEmoji: '⛽️', minExp: 500, nextExp: 900 },
  { level: 4, title: '防災ホープ', badgeEmoji: '🔥', minExp: 900, nextExp: 1400 },
  { level: 5, title: '丙種プロフェッショナル', badgeEmoji: '🎖️', minExp: 1400, nextExp: 2000 },
  { level: 6, title: '危険物マスター', badgeEmoji: '👑', minExp: 2000, nextExp: 2000 },
];

export function calculateExpAndLevel(data: AppStorageData): LevelInfo {
  const lessonExp = data.completedLessons.length * 50;
  
  const answers = Object.values(data.practiceAnswers);
  const practiceAnswerExp = answers.length * 15;
  const practiceCorrectExp = answers.filter((a) => a.isCorrect).length * 15;

  const examCountExp = data.examHistory.length * 100;
  const examPassExp = data.examHistory.filter((e) => e.isPassed).length * 300;

  const totalExp = lessonExp + practiceAnswerExp + practiceCorrectExp + examCountExp + examPassExp;

  let currentTier = LEVEL_THRESHOLDS[0];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalExp >= LEVEL_THRESHOLDS[i].minExp) {
      currentTier = LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const isMax = currentTier.level === LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;
  const tierExpSpan = currentTier.nextExp - currentTier.minExp;
  const expInTier = totalExp - currentTier.minExp;
  const progressPercent = isMax ? 100 : Math.min(100, Math.round((expInTier / tierExpSpan) * 100));

  return {
    level: currentTier.level,
    title: currentTier.title,
    badgeEmoji: currentTier.badgeEmoji,
    currentExp: totalExp,
    nextLevelExp: currentTier.nextExp,
    progressPercent,
  };
}

export function getAchievementBadges(data: AppStorageData): AchievementBadge[] {
  const completedCount = data.completedLessons.length;
  const practiceCorrectCount = Object.values(data.practiceAnswers).filter((a) => a.isCorrect).length;
  const hasPassedExam = data.examHistory.some((e) => e.isPassed);
  const hasPerfectExam = data.examHistory.some((e) => e.totalScore === 25);

  return [
    {
      id: 'first-step',
      title: 'はじめの一歩',
      description: '最初の教科書単元を1つ読了した',
      emoji: '📖',
      unlocked: completedCount >= 1,
    },
    {
      id: 'textbook-master',
      title: '全単元読破',
      description: '丙種の全9単元をすべて読了した',
      emoji: '🎓',
      unlocked: completedCount >= 9,
    },
    {
      id: 'drill-ace',
      title: '一問一答エース',
      description: '単元演習で15問以上正解した',
      emoji: '🎯',
      unlocked: practiceCorrectCount >= 15,
    },
    {
      id: 'exam-pass',
      title: '合格基準クリア',
      description: '75分模擬試験で合格基準（各科目60%以上）を達成した',
      emoji: '🏆',
      unlocked: hasPassedExam,
    },
    {
      id: 'perfect-shield',
      title: 'パーフェクト合格',
      description: '模擬試験で全25問パーフェクト（100%）正解した',
      emoji: '🌟',
      unlocked: hasPerfectExam,
    },
  ];
}
