import type {
  ExamResult,
  Question,
  SubjectId,
  SubjectInfo,
  SubjectResult,
} from './types';

export const SUBJECTS: Record<SubjectId, SubjectInfo> = {
  law: {
    id: 'law',
    name: '危険物に関する法令',
    shortName: '法令',
    questionCount: 10,
    passingScore: 6, // 60% of 10
    description: '消防法、製造所等の基準、丙種取扱者の権限・義務、指定数量の計算など',
  },
  combustion: {
    id: 'combustion',
    name: '燃焼及び消火に関する基礎知識',
    shortName: '燃焼・消火',
    questionCount: 5,
    passingScore: 3, // 60% of 5
    description: '燃焼の三要素、引火点・発火点、燃焼範囲、静電気の予防、消火の4大原理など',
  },
  properties: {
    id: 'properties',
    name: '危険物の性質並びにその火災予防及び消火の方法',
    shortName: '性消',
    questionCount: 10,
    passingScore: 6, // 60% of 10
    description: '第4類危険物の共通特性、ガソリン・灯油・軽油・重油・動植物油類等の性状と消火法',
  },
};

export const EXAM_CONFIG = {
  durationMinutes: 75,
  durationMs: 75 * 60 * 1000,
  totalQuestions: 25,
  passingRate: 0.6,
};

/**
 * 試験期限が切れているかどうかを判定する
 */
export function isExamExpired(deadline: number, now: number = Date.now()): boolean {
  return now >= deadline;
}

/**
 * 模試の回答を採点し、科目別の正解数と合否を判定する。
 * 未回答（未選択）は不正解として計算。
 * 合否は全3科目すべてにおいて60%以上（AND条件）を満たす必要がある。
 */
export function gradeExam(
  answers: Record<string, number>,
  questions: Question[],
  submittedAt: number = Date.now(),
  examId: string = `exam-${Date.now()}`
): ExamResult {
  const subjectScores: Record<SubjectId, { correct: number; total: number }> = {
    law: { correct: 0, total: 0 },
    combustion: { correct: 0, total: 0 },
    properties: { correct: 0, total: 0 },
  };

  let totalScore = 0;

  for (const q of questions) {
    if (!subjectScores[q.subjectId]) {
      continue;
    }
    subjectScores[q.subjectId].total += 1;

    const userAnswer = answers[q.id];
    // 未回答または無効なインデックスは不正解
    if (typeof userAnswer === 'number' && userAnswer === q.correctIndex) {
      subjectScores[q.subjectId].correct += 1;
      totalScore += 1;
    }
  }

  const subjectResults: Record<SubjectId, SubjectResult> = {
    law: calculateSubjectResult('law', subjectScores.law.correct, subjectScores.law.total),
    combustion: calculateSubjectResult(
      'combustion',
      subjectScores.combustion.correct,
      subjectScores.combustion.total
    ),
    properties: calculateSubjectResult(
      'properties',
      subjectScores.properties.correct,
      subjectScores.properties.total
    ),
  };

  // 全科目で 60% 以上正解していることが合格の必須条件 (AND条件)
  const isPassed =
    subjectResults.law.isPassed &&
    subjectResults.combustion.isPassed &&
    subjectResults.properties.isPassed;

  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return {
    id: examId,
    submittedAt,
    totalScore,
    totalQuestions,
    percentage,
    isPassed,
    subjectScores: subjectResults,
    answers: { ...answers },
  };
}

function calculateSubjectResult(
  subjectId: SubjectId,
  correct: number,
  total: number
): SubjectResult {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const subjectInfo = SUBJECTS[subjectId];
  // 60%以上（指定問数以上）
  const isPassed = correct >= subjectInfo.passingScore;

  return {
    subjectId,
    subjectName: subjectInfo.name,
    score: correct,
    total,
    percentage,
    isPassed,
  };
}
