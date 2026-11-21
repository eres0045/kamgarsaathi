'use client';

// Auto-generated typed API client — the app's single fetch surface.
// Request bodies are typed against the database schema, so calling an
// endpoint with the wrong field names is a compile error. Do not hand-
// edit — regenerate from the API atlas + schema instead.

import { getToken } from '@/lib/authToken';

// Mock mode: the IDE preview boots before any database exists, so the
// single fetch surface answers locally instead of calling routes that
// would fail on a missing DATABASE_URL. Mirrors the demo session in
// @/lib/authContext so both auth surfaces agree.
// The `process.env.NEXT_PUBLIC_MOCK_MODE` form is deliberate: Next inlines
// that EXACT text at build time. `process.env?.X` or a computed key is not
// matched by the inliner, so it would compile to a lookup that is always
// undefined in the browser bundle — the same way a dynamic
// `process.env['NEXT_PUBLIC_' + name]` once left the preview inspector
// permanently inert. Do not add optional chaining here.
const __NEXEN_IS_MOCK__ =
  (typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true') ||
  (typeof process !== 'undefined' && process.env.MOCK_MODE === 'true') ||
  ((globalThis as unknown as { __NEXEN_MOCK__?: boolean }).__NEXEN_MOCK__ === true);

const __NEXEN_DEMO_USER__ = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'construction_or_gig_worker',
};

