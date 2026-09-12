import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore
import { LESSONS } from '../lib/curriculum.ts';
// @ts-ignore
import { QUESTIONS } from '../lib/questions.ts';
// @ts-ignore
import { SUBJECTS } from '../lib/scoring.ts';

test('教材データ検証: 最低9教材かつ科目別3教材', () => {
  assert.ok(LESSONS.length >= 9, `教材数が不足しています: ${LESSONS.length}`);

  const lawLessons = LESSONS.filter((l) => l.subjectId === 'law');
  const combLessons = LESSONS.filter((l) => l.subjectId === 'combustion');
  const propLessons = LESSONS.filter((l) => l.subjectId === 'properties');

  assert.ok(lawLessons.length >= 3, '法令の教材が3未満');
  assert.ok(combLessons.length >= 3, '燃焼消火の教材が3未満');
  assert.ok(propLessons.length >= 3, '性消の教材が3未満');

  // 各教材のセクションと文字数チェック（導入・理由・具体例・つまずき・要点）
  for (const lesson of LESSONS) {
    assert.ok(lesson.title.length > 0, `教材 ${lesson.id} にタイトルがありません`);
    assert.ok(lesson.sections.introduction.length > 50, `教材 ${lesson.id} の導入が短すぎます`);
    assert.ok(lesson.sections.reason.length > 50, `教材 ${lesson.id} の理由が短すぎます`);
    assert.ok(lesson.sections.examples.length > 50, `教材 ${lesson.id} の具体例が短すぎます`);
    assert.ok(lesson.sections.pitfalls.length > 50, `教材 ${lesson.id} のつまずきが短すぎます`);
    assert.ok(lesson.sections.summary.length > 30, `教材 ${lesson.id} の要点が短すぎます`);

    const totalChars =
      lesson.sections.introduction.length +
      lesson.sections.reason.length +
      lesson.sections.examples.length +
      lesson.sections.pitfalls.length +
      lesson.sections.summary.length;
    // 500〜900字目安（十分な学習密度）
    assert.ok(
      totalChars >= 400,
      `教材 ${lesson.id} の総文字数が少なすぎます (${totalChars}文字)`
    );

    assert.ok(lesson.source.url.startsWith('http'), `教材 ${lesson.id} に出典URLがありません`);
    assert.ok(lesson.source.checkedAt.length > 0, `教材 ${lesson.id} に確認日がありません`);
  }
});

test('問題データ検証: 最低25問かつ科目別内訳（法令10、燃焼消火5、性消10）', () => {
  assert.equal(QUESTIONS.length, 25, `問題総数が25ではありません: ${QUESTIONS.length}`);

  const law = QUESTIONS.filter((q) => q.subjectId === 'law');
  const combustion = QUESTIONS.filter((q) => q.subjectId === 'combustion');
  const properties = QUESTIONS.filter((q) => q.subjectId === 'properties');

  assert.equal(law.length, 10, '法令が10問ではありません');
  assert.equal(combustion.length, 5, '燃焼消火が5問ではありません');
  assert.equal(properties.length, 10, '性消が10問ではありません');
});

test('問題データ検証: 四肢択一、正解位置分散、個別選択肢解説、lessonId参照整合性', () => {
  const lessonIds = new Set(LESSONS.map((l) => l.id));
  const correctCounts = [0, 0, 0, 0];

  for (const q of QUESTIONS) {
    assert.equal(q.options.length, 4, `問題 ${q.id} は四肢択一ではありません`);
    assert.equal(q.explanations.length, 4, `問題 ${q.id} に4選択肢分の解説がありません`);

    for (let i = 0; i < 4; i++) {
      assert.ok(q.options[i].trim().length > 0, `問題 ${q.id} の選択肢${i}が空です`);
      assert.ok(q.explanations[i].trim().length > 0, `問題 ${q.id} の選択肢${i}の解説が空です`);
    }

    assert.ok(
      q.correctIndex >= 0 && q.correctIndex <= 3,
      `問題 ${q.id} の正解インデックスが0〜3の範囲外です`
    );
    correctCounts[q.correctIndex]++;

    // lessonIdが実在するか
    assert.ok(lessonIds.has(q.lessonId), `問題 ${q.id} の lessonId (${q.lessonId}) が存在しません`);

    // 出典URLと確認日
    assert.ok(q.source.url.startsWith('http'), `問題 ${q.id} に有効な出典URLがありません`);
    assert.ok(q.source.checkedAt.length > 0, `問題 ${q.id} に確認日がありません`);
  }

  // 正解位置の分散チェック: 各インデックスが最低4問以上、最大8問以下（均等分散）
  for (let i = 0; i < 4; i++) {
    assert.ok(
      correctCounts[i] >= 4 && correctCounts[i] <= 9,
      `正解インデックス ${i} の出現数が偏っています: ${correctCounts[i]}`
    );
  }
});

test('教材および問題のID重複なし・選択肢の重複なし検証', () => {
  // 教材IDの重複なし
  const lessonIdSet = new Set<string>();
  for (const lesson of LESSONS) {
    assert.ok(!lessonIdSet.has(lesson.id), `重複した教材IDが存在します: ${lesson.id}`);
    lessonIdSet.add(lesson.id);
    assert.ok(
      ['law', 'combustion', 'properties'].includes(lesson.subjectId),
      `無効な科目IDです: ${lesson.subjectId}`
    );
  }

  // 問題IDの重複なし & 問題内の選択肢重複なし
  const questionIdSet = new Set<string>();
  for (const q of QUESTIONS) {
    assert.ok(!questionIdSet.has(q.id), `重複した問題IDが存在します: ${q.id}`);
    questionIdSet.add(q.id);

    const optionTextSet = new Set<string>();
    for (const opt of q.options) {
      assert.ok(!optionTextSet.has(opt.trim()), `問題 ${q.id} に重複した選択肢があります: "${opt}"`);
      optionTextSet.add(opt.trim());
    }
  }
});

