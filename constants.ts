
import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  Subject.Physics,
  Subject.Chemistry,
  Subject.Biology,
  Subject.ComputerScience,
];

export const CLASSES: string[] = ['7', '8', '9', '10', '11', '12'];

export const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string }> = {
    [Subject.Physics]: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-800 dark:text-sky-200', border: 'border-sky-500' },
    [Subject.Chemistry]: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-500' },
    [Subject.Biology]: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-500' },
    [Subject.ComputerScience]: { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-800 dark:text-violet-200', border: 'border-violet-500' },
};

export const ADMIN_NICKNAME = 'tojodeepmaker111';