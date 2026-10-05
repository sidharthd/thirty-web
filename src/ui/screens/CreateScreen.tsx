import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CommitmentForm } from '../components/CommitmentForm.tsx';

interface CreateScreenProps {
  onSubmit: (title: string) => { success: boolean; error?: string };
  onCancel?: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({ onSubmit, onCancel }) => {
  return (
    <section className="create-screen">
      {onCancel && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          style={{ alignSelf: 'flex-start', marginBottom: '16px', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
      )}

      <h1 className="title-large">New Commitment</h1>
      <p className="text-meta" style={{ marginTop: '8px', marginBottom: '24px' }}>
        What will you commit to for the next 30 days?
      </p>

      <CommitmentForm
        onSubmit={onSubmit}
        submitLabel="Start 30 Days"
      />
    </section>
  );
};
