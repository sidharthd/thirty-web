import React, { useState } from 'react';
import type { Commitment } from '../../types/commitment.ts';
import type { ProgressState } from '../../logic/commitmentRules.ts';
import { RadialProgress } from '../components/RadialProgress.tsx';
import { CommitmentActionModal } from '../components/CommitmentActionModal.tsx';
import { Plus, RotateCcw, MoreHorizontal } from 'lucide-react';

interface ActiveScreenProps {
  commitment: Commitment | null;
  progress: ProgressState;
  isTodayDone: boolean;
  isWithinGracePeriod: boolean;
  onMarkDone: () => void;
  onUndo: () => void;
  onCreateClick: () => void;
  onEditTitle: (newTitle: string) => { success: boolean; error?: string };
  onCancelCommitment: () => { success: boolean; error?: string };
  onAbandonCommitment: () => { success: boolean; error?: string };
}

export const ActiveScreen: React.FC<ActiveScreenProps> = ({
  commitment,
  progress,
  isTodayDone,
  isWithinGracePeriod,
  onMarkDone,
  onUndo,
  onCreateClick,
  onEditTitle,
  onCancelCommitment,
  onAbandonCommitment,
}) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
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
        <h1 className="title-large active-title">{commitment.title}</h1>
        <button
          type="button"
          className="btn-icon-header"
          onClick={() => setIsActionModalOpen(true)}
          aria-label="Commitment options"
          title="Commitment options"
        >
          <MoreHorizontal size={20} aria-hidden="true" />
        </button>
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

      {isActionModalOpen && (
        <CommitmentActionModal
          commitment={commitment}
          isWithinGracePeriod={isWithinGracePeriod}
          onClose={() => setIsActionModalOpen(false)}
          onEditTitle={onEditTitle}
          onCancelCommitment={onCancelCommitment}
          onAbandonCommitment={onAbandonCommitment}
        />
      )}
    </section>
  );
};
