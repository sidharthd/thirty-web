import { useState } from 'react';
import { useCommitments } from './logic/useCommitments.ts';
import { Navigation, type NavTab } from './ui/components/Navigation.tsx';
import { ActiveScreen } from './ui/screens/ActiveScreen.tsx';
import { CreateScreen } from './ui/screens/CreateScreen.tsx';
import { IntroScreen } from './ui/screens/IntroScreen.tsx';
import { PastScreen } from './ui/screens/PastScreen.tsx';
import { GraduationScreen } from './ui/screens/GraduationScreen.tsx';
import './ui/styles/app.css';

export default function App() {
  const {
    activeCommitment,
    pastCommitments,
    isTodayDone,
    isFirstTimeUser,
    progress,
    showGraduationScreen,
    createCommitment,
    markTodayDone,
    unmarkToday,
    graduateCommitment,
    dismissGraduation,
  } = useCommitments();

  const [currentTab, setCurrentTab] = useState<NavTab>('active');
  const [isCreatingManually, setIsCreatingManually] = useState(false);

  const handleStartAnother = () => {
    graduateCommitment();
    setCurrentTab('active');
    setIsCreatingManually(true);
  };

  const handleFinishForNow = () => {
    dismissGraduation();
    setCurrentTab('past');
    setIsCreatingManually(false);
  };

  const handleCreateSubmit = (title: string) => {
    const result = createCommitment(title);
    if (result.success) {
      setIsCreatingManually(false);
      setCurrentTab('active');
    }
    return result;
  };

  // Determine whether to display the Create / Intro Screen
  const shouldShowCreateScreen =
    currentTab === 'active' && (!activeCommitment || isCreatingManually);

  return (
    <div className="app-container">
      {!isFirstTimeUser && (
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'past') {
              setIsCreatingManually(false);
            }
          }}
          pastCount={pastCommitments.length}
        />
      )}

      <main className="app-main">
        {currentTab === 'active' && (
          <>
            {shouldShowCreateScreen ? (
              isFirstTimeUser ? (
                <IntroScreen onSubmit={handleCreateSubmit} />
              ) : (
                <CreateScreen
                  onSubmit={handleCreateSubmit}
                  onCancel={activeCommitment ? () => setIsCreatingManually(false) : undefined}
                />
              )
            ) : (
              <ActiveScreen
                commitment={activeCommitment}
                progress={progress}
                isTodayDone={isTodayDone}
                onMarkDone={markTodayDone}
                onUndo={unmarkToday}
                onCreateClick={() => setIsCreatingManually(true)}
              />
            )}
          </>
        )}

        {currentTab === 'past' && (
          <PastScreen pastCommitments={pastCommitments} />
        )}
      </main>

      {showGraduationScreen && activeCommitment && (
        <GraduationScreen
          commitment={activeCommitment}
          onStartAnother={handleStartAnother}
          onFinishForNow={handleFinishForNow}
        />
      )}
    </div>
  );
}
