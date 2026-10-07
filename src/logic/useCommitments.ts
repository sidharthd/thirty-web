import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Commitment, AppState } from '../types/commitment.ts';
import { commitmentRepository } from '../data/commitmentRepository.ts';
import { getTodayDateKey } from './dateUtils.ts';
import {
  TARGET_DAYS,
  getProgress,
  isCompletedToday,
  canMarkToday,
  validateNewCommitment,
  checkIsFirstTimeUser,
  isWithinGracePeriod,
  validateEditedTitle,
  type ProgressState,
} from './commitmentRules.ts';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `commit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export interface UseCommitmentsReturn {
  activeCommitment: Commitment | null;
  pastCommitments: Commitment[];
  isLoaded: boolean;
  isTodayDone: boolean;
  isFirstTimeUser: boolean;
  progress: ProgressState;
  showGraduationScreen: boolean;
  isWithinGracePeriod: boolean;
  createCommitment: (title: string) => { success: boolean; error?: string };
  markTodayDone: () => { success: boolean; isGraduation: boolean };
  unmarkToday: () => void;
  graduateCommitment: () => Commitment | null;
  dismissGraduation: () => void;
  editActiveTitle: (newTitle: string) => { success: boolean; error?: string };
  cancelActiveCommitment: () => { success: boolean; error?: string };
  abandonActiveCommitment: () => { success: boolean; error?: string };
}

export function useCommitments(): UseCommitmentsReturn {
  const [appState, setAppState] = useState<AppState>(() => commitmentRepository.loadAppState());
  const [isLoaded] = useState<boolean>(true);
  const [dismissedGraduationId, setDismissedGraduationId] = useState<string | null>(null);

  const { activeCommitment, pastCommitments } = appState;

  // Persist state changes whenever appState updates
  useEffect(() => {
    commitmentRepository.saveAppState(appState);
  }, [appState]);

  const todayKey = getTodayDateKey();
  const isTodayDone = useMemo(
    () => isCompletedToday(activeCommitment, todayKey),
    [activeCommitment, todayKey]
  );

  const progress = useMemo(
    () => getProgress(activeCommitment),
    [activeCommitment]
  );

  const isFirstTimeUser = useMemo(
    () => checkIsFirstTimeUser(activeCommitment, pastCommitments),
    [activeCommitment, pastCommitments]
  );

  // Show graduation when active commitment reaches 30 days and has not been dismissed
  const showGraduationScreen = useMemo(() => {
    if (!activeCommitment || activeCommitment.status !== 'active') {
      return false;
    }
    if (activeCommitment.id === dismissedGraduationId) {
      return false;
    }
    return progress.isComplete;
  }, [activeCommitment, dismissedGraduationId, progress.isComplete]);

  /**
   * Creates a new 30-day commitment.
   */
  const createCommitment = useCallback((title: string): { success: boolean; error?: string } => {
    const validation = validateNewCommitment(title, activeCommitment);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const newCommitment: Commitment = {
      id: generateId(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      status: 'active',
    };

    setAppState((prev) => ({
      ...prev,
      activeCommitment: newCommitment,
    }));

    return { success: true };
  }, [activeCommitment]);

  /**
   * Marks today as complete.
   */
  const markTodayDone = useCallback((): { success: boolean; isGraduation: boolean } => {
    if (!activeCommitment || !canMarkToday(activeCommitment, todayKey)) {
      return { success: false, isGraduation: false };
    }

    const updatedDates = [...activeCommitment.completedDates, todayKey];
    const isGraduation = updatedDates.length >= TARGET_DAYS;

    setAppState((prev) => {
      if (!prev.activeCommitment) return prev;
      return {
        ...prev,
        activeCommitment: {
          ...prev.activeCommitment,
          completedDates: updatedDates,
        },
      };
    });

    return { success: true, isGraduation };
  }, [activeCommitment, todayKey]);

  /**
   * Unmarks today if completed (undo).
   */
  const unmarkToday = useCallback(() => {
    if (!activeCommitment || !isTodayDone) {
      return;
    }

    const updatedDates = activeCommitment.completedDates.filter((date) => date !== todayKey);

    setAppState((prev) => {
      if (!prev.activeCommitment) return prev;
      return {
        ...prev,
        activeCommitment: {
          ...prev.activeCommitment,
          completedDates: updatedDates,
        },
      };
    });
  }, [activeCommitment, isTodayDone, todayKey]);

  /**
   * Moves the active commitment to past commitments as graduated.
   */
  const graduateCommitment = useCallback((): Commitment | null => {
    if (!activeCommitment) {
      return null;
    }

    const graduated: Commitment = {
      ...activeCommitment,
      status: 'graduated',
      graduatedAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      activeCommitment: null,
      pastCommitments: [graduated, ...prev.pastCommitments],
    }));

    setDismissedGraduationId(null);
    return graduated;
  }, [activeCommitment]);

  /**
   * Dismisses the graduation screen without starting a new commitment immediately.
   * Graduates the commitment and leaves active as null.
   */
  const dismissGraduation = useCallback(() => {
    graduateCommitment();
  }, [graduateCommitment]);

  const isGracePeriodActive = useMemo(
    () => isWithinGracePeriod(activeCommitment),
    [activeCommitment]
  );

  /**
   * Updates the title of the active commitment.
   */
  const editActiveTitle = useCallback((newTitle: string): { success: boolean; error?: string } => {
    if (!activeCommitment) {
      return { success: false, error: 'No active commitment to edit.' };
    }

    const validation = validateEditedTitle(newTitle);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const trimmed = newTitle.trim();
    setAppState((prev) => {
      if (!prev.activeCommitment) return prev;
      return {
        ...prev,
        activeCommitment: {
          ...prev.activeCommitment,
          title: trimmed,
        },
      };
    });

    return { success: true };
  }, [activeCommitment]);

  /**
   * Cancels the active commitment during its grace period.
   * Completely removes it without saving to past history.
   */
  const cancelActiveCommitment = useCallback((): { success: boolean; error?: string } => {
    if (!activeCommitment) {
      return { success: false, error: 'No active commitment to cancel.' };
    }

    if (!isWithinGracePeriod(activeCommitment)) {
      return {
        success: false,
        error: 'Grace period has expired. You can abandon this commitment instead.',
      };
    }

    setAppState((prev) => ({
      ...prev,
      activeCommitment: null,
    }));

    return { success: true };
  }, [activeCommitment]);

  /**
   * Abandons the active commitment after the grace period.
   * Concludes it early and archives it to past commitments.
   */
  const abandonActiveCommitment = useCallback((): { success: boolean; error?: string } => {
    if (!activeCommitment) {
      return { success: false, error: 'No active commitment to abandon.' };
    }

    const abandoned: Commitment = {
      ...activeCommitment,
      status: 'abandoned',
      abandonedAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      activeCommitment: null,
      pastCommitments: [abandoned, ...prev.pastCommitments],
    }));

    return { success: true };
  }, [activeCommitment]);

  return {
    activeCommitment,
    pastCommitments,
    isLoaded,
    isTodayDone,
    isFirstTimeUser,
    progress,
    showGraduationScreen,
    isWithinGracePeriod: isGracePeriodActive,
    createCommitment,
    markTodayDone,
    unmarkToday,
    graduateCommitment,
    dismissGraduation,
    editActiveTitle,
    cancelActiveCommitment,
    abandonActiveCommitment,
  };
}
