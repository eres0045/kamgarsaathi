// Auto-generated from the reviewed schema — canonical Worker shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Worker {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  age?: number | null;
  occupation: string;
  state: string;
  constructionDaysLast12Months: number;
  employmentStatus: string;
  aadhaarShown: boolean;
  isSample: boolean;
}
