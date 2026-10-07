import { describe, expect, it } from 'bun:test';
import {
  isWithinGracePeriod,
  validateEditedTitle,
} from './commitmentRules.ts';
import type { Commitment } from '../types/commitment.ts';

describe('commitmentRules', () => {
  const createMockCommitment = (overrides: Partial<Commitment> = {}): Commitment => ({
    id: 'test-1',
    title: 'Morning Run',
    createdAt: new Date().toISOString(),
    completedDates: [],
    status: 'active',
    ...overrides,
  });

  describe('isWithinGracePeriod', () => {
    it('returns false when commitment is null or not active', () => {
      expect(isWithinGracePeriod(null)).toBe(false);
      expect(isWithinGracePeriod(createMockCommitment({ status: 'graduated' }))).toBe(false);
      expect(isWithinGracePeriod(createMockCommitment({ status: 'abandoned' }))).toBe(false);
    });

    it('returns true when commitment is active, <= 1 day completed, and created < 24h ago', () => {
      const now = new Date('2026-10-08T12:00:00.000Z');
      const commitment = createMockCommitment({
        createdAt: new Date('2026-10-08T00:00:00.000Z').toISOString(), // 12 hours ago
        completedDates: ['2026-10-08'],
      });

      expect(isWithinGracePeriod(commitment, now)).toBe(true);
    });

    it('returns true with 0 completions when created < 24h ago', () => {
      const now = new Date('2026-10-08T12:00:00.000Z');
      const commitment = createMockCommitment({
        createdAt: new Date('2026-10-08T06:00:00.000Z').toISOString(), // 6 hours ago
        completedDates: [],
      });

      expect(isWithinGracePeriod(commitment, now)).toBe(true);
    });

    it('returns false when completedDates has more than 1 entry even if created < 24h ago', () => {
      const now = new Date('2026-10-08T12:00:00.000Z');
      const commitment = createMockCommitment({
        createdAt: new Date('2026-10-08T00:00:00.000Z').toISOString(),
        completedDates: ['2026-10-07', '2026-10-08'],
      });

      expect(isWithinGracePeriod(commitment, now)).toBe(false);
    });

    it('returns false when created >= 24h ago even with 0 or 1 completion', () => {
      const now = new Date('2026-10-08T12:00:00.000Z');
      const commitment = createMockCommitment({
        createdAt: new Date('2026-10-07T11:00:00.000Z').toISOString(), // 25 hours ago
        completedDates: ['2026-10-07'],
      });

      expect(isWithinGracePeriod(commitment, now)).toBe(false);
    });

    it('returns false when createdAt is invalid or in the future', () => {
      const now = new Date('2026-10-08T12:00:00.000Z');
      expect(isWithinGracePeriod(createMockCommitment({ createdAt: 'invalid-date' }), now)).toBe(false);
      expect(isWithinGracePeriod(createMockCommitment({ createdAt: '2026-10-08T13:00:00.000Z' }), now)).toBe(false);
    });
  });

  describe('validateEditedTitle', () => {
    it('accepts valid non-empty titles under 100 characters', () => {
      expect(validateEditedTitle('Read 20 pages').valid).toBe(true);
      expect(validateEditedTitle('   Meditate for 10 minutes   ').valid).toBe(true);
    });

    it('rejects empty or whitespace-only titles', () => {
      expect(validateEditedTitle('').valid).toBe(false);
      expect(validateEditedTitle('   ').valid).toBe(false);
    });

    it('rejects titles longer than 100 characters', () => {
      const longTitle = 'A'.repeat(101);
      expect(validateEditedTitle(longTitle).valid).toBe(false);
    });
  });
});
