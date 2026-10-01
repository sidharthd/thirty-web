import type { Commitment } from '../types/commitment.ts';
import { getTodayDateKey } from './dateUtils.ts';

export const TARGET_DAYS = 30;

export interface ProgressState {
  current: number;
  target: number;
  isComplete: boolean;
  percent: number;
}

/**
 * Checks if the given commitment has already been marked done for today.
 */
export function isCompletedToday(
  commitment: Commitment | null,
  todayKey: string = getTodayDateKey()
): boolean {
  if (!commitment || commitment.status !== 'active') {
    return false;
  }
  return commitment.completedDates.includes(todayKey);
}

/**
 * Calculates current progress toward the 30-day goal.
 */
export function getProgress(commitment: Commitment | null): ProgressState {
  const current = commitment ? Math.min(commitment.completedDates.length, TARGET_DAYS) : 0;
  const isComplete = current >= TARGET_DAYS;
  const percent = Math.min(100, Math.round((current / TARGET_DAYS) * 100));

  return {
    current,
    target: TARGET_DAYS,
    isComplete,
    percent,
  };
}

/**
 * Validates whether today's commitment can be marked as complete.
 */
export function canMarkToday(
  commitment: Commitment | null,
  todayKey: string = getTodayDateKey()
): boolean {
  if (!commitment || commitment.status !== 'active') {
    return false;
  }
  const progress = getProgress(commitment);
  if (progress.isComplete) {
    return false;
  }
  return !isCompletedToday(commitment, todayKey);
}

/**
 * Validates inputs before creating a new commitment.
 * Enforces the PRD rule: Only one active commitment at a time.
 */
export function validateNewCommitment(
  title: string,
  currentActive: Commitment | null
): { valid: boolean; error?: string } {
  if (currentActive && currentActive.status === 'active') {
    return {
      valid: false,
      error: 'Only one active commitment is permitted at a time.',
    };
  }

  const trimmed = title.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Commitment name cannot be empty.',
    };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: 'Commitment name should be under 100 characters.',
    };
  }

  return { valid: true };
}
