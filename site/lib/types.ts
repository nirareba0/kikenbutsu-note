export type SubjectId = 'law' | 'combustion' | 'properties';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  questionCount: number;
  passingScore: number; // 60%
  description: string;
}

export interface LessonSections {
  introduction: string; // 導入
  reason: string; // 理由
  examples: string; // 具体例
  pitfalls: string; // つまずき
  summary: string; // 要点
}

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  title: string;
  order: number;
  estimatedMinutes: number;
  sections: LessonSections;
  source: {
    title: string;
    url: string;
    checkedAt: string;
  };
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  lessonId: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanations: [string, string, string, string];
  source: {
    title: string;
    url: string;
    checkedAt: string;
  };
}

export interface PracticeAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  isUncertain: boolean;
  answeredAt: number;
}

export interface ExamSession {
  id: string;
  startedAt: number;
  deadline: number;
  isCompleted: boolean;
  submittedAt?: number;
  answers: Record<string, number>; // questionId -> selectedIndex
  currentQuestionIndex: number;
}

export interface SubjectResult {
  subjectId: SubjectId;
  subjectName: string;
  score: number;
  total: number;
  percentage: number;
  isPassed: boolean;
}

export interface ExamResult {
  id: string;
  submittedAt: number;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  subjectScores: Record<SubjectId, SubjectResult>;
  answers: Record<string, number>;
}

export interface AppStorageData {
  version: number;
  completedLessons: string[];
  practiceAnswers: Record<string, PracticeAnswer>;
  currentExamSession: ExamSession | null;
  examHistory: ExamResult[];
  lastActiveLessonId: string | null;
  lastActivePracticeQuestionId: string | null;
}
