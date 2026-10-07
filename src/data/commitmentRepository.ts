import type { AppState, Commitment } from '../types/commitment.ts';
import { type StorageAdapter, defaultStorage } from './storage.ts';

const STORAGE_KEY = 'thirty_day_commitment_state_v1';

export const INITIAL_APP_STATE: AppState = {
  activeCommitment: null,
  pastCommitments: [],
};

export interface CommitmentRepository {
  loadAppState(): AppState;
  saveAppState(state: AppState): void;
  clearAppState(): void;
}

function sanitizeCommitment(raw: unknown): Commitment | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const candidate = raw as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || typeof candidate.title !== 'string') {
    return null;
  }

  const completedDates = Array.isArray(candidate.completedDates)
    ? candidate.completedDates.filter((item): item is string => typeof item === 'string')
    : [];

  let status: Commitment['status'] = 'active';
  if (candidate.status === 'graduated') {
    status = 'graduated';
  } else if (candidate.status === 'abandoned') {
    status = 'abandoned';
  }

  const createdAt = typeof candidate.createdAt === 'string'
    ? candidate.createdAt
    : new Date().toISOString();
  const graduatedAt = typeof candidate.graduatedAt === 'string'
    ? candidate.graduatedAt
    : undefined;
  const abandonedAt = typeof candidate.abandonedAt === 'string'
    ? candidate.abandonedAt
    : undefined;

  return {
    id: candidate.id,
    title: candidate.title,
    createdAt,
    completedDates,
    status,
    graduatedAt,
    abandonedAt,
  };
}

export class LocalCommitmentRepository implements CommitmentRepository {
  private storage: StorageAdapter;
  private storageKey: string;

  constructor(storage: StorageAdapter = defaultStorage, storageKey: string = STORAGE_KEY) {
    this.storage = storage;
    this.storageKey = storageKey;
  }

  loadAppState(): AppState {
    const raw = this.storage.getItem(this.storageKey);
    if (!raw) {
      return INITIAL_APP_STATE;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return INITIAL_APP_STATE;
      }

      const activeCommitment = sanitizeCommitment(parsed.activeCommitment);

      const pastCommitments: Commitment[] = Array.isArray(parsed.pastCommitments)
        ? parsed.pastCommitments
            .map((item: unknown) => sanitizeCommitment(item))
            .filter((item: Commitment | null): item is Commitment => item !== null)
        : [];

      return {
        activeCommitment,
        pastCommitments,
      };
    } catch (error) {
      console.error('Error parsing stored app state:', error);
      return INITIAL_APP_STATE;
    }
  }

  saveAppState(state: AppState): void {
    try {
      const serialized = JSON.stringify(state);
      this.storage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error('Error saving app state to storage:', error);
    }
  }

  clearAppState(): void {
    this.storage.removeItem(this.storageKey);
  }
}

export const commitmentRepository: CommitmentRepository = new LocalCommitmentRepository();
