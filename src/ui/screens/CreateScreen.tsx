import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CreateScreenProps {
  onSubmit: (title: string) => { success: boolean; error?: string };
  onCancel?: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a commitment.');
      return;
    }

    const result = onSubmit(title);
    if (!result.success) {
      setError(result.error ?? 'Could not create commitment.');
    } else {
      setError(null);
    }
  };

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
      <p className="text-meta" style={{ marginTop: '8px' }}>
        What habit do you want to commit to for 30 days?
      </p>

      <form className="create-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="commitment-input" className="sr-only" style={{ display: 'none' }}>
            Commitment Name
          </label>
          <input
            id="commitment-input"
            type="text"
            className="text-input"
            placeholder="e.g. Read 10 pages"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
            maxLength={100}
            aria-invalid={Boolean(error)}
          />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Start 30-Day Commitment
        </button>
      </form>
    </section>
  );
};
