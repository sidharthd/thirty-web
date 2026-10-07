import React, { useState, useEffect } from 'react';
import type { Commitment } from '../../types/commitment.ts';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';
import { Pencil, Trash2, Flag, X } from 'lucide-react';

interface CommitmentActionModalProps {
  commitment: Commitment;
  isWithinGracePeriod: boolean;
  onClose: () => void;
  onEditTitle: (newTitle: string) => { success: boolean; error?: string };
  onCancelCommitment: () => { success: boolean; error?: string };
  onAbandonCommitment: () => { success: boolean; error?: string };
}

type ModalView = 'menu' | 'edit' | 'cancel_confirm' | 'abandon_confirm';

export const CommitmentActionModal: React.FC<CommitmentActionModalProps> = ({
  commitment,
  isWithinGracePeriod,
  onClose,
  onEditTitle,
  onCancelCommitment,
  onAbandonCommitment,
}) => {
  const [view, setView] = useState<ModalView>('menu');
  const [editedTitle, setEditedTitle] = useState(commitment.title);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle ESC key to close or go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view !== 'menu') {
          setView('menu');
          setErrorMessage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, onClose]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onEditTitle(editedTitle);
    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to update commitment title.');
    }
  };

  const handleConfirmCancel = () => {
    const result = onCancelCommitment();
    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to cancel commitment.');
    }
  };

  const handleConfirmAbandon = () => {
    const result = onAbandonCommitment();
    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to abandon commitment.');
    }
  };

  const completedCount = commitment.completedDates.length;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content action-modal-content">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {view === 'menu' && (
          <div className="action-menu-view">
            <header className="action-modal-header">
              <h2 id="action-modal-title" className="title-medium">
                Commitment Options
              </h2>
              <p className="text-subtle text-truncate" title={commitment.title}>
                {commitment.title}
              </p>
            </header>

            <div className="action-menu-list">
              <button
                type="button"
                className="action-menu-item"
                onClick={() => setView('edit')}
              >
                <div className="action-menu-icon">
                  <Pencil size={18} aria-hidden="true" />
                </div>
                <div className="action-menu-text">
                  <span className="action-menu-label">Edit Title</span>
                  <span className="action-menu-description">
                    Fix typos or adjust wording without losing progress
                  </span>
                </div>
              </button>

              {isWithinGracePeriod ? (
                <button
                  type="button"
                  className="action-menu-item action-menu-danger"
                  onClick={() => setView('cancel_confirm')}
                >
                  <div className="action-menu-icon action-icon-danger">
                    <Trash2 size={18} aria-hidden="true" />
                  </div>
                  <div className="action-menu-text">
                    <span className="action-menu-label">Cancel Commitment</span>
                    <span className="action-menu-description">
                      Within 24h grace window. Completely removes without recording.
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  className="action-menu-item action-menu-danger"
                  onClick={() => setView('abandon_confirm')}
                >
                  <div className="action-menu-icon action-icon-danger">
                    <Flag size={18} aria-hidden="true" />
                  </div>
                  <div className="action-menu-text">
                    <span className="action-menu-label">Abandon Commitment</span>
                    <span className="action-menu-description">
                      Conclude early and archive {completedCount} / {TARGET_DAYS} days
                    </span>
                  </div>
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ marginTop: '8px' }}
            >
              Close
            </button>
          </div>
        )}

        {view === 'edit' && (
          <form onSubmit={handleEditSubmit} className="action-edit-view">
            <header className="action-modal-header">
              <h2 id="action-modal-title" className="title-medium">
                Edit Commitment Title
              </h2>
              <p className="text-subtle">
                Progress ({completedCount}/{TARGET_DAYS} days) will remain intact.
              </p>
            </header>

            <div className="commitment-input-group" style={{ textAlign: 'left' }}>
              <input
                type="text"
                className="text-input"
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                maxLength={100}
                autoFocus
                placeholder="Commitment title"
              />
              <span className="input-hint-text">
                {editedTitle.trim().length}/100 characters
              </span>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setView('menu');
                  setErrorMessage(null);
                }}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {view === 'cancel_confirm' && (
          <div className="action-confirm-view">
            <div className="action-warning-icon">
              <Trash2 size={28} aria-hidden="true" />
            </div>

            <header className="action-modal-header">
              <h2 id="action-modal-title" className="title-medium">
                Cancel Commitment?
              </h2>
              <p className="text-secondary" style={{ marginTop: '6px' }}>
                Because you started this within the last 24 hours, it will be discarded completely without recording to your history.
              </p>
            </header>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
              >
                Cancel Commitment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setView('menu');
                  setErrorMessage(null);
                }}
              >
                Keep Commitment
              </button>
            </div>
          </div>
        )}

        {view === 'abandon_confirm' && (
          <div className="action-confirm-view">
            <div className="action-warning-icon">
              <Flag size={28} aria-hidden="true" />
            </div>

            <header className="action-modal-header">
              <h2 id="action-modal-title" className="title-medium">
                Abandon Commitment?
              </h2>
              <p className="text-secondary" style={{ marginTop: '6px' }}>
                This will end your commitment early. Your {completedCount} completed {completedCount === 1 ? 'day' : 'days'} will be archived in your past history.
              </p>
            </header>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmAbandon}
              >
                Yes, Abandon Commitment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setView('menu');
                  setErrorMessage(null);
                }}
              >
                Keep Practicing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
