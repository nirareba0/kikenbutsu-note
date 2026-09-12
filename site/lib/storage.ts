import type {
  AppStorageData,
  ExamResult,
  ExamSession,
  PracticeAnswer,
  SubjectId,
} from './types';

export const CURRENT_STORAGE_VERSION = 1;
export const STORAGE_KEY = 'kikenbutsu_note_v1';

export const DEFAULT_STORAGE_DATA: AppStorageData = {
  version: CURRENT_STORAGE_VERSION,
  completedLessons: [],
  practiceAnswers: {},
  currentExamSession: null,
  examHistory: [],
  lastActiveLessonId: null,
  lastActivePracticeQuestionId: null,
};

let memoryStore: AppStorageData | null = null;
let isStorageAvailableState: boolean = true;
let storageErrorMessage: string | null = null;

export function getStorageStatus(): { available: boolean; errorMessage: string | null } {
  return {
    available: isStorageAvailableState,
    errorMessage: storageErrorMessage,
  };
}

/**
 * localStorage が利用可能か安全にテストする
 */
export function checkLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isStorageAvailableState = true;
    storageErrorMessage = null;
    return true;
  } catch (e) {
    isStorageAvailableState = false;
    storageErrorMessage =
      e instanceof Error
        ? `端末の保存領域（ローカルストレージ）への書き込みが制限されています: ${e.message}`
        : '端末の保存領域を利用できません。ブラウザのプライベートモード等の設定を確認してください。';
    return false;
  }
}

/**
 * 読み込んだデータを厳密に検証・サニタイズする
 */
export function sanitizeStorageData(
  rawData: unknown,
  validLessonIds: Set<string>,
  validQuestionIds: Set<string>
): AppStorageData {
  if (!rawData || typeof rawData !== 'object') {
    return { ...DEFAULT_STORAGE_DATA };
  }

  const obj = rawData as Record<string, unknown>;

  // completedLessons の検証
  const rawCompleted = Array.isArray(obj.completedLessons) ? obj.completedLessons : [];
  const completedLessons = rawCompleted.filter(
    (id): id is string => typeof id === 'string' && validLessonIds.has(id)
  );

  // practiceAnswers の検証
  const practiceAnswers: Record<string, PracticeAnswer> = {};
  if (obj.practiceAnswers && typeof obj.practiceAnswers === 'object') {
    const rawAnswers = obj.practiceAnswers as Record<string, unknown>;
    for (const [qId, ans] of Object.entries(rawAnswers)) {
      if (!validQuestionIds.has(qId) || !ans || typeof ans !== 'object') {
        continue;
      }
      const ansObj = ans as Record<string, unknown>;
      const selectedIndex = Number(ansObj.selectedIndex);
      // 4択なので 0, 1, 2, 3 のみ有効
      if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
        continue;
      }
      practiceAnswers[qId] = {
        questionId: qId,
        selectedIndex,
        isCorrect: Boolean(ansObj.isCorrect),
        isUncertain: Boolean(ansObj.isUncertain),
        answeredAt: typeof ansObj.answeredAt === 'number' ? ansObj.answeredAt : Date.now(),
      };
    }
  }

  // currentExamSession の検証
  let currentExamSession: ExamSession | null = null;
  if (obj.currentExamSession && typeof obj.currentExamSession === 'object') {
    const rawSession = obj.currentExamSession as Record<string, unknown>;
    const id = typeof rawSession.id === 'string' ? rawSession.id : '';
    const startedAt = typeof rawSession.startedAt === 'number' ? rawSession.startedAt : 0;
    const deadline = typeof rawSession.deadline === 'number' ? rawSession.deadline : 0;
    const isCompleted = Boolean(rawSession.isCompleted);
    const submittedAt =
      typeof rawSession.submittedAt === 'number' ? rawSession.submittedAt : undefined;
    const currentQuestionIndex =
      typeof rawSession.currentQuestionIndex === 'number' &&
      rawSession.currentQuestionIndex >= 0 &&
      rawSession.currentQuestionIndex < 25
        ? rawSession.currentQuestionIndex
        : 0;

    const answers: Record<string, number> = {};
    if (rawSession.answers && typeof rawSession.answers === 'object') {
      const rawAns = rawSession.answers as Record<string, unknown>;
      for (const [qId, idx] of Object.entries(rawAns)) {
        if (!validQuestionIds.has(qId)) continue;
        const numIdx = Number(idx);
        if (Number.isInteger(numIdx) && numIdx >= 0 && numIdx <= 3) {
          answers[qId] = numIdx;
        }
      }
    }

    if (id && startedAt > 0 && deadline > startedAt) {
      currentExamSession = {
        id,
        startedAt,
        deadline,
        isCompleted,
        submittedAt,
        answers,
        currentQuestionIndex,
      };
    }
  }

  // examHistory の検証
  const examHistory: ExamResult[] = [];
  if (Array.isArray(obj.examHistory)) {
    for (const item of obj.examHistory) {
      if (!item || typeof item !== 'object') continue;
      const res = item as Record<string, unknown>;
      const id = typeof res.id === 'string' ? res.id : `exam-${Date.now()}`;
      const submittedAt = typeof res.submittedAt === 'number' ? res.submittedAt : 0;
      const totalScore = typeof res.totalScore === 'number' ? res.totalScore : 0;
      const totalQuestions = typeof res.totalQuestions === 'number' ? res.totalQuestions : 25;
      const percentage = typeof res.percentage === 'number' ? res.percentage : 0;
      const isPassed = Boolean(res.isPassed);

      const answers: Record<string, number> = {};
      if (res.answers && typeof res.answers === 'object') {
        const rawAns = res.answers as Record<string, unknown>;
        for (const [qId, idx] of Object.entries(rawAns)) {
          if (!validQuestionIds.has(qId)) continue;
          const numIdx = Number(idx);
          if (Number.isInteger(numIdx) && numIdx >= 0 && numIdx <= 3) {
            answers[qId] = numIdx;
          }
        }
      }

      if (res.subjectScores && typeof res.subjectScores === 'object') {
        const rawScores = res.subjectScores as Record<string, unknown>;
        const subjects: SubjectId[] = ['law', 'combustion', 'properties'];
        const validSubjects = subjects.every((s) => rawScores[s] && typeof rawScores[s] === 'object');
        if (validSubjects) {
          examHistory.push({
            id,
            submittedAt,
            totalScore,
            totalQuestions,
            percentage,
            isPassed,
            subjectScores: res.subjectScores as ExamResult['subjectScores'],
            answers,
          });
        }
      }
      if (examHistory.length >= 50) break;
    }
  }


  // lastActiveLessonId の検証
  const lastActiveLessonId =
    typeof obj.lastActiveLessonId === 'string' && validLessonIds.has(obj.lastActiveLessonId)
      ? obj.lastActiveLessonId
      : null;

  // lastActivePracticeQuestionId の検証
  const lastActivePracticeQuestionId =
    typeof obj.lastActivePracticeQuestionId === 'string' &&
    validQuestionIds.has(obj.lastActivePracticeQuestionId)
      ? obj.lastActivePracticeQuestionId
      : null;

  return {
    version: CURRENT_STORAGE_VERSION,
    completedLessons,
    practiceAnswers,
    currentExamSession,
    examHistory,
    lastActiveLessonId,
    lastActivePracticeQuestionId,
  };
}

