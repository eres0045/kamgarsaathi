'use client';

// Demo data — rendered by the pipeline from prisma/schema.prisma. One account per
// role (<role>@example.com, password DEMO_PASSWORD from .env) plus demo@example.com, then every table,
// parents first. Every insert is non-fatal; safe to run again.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = new PrismaClient();
const ids: Record<string, Array<string | number>> = {};
const users: Record<string, string | number> = {};
function pick(model: string, i: number): string | number | undefined {
  const list = ids[model] || [];
  return list.length ? list[i % list.length] : undefined;
}
function why(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  return m.split('\n').filter(Boolean).slice(-1)[0]?.slice(0, 200) ?? m;
}

async function main() {
  // DEMO_PASSWORD in .env, random for each project. Unset, nobody can sign in as the demo accounts.
  const demoPassword = process.env.DEMO_PASSWORD || randomUUID();
  if (!process.env.DEMO_PASSWORD) console.log('[seed] demo accounts: DEMO_PASSWORD is not set in .env, so nobody can sign in as them');
  const hashed = await bcrypt.hash(demoPassword, 10);
  console.log('[seed] demo-user: MISSING — this app has no user model');
  try {
    if ((await db.certificate.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ profileId: pick("Profile", 0), workerId: pick("Worker", 0), photoUrl: "https://picsum.photos/seed/workcert/800/600", isSample: true, extractionStatus: "confirmed", confirmedAt: new Date("2025-11-03T10:22:00Z"), confirmedDays: 96, confirmedBy: "Sunita Pawar", label: "Site work certificate", issuerName: "Shree Constructions, Hinjewadi", issuerConfirmed: true, periodStartDate: new Date("2025-01-01T00:00:00Z"), periodEndDate: new Date("2025-04-06T00:00:00Z"), datesConfirmed: true, source: "photo_upload" }),
        () => ({ profileId: pick("Profile", 1), workerId: pick("Worker", 1), photoUrl: "https://picsum.photos/seed/sitecert/800/600", isSample: true, extractionStatus: "extracted", label: "Contractor work letter", issuerName: "Patil & Sons Builders", issuerConfirmed: false, periodStartDate: new Date("2024-11-10T00:00:00Z"), periodEndDate: new Date("2025-02-28T00:00:00Z"), datesConfirmed: false, source: "photo_upload" }),
        () => ({ profileId: pick("Profile", 2), workerId: pick("Worker", 2), photoUrl: "https://picsum.photos/seed/mahacert/800/600", isSample: true, extractionStatus: "pending", label: "Employer letter", issuerConfirmed: false, datesConfirmed: false, source: "photo_upload" }),
        () => ({ profileId: pick("Profile", 3), workerId: pick("Worker", 3), photoUrl: "https://picsum.photos/seed/blurdoc/800/600", isSample: true, extractionStatus: "failed", label: "Handwritten work record", issuerConfirmed: false, datesConfirmed: false, source: "camera_capture" }),
        () => ({ profileId: pick("Profile", 4), workerId: pick("Worker", 4), photoUrl: "https://picsum.photos/seed/ngoslip/800/600", isSample: true, extractionStatus: "confirmed", confirmedAt: new Date("2025-10-28T16:05:00Z"), confirmedDays: 45, confirmedBy: "Bhimrao Jadhav", label: "Sugarcane harvest slip", issuerName: "Ambajogai Sugar Co-op", issuerConfirmed: true, periodStartDate: new Date("2024-10-15T00:00:00Z"), periodEndDate: new Date("2025-01-15T00:00:00Z"), datesConfirmed: true, source: "csc_entry" }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.certificate.create({ data: row() as never });
          (ids["Certificate"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Certificate row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Certificate: ${ok}/${rows.length} rows`);
    } else {
      ids["Certificate"] = (await db.certificate.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Certificate skipped: ' + why(e));
  }
  try {
    if ((await db.document.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ nameEn: "Aadhaar card", nameMr: "आधार कार्ड", whereToGet: "UIDAI enrolment centre or uidai.gov.in", costRupees: 0, costStatus: "verified", daysToObtain: 30, daysStatus: "verify", isGateDocument: true, isShowOnly: false, position: 1, whereToGetMr: "UIDAI नोंदणी केंद्र किंवा uidai.gov.in", documentType: "identity", isSample: true, workerId: pick("Worker", 0) }),
        () => ({ nameEn: "Bank passbook or cancelled cheque", nameMr: "बँक पासबुक किंवा रद्द धनादेश", whereToGet: "Your bank branch", costRupees: 0, costStatus: "verify", daysToObtain: 3, daysStatus: "verify", isGateDocument: true, isShowOnly: false, position: 2, whereToGetMr: "तुमची बँक शाखा", documentType: "bank", isSample: true, workerId: pick("Worker", 1) }),
        () => ({ nameEn: "90-day construction work certificate", nameMr: "९० दिवस बांधकाम कामाचे प्रमाणपत्र", whereToGet: "Contractor or site engineer, signed and stamped", costRupees: 0, costStatus: "verify", daysToObtain: 7, daysStatus: "verify", appealOfficer: "Labour Officer, District Labour Office", isGateDocument: true, isShowOnly: false, position: 3, whereToGetMr: "ठेकेदार किंवा साइट इंजिनिअर, सही आणि शिक्क्यासह", appealOfficerMr: "कामगार अधिकारी, जिल्हा कामगार कार्यालय", documentType: "work_proof", isSample: true, workerId: pick("Worker", 2) }),
        () => ({ nameEn: "Passport-size photo", nameMr: "पासपोर्ट साइज फोटो", whereToGet: "Any photo studio", costRupees: 50, costStatus: "verify", daysToObtain: 0, daysStatus: "verified", isGateDocument: false, isShowOnly: false, position: 4, whereToGetMr: "कोणताही फोटो स्टुडिओ", documentType: "photo", isSample: true, workerId: pick("Worker", 3) }),
        () => ({ nameEn: "Ration card (show only)", nameMr: "रेशन कार्ड (फक्त दाखवण्यासाठी)", whereToGet: "Taluka supply office", costRupees: 0, costStatus: "verified", daysToObtain: 60, daysStatus: "verify", isGateDocument: false, isShowOnly: true, position: 5, whereToGetMr: "तालुका पुरवठा कार्यालय", documentType: "address", isSample: true, workerId: pick("Worker", 4) }),
        () => ({ nameEn: "Child's school leaving or birth certificate", nameMr: "मुलाचा शाळा सोडल्याचा किंवा जन्म दाखला", whereToGet: "School office or gram panchayat / municipal office", costRupees: 20, costStatus: "verify", daysToObtain: 10, daysStatus: "verify", isGateDocument: false, isShowOnly: false, position: 6, whereToGetMr: "शाळा कार्यालय किंवा ग्रामपंचायत / नगरपालिका कार्यालय", documentType: "family", isSample: true, workerId: pick("Worker", 5) }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.document.create({ data: row() as never });
          (ids["Document"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Document row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Document: ${ok}/${rows.length} rows`);
    } else {
      ids["Document"] = (await db.document.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Document skipped: ' + why(e));
  }
  try {
    if ((await db.persona.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ name: "Sunita Pawar #1", age: 34, gender: "female", work: "Mason helper (gavandi)", place: "Pune", occupation: "construction", state: "Maharashtra", constructionDaysLast12Months: 210, hasBankAccount: true, epfoEsic: false, incomeTaxPayer: false, monthlyIncome: 14500.0, married: true, schoolGoingChildren: 2, bocwRegistered: false, storyText: "मी दोन मुलांची आई आहे. गेल्या वर्षी साइटवर वर्षभर काम केलं, पण बोकवूत नोंदणी नाही.", isSample: true }),
        () => ({ name: "Raju Khandekar #2", age: 27, gender: "male", work: "Zomato delivery partner", place: "Nagpur", occupation: "gig_delivery", state: "Maharashtra", constructionDaysLast12Months: 0, hasBankAccount: true, epfoEsic: false, incomeTaxPayer: false, monthlyIncome: 18000.0, married: false, schoolGoingChildren: 0, bocwRegistered: false, storyText: "रोज बाईक चालवतो, पण अपघात झाला तर विमा आहे का हे मला माहीत नाही.", isSample: true }),
        () => ({ name: "Meera Gaikwad #3", age: 45, gender: "female", work: "Household help", place: "Thane", occupation: "domestic", state: "Maharashtra", constructionDaysLast12Months: 0, hasBankAccount: true, epfoEsic: false, incomeTaxPayer: false, monthlyIncome: 9000.0, married: true, schoolGoingChildren: 1, bocwRegistered: false, storyText: "घरकाम करते, नवऱ्याची नोकरी गेली. मुलाच्या शाळेची फी आणि औषधांचा खर्च जास्त झाला आहे.", isSample: true }),
        () => ({ name: "Bhimrao Jadhav #4", age: 52, gender: "male", work: "Sugarcane cutter", place: "Beed", occupation: "agriculture", state: "Maharashtra", constructionDaysLast12Months: 40, hasBankAccount: false, epfoEsic: false, incomeTaxPayer: false, monthlyIncome: 11000.0, married: true, schoolGoingChildren: 0, bocwRegistered: false, storyText: "हंगामात ऊस तोडतो, उरलेले महिने शेतमजुरी. बँकेत खाते उघडायचे आहे.", isSample: true }),
        () => ({ name: "Asha Kamble #5", age: 31, gender: "female", work: "Vegetable stall, Kalyan market", place: "Kalyan", occupation: "street_vending", state: "Maharashtra", constructionDaysLast12Months: 0, hasBankAccount: true, epfoEsic: false, incomeTaxPayer: false, monthlyIncome: 12000.0, married: false, schoolGoingChildren: 0, bocwRegistered: false, storyText: "सकाळी पाच वाजता बाजारात जाते. उतारवयासाठी काही बचत करायची आहे.", isSample: true }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.persona.create({ data: row() as never });
          (ids["Persona"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Persona row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Persona: ${ok}/${rows.length} rows`);
    } else {
      ids["Persona"] = (await db.persona.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Persona skipped: ' + why(e));
  }
  try {
    if ((await db.profile.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ name: "Sunita Pawar", age: 34, gender: "female", occupation: "construction", state: "Maharashtra", area: "urban", constructionDaysLast12Months: 210, hasBankAccount: true, aadhaarLinkedBank: true, epfoEsic: false, nps: false, incomeTaxPayer: false, govtEmployeeFamily: false, monthlyIncome: 14500.0, familyIncomeYearly: 216000.0, married: true, marriageEvent: "first", schoolChildrenCount: 2, mahabocwRegistered: false, registrationActive: false, willingUnskilledWork: true, storyText: "वर्षभर साइटवर काम केलं, पण बोकवूत नोंदणी नाही.", source: "persona", sourcePersonaId: pick("Persona", 0), isSample: true, isConfirmed: true, passwordHash: hashed, model: "Profile model 1", profileId: pick("Profile", 0) }),
        () => ({ name: "Raju Khandekar", age: 27, gender: "male", occupation: "gig_delivery", state: "Maharashtra", area: "urban", constructionDaysLast12Months: 0, hasBankAccount: true, aadhaarLinkedBank: true, epfoEsic: false, nps: false, incomeTaxPayer: false, govtEmployeeFamily: false, monthlyIncome: 18000.0, familyIncomeYearly: 216000.0, married: false, marriageEvent: "none", schoolChildrenCount: 0, mahabocwRegistered: false, registrationActive: false, willingUnskilledWork: true, storyText: "रोज बाईक चालवतो, विमा आहे का माहीत नाही.", source: "typed_story", sourcePersonaId: pick("Persona", 1), isSample: true, isConfirmed: false, passwordHash: hashed, model: "Profile model 2", profileId: pick("Profile", 1) }),
        () => ({ name: "Meera Gaikwad", age: 45, gender: "female", occupation: "domestic", state: "Maharashtra", area: "urban", constructionDaysLast12Months: 0, hasBankAccount: true, aadhaarLinkedBank: false, epfoEsic: false, nps: false, incomeTaxPayer: false, govtEmployeeFamily: false, monthlyIncome: 9000.0, familyIncomeYearly: 108000.0, married: true, marriageEvent: "repeat", schoolChildrenCount: 1, mahabocwRegistered: false, registrationActive: false, willingUnskilledWork: false, storyText: "घरकाम करते, नवऱ्याची नोकरी गेली.", source: "csc_entry", sourcePersonaId: pick("Persona", 2), isSample: true, isConfirmed: true, passwordHash: hashed, model: "Profile model 3", profileId: pick("Profile", 2) }),
        () => ({ name: "Bhimrao Jadhav", age: 52, gender: "male", occupation: "agriculture", state: "Maharashtra", area: "rural", constructionDaysLast12Months: 40, hasBankAccount: false, aadhaarLinkedBank: false, epfoEsic: false, nps: false, incomeTaxPayer: false, govtEmployeeFamily: false, monthlyIncome: 11000.0, familyIncomeYearly: 132000.0, married: true, marriageEvent: "first", schoolChildrenCount: 0, mahabocwRegistered: false, registrationActive: false, willingUnskilledWork: true, storyText: "हंगामात ऊस तोडतो, बँकेत खाते उघडायचे आहे.", source: "csc_entry", sourcePersonaId: pick("Persona", 3), isSample: true, isConfirmed: false, passwordHash: hashed, model: "Profile model 4", profileId: pick("Profile", 3) }),
        () => ({ name: "Asha Kamble", age: 31, gender: "female", occupation: "street_vending", state: "Maharashtra", area: "urban", constructionDaysLast12Months: 0, hasBankAccount: true, aadhaarLinkedBank: true, epfoEsic: false, nps: false, incomeTaxPayer: false, govtEmployeeFamily: false, monthlyIncome: 12000.0, familyIncomeYearly: 144000.0, married: false, marriageEvent: "none", schoolChildrenCount: 0, mahabocwRegistered: false, registrationActive: false, willingUnskilledWork: false, storyText: "सकाळी बाजारात जाते, बचत करायची आहे.", source: "typed_story", sourcePersonaId: pick("Persona", 4), isSample: true, isConfirmed: true, passwordHash: hashed, model: "Profile model 5", profileId: pick("Profile", 4) }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.profile.create({ data: row() as never });
          (ids["Profile"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Profile row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Profile: ${ok}/${rows.length} rows`);
    } else {
      ids["Profile"] = (await db.profile.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Profile skipped: ' + why(e));
  }
  try {
    if ((await db.scheme.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ code: "ESHRAM #1", nameEn: "e-Shram Registration", nameMr: "ई-श्रम नोंदणी", benefitEn: "National ID for unorganised workers and access to central schemes", amountStatus: "none", stackPosition: 1, stackGroup: "e_shram", stackReasonEn: "Gateway registration for most central worker schemes", stackReasonMr: "बहुतांश केंद्रीय कामगार योजनांसाठी प्रवेशद्वार नोंदणी", applyAt: "eshram.gov.in", officialSource: "eshram.gov.in", lastVerified: new Date("2025-10-15T00:00:00Z"), status: "verified", newApplicationsStatus: "open", applyAtMr: "eshram.gov.in", checkStatusAt: "eshram.gov.in" }),
        () => ({ code: "PMSYM #2", nameEn: "PM Shram Yogi Maandhan", nameMr: "पंतप्रधान श्रम योगी मानधन योजना", benefitEn: "Monthly pension after age 60 with government co-contribution", amountStatus: "verify", stackPosition: 2, stackGroup: "insurance_pension", stackReasonEn: "Pension scheme; can run alongside BOCW benefits", stackReasonMr: "निवृत्तीवेतन योजना; बोकवू लाभांसोबत घेता येते", applyAt: "maandhan.in", officialSource: "maandhan.in", lastVerified: new Date("2025-09-30T00:00:00Z"), status: "partially_verified", newApplicationsStatus: "open", contributionBands: [{"entryAge": "18-29", "monthlyContributionRupees": 55}, {"entryAge": "30-40", "monthlyContributionRupees": 100}] }),
        () => ({ code: "PMJJBY #3", nameEn: "PM Jeevan Jyoti Bima Yojana", nameMr: "पंतप्रधान जीवन ज्योती विमा योजना", benefitEn: "Life insurance cover for death from any cause", amountStatus: "verify", stackPosition: 3, stackGroup: "insurance_pension", stackReasonEn: "Life cover, combinable with accident cover", stackReasonMr: "जीवन विमा, अपघात विम्यासोबत घेता येतो", applyAt: "Bank branch or net banking", officialSource: "jansuraksha.gov.in", lastVerified: new Date("2025-09-30T00:00:00Z"), status: "verified", newApplicationsStatus: "open", applyAtMr: "बँक शाखा किंवा नेट बँकिंग" }),
        () => ({ code: "PMSBY #4", nameEn: "PM Suraksha Bima Yojana", nameMr: "पंतप्रधान सुरक्षा विमा योजना", benefitEn: "Accident insurance cover at a low annual premium", amountStatus: "verify", stackPosition: 4, stackGroup: "insurance_pension", stackReasonEn: "Accident cover, combinable with life cover", stackReasonMr: "अपघात विमा, जीवन विम्यासोबत घेता येतो", applyAt: "Bank branch or net banking", officialSource: "jansuraksha.gov.in", lastVerified: new Date("2025-09-30T00:00:00Z"), status: "verified", newApplicationsStatus: "open", applyAtMr: "बँक शाखा किंवा नेट बँकिंग" }),
        () => ({ code: "BOCWREG #5", nameEn: "BOCW Worker Registration (MAHABOCW)", nameMr: "बांधकाम कामगार नोंदणी (महाबोकवू)", benefitEn: "Gateway to all Maharashtra construction worker welfare benefits", amountStatus: "none", stackPosition: 1, stackGroup: "bocw_gate", stackReasonEn: "Must be registered before claiming any BOCW benefit", stackReasonMr: "कोणताही बोकवू लाभ मिळवण्यापूर्वी नोंदणी आवश्यक", applyAt: "mahabocw.in", officialSource: "mahabocw.in", lastVerified: new Date("2025-10-01T00:00:00Z"), status: "verified", newApplicationsStatus: "open", applyAtMr: "mahabocw.in" }),
        () => ({ code: "BOCWBEN #6", nameEn: "BOCW Welfare Benefits", nameMr: "बांधकाम कामगार कल्याण लाभ", benefitEn: "Education, health, and maternity aid for registered construction workers", amountStatus: "verify", stackPosition: 2, stackGroup: "bocw_benefit", stackReasonEn: "Available after active registration with 90+ construction days", stackReasonMr: "सक्रिय नोंदणी आणि ९०+ बांधकाम दिवसांनंतर उपलब्ध", applyAt: "Nearest BOCW facilitation centre", officialSource: "mahabocw.in", lastVerified: new Date("2025-10-01T00:00:00Z"), status: "partially_verified", newApplicationsStatus: "verify" }),
        () => ({ code: "MJPJAY #7", nameEn: "Mahatma Phule Jan Arogya Yojana", nameMr: "महात्मा फुले जन आरोग्य योजना", benefitEn: "Health cover for hospital treatment at empanelled hospitals", amountStatus: "verify", stackPosition: 1, stackGroup: "parallel_state", stackReasonEn: "State health cover, runs independently of central schemes", stackReasonMr: "राज्य आरोग्य विमा, केंद्र योजनांपासून स्वतंत्र चालतो", applyAt: "Empanelled hospital or CSC", officialSource: "jeevandayee.gov.in", lastVerified: new Date("2025-09-20T00:00:00Z"), status: "partially_verified", newApplicationsStatus: "open" }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.scheme.create({ data: row() as never });
          (ids["Scheme"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Scheme row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Scheme: ${ok}/${rows.length} rows`);
    } else {
      ids["Scheme"] = (await db.scheme.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Scheme skipped: ' + why(e));
  }
  try {
    if ((await db.worker.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ name: "Sunita Pawar", age: 34, occupation: "construction", state: "Maharashtra", constructionDaysLast12Months: 210, employmentStatus: "employed", aadhaarShown: true, isSample: true }),
        () => ({ name: "Ganesh Shinde", age: 29, occupation: "construction", state: "Maharashtra", constructionDaysLast12Months: 120, employmentStatus: "employed", aadhaarShown: true, isSample: true }),
        () => ({ name: "Prakash Warade", age: 41, occupation: "construction", state: "Maharashtra", constructionDaysLast12Months: 35, employmentStatus: "left", aadhaarShown: false, isSample: true }),
        () => ({ name: "Sushila Bhosale", age: 38, occupation: "domestic", state: "Maharashtra", constructionDaysLast12Months: 0, employmentStatus: "employed", aadhaarShown: true, isSample: true }),
        () => ({ name: "Imran Sheikh", age: 24, occupation: "gig_delivery", state: "Maharashtra", constructionDaysLast12Months: 0, employmentStatus: "employed", aadhaarShown: false, isSample: true }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.worker.create({ data: row() as never });
          (ids["Worker"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] Worker row skipped: ' + why(e));
        }
      }
      console.log(`[seed] Worker: ${ok}/${rows.length} rows`);
    } else {
      ids["Worker"] = (await db.worker.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] Worker skipped: ' + why(e));
  }
  try {
    if ((await db.certificateExtraction.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ certificateId: pick("Certificate", 0), fieldKey: "days_worked", extractedValue: "96", cropImageUrl: "https://picsum.photos/seed/cropdays/800/600", isConfirmed: true, confirmedAt: new Date("2025-11-03T10:21:00Z") }),
        () => ({ certificateId: pick("Certificate", 1), fieldKey: "period_start", extractedValue: "01/01/2025", cropImageUrl: "https://picsum.photos/seed/cropstart/800/600", isConfirmed: true, confirmedAt: new Date("2025-11-03T10:21:30Z") }),
        () => ({ certificateId: pick("Certificate", 2), fieldKey: "period_end", extractedValue: "06/04/2025", cropImageUrl: "https://picsum.photos/seed/cropend/800/600", isConfirmed: true, confirmedAt: new Date("2025-11-03T10:22:00Z") }),
        () => ({ certificateId: pick("Certificate", 3), fieldKey: "issuer_name", extractedValue: "Patil & Sons Builders", cropImageUrl: "https://picsum.photos/seed/cropissuer/800/600", isConfirmed: false }),
        () => ({ certificateId: pick("Certificate", 4), fieldKey: "days_worked", extractedValue: "11O", cropImageUrl: "https://picsum.photos/seed/cropblur/800/600", isConfirmed: false }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.certificateExtraction.create({ data: row() as never });
          (ids["CertificateExtraction"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] CertificateExtraction row skipped: ' + why(e));
        }
      }
      console.log(`[seed] CertificateExtraction: ${ok}/${rows.length} rows`);
    } else {
      ids["CertificateExtraction"] = (await db.certificateExtraction.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] CertificateExtraction skipped: ' + why(e));
  }
  try {
    if ((await db.documentTick.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ profileId: pick("Profile", 0), documentId: pick("Document", 0), isTicked: true, tickedAt: new Date("2025-11-02T09:15:00Z") }),
        () => ({ profileId: pick("Profile", 1), documentId: pick("Document", 1), isTicked: true, tickedAt: new Date("2025-11-02T09:17:00Z") }),
        () => ({ profileId: pick("Profile", 2), documentId: pick("Document", 2), isTicked: false, tickedAt: new Date("2025-11-05T14:40:00Z") }),
        () => ({ profileId: pick("Profile", 3), documentId: pick("Document", 3), isTicked: false, tickedAt: new Date("2025-11-05T14:40:00Z") }),
        () => ({ profileId: pick("Profile", 4), documentId: pick("Document", 4), isTicked: true, tickedAt: new Date("2025-11-05T14:40:00Z") }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.documentTick.create({ data: row() as never });
          (ids["DocumentTick"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] DocumentTick row skipped: ' + why(e));
        }
      }
      console.log(`[seed] DocumentTick: ${ok}/${rows.length} rows`);
    } else {
      ids["DocumentTick"] = (await db.documentTick.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] DocumentTick skipped: ' + why(e));
  }
  try {
    if ((await db.schemeRule.count()) === 0) {
      const rows: Array<() => Record<string, unknown>> = [
        () => ({ schemeId: pick("Scheme", 0), position: 1, ruleKey: "construction_days_90 #1", checkEn: "Worked at least 90 days in construction in the last 12 months", checkMr: "गेल्या १२ महिन्यांत बांधकामावर किमान ९० दिवस काम", passIf: "constructionDaysLast12Months >= 90", verifyFlag: false, reasonPassEn: "You have enough construction days to qualify for BOCW benefits", reasonPassMr: "बोकवू लाभांसाठी तुमचे बांधकाम दिवस पुरेसे आहेत", reasonFailEn: "You need 90 construction days in the last 12 months", reasonFailMr: "गेल्या १२ महिन्यांत ९० बांधकाम दिवस आवश्यक आहेत" }),
        () => ({ schemeId: pick("Scheme", 1), position: 2, ruleKey: "not_income_tax_payer #2", checkEn: "Not an income tax payer", checkMr: "आयकर भरणारे नाही", passIf: "incomeTaxPayer == false", verifyFlag: false, reasonPassEn: "Income tax status does not block you", reasonPassMr: "आयकर स्थिती तुम्हाला अडवत नाही", reasonFailEn: "Income tax payers are excluded from this scheme", reasonFailMr: "आयकर भरणाऱ्यांना ही योजना लागू नाही" }),
        () => ({ schemeId: pick("Scheme", 2), position: 3, ruleKey: "no_epfo_esic #3", checkEn: "Not covered by EPFO or ESIC", checkMr: "EPFO किंवा ESIC मध्ये नाव नाही", passIf: "epfoEsic == false", verifyFlag: true, reasonPassEn: "You are not in EPFO or ESIC, so you can apply for PM-SYM", reasonPassMr: "तुम्ही EPFO किंवा ESIC मध्ये नाही, त्यामुळे PM-SYM साठी अर्ज करू शकता", reasonFailEn: "EPFO or ESIC members are excluded from PM-SYM", reasonFailMr: "EPFO किंवा ESIC सदस्यांना PM-SYM लागू नाही" }),
        () => ({ schemeId: pick("Scheme", 3), position: 4, ruleKey: "bank_account_present #4", checkEn: "Has a bank account", checkMr: "बँक खाते आहे", passIf: "hasBankAccount == true", verifyFlag: false, reasonPassEn: "Your bank account can receive benefits directly", reasonPassMr: "तुमच्या बँक खात्यात थेट लाभ जमा होऊ शकतो", reasonFailEn: "Open a bank account first so benefits can be paid", reasonFailMr: "लाभ मिळण्यासाठी आधी बँक खाते उघडा" }),
        () => ({ schemeId: pick("Scheme", 4), position: 5, ruleKey: "aadhaar_linked_bank #5", checkEn: "Aadhaar is linked to your bank account", checkMr: "आधार बँक खात्याशी जोडलेला आहे", passIf: "aadhaarLinkedBank == true", verifyFlag: true, reasonPassEn: "Aadhaar linking lets DBT payments reach you", reasonPassMr: "आधार जोडल्यामुळे DBT रक्कम थेट मिळेल", reasonFailEn: "Link Aadhaar to your bank so DBT payments can reach you", reasonFailMr: "DBT रक्कम मिळण्यासाठी आधार बँकेशी जोडा" }),
      ];
      let ok = 0;
      for (const row of rows) {
        try {
          const r = await db.schemeRule.create({ data: row() as never });
          (ids["SchemeRule"] ??= []).push((r as { id: string | number }).id);
          ok++;
        } catch (e) {
          console.log('[seed] SchemeRule row skipped: ' + why(e));
        }
      }
      console.log(`[seed] SchemeRule: ${ok}/${rows.length} rows`);
    } else {
      ids["SchemeRule"] = (await db.schemeRule.findMany({ take: 50, select: { id: true } } as never) as Array<{ id: string | number }>).map((r) => r.id);
    }
  } catch (e) {
    console.log('[seed] SchemeRule skipped: ' + why(e));
  }
}

main()
  .then(async () => { await db.$disconnect(); })
  .catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(0); });