const __NEXEN_MOCK_ROWS__: Record<string, any[]> = {
  "personas": [
    {
      "id": "persona_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "name": "Sunita Pawar",
      "age": 34,
      "gender": "female",
      "work": "Mason helper (gavandi)",
      "place": "Pune",
      "occupation": "construction",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 210,
      "hasBankAccount": true,
      "epfoEsic": false,
      "incomeTaxPayer": false,
      "monthlyIncome": 14500.0,
      "married": true,
      "schoolGoingChildren": 2,
      "bocwRegistered": false,
      "storyText": "मी दोन मुलांची आई आहे. गेल्या वर्षी साइटवर वर्षभर काम केलं, पण बोकवूत नोंदणी नाही.",
      "isSample": true,
      "familyIncomeYearly": 3,
      "aadhaarLinkedBank": true,
      "govtEmployeeFamily": true,
      "nps": true,
      "area": "sample_area_1",
      "registrationActive": true,
      "marriageEvent": "sample_marriageevent_1",
      "willingUnskilledWork": true
    },
    {
      "id": "persona_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "name": "Raju Khandekar",
      "age": 27,
      "gender": "male",
      "work": "Zomato delivery partner",
      "place": "Nagpur",
      "occupation": "gig_delivery",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "epfoEsic": false,
      "incomeTaxPayer": false,
      "monthlyIncome": 18000.0,
      "married": false,
      "schoolGoingChildren": 0,
      "bocwRegistered": false,
      "storyText": "रोज बाईक चालवतो, पण अपघात झाला तर विमा आहे का हे मला माहीत नाही.",
      "isSample": true,
      "familyIncomeYearly": 10,
      "aadhaarLinkedBank": false,
      "govtEmployeeFamily": false,
      "nps": false,
      "area": "sample_area_2",
      "registrationActive": false,
      "marriageEvent": "sample_marriageevent_2",
      "willingUnskilledWork": false
    },
    {
      "id": "persona_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "name": "Meera Gaikwad",
      "age": 45,
      "gender": "female",
      "work": "Household help",
      "place": "Thane",
      "occupation": "domestic",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "epfoEsic": false,
      "incomeTaxPayer": false,
      "monthlyIncome": 9000.0,
      "married": true,
      "schoolGoingChildren": 1,
      "bocwRegistered": false,
      "storyText": "घरकाम करते, नवऱ्याची नोकरी गेली. मुलाच्या शाळेची फी आणि औषधांचा खर्च जास्त झाला आहे.",
      "isSample": true,
      "familyIncomeYearly": 17,
      "aadhaarLinkedBank": true,
      "govtEmployeeFamily": true,
      "nps": true,
      "area": "sample_area_3",
      "registrationActive": true,
      "marriageEvent": "sample_marriageevent_3",
      "willingUnskilledWork": true
    },
    {
      "id": "persona_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "name": "Bhimrao Jadhav",
      "age": 52,
      "gender": "male",
      "work": "Sugarcane cutter",
      "place": "Beed",
      "occupation": "agriculture",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 40,
      "hasBankAccount": false,
      "epfoEsic": false,
      "incomeTaxPayer": false,
      "monthlyIncome": 11000.0,
      "married": true,
      "schoolGoingChildren": 0,
      "bocwRegistered": false,
      "storyText": "हंगामात ऊस तोडतो, उरलेले महिने शेतमजुरी. बँकेत खाते उघडायचे आहे.",
      "isSample": true,
      "familyIncomeYearly": 24,
      "aadhaarLinkedBank": false,
      "govtEmployeeFamily": false,
      "nps": false,
      "area": "sample_area_4",
      "registrationActive": false,
      "marriageEvent": "sample_marriageevent_4",
      "willingUnskilledWork": false
    },
    {
      "id": "persona_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "name": "Asha Kamble",
      "age": 31,
      "gender": "female",
      "work": "Vegetable stall, Kalyan market",
      "place": "Kalyan",
      "occupation": "street_vending",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "epfoEsic": false,
      "incomeTaxPayer": false,
      "monthlyIncome": 12000.0,
      "married": false,
      "schoolGoingChildren": 0,
      "bocwRegistered": false,
      "storyText": "सकाळी पाच वाजता बाजारात जाते. उतारवयासाठी काही बचत करायची आहे.",
      "isSample": true,
      "familyIncomeYearly": 31,
      "aadhaarLinkedBank": true,
      "govtEmployeeFamily": true,
      "nps": true,
      "area": "sample_area_5",
      "registrationActive": true,
      "marriageEvent": "sample_marriageevent_5",
      "willingUnskilledWork": true
    }
  ],
  "profiles": [
    {
      "id": "profile_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "name": "Sunita Pawar",
      "age": 34,
      "gender": "female",
      "occupation": "construction",
      "state": "Maharashtra",
      "area": "urban",
      "constructionDaysLast12Months": 210,
      "hasBankAccount": true,
      "bankAccountNumber": "sample_bankaccountnumber_1",
      "aadhaarNumber": "sample_aadhaarnumber_1",
      "aadhaarLinkedBank": true,
      "epfoEsic": false,
      "nps": false,
      "incomeTaxPayer": false,
      "govtEmployeeFamily": false,
      "monthlyIncome": 14500.0,
      "familyIncomeYearly": 216000.0,
      "married": true,
      "marriageEvent": "first",
      "schoolChildrenCount": 2,
      "mahabocwRegistered": false,
      "registrationActive": false,
      "willingUnskilledWork": true,
      "storyText": "वर्षभर साइटवर काम केलं, पण बोकवूत नोंदणी नाही.",
      "source": "persona",
      "sourcePersonaId": "persona_001",
      "isSample": true,
      "isConfirmed": true,
      "confirmedAt": "2026-01-15T10:00:00Z",
      "editedFields": {},
      "accessToken": "sample_accesstoken_1"
    },
    {
      "id": "profile_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "name": "Raju Khandekar",
      "age": 27,
      "gender": "male",
      "occupation": "gig_delivery",
      "state": "Maharashtra",
      "area": "urban",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "bankAccountNumber": "sample_bankaccountnumber_2",
      "aadhaarNumber": "sample_aadhaarnumber_2",
      "aadhaarLinkedBank": true,
      "epfoEsic": false,
      "nps": false,
      "incomeTaxPayer": false,
      "govtEmployeeFamily": false,
      "monthlyIncome": 18000.0,
      "familyIncomeYearly": 216000.0,
      "married": false,
      "marriageEvent": "none",
      "schoolChildrenCount": 0,
      "mahabocwRegistered": false,
      "registrationActive": false,
      "willingUnskilledWork": true,
      "storyText": "रोज बाईक चालवतो, विमा आहे का माहीत नाही.",
      "source": "typed_story",
      "sourcePersonaId": "persona_002",
      "isSample": true,
      "isConfirmed": false,
      "confirmedAt": "2026-02-15T10:00:00Z",
      "editedFields": {},
      "accessToken": "sample_accesstoken_2"
    },
    {
      "id": "profile_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "name": "Meera Gaikwad",
      "age": 45,
      "gender": "female",
      "occupation": "domestic",
      "state": "Maharashtra",
      "area": "urban",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "bankAccountNumber": "sample_bankaccountnumber_3",
      "aadhaarNumber": "sample_aadhaarnumber_3",
      "aadhaarLinkedBank": false,
      "epfoEsic": false,
      "nps": false,
      "incomeTaxPayer": false,
      "govtEmployeeFamily": false,
      "monthlyIncome": 9000.0,
      "familyIncomeYearly": 108000.0,
      "married": true,
      "marriageEvent": "repeat",
      "schoolChildrenCount": 1,
      "mahabocwRegistered": false,
      "registrationActive": false,
      "willingUnskilledWork": false,
      "storyText": "घरकाम करते, नवऱ्याची नोकरी गेली.",
      "source": "csc_entry",
      "sourcePersonaId": "persona_003",
      "isSample": true,
      "isConfirmed": true,
      "confirmedAt": "2026-03-15T10:00:00Z",
      "editedFields": {},
      "accessToken": "sample_accesstoken_3"
    },
    {
      "id": "profile_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "name": "Bhimrao Jadhav",
      "age": 52,
      "gender": "male",
      "occupation": "agriculture",
      "state": "Maharashtra",
      "area": "rural",
      "constructionDaysLast12Months": 40,
      "hasBankAccount": false,
      "bankAccountNumber": "sample_bankaccountnumber_4",
      "aadhaarNumber": "sample_aadhaarnumber_4",
      "aadhaarLinkedBank": false,
      "epfoEsic": false,
      "nps": false,
      "incomeTaxPayer": false,
      "govtEmployeeFamily": false,
      "monthlyIncome": 11000.0,
      "familyIncomeYearly": 132000.0,
      "married": true,
      "marriageEvent": "first",
      "schoolChildrenCount": 0,
      "mahabocwRegistered": false,
      "registrationActive": false,
      "willingUnskilledWork": true,
      "storyText": "हंगामात ऊस तोडतो, बँकेत खाते उघडायचे आहे.",
      "source": "csc_entry",
      "sourcePersonaId": "persona_004",
      "isSample": true,
      "isConfirmed": false,
      "confirmedAt": "2026-04-15T10:00:00Z",
      "editedFields": {},
      "accessToken": "sample_accesstoken_4"
    },
    {
      "id": "profile_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "name": "Asha Kamble",
      "age": 31,
      "gender": "female",
      "occupation": "street_vending",
      "state": "Maharashtra",
      "area": "urban",
      "constructionDaysLast12Months": 0,
      "hasBankAccount": true,
      "bankAccountNumber": "sample_bankaccountnumber_5",
      "aadhaarNumber": "sample_aadhaarnumber_5",
      "aadhaarLinkedBank": true,
      "epfoEsic": false,
      "nps": false,
      "incomeTaxPayer": false,
      "govtEmployeeFamily": false,
      "monthlyIncome": 12000.0,
      "familyIncomeYearly": 144000.0,
      "married": false,
      "marriageEvent": "none",
      "schoolChildrenCount": 0,
      "mahabocwRegistered": false,
      "registrationActive": false,
      "willingUnskilledWork": false,
      "storyText": "सकाळी बाजारात जाते, बचत करायची आहे.",
      "source": "typed_story",
      "sourcePersonaId": "persona_005",
      "isSample": true,
      "isConfirmed": true,
      "confirmedAt": "2026-05-15T10:00:00Z",
      "editedFields": {},
      "accessToken": "sample_accesstoken_5"
    }
  ],
  "renewal_reminders": [
    {
      "id": "renewal_reminder_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "profileId": "profile_001",
      "registrationDate": "2026-01-15T10:00:00Z",
      "renewalDueDate": "2026-01-15T10:00:00Z"
    },
    {
      "id": "renewal_reminder_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "profileId": "profile_002",
      "registrationDate": "2026-02-15T10:00:00Z",
      "renewalDueDate": "2026-02-15T10:00:00Z"
    },
    {
      "id": "renewal_reminder_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "profileId": "profile_003",
      "registrationDate": "2026-03-15T10:00:00Z",
      "renewalDueDate": "2026-03-15T10:00:00Z"
    }
  ],
  "schemes": [
    {
      "id": "scheme_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "code": "ESHRAM",
      "nameEn": "e-Shram Registration",
      "nameMr": "ई-श्रम नोंदणी",
      "benefitEn": "National ID for unorganised workers and access to central schemes",
      "benefitAmount": "sample_benefitamount_1",
      "amountStatus": "none",
      "stackPosition": 1,
      "stackGroup": "e_shram",
      "stackReasonEn": "Gateway registration for most central worker schemes",
      "stackReasonMr": "बहुतांश केंद्रीय कामगार योजनांसाठी प्रवेशद्वार नोंदणी",
      "applyAt": "eshram.gov.in",
      "officialSource": "eshram.gov.in",
      "lastVerified": "2025-10-15T00:00:00Z",
      "status": "verified",
      "newApplicationsStatus": "open",
      "benefitMr": "sample_benefitmr_1",
      "contributionBands": {},
      "applyAtMr": "eshram.gov.in",
      "applySteps": {},
      "checkStatusAt": "eshram.gov.in",
      "checkStatusAtMr": "sample_checkstatusatmr_1"
    },
    {
      "id": "scheme_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "code": "PMSYM",
      "nameEn": "PM Shram Yogi Maandhan",
      "nameMr": "पंतप्रधान श्रम योगी मानधन योजना",
      "benefitEn": "Monthly pension after age 60 with government co-contribution",
      "benefitAmount": "sample_benefitamount_2",
      "amountStatus": "verify",
      "stackPosition": 2,
      "stackGroup": "insurance_pension",
      "stackReasonEn": "Pension scheme; can run alongside BOCW benefits",
      "stackReasonMr": "निवृत्तीवेतन योजना; बोकवू लाभांसोबत घेता येते",
      "applyAt": "maandhan.in",
      "officialSource": "maandhan.in",
      "lastVerified": "2025-09-30T00:00:00Z",
      "status": "partially_verified",
      "newApplicationsStatus": "open",
      "benefitMr": "sample_benefitmr_2",
      "contributionBands": {},
      "applyAtMr": "sample_applyatmr_2",
      "applySteps": {},
      "checkStatusAt": "2026-02-15T10:00:00Z",
      "checkStatusAtMr": "sample_checkstatusatmr_2"
    },
    {
      "id": "scheme_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "code": "PMJJBY",
      "nameEn": "PM Jeevan Jyoti Bima Yojana",
      "nameMr": "पंतप्रधान जीवन ज्योती विमा योजना",
      "benefitEn": "Life insurance cover for death from any cause",
      "benefitAmount": "sample_benefitamount_3",
      "amountStatus": "verify",
      "stackPosition": 3,
      "stackGroup": "insurance_pension",
      "stackReasonEn": "Life cover, combinable with accident cover",
      "stackReasonMr": "जीवन विमा, अपघात विम्यासोबत घेता येतो",
      "applyAt": "Bank branch or net banking",
      "officialSource": "jansuraksha.gov.in",
      "lastVerified": "2025-09-30T00:00:00Z",
      "status": "verified",
      "newApplicationsStatus": "open",
      "benefitMr": "sample_benefitmr_3",
      "contributionBands": {},
      "applyAtMr": "बँक शाखा किंवा नेट बँकिंग",
      "applySteps": {},
      "checkStatusAt": "2026-03-15T10:00:00Z",
      "checkStatusAtMr": "sample_checkstatusatmr_3"
    },
    {
      "id": "scheme_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "code": "PMSBY",
      "nameEn": "PM Suraksha Bima Yojana",
      "nameMr": "पंतप्रधान सुरक्षा विमा योजना",
      "benefitEn": "Accident insurance cover at a low annual premium",
      "benefitAmount": "sample_benefitamount_4",
      "amountStatus": "verify",
      "stackPosition": 4,
      "stackGroup": "insurance_pension",
      "stackReasonEn": "Accident cover, combinable with life cover",
      "stackReasonMr": "अपघात विमा, जीवन विम्यासोबत घेता येतो",
      "applyAt": "Bank branch or net banking",
      "officialSource": "jansuraksha.gov.in",
      "lastVerified": "2025-09-30T00:00:00Z",
      "status": "verified",
      "newApplicationsStatus": "open",
      "benefitMr": "sample_benefitmr_4",
      "contributionBands": {},
      "applyAtMr": "बँक शाखा किंवा नेट बँकिंग",
      "applySteps": {},
      "checkStatusAt": "2026-04-15T10:00:00Z",
      "checkStatusAtMr": "sample_checkstatusatmr_4"
    },
    {
      "id": "scheme_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "code": "BOCWREG",
      "nameEn": "BOCW Worker Registration (MAHABOCW)",
      "nameMr": "बांधकाम कामगार नोंदणी (महाबोकवू)",
      "benefitEn": "Gateway to all Maharashtra construction worker welfare benefits",
      "benefitAmount": "sample_benefitamount_5",
      "amountStatus": "none",
      "stackPosition": 1,
      "stackGroup": "bocw_gate",
      "stackReasonEn": "Must be registered before claiming any BOCW benefit",
      "stackReasonMr": "कोणताही बोकवू लाभ मिळवण्यापूर्वी नोंदणी आवश्यक",
      "applyAt": "mahabocw.in",
      "officialSource": "mahabocw.in",
      "lastVerified": "2025-10-01T00:00:00Z",
      "status": "verified",
      "newApplicationsStatus": "open",
      "benefitMr": "sample_benefitmr_5",
      "contributionBands": {},
      "applyAtMr": "mahabocw.in",
      "applySteps": {},
      "checkStatusAt": "2026-05-15T10:00:00Z",
      "checkStatusAtMr": "sample_checkstatusatmr_5"
    },
    {
      "id": "scheme_006",
      "createdAt": "2026-06-15T10:00:00Z",
      "updatedAt": "2026-06-15T10:00:00Z",
      "code": "BOCWBEN",
      "nameEn": "BOCW Welfare Benefits",
      "nameMr": "बांधकाम कामगार कल्याण लाभ",
      "benefitEn": "Education, health, and maternity aid for registered construction workers",
      "benefitAmount": "sample_benefitamount_6",
      "amountStatus": "verify",
      "stackPosition": 2,
      "stackGroup": "bocw_benefit",
      "stackReasonEn": "Available after active registration with 90+ construction days",
      "stackReasonMr": "सक्रिय नोंदणी आणि ९०+ बांधकाम दिवसांनंतर उपलब्ध",
      "applyAt": "Nearest BOCW facilitation centre",
      "officialSource": "mahabocw.in",
      "lastVerified": "2025-10-01T00:00:00Z",
      "status": "partially_verified",
      "newApplicationsStatus": "verify",
      "benefitMr": "sample_benefitmr_6",
      "contributionBands": {},
      "applyAtMr": "sample_applyatmr_6",
      "applySteps": {},
      "checkStatusAt": "2026-06-15T10:00:00Z",
      "checkStatusAtMr": "sample_checkstatusatmr_6"
    }
  ],
  "scheme_rules": [
    {
      "id": "scheme_rule_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "schemeId": "scheme_001",
      "position": 1,
      "ruleKey": "construction_days_90",
      "checkEn": "Worked at least 90 days in construction in the last 12 months",
      "checkMr": "गेल्या १२ महिन्यांत बांधकामावर किमान ९० दिवस काम",
      "passIf": "constructionDaysLast12Months >= 90",
      "verifyFlag": false,
      "reasonPassEn": "You have enough construction days to qualify for BOCW benefits",
      "reasonPassMr": "बोकवू लाभांसाठी तुमचे बांधकाम दिवस पुरेसे आहेत",
      "reasonFailEn": "You need 90 construction days in the last 12 months",
      "reasonFailMr": "गेल्या १२ महिन्यांत ९० बांधकाम दिवस आवश्यक आहेत"
    },
    {
      "id": "scheme_rule_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "schemeId": "scheme_002",
      "position": 2,
      "ruleKey": "not_income_tax_payer",
      "checkEn": "Not an income tax payer",
      "checkMr": "आयकर भरणारे नाही",
      "passIf": "incomeTaxPayer == false",
      "verifyFlag": false,
      "reasonPassEn": "Income tax status does not block you",
      "reasonPassMr": "आयकर स्थिती तुम्हाला अडवत नाही",
      "reasonFailEn": "Income tax payers are excluded from this scheme",
      "reasonFailMr": "आयकर भरणाऱ्यांना ही योजना लागू नाही"
    },
    {
      "id": "scheme_rule_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "schemeId": "scheme_003",
      "position": 3,
      "ruleKey": "no_epfo_esic",
      "checkEn": "Not covered by EPFO or ESIC",
      "checkMr": "EPFO किंवा ESIC मध्ये नाव नाही",
      "passIf": "epfoEsic == false",
      "verifyFlag": true,
      "reasonPassEn": "You are not in EPFO or ESIC, so you can apply for PM-SYM",
      "reasonPassMr": "तुम्ही EPFO किंवा ESIC मध्ये नाही, त्यामुळे PM-SYM साठी अर्ज करू शकता",
      "reasonFailEn": "EPFO or ESIC members are excluded from PM-SYM",
      "reasonFailMr": "EPFO किंवा ESIC सदस्यांना PM-SYM लागू नाही"
    },
    {
      "id": "scheme_rule_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "schemeId": "scheme_004",
      "position": 4,
      "ruleKey": "bank_account_present",
      "checkEn": "Has a bank account",
      "checkMr": "बँक खाते आहे",
      "passIf": "hasBankAccount == true",
      "verifyFlag": false,
      "reasonPassEn": "Your bank account can receive benefits directly",
      "reasonPassMr": "तुमच्या बँक खात्यात थेट लाभ जमा होऊ शकतो",
      "reasonFailEn": "Open a bank account first so benefits can be paid",
      "reasonFailMr": "लाभ मिळण्यासाठी आधी बँक खाते उघडा"
    },
    {
      "id": "scheme_rule_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "schemeId": "scheme_005",
      "position": 5,
      "ruleKey": "aadhaar_linked_bank",
      "checkEn": "Aadhaar is linked to your bank account",
      "checkMr": "आधार बँक खात्याशी जोडलेला आहे",
      "passIf": "aadhaarLinkedBank == true",
      "verifyFlag": true,
      "reasonPassEn": "Aadhaar linking lets DBT payments reach you",
      "reasonPassMr": "आधार जोडल्यामुळे DBT रक्कम थेट मिळेल",
      "reasonFailEn": "Link Aadhaar to your bank so DBT payments can reach you",
      "reasonFailMr": "DBT रक्कम मिळण्यासाठी आधार बँकेशी जोडा"
    }
  ],
  "documents": [
    {
      "id": "document_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "nameEn": "Aadhaar card",
      "nameMr": "आधार कार्ड",
      "whereToGet": "UIDAI enrolment centre or uidai.gov.in",
      "costRupees": 0,
      "costStatus": "verified",
      "daysToObtain": 30,
      "daysStatus": "verify",
      "appealOfficer": "sample_appealofficer_1",
      "isGateDocument": true,
      "isShowOnly": false,
      "position": 1,
      "whereToGetMr": "UIDAI नोंदणी केंद्र किंवा uidai.gov.in",
      "appealOfficerMr": "sample_appealofficermr_1",
      "documentType": "identity",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_001"
    },
    {
      "id": "document_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "nameEn": "Bank passbook or cancelled cheque",
      "nameMr": "बँक पासबुक किंवा रद्द धनादेश",
      "whereToGet": "Your bank branch",
      "costRupees": 0,
      "costStatus": "verify",
      "daysToObtain": 3,
      "daysStatus": "verify",
      "appealOfficer": "sample_appealofficer_2",
      "isGateDocument": true,
      "isShowOnly": false,
      "position": 2,
      "whereToGetMr": "तुमची बँक शाखा",
      "appealOfficerMr": "sample_appealofficermr_2",
      "documentType": "bank",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_002"
    },
    {
      "id": "document_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "nameEn": "90-day construction work certificate",
      "nameMr": "९० दिवस बांधकाम कामाचे प्रमाणपत्र",
      "whereToGet": "Contractor or site engineer, signed and stamped",
      "costRupees": 0,
      "costStatus": "verify",
      "daysToObtain": 7,
      "daysStatus": "verify",
      "appealOfficer": "Labour Officer, District Labour Office",
      "isGateDocument": true,
      "isShowOnly": false,
      "position": 3,
      "whereToGetMr": "ठेकेदार किंवा साइट इंजिनिअर, सही आणि शिक्क्यासह",
      "appealOfficerMr": "कामगार अधिकारी, जिल्हा कामगार कार्यालय",
      "documentType": "work_proof",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_003"
    },
    {
      "id": "document_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "nameEn": "Passport-size photo",
      "nameMr": "पासपोर्ट साइज फोटो",
      "whereToGet": "Any photo studio",
      "costRupees": 50,
      "costStatus": "verify",
      "daysToObtain": 0,
      "daysStatus": "verified",
      "appealOfficer": "sample_appealofficer_4",
      "isGateDocument": false,
      "isShowOnly": false,
      "position": 4,
      "whereToGetMr": "कोणताही फोटो स्टुडिओ",
      "appealOfficerMr": "sample_appealofficermr_4",
      "documentType": "photo",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_004"
    },
    {
      "id": "document_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "nameEn": "Ration card (show only)",
      "nameMr": "रेशन कार्ड (फक्त दाखवण्यासाठी)",
      "whereToGet": "Taluka supply office",
      "costRupees": 0,
      "costStatus": "verified",
      "daysToObtain": 60,
      "daysStatus": "verify",
      "appealOfficer": "sample_appealofficer_5",
      "isGateDocument": false,
      "isShowOnly": true,
      "position": 5,
      "whereToGetMr": "तालुका पुरवठा कार्यालय",
      "appealOfficerMr": "sample_appealofficermr_5",
      "documentType": "address",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_005"
    },
    {
      "id": "document_006",
      "createdAt": "2026-06-15T10:00:00Z",
      "updatedAt": "2026-06-15T10:00:00Z",
      "nameEn": "Child's school leaving or birth certificate",
      "nameMr": "मुलाचा शाळा सोडल्याचा किंवा जन्म दाखला",
      "whereToGet": "School office or gram panchayat / municipal office",
      "costRupees": 20,
      "costStatus": "verify",
      "daysToObtain": 10,
      "daysStatus": "verify",
      "appealOfficer": "sample_appealofficer_6",
      "isGateDocument": false,
      "isShowOnly": false,
      "position": 6,
      "whereToGetMr": "शाळा कार्यालय किंवा ग्रामपंचायत / नगरपालिका कार्यालय",
      "appealOfficerMr": "sample_appealofficermr_6",
      "documentType": "family",
      "cropRegion": {},
      "isSample": true,
      "workerId": "worker_001"
    }
  ],
  "document_ticks": [
    {
      "id": "document_tick_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "profileId": "profile_001",
      "documentId": "document_001",
      "isTicked": true,
      "tickedAt": "2025-11-02T09:15:00Z"
    },
    {
      "id": "document_tick_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "profileId": "profile_002",
      "documentId": "document_002",
      "isTicked": true,
      "tickedAt": "2025-11-02T09:17:00Z"
    },
    {
      "id": "document_tick_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "profileId": "profile_003",
      "documentId": "document_003",
      "isTicked": false,
      "tickedAt": "2026-03-15T10:00:00Z"
    },
    {
      "id": "document_tick_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "profileId": "profile_004",
      "documentId": "document_004",
      "isTicked": false,
      "tickedAt": "2026-04-15T10:00:00Z"
    },
    {
      "id": "document_tick_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "profileId": "profile_005",
      "documentId": "document_005",
      "isTicked": true,
      "tickedAt": "2025-11-05T14:40:00Z"
    }
  ],
  "certificates": [
    {
      "id": "certificate_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "profileId": "profile_001",
      "workerId": "worker_001",
      "photoUrl": "https://picsum.photos/seed/workcert/800/600",
      "isSample": true,
      "extractionStatus": "confirmed",
      "confirmedAt": "2025-11-03T10:22:00Z",
      "confirmedDays": 96,
      "confirmedBy": "Sunita Pawar",
      "label": "Site work certificate",
      "issuer": "sample_issuer_1",
      "issuerName": "Shree Constructions, Hinjewadi",
      "issuerConfirmed": true,
      "issuedDate": "2026-01-15T10:00:00Z",
      "issueDate": "2026-01-15T10:00:00Z",
      "issuedOn": "2026-01-15T10:00:00Z",
      "periodStart": "2026-01-15T10:00:00Z",
      "periodEnd": "2026-01-15T10:00:00Z",
      "periodStartDate": "2025-01-01T00:00:00Z",
      "periodEndDate": "2025-04-06T00:00:00Z",
      "datesConfirmed": true,
      "source": "photo_upload"
    },
    {
      "id": "certificate_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "profileId": "profile_002",
      "workerId": "worker_002",
      "photoUrl": "https://picsum.photos/seed/sitecert/800/600",
      "isSample": true,
      "extractionStatus": "extracted",
      "confirmedAt": "2026-02-15T10:00:00Z",
      "confirmedDays": 10,
      "confirmedBy": "sample_confirmedby_2",
      "label": "Contractor work letter",
      "issuer": "sample_issuer_2",
      "issuerName": "Patil & Sons Builders",
      "issuerConfirmed": false,
      "issuedDate": "2026-02-15T10:00:00Z",
      "issueDate": "2026-02-15T10:00:00Z",
      "issuedOn": "2026-02-15T10:00:00Z",
      "periodStart": "2026-02-15T10:00:00Z",
      "periodEnd": "2026-02-15T10:00:00Z",
      "periodStartDate": "2024-11-10T00:00:00Z",
      "periodEndDate": "2025-02-28T00:00:00Z",
      "datesConfirmed": false,
      "source": "photo_upload"
    },
    {
      "id": "certificate_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "profileId": "profile_003",
      "workerId": "worker_003",
      "photoUrl": "https://picsum.photos/seed/mahacert/800/600",
      "isSample": true,
      "extractionStatus": "pending",
      "confirmedAt": "2026-03-15T10:00:00Z",
      "confirmedDays": 17,
      "confirmedBy": "sample_confirmedby_3",
      "label": "Employer letter",
      "issuer": "sample_issuer_3",
      "issuerName": "sample_issuername_3",
      "issuerConfirmed": false,
      "issuedDate": "2026-03-15T10:00:00Z",
      "issueDate": "2026-03-15T10:00:00Z",
      "issuedOn": "2026-03-15T10:00:00Z",
      "periodStart": "2026-03-15T10:00:00Z",
      "periodEnd": "2026-03-15T10:00:00Z",
      "periodStartDate": "2026-03-15T10:00:00Z",
      "periodEndDate": "2026-03-15T10:00:00Z",
      "datesConfirmed": false,
      "source": "photo_upload"
    },
    {
      "id": "certificate_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "profileId": "profile_004",
      "workerId": "worker_004",
      "photoUrl": "https://picsum.photos/seed/blurdoc/800/600",
      "isSample": true,
      "extractionStatus": "failed",
      "confirmedAt": "2026-04-15T10:00:00Z",
      "confirmedDays": 24,
      "confirmedBy": "sample_confirmedby_4",
      "label": "Handwritten work record",
      "issuer": "sample_issuer_4",
      "issuerName": "sample_issuername_4",
      "issuerConfirmed": false,
      "issuedDate": "2026-04-15T10:00:00Z",
      "issueDate": "2026-04-15T10:00:00Z",
      "issuedOn": "2026-04-15T10:00:00Z",
      "periodStart": "2026-04-15T10:00:00Z",
      "periodEnd": "2026-04-15T10:00:00Z",
      "periodStartDate": "2026-04-15T10:00:00Z",
      "periodEndDate": "2026-04-15T10:00:00Z",
      "datesConfirmed": false,
      "source": "camera_capture"
    },
    {
      "id": "certificate_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "profileId": "profile_005",
      "workerId": "worker_005",
      "photoUrl": "https://picsum.photos/seed/ngoslip/800/600",
      "isSample": true,
      "extractionStatus": "confirmed",
      "confirmedAt": "2025-10-28T16:05:00Z",
      "confirmedDays": 45,
      "confirmedBy": "Bhimrao Jadhav",
      "label": "Sugarcane harvest slip",
      "issuer": "sample_issuer_5",
      "issuerName": "Ambajogai Sugar Co-op",
      "issuerConfirmed": true,
      "issuedDate": "2026-05-15T10:00:00Z",
      "issueDate": "2026-05-15T10:00:00Z",
      "issuedOn": "2026-05-15T10:00:00Z",
      "periodStart": "2026-05-15T10:00:00Z",
      "periodEnd": "2026-05-15T10:00:00Z",
      "periodStartDate": "2024-10-15T00:00:00Z",
      "periodEndDate": "2025-01-15T00:00:00Z",
      "datesConfirmed": true,
      "source": "csc_entry"
    }
  ],
  "certificate_extractions": [
    {
      "id": "certificate_extraction_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "certificateId": "certificate_001",
      "fieldKey": "days_worked",
      "extractedValue": "96",
      "cropImageUrl": "https://picsum.photos/seed/cropdays/800/600",
      "isConfirmed": true,
      "confirmedAt": "2025-11-03T10:21:00Z"
    },
    {
      "id": "certificate_extraction_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "certificateId": "certificate_002",
      "fieldKey": "period_start",
      "extractedValue": "01/01/2025",
      "cropImageUrl": "https://picsum.photos/seed/cropstart/800/600",
      "isConfirmed": true,
      "confirmedAt": "2025-11-03T10:21:30Z"
    },
    {
      "id": "certificate_extraction_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "certificateId": "certificate_003",
      "fieldKey": "period_end",
      "extractedValue": "06/04/2025",
      "cropImageUrl": "https://picsum.photos/seed/cropend/800/600",
      "isConfirmed": true,
      "confirmedAt": "2025-11-03T10:22:00Z"
    },
    {
      "id": "certificate_extraction_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "certificateId": "certificate_004",
      "fieldKey": "issuer_name",
      "extractedValue": "Patil & Sons Builders",
      "cropImageUrl": "https://picsum.photos/seed/cropissuer/800/600",
      "isConfirmed": false,
      "confirmedAt": "2026-04-15T10:00:00Z"
    },
    {
      "id": "certificate_extraction_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "certificateId": "certificate_005",
      "fieldKey": "days_worked",
      "extractedValue": "11O",
      "cropImageUrl": "https://picsum.photos/seed/cropblur/800/600",
      "isConfirmed": false,
      "confirmedAt": "2026-05-15T10:00:00Z"
    }
  ],
  "workers": [
    {
      "id": "worker_001",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z",
      "name": "Sunita Pawar",
      "age": 34,
      "occupation": "construction",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 210,
      "employmentStatus": "employed",
      "aadhaarShown": true,
      "isSample": true
    },
    {
      "id": "worker_002",
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z",
      "name": "Ganesh Shinde",
      "age": 29,
      "occupation": "construction",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 120,
      "employmentStatus": "employed",
      "aadhaarShown": true,
      "isSample": true
    },
    {
      "id": "worker_003",
      "createdAt": "2026-03-15T10:00:00Z",
      "updatedAt": "2026-03-15T10:00:00Z",
      "name": "Prakash Warade",
      "age": 41,
      "occupation": "construction",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 35,
      "employmentStatus": "left",
      "aadhaarShown": false,
      "isSample": true
    },
    {
      "id": "worker_004",
      "createdAt": "2026-04-15T10:00:00Z",
      "updatedAt": "2026-04-15T10:00:00Z",
      "name": "Sushila Bhosale",
      "age": 38,
      "occupation": "domestic",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 0,
      "employmentStatus": "employed",
      "aadhaarShown": true,
      "isSample": true
    },
    {
      "id": "worker_005",
      "createdAt": "2026-05-15T10:00:00Z",
      "updatedAt": "2026-05-15T10:00:00Z",
      "name": "Imran Sheikh",
      "age": 24,
      "occupation": "gig_delivery",
      "state": "Maharashtra",
      "constructionDaysLast12Months": 0,
      "employmentStatus": "employed",
      "aadhaarShown": false,
      "isSample": true
    }
  ]
};
__NEXEN_MOCK_ROWS__["renewal-reminders"] = __NEXEN_MOCK_ROWS__["renewal_reminders"];
__NEXEN_MOCK_ROWS__["renewalReminders"] = __NEXEN_MOCK_ROWS__["renewal_reminders"];
__NEXEN_MOCK_ROWS__["schemeRules"] = __NEXEN_MOCK_ROWS__["scheme_rules"];
__NEXEN_MOCK_ROWS__["scheme-rules"] = __NEXEN_MOCK_ROWS__["scheme_rules"];
__NEXEN_MOCK_ROWS__["document-ticks"] = __NEXEN_MOCK_ROWS__["document_ticks"];
__NEXEN_MOCK_ROWS__["documentTicks"] = __NEXEN_MOCK_ROWS__["document_ticks"];
__NEXEN_MOCK_ROWS__["certificateExtractions"] = __NEXEN_MOCK_ROWS__["certificate_extractions"];
__NEXEN_MOCK_ROWS__["certificate-extractions"] = __NEXEN_MOCK_ROWS__["certificate_extractions"];

