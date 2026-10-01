import React from 'react';
import type { Commitment } from '../../types/commitment.ts';
import { PastCommitmentCard } from '../components/PastCommitmentCard.tsx';

interface PastScreenProps {
  pastCommitments: Commitment[];
}

export const PastScreen: React.FC<PastScreenProps> = ({ pastCommitments }) => {
  return (
    <section className="past-screen">
      <header>
        <h1 className="title-large">Past Commitments</h1>
        <p className="text-meta" style={{ marginTop: '4px' }}>
          Historical records of completed 30-day commitments.
        </p>
      </header>

      {pastCommitments.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '300px' }}>
          <p className="title-medium" style={{ fontSize: '17px' }}>
            No past commitments yet
          </p>
          <p className="text-subtle" style={{ maxWidth: '300px' }}>
            When you complete a 30-day commitment, it will be graduated and preserved here.
          </p>
        </div>
      ) : (
        <div className="past-list">
          {pastCommitments.map((commitment) => (
            <PastCommitmentCard key={commitment.id} commitment={commitment} />
          ))}
        </div>
      )}
    </section>
  );
};
