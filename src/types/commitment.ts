export type CommitmentStatus = 'active' | 'graduated';

export interface Commitment {
  id: string;
  title: string;
  createdAt: string; // ISO 8601 string
  completedDates: string[]; // List of unique "YYYY-MM-DD" local calendar date strings
  status: CommitmentStatus;
  graduatedAt?: string; // ISO 8601 string when 30/30 was achieved
}

export interface AppState {
  activeCommitment: Commitment | null;
  pastCommitments: Commitment[];
}

export interface CreateCommitmentInput {
  title: string;
}
