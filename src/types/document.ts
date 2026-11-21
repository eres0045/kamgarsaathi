// Auto-generated from the reviewed schema — canonical Document shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  nameEn: string;
  nameMr: string;
  whereToGet: string;
  costRupees?: number | null;
  costStatus: string;
  daysToObtain?: number | null;
  daysStatus: string;
  appealOfficer?: string | null;
  isGateDocument: boolean;
  isShowOnly: boolean;
  position?: number | null;
  whereToGetMr?: string | null;
  appealOfficerMr?: string | null;
}
