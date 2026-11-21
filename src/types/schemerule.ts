// Auto-generated from the reviewed schema — canonical SchemeRule shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface SchemeRule {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemeId: string;
  position: number;
  ruleKey: string;
  checkEn: string;
  checkMr: string;
  passIf: string;
  verifyFlag: boolean;
  reasonPassEn: string;
  reasonPassMr: string;
  reasonFailEn: string;
  reasonFailMr: string;
}
