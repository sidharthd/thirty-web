import React from 'react';
import type { Commitment } from '../../types/commitment.ts';
import { formatDisplayDate } from '../../logic/dateUtils.ts';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';

interface PastCommitmentCardProps {
  commitment: Commitment;
}

export const PastCommitmentCard: React.FC<PastCommitmentCardProps> = ({ commitment }) => {
  const startDate = formatDisplayDate(commitment.createdAt);
  const completionDate = formatDisplayDate(commitment.graduatedAt);

  return (
    <article className="past-card">
      <div className="past-card-header">
        <h3 className="past-card-title">{commitment.title}</h3>
        <span className="status-tag">Graduated</span>
      </div>
      <div className="past-card-meta">
        <span>{TARGET_DAYS} / {TARGET_DAYS} days completed</span>
        <span className="text-subtle">
          {startDate} — {completionDate}
        </span>
      </div>
    </article>
  );
};
