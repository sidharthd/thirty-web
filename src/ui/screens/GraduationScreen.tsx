import React from 'react';
import { Award, Plus, Check } from 'lucide-react';
import type { Commitment } from '../../types/commitment.ts';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';

interface GraduationScreenProps {
  commitment: Commitment;
  onStartAnother: () => void;
  onFinishForNow: () => void;
}

export const GraduationScreen: React.FC<GraduationScreenProps> = ({
  commitment,
  onStartAnother,
  onFinishForNow,
}) => {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graduation-title"
    >
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={24} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        <div>
          <span className="modal-pretitle">Milestone Reached</span>
          <h2 id="graduation-title" className="title-large" style={{ marginTop: '6px' }}>
            30 Days Complete
          </h2>
          <p className="title-medium" style={{ marginTop: '12px', fontWeight: 500 }}>
            {commitment.title}
          </p>
          <p className="text-meta" style={{ marginTop: '4px' }}>
            {TARGET_DAYS} / {TARGET_DAYS} days completed
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartAnother}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Start another commitment</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onFinishForNow}
          >
            <Check size={16} aria-hidden="true" />
            <span>Finish for now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