// ── Sample-data changes: kept for this browser tab ──────────────────────────
const __NEXEN_SAMPLE_KEY__ = 'nexen.sample.8dc7da144cd0';
let __sampleLoaded = false;
const __sampleCreated = new Set<string>();
const __sampleAnswered = new WeakMap<object, any>();
function __sampleTables(): string[] {
  const keys = Object.keys(__NEXEN_MOCK_ROWS__);
  return keys.filter((k, i) => keys.findIndex((j) => __NEXEN_MOCK_ROWS__[j] === __NEXEN_MOCK_ROWS__[k]) === i);
}
function __sampleLoad(): void {
  if (__sampleLoaded) return;
  __sampleLoaded = true;
  try {
    const saved = JSON.parse(globalThis.sessionStorage?.getItem(__NEXEN_SAMPLE_KEY__) ?? 'null');
    if (!saved || typeof saved !== 'object') return;
    for (const t of __sampleTables()) {
      const kept = saved.rows?.[t];
      if (Array.isArray(kept)) __NEXEN_MOCK_ROWS__[t].splice(0, __NEXEN_MOCK_ROWS__[t].length, ...kept);
    }
    for (const id of Array.isArray(saved.created) ? saved.created : []) __sampleCreated.add(String(id));
  } catch { /* blocked or unreadable storage: the sample rows as shipped */ }
}
function __sampleSave(): void {
  try {
    const rows: Record<string, any[]> = {};
    for (const t of __sampleTables()) rows[t] = __NEXEN_MOCK_ROWS__[t];
    globalThis.sessionStorage?.setItem(__NEXEN_SAMPLE_KEY__, JSON.stringify({ rows, created: Array.from(__sampleCreated) }));
  } catch { /* full or blocked: kept until the page reloads */ }
  // The IDE preview says, once, that this went to sample data only.
  try {
    if (typeof window !== 'undefined' && window.parent !== window) window.parent.postMessage({ type: 'nexen:sample-write' }, '*');
  } catch { /* no preview around this page */ }
}
function __sampleFind(all: any[], id: string): number {
  return all.findIndex((r) => String(r.id) === String(id) || String(r.slug) === String(id));
}
/** A field the person did not fill, as a new row of theirs would hold it. Links and
 *  status-like values keep a sample row's (pages read them); its text, dates and counts do
 *  not: a new habit showed "Sample description for record 1" and its reminder. */
