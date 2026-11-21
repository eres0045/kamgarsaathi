// Auto-generated from the reviewed schema — canonical Profile shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Profile {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string | null;
  age: number;
  gender?: string | null;
  occupation: string;
  state: string;
  area?: string | null;
  constructionDaysLast12Months: number;
  hasBankAccount: boolean;
  aadhaarLinkedBank: boolean;
  epfoEsic: boolean;
  nps: boolean;
  incomeTaxPayer: boolean;
  govtEmployeeFamily: boolean;
  monthlyIncome?: number | null;
  familyIncomeYearly?: number | null;
  married: boolean;
  marriageEvent?: string | null;
  schoolChildrenCount: number;
  mahabocwRegistered: boolean;
  registrationActive: boolean;
  willingUnskilledWork: boolean;
  storyText?: string | null;
  source: string;
  sourcePersonaId?: string | null;
  isSample: boolean;
  isConfirmed: boolean;
  confirmedAt?: string | null;
  editedFields?: Record<string, unknown> | null;
  accessToken?: string | null;
}
