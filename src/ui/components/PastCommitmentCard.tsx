import React from 'react';
import type { Commitment } from '../../types/commitment.ts';
import { formatDisplayDate } from '../../logic/dateUtils.ts';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';

interface PastCommitmentCardProps {
  commitment: Commitment;
}

export const PastCommitmentCard: React.FC<PastCommitmentCardProps> = ({ commitment }) => {
  const isAbandoned = commitment.status === 'abandoned';
  const startDate = formatDisplayDate(commitment.createdAt);
  const endDate = formatDisplayDate(isAbandoned ? commitment.abandonedAt : commitment.graduatedAt);
  const completedCount = isAbandoned
    ? commitment.completedDates.length
    : TARGET_DAYS;

  return (
    <article className={`past-card ${isAbandoned ? 'past-card-abandoned' : ''}`}>
      <div className="past-card-header">
        <h3 className="past-card-title">{commitment.title}</h3>
        <span className={`status-tag ${isAbandoned ? 'status-tag-abandoned' : 'status-tag-graduated'}`}>
          {isAbandoned ? 'Abandoned' : 'Graduated'}
        </span>
      </div>
      <div className="past-card-meta">
        <span>{completedCount} / {TARGET_DAYS} days completed</span>
        <span className="text-subtle">
          {startDate} — {endDate}
        </span>
      </div>
    </article>
  );
};
