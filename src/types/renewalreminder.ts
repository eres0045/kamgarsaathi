// Auto-generated from the reviewed schema — canonical RenewalReminder shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface RenewalReminder {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileId: string;
  registrationDate?: string | null;
  renewalDueDate?: string | null;
}
