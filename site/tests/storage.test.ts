import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore
import { sanitizeStorageData, DEFAULT_STORAGE_DATA } from '../lib/storage.ts';

const validLessonIds = new Set(['law-01-heishu-scope', 'comb-01-three-elements']);
const validQuestionIds = new Set(['law-q01', 'comb-q01']);

test('ストレージサニタイズ: null / undefined / 不正オブジェクトのフォールバック', () => {
  const resNull = sanitizeStorageData(null, validLessonIds, validQuestionIds);
  assert.deepEqual(resNull, DEFAULT_STORAGE_DATA);

  const resString = sanitizeStorageData('invalid string', validLessonIds, validQuestionIds);
  assert.deepEqual(resString, DEFAULT_STORAGE_DATA);

  const resEmptyObj = sanitizeStorageData({}, validLessonIds, validQuestionIds);
  assert.equal(resEmptyObj.version, 1);
  assert.deepEqual(resEmptyObj.completedLessons, []);
  assert.deepEqual(resEmptyObj.practiceAnswers, {});
});

test('ストレージサニタイズ: 不明なIDや不正な選択肢インデックスの除外', () => {
  const corruptInput = {
    version: 1,
    completedLessons: ['law-01-heishu-scope', 'unknown-lesson-999', 12345],
    practiceAnswers: {
      'law-q01': {
        questionId: 'law-q01',
        selectedIndex: 2, // 正常
        isCorrect: true,
        isUncertain: false,
        answeredAt: 1700000000,
      },
      'comb-q01': {
        questionId: 'comb-q01',
        selectedIndex: 99, // 不正なインデックス（4択の範囲外）
        isCorrect: false,
        isUncertain: true,
      },
      'unknown-q99': {
        questionId: 'unknown-q99', // 不明な問題ID
        selectedIndex: 1,
      },
    },
    currentExamSession: {
      id: 'session-1',
      startedAt: 1000,
      deadline: 5500000,
      isCompleted: false,
      answers: {
        'law-q01': 1,
        'comb-q01': 5, // 不正インデックス
        'unknown-q': 0, // 不明ID
      },
      currentQuestionIndex: 2,
    },
  };

  const sanitized = sanitizeStorageData(corruptInput, validLessonIds, validQuestionIds);

  // unknown-lesson-999 と 12345 は除外されている
  assert.deepEqual(sanitized.completedLessons, ['law-01-heishu-scope']);

  // law-q01 のみ残る（comb-q01のindex 99 と unknown-q99 は除外）
  assert.equal(Object.keys(sanitized.practiceAnswers).length, 1);
  assert.ok(sanitized.practiceAnswers['law-q01']);
  assert.equal(sanitized.practiceAnswers['law-q01'].selectedIndex, 2);

  // currentExamSessionのanswers
  assert.ok(sanitized.currentExamSession);
  assert.equal(sanitized.currentExamSession?.answers['law-q01'], 1);
  assert.equal(sanitized.currentExamSession?.answers['comb-q01'], undefined);
  assert.equal(sanitized.currentExamSession?.answers['unknown-q'], undefined);
});

test('ストレージサニタイズ: examHistory 内の不完全・破損レコードの除外', () => {
  const corruptInput = {
    version: 1,
    completedLessons: [],
    practiceAnswers: {},
    examHistory: [
      null,
      'not an object',
      { id: 'broken-1' }, // subjectScores が欠損
      {
        id: 'valid-exam-1',
        submittedAt: 1700000000,
        totalScore: 20,
        totalQuestions: 25,
        percentage: 80,
        isPassed: true,
        subjectScores: {
          law: { subjectId: 'law', subjectName: '法令', score: 8, total: 10, percentage: 80, isPassed: true },
          combustion: { subjectId: 'combustion', subjectName: '燃焼消火', score: 4, total: 5, percentage: 80, isPassed: true },
          properties: { subjectId: 'properties', subjectName: '性消', score: 8, total: 10, percentage: 80, isPassed: true },
        },
        answers: {
          'law-q01': 1,
          'unknown-q': 2,
        },
      },
    ],
  };

  const sanitized = sanitizeStorageData(corruptInput, validLessonIds, validQuestionIds);
  assert.equal(sanitized.examHistory.length, 1);
  assert.equal(sanitized.examHistory[0].id, 'valid-exam-1');
  assert.equal(sanitized.examHistory[0].answers['unknown-q'], undefined);
  assert.equal(sanitized.examHistory[0].answers['law-q01'], 1);
});

