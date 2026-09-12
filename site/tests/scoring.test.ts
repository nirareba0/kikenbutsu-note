import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error allow ts import for node test
import { gradeExam, isExamExpired } from '../lib/scoring.ts';
// @ts-expect-error allow ts import for node test
import { QUESTIONS } from '../lib/questions.ts';

void test('採点ロジック: 全問正解の場合は合格かつ100%', () => {
  const perfectAnswers: Record<string, number> = {};
  for (const q of QUESTIONS) {
    perfectAnswers[q.id] = q.correctIndex;
  }

  const result = gradeExam(perfectAnswers, QUESTIONS);
  assert.equal(result.totalScore, 25);
  assert.equal(result.totalQuestions, 25);
  assert.equal(result.percentage, 100);
  assert.equal(result.isPassed, true);
  assert.equal(result.subjectScores.law.isPassed, true);
  assert.equal(result.subjectScores.combustion.isPassed, true);
  assert.equal(result.subjectScores.properties.isPassed, true);
});

test('採点ロジック: 科目別60%境界（総合点が高くても1科目未達なら不合格）', () => {
  // 法令: 10問中10問正解 (100% >= 60%)
  // 燃焼消火: 5問中2問正解 (40% < 60% -> 不合格!)
  // 性消: 10問中10問正解 (100% >= 60%)
  // 総合: 22 / 25 (88%)
  const answers: Record<string, number> = {};

  const lawQuestions = QUESTIONS.filter((q) => q.subjectId === 'law');
  const combQuestions = QUESTIONS.filter((q) => q.subjectId === 'combustion');
  const propQuestions = QUESTIONS.filter((q) => q.subjectId === 'properties');

  for (const q of lawQuestions) {
    answers[q.id] = q.correctIndex;
  }
  for (const q of propQuestions) {
    answers[q.id] = q.correctIndex;
  }

  // 燃焼消火は 2問だけ正解、残り3問は不正解
  combQuestions.forEach((q, idx) => {
    if (idx < 2) {
      answers[q.id] = q.correctIndex;
    } else {
      answers[q.id] = (q.correctIndex + 1) % 4; // 間違い
    }
  });

  const result = gradeExam(answers, QUESTIONS);
  assert.equal(result.totalScore, 22);
  assert.equal(result.percentage, 88);
  assert.equal(result.subjectScores.law.score, 10);
  assert.equal(result.subjectScores.law.isPassed, true);
  assert.equal(result.subjectScores.properties.score, 10);
  assert.equal(result.subjectScores.properties.isPassed, true);

  assert.equal(result.subjectScores.combustion.score, 2);
  assert.equal(result.subjectScores.combustion.percentage, 40);
  assert.equal(result.subjectScores.combustion.isPassed, false);

  // 総合点88%でも1科目未達なので不合格判定
  assert.equal(result.isPassed, false);
});

test('採点ロジック: ギリギリ60%通過（法令6/10, 燃焼消火3/5, 性消6/10 = 15/25 60%）', () => {
  const answers: Record<string, number> = {};
  const lawQuestions = QUESTIONS.filter((q) => q.subjectId === 'law');
  const combQuestions = QUESTIONS.filter((q) => q.subjectId === 'combustion');
  const propQuestions = QUESTIONS.filter((q) => q.subjectId === 'properties');

  lawQuestions.forEach((q, idx) => {
    answers[q.id] = idx < 6 ? q.correctIndex : (q.correctIndex + 1) % 4;
  });
  combQuestions.forEach((q, idx) => {
    answers[q.id] = idx < 3 ? q.correctIndex : (q.correctIndex + 1) % 4;
  });
  propQuestions.forEach((q, idx) => {
    answers[q.id] = idx < 6 ? q.correctIndex : (q.correctIndex + 1) % 4;
  });

  const result = gradeExam(answers, QUESTIONS);
  assert.equal(result.totalScore, 15);
  assert.equal(result.percentage, 60);
  assert.equal(result.subjectScores.law.score, 6);
  assert.equal(result.subjectScores.law.isPassed, true);
  assert.equal(result.subjectScores.combustion.score, 3);
  assert.equal(result.subjectScores.combustion.isPassed, true);
  assert.equal(result.subjectScores.properties.score, 6);
  assert.equal(result.subjectScores.properties.isPassed, true);
  assert.equal(result.isPassed, true);
});

test('採点ロジック: 未回答（キーなし/null/undefined/不正なインデックス）は不正解として集計', () => {
  const partialAnswers: Record<string, number> = {
    'law-q01': QUESTIONS.find((q) => q.id === 'law-q01')!.correctIndex,
    'comb-q01': -1, // 不正なインデックス
    'prop-q01': 99, // 不正なインデックス
    // 残りは未回答
  };

  const result = gradeExam(partialAnswers, QUESTIONS);
  assert.equal(result.totalScore, 1);
  assert.equal(result.totalQuestions, 25);
  assert.equal(result.subjectScores.law.score, 1);
  assert.equal(result.subjectScores.combustion.score, 0);
  assert.equal(result.subjectScores.properties.score, 0);
  assert.equal(result.isPassed, false);
});

test('期限判定: 期限前と期限後の判定', () => {
  const now = 1000000;
  assert.equal(isExamExpired(now + 1000, now), false);
  assert.equal(isExamExpired(now, now), true);
  assert.equal(isExamExpired(now - 1000, now), true);
});

test('採点ロジック: 空の問題配列が渡された場合のゼロ除算防止', () => {
  const result = gradeExam({}, []);
  assert.equal(result.totalScore, 0);
  assert.equal(result.totalQuestions, 0);
  assert.equal(result.percentage, 0);
  assert.equal(result.isPassed, false);
});