function __sampleBlank(k: string, v: any): any {
  if (/(Id|_id)$/.test(k) || /status|state|role|type|kind|priority|category|level|currency|unit|visibility/i.test(k)) return v;
  if (Array.isArray(v)) return [];
  if (v && typeof v === 'object') return v;
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  return null;
}
/** A new row: a sample row's fields (what pages read), the person's values in them. */
function __sampleInsert(table: string, body: any, links?: Record<string, string>): any {
  if (body && typeof body === 'object' && __sampleAnswered.has(body)) return __sampleAnswered.get(body);
  __sampleLoad();
  const all = __NEXEN_MOCK_ROWS__[table] ?? (__NEXEN_MOCK_ROWS__[table] = []);
  const like: any = all[0] ?? {};
  const now = new Date().toISOString();
  const row: any = {};
  for (const [k, v] of Object.entries(like)) row[k] = __sampleBlank(k, v);
  Object.assign(row, body && typeof body === 'object' ? body : {}, links ?? {});
  row.id = typeof like.id === 'number'
    ? all.reduce((m: number, r: any) => Math.max(m, Number(r.id) || 0), 0) + 1
    : (globalThis.crypto?.randomUUID?.() ?? `sample-${Date.now().toString(36)}`);
  if ('slug' in like && !(body && body.slug)) row.slug = String(row.id);
  for (const k of ['createdAt', 'updatedAt', 'created_at', 'updated_at']) if (k in like) row[k] = now;
  all.unshift(row);
  __sampleCreated.add(String(row.id));
  if (body && typeof body === 'object') __sampleAnswered.set(body, row);
  __sampleSave();
  return row;
}
function __sampleUpdate(table: string, id: string, body: any): any {
  __sampleLoad();
  const all = __NEXEN_MOCK_ROWS__[table] ?? [];
  const changes: any = { ...(body && typeof body === 'object' ? body : {}) };
  delete changes.id;
  const i = __sampleFind(all, id);
  if (i < 0) return { ...__mockRow(table, id), ...changes };
  Object.assign(all[i], changes);
  for (const k of ['updatedAt', 'updated_at']) if (k in all[i]) all[i][k] = new Date().toISOString();
  __sampleSave();
  return all[i];
}
function __sampleDelete(table: string, id: string): undefined {
  __sampleLoad();
  const all = __NEXEN_MOCK_ROWS__[table] ?? [];
  const i = __sampleFind(all, id);
  if (i >= 0) {
    all.splice(i, 1);
    __sampleSave();
  }
  return undefined;
}
/** A write no designed endpoint answers, applied to the table its path names. */
function __sampleWrite(method: string, path: string, body: any): any {
  const segs = path.split('/').filter(Boolean);
  for (let i = segs.length - 1; i >= 0; i -= 1) {
    if (!__NEXEN_MOCK_ROWS__[segs[i]]) continue;
    if (i === segs.length - 1 && method === 'POST') return __sampleInsert(segs[i], body);
    if (i === segs.length - 2 && (method === 'PATCH' || method === 'PUT')) return __sampleUpdate(segs[i], decodeURIComponent(segs[i + 1]), body);
    if (i === segs.length - 2 && method === 'DELETE') return __sampleDelete(segs[i], decodeURIComponent(segs[i + 1]));
    return undefined;
  }
  return undefined;
}

