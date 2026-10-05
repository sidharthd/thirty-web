import React from 'react';
import { CommitmentForm } from '../components/CommitmentForm.tsx';

interface IntroScreenProps {
  onSubmit: (title: string) => { success: boolean; error?: string };
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onSubmit }) => {
  return (
    <section className="intro-screen">
      <div className="intro-manifesto">
        <span className="intro-brand">thirty</span>

        <h1 className="intro-title">
          One commitment.<br />
          Thirty days.
        </h1>

        <p className="intro-lead">
          You won't build a list of habits here.
        </p>

        <p className="intro-body">
          Pick one thing you want to practice, give it 30 days, then decide what's next.
        </p>
      </div>

      <CommitmentForm
        onSubmit={onSubmit}
        submitLabel="Start 30 Days"
        hintText="For the next 30 days"
      />
    </section>
  );
};
