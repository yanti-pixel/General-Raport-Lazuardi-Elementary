export interface Student {
  id: string;
  name: string;
  class: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface LearningGoal {
  id: string;
  subjectId: string;
  description: string;
}

export interface LearningObjective {
  id: string;
  learningGoalId: string;
  description: string;
}

export interface MonthlyRecord {
  id: string;
  studentId: string;
  month: string;
  subjectId: string;
  objectiveId: string;
  score: number;
  anecdote: string;
  comment?: string;
}

export const SUBJECTS: Subject[] = [
  { id: '1', name: 'Mengaji' },
  { id: '2', name: 'Bahasa Indonesia' },
  { id: '3', name: 'Matematika' },
  { id: '4', name: 'Bahasa Inggris' },
];

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const LEVELS = [
  { value: 4, label: 'Sangat Baik (SB)' },
  { value: 3, label: 'Baik (B)' },
  { value: 2, label: 'Cukup (C)' },
  { value: 1, label: 'Perlu Bantuan (PB)' },
];