function __mockRows(table: string, where?: Record<string, string>): any[] {
  __sampleLoad();
  const all = __NEXEN_MOCK_ROWS__[table] ?? [];
  if (!where || !Object.keys(where).length) return all;
  const hit = all.filter((r) => Object.entries(where).every(([k, v]) => String(r[k]) === String(v)));
  // A parent added in this tab has no children yet: none, not every sample row.
  return hit.length || Object.values(where).some((v) => __sampleCreated.has(String(v))) ? hit : all;
}

function __mockRow(table: string, id?: string): any {
  __sampleLoad();
  const all = __NEXEN_MOCK_ROWS__[table] ?? [];
  return (id !== undefined && all.find((r) => String(r.id) === String(id) || String(r.slug) === String(id))) || all[0] || {};
}

/** One answer per designed endpoint, in the shape the API Layer declares for it. */
const __NEXEN_MOCK_ROUTES__: Array<[string, RegExp, (p: string[], body: any) => any]> = [
  ["POST", /^\/api\/profiles\/suggestions$/, (p, body) => ({ "suggested": __mockRow("profiles"), "unparsed_chips": ["sample_unparsed_chips_1"] })],
  ["GET", /^\/api\/scheme-rules$/, (p, body) => __mockRows("scheme_rules")],
  ["GET", /^\/api\/documents$/, (p, body) => __mockRows("documents")],
  ["POST", /^\/api\/profiles$/, (p, body) => ({ "profile": __sampleInsert("profiles", body), "access_token": "nexen-mock-token" })],
  ["GET", /^\/api\/personas$/, (p, body) => __mockRows("personas")],
  ["GET", /^\/api\/schemes$/, (p, body) => __mockRows("schemes")],
  ["GET", /^\/api\/profiles\/([^\/]+)\/renewal-countdown$/, (p, body) => ({ "days_to_renewal": 3, "renewal_due_date": "2026-01-15T10:00:00Z", "first_deadline": "sample_first_deadline_1" })],
  ["PUT", /^\/api\/profiles\/([^\/]+)\/renewal-reminder$/, (p, body) => ({ ...__mockRow("renewal_reminders"), ...body })],
  ["GET", /^\/api\/profiles\/([^\/]+)\/application-pack$/, (p, body) => ({ "profile": __mockRow("profiles", p[0]), "verdicts": [], "documents": [], "steps": ["sample_steps_1"], "check_status_at": "2026-01-15T10:00:00Z" })],
  ["GET", /^\/api\/certificates\/([^\/]+)\/gate-verdict$/, (p, body) => ({ "certificate_id": "certificate__001", "state": "pass", "days_shown": 3, "days_short": 3, "reason_en": "sample_reason_en_1", "reason_mr": "sample_reason_mr_1" })],
  ["GET", /^\/api\/profiles\/([^\/]+)\/document-quest$/, (p, body) => ({ "profile_id": "profile__001", "documents": __mockRows("documents").map((r: any) => ({ ...r, ...(({ "is_ticked": true, "ticked_at": "2026-01-15T10:00:00Z" })) })), "ticked_count": 3, "total": __mockRows("documents").map((r: any) => ({ ...r, ...(({ "is_ticked": true, "ticked_at": "2026-01-15T10:00:00Z" })) })).length, "pack_ready": true })],
  ["GET", /^\/api\/profiles\/([^\/]+)\/scheme-stack$/, (p, body) => ({ "schemes": [({ "slug": "sample_slug_1", "name_en": "sample_name_en_1", "name_mr": "sample_name_mr_1", "claim_order": 3, "why_in_order_en": "sample_why_in_order_en_1", "verdict": null })], "unlocked_inr_verified": 3, "scholarship_eligible": true })],
  ["GET", /^\/api\/profiles\/([^\/]+)\/certificates$/, (p, body) => __mockRows("certificates", { profileId: p[0] })],
  ["POST", /^\/api\/profiles\/([^\/]+)\/certificates$/, (p, body) => __sampleInsert("certificates", body, { profileId: p[0] })],
  ["GET", /^\/api\/profiles\/([^\/]+)\/verdicts$/, (p, body) => [({ "scheme": ({ "id": "id_001", "slug": "sample_slug_1", "name_en": "sample_name_en_1", "name_mr": "sample_name_mr_1", "claim_order": 3 }), "rules": [({ "position": 3, "check_en": "sample_check_en_1", "check_mr": "sample_check_mr_1", "state": null, "reason_en": "sample_reason_en_1", "reason_mr": "sample_reason_mr_1" })] })]],
  ["POST", /^\/api\/personas\/([^\/]+)\/profiles$/, (p, body) => __sampleInsert("profiles", body)],
  ["POST", /^\/api\/profiles\/([^\/]+)\/confirm$/, (p, body) => __mockRow("profiles", p[0])],
  ["GET", /^\/api\/profiles\/([^\/]+)\/gate$/, (p, body) => ({ "status": null, "required_days": 3, "confirmed_days": 3, "shortfall_days": 3, "certificate_id": "certificate__001" })],
  ["GET", /^\/api\/certificates\/([^\/]+)$/, (p, body) => ({ ...(__mockRow("certificates", p[0])), ...(({ "extractions": __mockRows("certificate_extractions", { certificateId: p[0] }) })) })],
  ["GET", /^\/api\/profiles\/([^\/]+)$/, (p, body) => __mockRow("profiles", p[0])],
  ["PATCH", /^\/api\/profiles\/([^\/]+)$/, (p, body) => __sampleUpdate("profiles", p[0], body)],
  ["DELETE", /^\/api\/profiles\/([^\/]+)$/, (p, body) => __sampleDelete("profiles", p[0])],
  ["POST", /^\/api\/profiles\/([^\/]+)\/certificates\/([^\/]+)\/confirm$/, (p, body) => __mockRow("certificates", p[1])],
  ["PATCH", /^\/api\/certificates\/([^\/]+)\/extractions\/([^\/]+)$/, (p, body) => __sampleUpdate("certificate_extractions", p[1], body)],
  ["PATCH", /^\/api\/profiles\/([^\/]+)\/document-ticks\/([^\/]+)$/, (p, body) => __sampleUpdate("document_ticks", p[1], body)],
  ["DELETE", /^\/api\/profiles\/([^\/]+)\/certificates\/([^\/]+)$/, (p, body) => __sampleDelete("certificates", p[1])],
];

