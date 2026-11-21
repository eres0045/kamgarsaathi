// Auto-generated from the reviewed schema — canonical Certificate shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Certificate {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileId?: string | null;
  workerId?: string | null;
  photoUrl: string;
  isSample: boolean;
  extractionStatus: string;
  confirmedAt?: string | null;
  confirmedDays?: number | null;
  confirmedBy?: string | null;
}
