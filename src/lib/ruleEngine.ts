import schemesData from '@/data/schemes.json';

// Deterministic rule engine. Every verdict comes from a structured profile field.
// A missing field, or a VERIFY rule, returns "unknown" — never a guessed pass.

export type Bilingual = { mr: string; en: string };
export type RuleStatus = 'pass' | 'fail' | 'unknown';

export type Rule = {
  id: string;
  field: string | null;
  op: string | null; // eq | in | gte | lte | lt | between
  value?: string | number | boolean | string[] | null;
  max?: number | null;
  verify?: boolean;
  reason_pass: Bilingual;
  reason_fail: Bilingual;
  check: Bilingual;
};

export type Scheme = {
  id: string;
  name: Bilingual;
  last_verified: string;
  status: string;
  benefit: Bilingual;
  amount: Bilingual;
  display_amount?: Bilingual;
  apply_at: Bilingual | null;
  notice?: Bilingual;
  rules: Rule[];
};

export type RuleResult = {
  status: RuleStatus;
  reasonMr: string;
  reasonEn: string;
  checkMr?: string;
  checkEn?: string;
};

export type RuleProfile = Record<string, unknown>;

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toDevanagari(text: string): string {
  return text.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

// Fills {days} / {short} placeholders. Only day counts are ever substituted.
function fill(template: string, vars: Record<string, string>, marathi: boolean): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key] ?? '';
    return marathi ? toDevanagari(value) : value;
  });
}

function unknownResult(rule: Rule): RuleResult {
  return {
    status: 'unknown',
    reasonMr: `तपासा — ${rule.check.mr}`,
    reasonEn: `Check — ${rule.check.en}`,
    checkMr: rule.check.mr,
    checkEn: rule.check.en,
  };
}

// Returns true/false for a comparison, or null when the value type does not fit the rule.
function compare(rule: Rule, raw: unknown): boolean | null {
  const expected = rule.value;
  switch (rule.op) {
    case 'eq':
      return typeof raw === typeof expected ? raw === expected : null;
    case 'in':
      return Array.isArray(expected) && typeof raw === 'string' ? expected.includes(raw) : null;
    case 'gte':
      return typeof raw === 'number' && typeof expected === 'number' ? raw >= expected : null;
    case 'lte':
      return typeof raw === 'number' && typeof expected === 'number' ? raw <= expected : null;
    case 'lt':
      return typeof raw === 'number' && typeof expected === 'number' ? raw < expected : null;
    case 'between':
      return typeof raw === 'number' && typeof expected === 'number' && typeof rule.max === 'number'
        ? raw >= expected && raw <= rule.max
        : null;
    default:
      return null;
  }
}

export function evaluateRule(rule: Rule, profile: RuleProfile | null | undefined): RuleResult {
  if (rule.verify || !rule.field || !rule.op || !profile) return unknownResult(rule);

  const raw = profile[rule.field];
  if (raw === undefined || raw === null) return unknownResult(rule);

  const ok = compare(rule, raw);
  if (ok === null) return unknownResult(rule);

  const vars: Record<string, string> = {};
  if (typeof raw === 'number') {
    vars.days = String(raw);
    if (rule.op === 'gte' && typeof rule.value === 'number') {
      vars.short = String(rule.value - raw);
    }
  }

  const template = ok ? rule.reason_pass : rule.reason_fail;
  return {
    status: ok ? 'pass' : 'fail',
    reasonMr: fill(template.mr, vars, true),
    reasonEn: fill(template.en, vars, false),
  };
}

// A scheme fails if any rule fails, is unknown if any rule is unknown, otherwise passes.
export function evaluateScheme(
  scheme: Scheme,
  profile: RuleProfile | null | undefined,
): { status: RuleStatus; results: RuleResult[] } {
  const results = scheme.rules.map((rule) => evaluateRule(rule, profile));
  const status: RuleStatus = results.some((r) => r.status === 'fail')
    ? 'fail'
    : results.some((r) => r.status === 'unknown')
      ? 'unknown'
      : 'pass';
  return { status, results };
}

export const SCHEMES = schemesData as Scheme[];

// Fallback profile when nothing is saved: Ramesh, AFTER state (96 days). Fictional sample.
export const RAMESH_AFTER_PROFILE: RuleProfile = {
  version: 1,
  source: 'sample',
  sampleId: 'ramesh',
  state: 'Maharashtra',
  workType: 'mason',
  occupation: 'construction',
  constructionDays: 96,
  age: 41,
  married: true,
  schoolChildren: true,
  bankAccount: true,
  epfoEsic: false,
  incomeTaxPayer: false,
};
