// Auto-generated from the reviewed schema — canonical DocumentTick shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface DocumentTick {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileId: string;
  documentId: string;
  isTicked: boolean;
  tickedAt?: string | null;
}