/** What `http()` returns in mock mode. Sign-in paths hand back the demo
 *  session @/lib/authContext uses. Every endpoint the API Layer designed
 *  answers in its own declared shape (`__NEXEN_MOCK_ROUTES__`), built from
 *  the same sample rows the database seed uses, and passed through the
 *  same `unwrap` a real answer gets — so a screen that works here reads
 *  the fields it will read against the real routes.
 *
 *  The `/me` rule is anchored to the END of the path: unanchored, it
 *  caught `/api/me/orders` and answered every "my ..." screen with the
 *  demo user. */
function __nexenMockResponse(url: string, init?: RequestInit): any {
  const method = (init?.method ?? 'GET').toUpperCase();
  const __path = String(url).split('?')[0].replace(/\/+$/, '') || '/';
  __sampleLoad();
  if (/\/(login|register|signup|sign-up|sign-in|signin)$/.test(__path)) {
    return { token: 'nexen-mock-token', user: __NEXEN_DEMO_USER__ };
  }
  if (/\/(logout|sign-out|signout)$/.test(__path)) return { ok: true };
  let __body: any = {};
  try { __body = init?.body ? JSON.parse(String(init.body)) : {}; } catch { __body = {}; }
  for (const [m, re, answer] of __NEXEN_MOCK_ROUTES__) {
    if (m !== method) continue;
    const hit = re.exec(__path);
    if (hit) return unwrap(answer(hit.slice(1).map(decodeURIComponent), __body));
  }
  if (method === 'GET' && /\/auth\/(me|session|user)$|^\/api\/(me|profile)$|\/users\/me$/.test(__path)) {
    return __NEXEN_DEMO_USER__;
  }
  // No designed answer: a write changes the rows its path names, kept for this
  // tab (`__sampleWrite`); else it echoes its body so optimistic UI still
  // renders. A read finds the rows its path names.
  if (method !== 'GET') {
    const written = __sampleWrite(method, __path, __body);
    if (written !== undefined || method === 'DELETE') return written;
  }
  if (method !== 'GET' && init?.body) return __body;
  const __segs = __path.split('/').filter(Boolean);
  for (let i = __segs.length - 1; i >= 0; i -= 1) {
    const rows = __NEXEN_MOCK_ROWS__[__segs[i]];
    if (!rows) continue;
    const isItem = i === __segs.length - 2;
    return isItem ? __mockRow(__segs[i], __segs[i + 1]) : rows;
  }
  return {};
}

