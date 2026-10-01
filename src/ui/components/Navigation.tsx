import React from 'react';
import { Target, History } from 'lucide-react';

export type NavTab = 'active' | 'past';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pastCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  pastCount,
}) => {
  return (
    <header className="app-header">
      <div className="brand-title">30-Day Commitment</div>
      <nav className="nav-links" aria-label="Main Navigation">
        <button
          type="button"
          className={`nav-btn ${currentTab === 'active' ? 'active' : ''}`}
          onClick={() => onSelectTab('active')}
          aria-current={currentTab === 'active' ? 'page' : undefined}
        >
          <Target size={14} aria-hidden="true" />
          Active
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === 'past' ? 'active' : ''}`}
          onClick={() => onSelectTab('past')}
          aria-current={currentTab === 'past' ? 'page' : undefined}
        >
          <History size={14} aria-hidden="true" />
          Past
          {pastCount > 0 && <span className="nav-badge">{pastCount}</span>}
        </button>
      </nav>
    </header>
  );
};
