import React from 'react';
import { Check, RotateCcw } from 'lucide-react';

interface DoneButtonProps {
  isTodayDone: boolean;
  onMarkDone: () => void;
  onUndo: () => void;
  disabled?: boolean;
}

export const DoneButton: React.FC<DoneButtonProps> = ({
  isTodayDone,
  onMarkDone,
  onUndo,
  disabled = false,
}) => {
  if (isTodayDone) {
    return (
      <div className="active-actions">
        <div className="completed-badge">
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          <span>Completed for today</span>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onUndo}
          title="Undo today's completion"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Undo today</span>
        </button>
      </div>
    );
  }

  return (
    <div className="active-actions">
      <button
        type="button"
        className="btn btn-primary"
        onClick={onMarkDone}
        disabled={disabled}
      >
        <Check size={18} strokeWidth={2.5} aria-hidden="true" />
        <span>Mark today as Done</span>
      </button>
    </div>
  );
};
