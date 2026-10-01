import React from 'react';
import type { Commitment } from '../../types/commitment.ts';
import type { ProgressState } from '../../logic/commitmentRules.ts';
import { RadialProgress } from '../components/RadialProgress.tsx';
import { Plus, RotateCcw } from 'lucide-react';

interface ActiveScreenProps {
  commitment: Commitment | null;
  progress: ProgressState;
  isTodayDone: boolean;
  onMarkDone: () => void;
  onUndo: () => void;
  onCreateClick: () => void;
}

export const ActiveScreen: React.FC<ActiveScreenProps> = ({
  commitment,
  progress,
  isTodayDone,
  onMarkDone,
  onUndo,
  onCreateClick,
}) => {
  if (!commitment) {
    return (
      <section className="empty-state">
        <h1 className="title-medium">No Active Commitment</h1>
        <p className="text-meta">
          One commitment. 30 days. Focus on practicing one habit at a time.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: 'auto', marginTop: '8px' }}
          onClick={onCreateClick}
        >
          <Plus size={16} aria-hidden="true" />
          <span>Start a Commitment</span>
        </button>
      </section>
    );
  }

  return (
    <section className="active-screen">
      <header className="active-header">
        <h1 className="title-large">{commitment.title}</h1>
      </header>

      <RadialProgress
        completedCount={progress.current}
        isTodayDone={isTodayDone}
        onMarkDone={onMarkDone}
        disabled={progress.isComplete}
      />

      {isTodayDone && !progress.isComplete && (
        <div className="active-undo-container">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onUndo}
            title="Undo today's mark"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>Undo today</span>
          </button>
        </div>
      )}
    </section>
  );
};
