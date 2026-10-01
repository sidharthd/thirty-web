import React from 'react';
import { TARGET_DAYS } from '../../logic/commitmentRules.ts';

interface RadialProgressProps {
  completedCount: number;
  isTodayDone: boolean;
}

const VIEWBOX_SIZE = 260;
const CENTER = VIEWBOX_SIZE / 2;
const RADIUS = 110;
const PIP_RADIUS = 5;

export const RadialProgress: React.FC<RadialProgressProps> = ({
  completedCount,
  isTodayDone,
}) => {
  const days = Array.from({ length: TARGET_DAYS }, (_, i) => i + 1);

  return (
    <div className="radial-container" role="region" aria-label="30-day precision radial progress">
      <div className="radial-wrapper">
        <svg
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          className="radial-svg"
          aria-hidden="true"
        >
          {days.map((day, index) => {
            const isDone = day <= completedCount;
            const isTodayTarget = !isTodayDone && day === completedCount + 1;

            // Angle in degrees starting from 12 o'clock (-90 deg)
            const angleDeg = index * (360 / TARGET_DAYS) - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = CENTER + RADIUS * Math.cos(angleRad);
            const cy = CENTER + RADIUS * Math.sin(angleRad);

            let pipClass = 'radial-pip';
            if (isDone) pipClass += ' filled';
            if (isTodayTarget) pipClass += ' today-target';

            return (
              <circle
                key={day}
                cx={cx}
                cy={cy}
                r={isTodayTarget ? PIP_RADIUS + 0.5 : PIP_RADIUS}
                className={pipClass}
              />
            );
          })}
        </svg>

        <div className="radial-center-content">
          <div className="radial-stat-row">
            <span className="radial-count">{completedCount}</span>
            <span className="radial-total">/ {TARGET_DAYS}</span>
          </div>
          <span className="radial-label">days completed</span>
        </div>
      </div>
    </div>
  );
};
