import React from 'react';
import { Check } from 'lucide-react';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';

interface ProgressGridProps {
  completedCount: number;
  isTodayDone: boolean;
}

export const ProgressGrid: React.FC<ProgressGridProps> = ({
  completedCount,
  isTodayDone,
}) => {
  const days = Array.from({ length: TARGET_DAYS }, (_, i) => i + 1);

  return (
    <div className="grid-container" role="region" aria-label="30-day progress visualizer">
      <div className="progress-grid">
        {days.map((day) => {
          const isDone = day <= completedCount;
          // The next pending day is today's target if today is not yet done
          const isTodayTarget = !isTodayDone && day === completedCount + 1;

          let cellClass = 'grid-cell';
          if (isDone) cellClass += ' completed';
          if (isTodayTarget) cellClass += ' today-target';

          return (
            <div
              key={day}
              className={cellClass}
              title={`Day ${day}: ${isDone ? 'Completed' : 'Pending'}`}
              aria-label={`Day ${day}: ${isDone ? 'Completed' : 'Pending'}`}
            >
              {isDone ? <Check size={12} strokeWidth={2.5} aria-hidden="true" /> : day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