/**
 * データを読み込む。localStorage が無効な場合はメモリ上のストアから取得。
 */
export function loadStorageData(
  validLessonIds: Set<string>,
  validQuestionIds: Set<string>
): AppStorageData {
  if (typeof window === 'undefined') {
    return memoryStore || { ...DEFAULT_STORAGE_DATA };
  }

  const isAvailable = checkLocalStorageAvailable();
  if (!isAvailable) {
    return memoryStore || { ...DEFAULT_STORAGE_DATA };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { ...DEFAULT_STORAGE_DATA };
      memoryStore = initial;
      return initial;
    }
    const parsed = JSON.parse(raw);
    const sanitized = sanitizeStorageData(parsed, validLessonIds, validQuestionIds);
    memoryStore = sanitized;
    return sanitized;
  } catch (e) {
    console.warn('Failed to parse localStorage, resetting to sanitized default:', e);
    const fallback = { ...DEFAULT_STORAGE_DATA };
    memoryStore = fallback;
    return fallback;
  }
}

/**
 * データを保存する。localStorage に保存できない場合はメモリに退避し、ステータスを更新。
 */
export function saveStorageData(data: AppStorageData): { success: boolean; error?: string } {
  memoryStore = data;

  if (typeof window === 'undefined') {
    return { success: true };
  }

  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    isStorageAvailableState = true;
    storageErrorMessage = null;
    return { success: true };
  } catch (e) {
    isStorageAvailableState = false;
    const msg =
      e instanceof Error
        ? `端末への保存に失敗しました（${e.message}）。本セッション中はメモリ内で学習を継続できます。`
        : '端末への保存に失敗しました。';
    storageErrorMessage = msg;
    console.warn(msg, e);
    return { success: false, error: msg };
  }
}