import type { Certificate } from '@/types/certificate';
import type { CertificateExtraction } from '@/types/certificateextraction';
import type { Document } from '@/types/document';
import type { DocumentTick } from '@/types/documenttick';
import type { Persona } from '@/types/persona';
import type { Profile } from '@/types/profile';
import type { RenewalReminder } from '@/types/renewalreminder';
import type { Scheme } from '@/types/scheme';
import type { SchemeRule } from '@/types/schemerule';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function withQuery(
  url: string,
  query?: Record<string, string | number | boolean | undefined>,
): string {
  if (!query) return url;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `${url}?${s}` : url;
}

// ONE envelope convention, applied here so nothing downstream has to think
// about it: route handlers return the entity WRAPPED — `{ task }`, `{ projects }`
// — matching the `{ error }` shape errors already use and leaving room for
// `{ data, meta }` later. This unwraps it, so hooks and pages only ever see
// entities.
//
// Without a single decision, some generated consumers unwrapped and some did
// not: `useTask` stored `{ task: {...} }` as the task itself while the page
// next to it got it right. Both were plausible readings of an unstated rule.
function unwrap(payload: any): any {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    return payload;
  }
  const keys = Object.keys(payload);
  // A single-key object whose key is not a known envelope field IS the
  // envelope. Anything else is already the entity — unwrapping a real
  // one-field entity would be worse than leaving a wrapper on.
  if (keys.length === 1 && !['error', 'message', 'ok'].includes(keys[0])) {
    return payload[keys[0]];
  }
  return payload;
}

