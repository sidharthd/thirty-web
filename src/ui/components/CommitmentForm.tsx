import React, { useState } from 'react';

interface CommitmentFormProps {
  onSubmit: (title: string) => { success: boolean; error?: string };
  submitLabel?: string;
  hintText?: string;
  autoFocus?: boolean;
}

export const CommitmentForm: React.FC<CommitmentFormProps> = ({
  onSubmit,
  submitLabel = 'Start 30 Days',
  hintText,
  autoFocus = true,
}) => {
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
    <form className="commitment-form" onSubmit={handleSubmit}>
      <div className="commitment-input-group">
        <label htmlFor="commitment-input" className="sr-only">
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
          autoFocus={autoFocus}
          maxLength={100}
          aria-invalid={Boolean(error)}
        />
        {hintText && <span className="input-hint-text">{hintText}</span>}
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
};
