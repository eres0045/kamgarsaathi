// Auto-generated from the reviewed schema — canonical Persona shape.
// The API serializes these exact field names; UI components read them.
// Do not hand-edit — regenerate from the schema instead.

export interface Persona {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  age: number;
  gender: string;
  work: string;
  place: string;
  occupation: string;
  state: string;
  constructionDaysLast12Months: number;
  hasBankAccount: boolean;
  epfoEsic: boolean;
  incomeTaxPayer: boolean;
  monthlyIncome: number;
  married: boolean;
  schoolGoingChildren: number;
  bocwRegistered: boolean;
  storyText: string;
  isSample: boolean;
  familyIncomeYearly?: number | null;
  aadhaarLinkedBank?: boolean | null;
  govtEmployeeFamily?: boolean | null;
  nps?: boolean | null;
  area?: string | null;
  registrationActive?: boolean | null;
  marriageEvent?: string | null;
  willingUnskilledWork?: boolean | null;
}
