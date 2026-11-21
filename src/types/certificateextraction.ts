// Auto-generated from the reviewed schema — canonical CertificateExtraction shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface CertificateExtraction {
  id: string;
  createdAt: string;
  updatedAt: string;
  certificateId: string;
  fieldKey: string;
  extractedValue: string;
  cropImageUrl: string;
  isConfirmed: boolean;
  confirmedAt?: string | null;
}