async function http(url: string, init?: RequestInit): Promise<any> {
  // No database exists during the preview — answer locally.
  if (__NEXEN_IS_MOCK__) return __nexenMockResponse(url, init);
  // Unified-Next: same-origin relative URLs. Auth is DUAL — the login route
  // sets an httpOnly session cookie AND returns the JWT, which the login form
  // persists via @/lib/authToken. We attach it as `Authorization: Bearer` here
  // because the cookie is withheld inside the IDE preview's cross-site iframe;
  // `credentials: 'include'` keeps the cookie working in a normal browser too.
  const token = typeof window !== 'undefined' ? getToken() : null;
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((init?.headers as Record<string, string> | undefined) ?? {}),
    },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text().catch(() => res.statusText));
  }
  if (res.status === 204) return undefined;
  return unwrap(await res.json().catch(() => undefined));
}

export async function getSchemes(query?: Record<string, string | number | boolean | undefined>): Promise<Scheme[]> {
  return http(withQuery(`/api/schemes`, query));
}
export async function getDocuments(query?: Record<string, string | number | boolean | undefined>): Promise<Document[]> {
  return http(withQuery(`/api/documents`, query));
}
export async function createProfile(input: Partial<Omit<Profile, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<{ profile: Profile; access_token: string }> {
  return http(`/api/profiles`, { method: 'POST', body: JSON.stringify(input) });
}
export async function getProfileById(profileId: string, query?: { token?: string }): Promise<Profile> {
  return http(withQuery(`/api/profiles/${profileId}`, query));
}
export async function updateProfile(profileId: string, input: Partial<Omit<Profile, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<Profile> {
  return http(`/api/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function deleteProfile(profileId: string): Promise<void> {
  return http(`/api/profiles/${profileId}`, { method: 'DELETE' });
}
export async function createProfileConfirm(profileId: string, input: Record<string, unknown>): Promise<Profile> {
  return http(`/api/profiles/${profileId}/confirm`, { method: 'POST', body: JSON.stringify(input) });
}
export async function getProfileVerdicts(profileId: string, query?: { token?: string }): Promise<any> {
  return http(withQuery(`/api/profiles/${profileId}/verdicts`, query));
}
export async function getProfileSchemeStack(profileId: string, query?: { token?: string }): Promise<any> {
  return http(withQuery(`/api/profiles/${profileId}/scheme-stack`, query));
}
export async function getProfileGate(profileId: string, query?: { token?: string }): Promise<any> {
  return http(withQuery(`/api/profiles/${profileId}/gate`, query));
}
export async function getProfileCertificates(profileId: string, query?: { token?: string }): Promise<Certificate[]> {
  return http(withQuery(`/api/profiles/${profileId}/certificates`, query));
}
export async function createProfileCertificate(profileId: string, input: Partial<Omit<Certificate, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<Certificate> {
  return http(`/api/profiles/${profileId}/certificates`, { method: 'POST', body: JSON.stringify(input) });
}
export async function createProfileCertificateConfirm(profileId: string, certificateId: string, input: Record<string, unknown>): Promise<Certificate> {
  return http(`/api/profiles/${profileId}/certificates/${certificateId}/confirm`, { method: 'POST', body: JSON.stringify(input) });
}
export async function deleteProfileCertificate(profileId: string, certificateId: string): Promise<void> {
  return http(`/api/profiles/${profileId}/certificates/${certificateId}`, { method: 'DELETE' });
}
export async function updateProfileRenewalReminder(profileId: string, input: Partial<Omit<RenewalReminder, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<RenewalReminder> {
  return http(`/api/profiles/${profileId}/renewal-reminder`, { method: 'PUT', body: JSON.stringify(input) });
}
export async function getProfileApplicationPack(profileId: string, query?: { token?: string }): Promise<{ profile: Profile; verdicts: Array<Record<string, unknown>>; documents: Array<Record<string, unknown>>; steps: string[]; check_status_at: string }> {
  return http(withQuery(`/api/profiles/${profileId}/application-pack`, query));
}
export async function getPersonas(query?: Record<string, string | number | boolean | undefined>): Promise<Persona[]> {
  return http(withQuery(`/api/personas`, query));
}
export async function createPersonaProfile(personaId: string, input: Partial<Omit<Profile, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<Profile> {
  return http(`/api/personas/${personaId}/profiles`, { method: 'POST', body: JSON.stringify(input) });
}
export async function createProfileSuggestion(input: { story_text: string }): Promise<{ suggested: Partial<Profile>; unparsed_chips: string[] }> {
  return http(`/api/profiles/suggestions`, { method: 'POST', body: JSON.stringify(input) });
}
export async function getProfileRenewalCountdown(profileId: string, query?: Record<string, string | number | boolean | undefined>): Promise<{ days_to_renewal: number | null; renewal_due_date: string | null; first_deadline: string | null }> {
  return http(withQuery(`/api/profiles/${profileId}/renewal-countdown`, query));
}
export async function deleteProfileRenewalReminder(profileId: string): Promise<void> {
  return http(`/api/profiles/${profileId}/renewal-reminder`, { method: 'DELETE' });
}
export async function getProfileDocumentQuest(profileId: string, query?: Record<string, string | number | boolean | undefined>): Promise<{ profile_id: string; documents: (Document & { is_ticked: boolean; ticked_at: string | null })[]; ticked_count: number; total: number; pack_ready: boolean }> {
  return http(withQuery(`/api/profiles/${profileId}/document-quest`, query));
}
export async function updateProfileDocumentTick(profileId: string, documentId: string, input: Partial<Omit<DocumentTick, 'createdAt' | 'deletedAt' | 'id' | 'updatedAt'>>): Promise<DocumentTick> {
  return http(`/api/profiles/${profileId}/document-ticks/${documentId}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function getSchemeRules(query?: Record<string, string | number | boolean | undefined>): Promise<SchemeRule[]> {
  return http(withQuery(`/api/scheme-rules`, query));
}
export async function getCertificateById(certificateId: string, query?: Record<string, string | number | boolean | undefined>): Promise<Certificate & { extractions: CertificateExtraction[] }> {
  return http(withQuery(`/api/certificates/${certificateId}`, query));
}
export async function updateCertificateExtraction(certificateId: string, extractionId: string, input: { extracted_value?: string; is_confirmed: boolean }): Promise<CertificateExtraction> {
  return http(`/api/certificates/${certificateId}/extractions/${extractionId}`, { method: 'PATCH', body: JSON.stringify(input) });
}
export async function getCertificateGateVerdict(certificateId: string, query?: Record<string, string | number | boolean | undefined>): Promise<{ certificate_id: string; state: 'pass' | 'fail' | 'check'; days_shown: number | null; days_short: number; reason_en: string; reason_mr: string }> {
  return http(withQuery(`/api/certificates/${certificateId}/gate-verdict`, query));
}
export async function createProfileCertificateExtract(profileId: string, input: Record<string, unknown>): Promise<any> {
  return http(`/api/profiles/${profileId}/certificates/extract`, { method: 'POST', body: JSON.stringify(input) });
}
export async function getProfilePmSymContribution(profileId: string, query?: Record<string, string | number | boolean | undefined>): Promise<any> {
  return http(withQuery(`/api/profiles/${profileId}/pm-sym-contribution`, query));
}
