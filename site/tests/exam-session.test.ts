import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore
import { EXAM_CONFIG, isExamExpired, gradeExam } from '../lib/scoring.ts';
// @ts-ignore
import { QUESTIONS } from '../lib/questions.ts';
// @ts-ignore
import type { ExamSession, ExamResult } from '../lib/types.ts';

test('模試セッション: 75分の絶対deadline設定とリロード継続シミュレーション', () => {
  const startedAt = 1710000000000;
  const deadline = startedAt + EXAM_CONFIG.durationMs; // 75分後

  assert.equal(deadline - startedAt, 75 * 60 * 1000);

  // 30分経過時（リロードされてもdeadlineは不変）
  const at30Min = startedAt + 30 * 60 * 1000;
  assert.equal(isExamExpired(deadline, at30Min), false);

  // 75分ちょうどまたはそれ以降
  const at75Min = startedAt + 75 * 60 * 1000;
  assert.equal(isExamExpired(deadline, at75Min), true);

  const at80Min = startedAt + 80 * 60 * 1000;
  assert.equal(isExamExpired(deadline, at80Min), true);
});

test('重複提出防止: 提出済みフラグと履歴への一度だけの記録', () => {
  const session: ExamSession = {
    id: 'exam-test-1',
    startedAt: Date.now() - 10000,
    deadline: Date.now() + 10000,
    isCompleted: false,
    answers: {
      'law-q01': 2,
    },
    currentQuestionIndex: 0,
  };

  const history: ExamResult[] = [];

  // 1回目の提出
  function submitSession(sess: ExamSession, hist: ExamResult[]) {
    if (sess.isCompleted) {
      return { success: false, reason: 'already_completed' };
    }
    const result = gradeExam(sess.answers, QUESTIONS, Date.now(), sess.id);
    sess.isCompleted = true;
    sess.submittedAt = Date.now();
    hist.unshift(result);
    return { success: true, result };
  }

  const firstSubmission = submitSession(session, history);
  assert.equal(firstSubmission.success, true);
  assert.equal(history.length, 1);
  assert.equal(session.isCompleted, true);

  // 2回目の提出試行（二重提出防止）
  const secondSubmission = submitSession(session, history);
  assert.equal(secondSubmission.success, false);
  assert.equal(secondSubmission.reason, 'already_completed');
  assert.equal(history.length, 1); // 履歴は増えない
});
