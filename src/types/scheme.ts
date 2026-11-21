// Auto-generated from the reviewed schema — canonical Scheme shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Scheme {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  nameEn: string;
  nameMr: string;
  benefitEn: string;
  benefitAmount?: number | null;
  amountStatus: string;
  stackPosition: number;
  stackGroup: string;
  stackReasonEn: string;
  stackReasonMr: string;
  applyAt: string;
  officialSource: string;
  lastVerified: string;
  status: string;
  newApplicationsStatus?: string | null;
  benefitMr?: string | null;
  contributionBands?: Record<string, unknown> | null;
  applyAtMr?: string | null;
  applySteps?: Record<string, unknown> | null;
  checkStatusAt?: string | null;
  checkStatusAtMr?: string | null;
}
