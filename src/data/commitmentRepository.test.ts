import { describe, expect, it } from 'bun:test';
import { LocalCommitmentRepository } from './commitmentRepository.ts';
import type { StorageAdapter } from './storage.ts';
import type { AppState } from '../types/commitment.ts';

class MemoryStorage implements StorageAdapter {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('commitmentRepository', () => {
  it('correctly persists and loads abandoned commitments', () => {
    const storage = new MemoryStorage();
    const repo = new LocalCommitmentRepository(storage, 'test_key');

    const state: AppState = {
      activeCommitment: null,
      pastCommitments: [
        {
          id: 'test-abandoned-1',
          title: 'Daily Meditation',
          createdAt: '2026-10-01T10:00:00.000Z',
          completedDates: ['2026-10-01', '2026-10-02'],
          status: 'abandoned',
          abandonedAt: '2026-10-05T14:00:00.000Z',
        },
        {
          id: 'test-graduated-1',
          title: 'Running',
          createdAt: '2026-09-01T10:00:00.000Z',
          completedDates: Array.from({ length: 30 }, (_, i) => `2026-09-${i + 1}`),
          status: 'graduated',
          graduatedAt: '2026-10-01T10:00:00.000Z',
        },
      ],
    };

    repo.saveAppState(state);
    const loaded = repo.loadAppState();

    expect(loaded.pastCommitments.length).toBe(2);
    expect(loaded.pastCommitments[0].status).toBe('abandoned');
    expect(loaded.pastCommitments[0].abandonedAt).toBe('2026-10-05T14:00:00.000Z');
    expect(loaded.pastCommitments[1].status).toBe('graduated');
  });
});
