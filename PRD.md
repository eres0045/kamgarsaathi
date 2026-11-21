# KamgarSaathi — Build Packet (ACE Builders 2026, PS5)

**For:** Ronit Shrimankar (solo) — build this yourself inside the Codebenders IDE.
**Event:** ACE Builders 2026, Problem Statement 5 — Citizens and Public Services ("Claim What's Yours").
**Deadlines:** build closes **Sun 22 Nov 23:59 IST**; submission window **23–24 Nov**; winners announced **5 Dec**.
**Prizes:** ₹2,00,000 total — 1st ₹1,00,000 / 2nd ₹50,000 / 3rd ₹30,000 / 4th–5th ₹10,000.
**Judging (/100):** Innovation 20% · Impact 20% · Technical Execution & Codebenders Usage 25% · UI/UX 15% · Business 20%. Top finalists are also weighed on LinkedIn post engagement.
**Submission needs:** working app link + public repo with an open-source licence + LinkedIn post.

**What this packet is:** a SPEC + DATA + COPY document. It is NOT the app and NOT code to paste as a finished product. Feed it to the Codebenders IDE's own AI (Nexen) section by section, in build order (§2). External AI tools are banned for the build — this packet is the plan, the verified scheme data, the copy, and the steps.

**Token discipline:** your 8,000,000 hackathon tokens expire **Sun 22 Nov 23:59 IST** and the burn rate is unpublished. Check the dashboard before each big generation. Suggested split: ~40% scaffold + screens, ~35% features + agent flow, **keep ~25% in reserve for the final fix pass**. Never burn the reserve on a nice-to-have.

**Platform reality (do not assume otherwise):** Codebenders is a **build-time AI platform, not a runtime platform**. There is no public evidence of a hosted DB, auth, hosting, file storage, cron, WhatsApp/SMS, payments, or a free runtime LLM key for your app. Build the app as a **static app: GitHub Pages + localStorage**. Any runtime LLM call needs a key you already hold, **never committed to the public repo**, with a **deterministic fallback** — if the LLM call fails, the deterministic rule engine still produces every verdict and the agent text degrades to templates. Never fake a live integration.

**Sources for every fact in this packet:** `ace-first-place-plays.md` (Play 1) and `ace-ideas-near-10.md` (KamgarSaathi §2), both 21 Nov 2026, plus quick web checks done 21 Nov 2026 (PIB for PM-SYM; Indian Express + Maharashtra WCD Dept for Majhi Ladki Bahin; aimindia.in / pmyojanah.com / sarkariyojana.com for BOCW benefits). Where a fact could not be confirmed, it is marked **VERIFY** — do not ship a VERIFY value as fact. Re-check every VERIFY item at the official portal before submitting.

---

## 1. The pick in one paragraph

**KamgarSaathi** is a Marathi-first agent for a Maharashtra construction or gig worker: the worker tells their story in plain Marathi, and the agent's real job is getting them past the **gates that silently block their money** — the 90-day work certificate for MahaBOCW registration, the annual renewal clock that kills benefits if it lapses, and the **order** in which schemes must be claimed (e-Shram first, then insurance/pension, then BOCW benefits). No Devpost/GitHub scheme-finder targets construction/gig workers, and MahaBOCW's own portal is a bare 3-question check with no reasoning, stacking, document quest or renewal reminders. It scored **8.55/10** (Innovation 9, Impact 9, Technical 8, UI/UX 9, Business 8) — the highest ceiling found across three research rounds and 40+ angles. The lever to ~8.7 is **one proof point**: a named CSC/Setu operator or contractor who confirms the gate problem on a 10-minute call (§9). The swing risk is Business — if the pitch does not name the payer, the score falls to ~8.15. The payer is **CSC/Setu operators + contractors, never the workers** (§8, §12).

---

## 2. App spec — screens in build order

Build in this order. Stop when time runs out; every step leaves a demoable app.

**Step 0 — Project setup in the IDE (evidence for the 25% Technical weight).** Create the repo, write a short PRD in the repo (problem, user, stack order, cut list), let Nexen generate the architecture + test suite + API docs. The build loop shown in the repo is how the "Use of Codebenders Platform" points are won — there is no runtime platform feature to bolt on.

**Step 1 — Home + persona picker (build first).** Marathi-first home screen. Language toggle Marathi / English (Marathi default). Three one-tap personas (§4). One-line pitch on the home screen: "तुमची गोष्ट सांगा — कोणत्या योजना मिळतील, का मिळतील, आणि काय आणायचे, ते सांगतो." (Tell your story — I'll tell you which schemes you'll get, why, and what to bring.)

**Step 2 — Story intake.** Typed Marathi + preset chips (no voice — cut). Chips: कामाचा प्रकार (mason / helper / painter / delivery rider / other), गेल्या 12 महिन्यांत किती दिवस काम (days-worked slider/number), वय (age), लग्न झाले आहे का (married?), मुले शाळेत आहेत का (school-going children?), बँक खाते आहे का (bank account?), EPFO/ESIC आहे का (EPFO/ESIC?), आयकर भरता का (income-tax payer?). Intake produces a structured profile — nothing free-text is trusted for a verdict; every rule reads a structured field.

**Step 3 — Rule engine evaluation (the deterministic core).** The 12 schemes in §3 run as data, not hard-coded if/else per scheme. Each rule returns one of three states: **✓ pass / ✗ fail / ? unknown (needs check)**. Every verdict shows its reason in Marathi + English ("✓ 90 दिवस: 96 दिवस दाखवले" / "✓ 90 days: 96 days shown"). A rule with a VERIFY fact shows "?" and names what to check — never a guessed pass.

**Step 4 — Gate-proof moment (the demo climax — build this before polish).** Certificate photo upload → agent extracts values → **the crop is shown next to each extracted value** → gate verdict. See §5 for the exact flow and the honesty rule.

**Step 5 — Scheme stack + ₹ unlocked.** Ordered list of the 12 schemes with *why this order* shown under each step. A single "₹ unlocked" number that moves when the gate clears: **₹5,000 tool-kit aid** (verified) + "scholarship eligibility unlocked" (NO ₹ figure — amount is VERIFY, §3). Never show a ₹ number you have not verified.

**Step 6 — Document quest.** 6 documents (§5), each with where to get it, cost, days, and appeal officer. Printable checklist (print stylesheet, not a PDF library). Each document is a quest step with a tick box; completing all 6 shows "pack ready".

**Step 7 — Renewal countdown.** From a user-entered registration date: a "days to renewal" ring + reminder stored in localStorage. If no registration yet, the countdown shows the *first* deadline instead: "register before your certificate crosses 12 months".

**Step 8 — Pre-filled application pack.** A printable summary: profile + per-rule verdicts + document checklist + the exact steps to apply and where to check status. It does NOT check live application status — there is no public government API for that; the manual tracker is Step 9.

**Step 9 — My applications tracker (manual — added 21 Nov after the PS5 criteria check: the brief requires "deadline reminders and application tracking, so nothing lapses", and the packet had cut tracking).** A per-scheme status the USER updates by hand: Not applied → Applied → Documents submitted → Approved / Rejected, with the date and the portal link where the official status lives. Stored in localStorage. The UI says, honestly: "status updated by you — check the portal for the official status". No live portal check, no scraped status, no faked "approved" — a manual tracker is the honest implementation of the requirement.

**CUT — do not build:** voice input · live portal scraping or live application-status checks · real SMS/WhatsApp sending (drafted message + copy button only) · payments · Karnataka gig-worker law (wrong state, benefits don't exist yet — §12) · any feature that needs a live government API.

**Data model (keep it this simple):** `schemes.json` (the 12 rules in §3) + `personas.json` (§4) + `strings.json` (§6) + `localStorage` for the profile, checklist ticks, renewal date, and application statuses (Step 9). No backend, no login, no user accounts.

---

## 3. The 12 schemes as copy-ready JSON rules

Copy this block into the app as `schemes.json`. Rules are data (the brief requires "store scheme rules as editable data because they change often"). **Every scheme ends with `last_verified: "2026-11-21"` and a `status` field.** `VERIFY` means: confirmed nowhere in the research files or today's web checks — re-check at the official portal before submitting, and in the app show "?" (unknown) for that rule, never a guessed ✓/✗.

**Stack order (why this order — show it under each step in the UI):**
1. e-Shram first — it is the gateway identity for unorganised workers.
2. PMSBY / PMJJBY / PM-SYM / PM-JAY next — they need only age + bank account + income, no BOCW gate.
3. MahaBOCW registration — needs the 90-day gate; unlocks all BOCW benefits.
4. BOCW benefits (scholarship, marriage, health, tool-kit) — need *active* BOCW registration.
5. Majhi Ladki Bahin — independent state scheme for women; runs in parallel, not in the stack.
6. VB-G RAM G / MGNREGA — fallback wage work when construction work dries up.

```json
[
  {
    "id": "eshram",
    "name_en": "e-Shram Card",
    "name_mr": "ई-श्रम कार्ड",
    "benefit": "Gateway registration for unorganised workers. Unlocks access to PMSBY / PMJJBY / PM-SYM and state welfare.",
    "benefit_amount": null,
    "rules": [
      { "check_en": "Age 16–59", "check_mr": "वय १६–५९", "pass_if": "age >= 16 && age <= 59", "reason_pass_en": "Age {age} is within 16–59", "reason_fail_en": "Age {age} is outside 16–59" },
      { "check_en": "Unorganised-sector worker", "check_mr": "असंघटित कामगार", "pass_if": "occupation in [construction, gig/delivery, domestic, street-vending, agriculture, other-unorganised]", "reason_pass_en": "Unorganised work: {occupation}", "reason_fail_en": "Organised-sector job — e-Shram does not apply" },
      { "check_en": "Not an EPFO / ESIC member", "check_mr": "EPFO / ESIC सदस्य नाही", "pass_if": "epfo_esic == false", "reason_pass_en": "Not an EPFO/ESIC member — good", "reason_fail_en": "EPFO/ESIC member — not eligible for e-Shram" },
      { "check_en": "Not an income-tax payer", "check_mr": "आयकर भरणारा नाही", "pass_if": "income_tax_payer == false", "reason_pass_en": "Not an income-tax payer — good", "reason_fail_en": "Income-tax payer — not eligible for e-Shram" }
    ],
    "documents": ["Aadhaar — SHOW at the centre, never type the number into the app", "Bank account / Jan Dhan account details", "Mobile number"],
    "apply_at": "Nearest CSC / Setu Seva Kendra, or the e-Shram portal",
    "official_source": "VERIFY — confirm the e-Shram portal URL before shipping (expected: eshram.gov.in — unconfirmed in this packet)",
    "last_verified": "2026-11-21",
    "status": "verified-from-research"
  },
  {
    "id": "pmsby",
    "name_en": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    "name_mr": "प्रधानमंत्री सुरक्षा विमा योजना",
    "benefit": "Accident insurance — ₹2,00,000 cover for accidental death / disability. Premium ₹20/year (auto-debit from bank account).",
    "benefit_amount": "₹2,00,000 cover; ₹20/year premium",
    "rules": [
      { "check_en": "Age within the scheme window", "check_mr": "वय योजनेच्या मर्यादेत", "pass_if": "VERIFY — usual window 18–70 is unconfirmed in this packet; show '?' until checked", "reason_pass_en": "Age {age} — window to be confirmed at the official portal", "reason_fail_en": "Age {age} — window to be confirmed at the official portal" },
      { "check_en": "Has a bank account (auto-debit consent)", "check_mr": "बँक खाते आहे", "pass_if": "has_bank_account == true", "reason_pass_en": "Bank account available for ₹20/year auto-debit", "reason_fail_en": "No bank account — open a Jan Dhan account first" }
    ],
    "documents": ["Bank account details", "Aadhaar — SHOW at the centre, never type the number into the app"],
    "apply_at": "Your bank branch or nearest CSC",
    "official_source": "VERIFY — confirm the Jan Suraksha portal URL before shipping (expected: jansuraksha.gov.in — unconfirmed in this packet)",
    "last_verified": "2026-11-21",
    "status": "partially-verified — benefit and premium verified from research; age window VERIFY"
  },
  {
    "id": "pmjjby",
    "name_en": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    "name_mr": "प्रधानमंत्री जीवन ज्योती विमा योजना",
    "benefit": "Life insurance — ₹2,00,000 on death (any cause). Premium ₹436/year (auto-debit from bank account).",
    "benefit_amount": "₹2,00,000 cover; ₹436/year premium",
    "rules": [
      { "check_en": "Age within the scheme window", "check_mr": "वय योजनेच्या मर्यादेत", "pass_if": "VERIFY — usual window 18–50 is unconfirmed in this packet; show '?' until checked", "reason_pass_en": "Age {age} — window to be confirmed at the official portal", "reason_fail_en": "Age {age} — window to be confirmed at the official portal" },
      { "check_en": "Has a bank account (auto-debit consent)", "check_mr": "बँक खाते आहे", "pass_if": "has_bank_account == true", "reason_pass_en": "Bank account available for ₹436/year auto-debit", "reason_fail_en": "No bank account — open a Jan Dhan account first" }
    ],
    "documents": ["Bank account details", "Aadhaar — SHOW at the centre, never type the number into the app"],
    "apply_at": "Your bank branch or nearest CSC",
    "official_source": "VERIFY — confirm the Jan Suraksha portal URL before shipping (expected: jansuraksha.gov.in — unconfirmed in this packet)",
    "last_verified": "2026-11-21",
    "status": "partially-verified — benefit and premium verified from research; age window VERIFY"
  },
  {
    "id": "pmsym",
    "name_en": "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
    "name_mr": "प्रधानमंत्री श्रम योगी मानधन योजना",
    "benefit": "Pension — ₹3,000/month from age 60, for life. Voluntary, contributory: worker pays ₹55–₹200/month by entry age (18 yrs: ₹55; 20: ₹65; 25: ₹80; 30: ₹105; 35: ₹150; 40: ₹200) and the Government matches it equally.",
    "benefit_amount": "₹3,000/month pension from age 60",
    "rules": [
      { "check_en": "Entry age 18–40", "check_mr": "वय १८–४०", "pass_if": "age >= 18 && age <= 40", "reason_pass_en": "Age {age} is within 18–40", "reason_fail_en": "Age {age} is outside 18–40 — cannot newly join PM-SYM" },
      { "check_en": "Monthly income ₹15,000 or less", "check_mr": "मासिक उत्पन्न ₹१५,000 किंवा कमी", "pass_if": "monthly_income <= 15000", "reason_pass_en": "Monthly income ₹{income} is within the limit", "reason_fail_en": "Monthly income ₹{income} is above ₹15,000" },
      { "check_en": "Unorganised-sector worker", "check_mr": "असंघटित कामगार", "pass_if": "occupation in [construction, gig/delivery, domestic, street-vending, agriculture, other-unorganised]", "reason_pass_en": "Unorganised work: {occupation}", "reason_fail_en": "Organised-sector job — PM-SYM does not apply" },
      { "check_en": "Not covered by EPF / ESIC / NPS", "check_mr": "EPF / ESIC / NPS नाही", "pass_if": "epfo_esic == false && nps == false", "reason_pass_en": "Not covered by EPF/ESIC/NPS — good", "reason_fail_en": "Covered by EPF/ESIC/NPS — not eligible for PM-SYM" },
      { "check_en": "Not an income-tax payer", "check_mr": "आयकर भरणारा नाही", "pass_if": "income_tax_payer == false", "reason_pass_en": "Not an income-tax payer — good", "reason_fail_en": "Income-tax payer — not eligible for PM-SYM" }
    ],
    "documents": ["Aadhaar — SHOW at the centre, never type the number into the app", "Savings / Jan Dhan bank account with IFSC", "Mobile number"],
    "apply_at": "Nearest CSC, or the Maandhan portal",
    "official_source": "https://maandhan.in/ (named in PIB release 04 Mar 2025); PIB: https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2108082&reg=48&lang=2",
    "last_verified": "2026-11-21",
    "status": "verified — PIB, Govt. of India"
  },
  {
    "id": "pmjay",
    "name_en": "Ayushman Bharat PM-JAY",
    "name_mr": "आयुष्मान भारत PM-JAY",
    "benefit": "Health cover — ₹5,00,000 per family per year for hospitalisation.",
    "benefit_amount": "₹5,00,000/family/year health cover",
    "rules": [
      { "check_en": "Eligible household (deprived / SECC list, or 70+ senior citizen)", "check_mr": "पात्र कुटुंब", "pass_if": "VERIFY — eligibility route (SECC list / 70+ cover) is unconfirmed in this packet; show '?' with 'check at the portal' until verified", "reason_pass_en": "Eligibility to be confirmed at the official portal", "reason_fail_en": "Eligibility to be confirmed at the official portal" }
    ],
    "documents": ["Aadhaar — SHOW at the centre, never type the number into the app", "Family / ration details — VERIFY exact list at the portal"],
    "apply_at": "Nearest CSC / Setu Seva Kendra, or the PM-JAY portal",
    "official_source": "VERIFY — confirm the PM-JAY portal URL and eligibility route before shipping (expected: pmjay.gov.in — unconfirmed in this packet)",
    "last_verified": "2026-11-21",
    "status": "partially-verified — ₹5L cover verified from research; eligibility route VERIFY"
  },
  {
    "id": "mahabocw",
    "name_en": "MahaBOCW Registration (Bandhkam Kamgar Yojana)",
    "name_mr": "महाबोकॉव्ह नोंदणी (बांधकाम कामगार योजना)",
    "benefit": "Gateway to ALL Maharashtra construction-worker welfare benefits (scholarship, marriage, health, tool-kit aid, pension). Without active registration, none of them can be claimed.",
    "benefit_amount": null,
    "rules": [
      { "check_en": "Age 18–60", "check_mr": "वय १८–६०", "pass_if": "age >= 18 && age <= 60", "reason_pass_en": "Age {age} is within 18–60", "reason_fail_en": "Age {age} is outside 18–60" },
      { "check_en": "90-day gate: certificate of ≥90 days' construction work in the past 12 months", "check_mr": "९० दिवसांचे प्रमाणपत्र", "pass_if": "construction_days_last_12_months >= 90", "reason_pass_en": "✓ 90 days: {days} days shown", "reason_fail_en": "✗ Only {days} of 90 days — {90 - days} days short. Work {90 - days} more days and get the certificate from your contractor." },
      { "check_en": "Construction worker in Maharashtra", "check_mr": "महाराष्ट्रातील बांधकाम कामगार", "pass_if": "occupation == construction && state == Maharashtra", "reason_pass_en": "Construction work in Maharashtra", "reason_fail_en": "Not construction work in Maharashtra — BOCW does not apply (try e-Shram instead)" }
    ],
    "documents": ["90-day work certificate (from employer / contractor)", "Aadhaar — SHOW at the centre, never type the number into the app", "Bank account details (Aadhaar-seeded, for DBT)", "Age proof", "Passport-size photos"],
    "apply_at": "mahabocw.in (IWBMS portal) or nearest Taluka Worker Facilitation Centre",
    "official_source": "mahabocw.in — named in multiple sources incl. https://aimindia.in/bandhkam-kamgar-yojana/",
    "last_verified": "2026-11-21",
    "status": "verified-from-research — 90-day gate and 18–60 age verified; registration fee VERIFY (sources conflict: ₹25 initial + ₹1/year renewal vs renewal free since Aug 2025)"
  },
  {
    "id": "bocw-scholarship",
    "name_en": "BOCW Children's Scholarship",
    "name_mr": "बांधकाम कामगार मुलांची शिष्यवृत्ती",
    "benefit": "Annual scholarship for the worker's children (first two children). Amount VERIFY — sources conflict (see verify note). The app shows ELIGIBILITY ONLY, never a ₹ figure, until the amount is re-checked at mahabocw.in.",
    "benefit_amount": "VERIFY — DO NOT SHOW A ₹ FIGURE. Older class-wise figures (Class 1–7 ₹2,500; 8–10 ₹5,000; 11–12 ₹10,000; degree ₹20,000; engineering ₹60,000; medical ₹1,00,000) conflict with the 13 July 2026 GRs (Class 9 pass ₹20,000; Class 11 pass ₹25,000; medical ₹1,00,000/yr; engineering ₹60,000/yr).",
    "rules": [
      { "check_en": "Active MahaBOCW registration", "check_mr": "सक्रिय महाबोकॉव्ह नोंदणी", "pass_if": "mahabocw_registered == true && registration_active == true", "reason_pass_en": "Registration active — scholarship can be claimed", "reason_fail_en": "No active BOCW registration — register first (see MahaBOCW step)" },
      { "check_en": "Child in school / college (first two children)", "check_mr": "मूल शाळेत / महाविद्यालयात (पहिली दोन मुले)", "pass_if": "school_children >= 1", "reason_pass_en": "{n} school-going child(ren) — first two covered", "reason_fail_en": "No school-going children" }
    ],
    "documents": ["Child's school / college bonafide certificate + marksheet", "Worker's active BOCW registration", "Bank account details"],
    "apply_at": "mahabocw.in or nearest Taluka Worker Facilitation Centre",
    "official_source": "mahabocw.in — amounts VERIFY at the portal; conflict noted above",
    "last_verified": "2026-11-21",
    "status": "VERIFY — benefit amount"
  },
  {
    "id": "bocw-marriage",
    "name_en": "BOCW Marriage Assistance",
    "name_mr": "बांधकाम कामगार विवाह सहाय्य",
    "benefit": "One-time marriage assistance for the worker's own/first marriage or a daughter's marriage. Amount VERIFY — sources conflict (₹30,000 self/first marriage in two sources; ₹51,000 daughter's marriage in one; ₹25,000 in another). Show ELIGIBILITY ONLY, never a ₹ figure, until re-checked.",
    "benefit_amount": "VERIFY — DO NOT SHOW A ₹ FIGURE",
    "rules": [
      { "check_en": "Active MahaBOCW registration", "check_mr": "सक्रिय महाबोकॉव्ह नोंदणी", "pass_if": "mahabocw_registered == true && registration_active == true", "reason_pass_en": "Registration active — marriage assistance can be claimed", "reason_fail_en": "No active BOCW registration — register first" },
      { "check_en": "First marriage (self or daughter)", "check_mr": "पहिले लग्न", "pass_if": "marriage_event == first", "reason_pass_en": "First marriage — covered", "reason_fail_en": "Not a first marriage — check the portal for what applies" }
    ],
    "documents": ["Marriage invitation / certificate — VERIFY exact list at the portal", "Worker's active BOCW registration", "Bank account details"],
    "apply_at": "mahabocw.in or nearest Taluka Worker Facilitation Centre",
    "official_source": "mahabocw.in — amounts VERIFY at the portal",
    "last_verified": "2026-11-21",
    "status": "VERIFY — benefit amount"
  },
  {
    "id": "bocw-health",
    "name_en": "BOCW Health & Maternity Assistance",
    "name_mr": "बांधकाम कामगार आरोग्य व प्रसूती सहाय्य",
    "benefit": "Health and maternity assistance for registered workers. Amount VERIFY — sources conflict (maternity ₹15,000 normal / ₹20,000 C-section in older sources; ₹25,000 one-time in the 13 July 2026 GRs; medical expenses ₹5,000–₹20,000 in another). Show ELIGIBILITY ONLY, never a ₹ figure, until re-checked.",
    "benefit_amount": "VERIFY — DO NOT SHOW A ₹ FIGURE",
    "rules": [
      { "check_en": "Active MahaBOCW registration", "check_mr": "सक्रिय महाबोकॉव्ह नोंदणी", "pass_if": "mahabocw_registered == true && registration_active == true", "reason_pass_en": "Registration active — health/maternity assistance can be claimed", "reason_fail_en": "No active BOCW registration — register first" },
      { "check_en": "Female worker, or wife of a male worker (maternity)", "check_mr": "महिला कामगार / कामगाराची पत्नी", "pass_if": "VERIFY — exact maternity eligibility wording unconfirmed in this packet", "reason_pass_en": "Maternity eligibility to be confirmed at the portal", "reason_fail_en": "Maternity eligibility to be confirmed at the portal" }
    ],
    "documents": ["Hospital / delivery records — VERIFY exact list at the portal", "Worker's active BOCW registration", "Bank account details"],
    "apply_at": "mahabocw.in or nearest Taluka Worker Facilitation Centre",
    "official_source": "mahabocw.in — amounts VERIFY at the portal",
    "last_verified": "2026-11-21",
    "status": "VERIFY — benefit amount and maternity wording"
  },
  {
    "id": "bocw-toolkit",
    "name_en": "BOCW Tool-Kit Aid",
    "name_mr": "बांधकाम कामगार साधनसंचयी सहाय्य",
    "benefit": "One-time ₹5,000 aid to buy essential work tools (once every 5 years, per one source). This is the demo's moving number — it is the most consistently reported BOCW figure.",
    "benefit_amount": "₹5,000 one-time",
    "rules": [
      { "check_en": "Active MahaBOCW registration", "check_mr": "सक्रिय महाबोकॉव्ह नोंदणी", "pass_if": "mahabocw_registered == true && registration_active == true", "reason_pass_en": "Registration active — ₹5,000 tool-kit aid can be claimed", "reason_fail_en": "No active BOCW registration — register first" }
    ],
    "documents": ["Worker's active BOCW registration", "Bank account details"],
    "apply_at": "mahabocw.in or nearest Taluka Worker Facilitation Centre",
    "official_source": "mahabocw.in — ₹5,000 figure in https://aimindia.in/bandhkam-kamgar-yojana/ and https://pmyojanah.com/bandhkam-kamgar-yojana/ (one other source says ₹10,000–₹15,000; the ₹5,000 figure is the most repeated — re-check at the portal before submitting)",
    "last_verified": "2026-11-21",
    "status": "verified-from-research — re-check at portal before submitting"
  },
  {
    "id": "ladki-bahin",
    "name_en": "Mukhyamantri Majhi Ladki Bahin Yojana",
    "name_mr": "मुख्यमंत्री माझी लाडकी बहीण योजना",
    "benefit": "₹1,500/month direct benefit transfer to eligible women in Maharashtra.",
    "benefit_amount": "₹1,500/month",
    "rules": [
      { "check_en": "Woman, Maharashtra resident, age 21–65", "check_mr": "महिला, महाराष्ट्र रहिवासी, वय २१–६५", "pass_if": "gender == female && state == Maharashtra && age >= 21 && age <= 65", "reason_pass_en": "Woman, 21–65, Maharashtra resident", "reason_fail_en": "Outside 21–65, or not a Maharashtra resident" },
      { "check_en": "Family annual income below ₹2.5 lakh", "check_mr": "कुटुंबाचे वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी", "pass_if": "family_income_yearly < 250000", "reason_pass_en": "Family income below ₹2.5 lakh", "reason_fail_en": "Family income above ₹2.5 lakh" },
      { "check_en": "Aadhaar-linked bank account in her own name", "check_mr": "आधार-संलग्न बँक खाते", "pass_if": "aadhaar_linked_bank == true", "reason_pass_en": "Aadhaar-linked bank account available", "reason_fail_en": "No Aadhaar-linked bank account — link it first" },
      { "check_en": "Not a government employee / income-tax-payer family", "check_mr": "सरकारी नोकरी / आयकर नाही", "pass_if": "govt_employee_family == false && income_tax_payer == false", "reason_pass_en": "No government employment / income-tax in the family", "reason_fail_en": "Government employment or income-tax in the family — not eligible" }
    ],
    "documents": ["Aadhaar — SHOW at the centre, never type the number into the app", "Bank account in her own name (Aadhaar-linked)", "Income certificate", "Domicile / residence proof"],
    "apply_at": "ladakibahin.maharashtra.gov.in — BUT READ THE FLAG: new-applications window status is VERIFY (one June 2026 source says no fresh online window had been announced; eKYC deadlines have passed). In the app, show this scheme ONLY as 'already enrolled? keep your eKYC current' — NEVER as a new-application route until the window is re-verified at the portal.",
    "official_source": "https://ladakibahin.maharashtra.gov.in/ and https://womenchild.maharashtra.gov.in/index.php/en/schemes/mukhyamantri-mazi-ladki-bahin-yojana — ₹1,500/month, 21–65, income < ₹2.5 lakh verified (Indian Express + Maharashtra WCD Dept)",
    "last_verified": "2026-11-21",
    "status": "verified — benefit and eligibility; new-application window VERIFY"
  },
  {
    "id": "vbg-ramg-mgnrega",
    "name_en": "VB-G RAM G / MGNREGA (fallback wage work)",
    "name_mr": "व्हीबी-जी राम जी / मनरेगा (पर्यायी मजुरी)",
    "benefit": "Guaranteed wage employment for rural households — the fallback when construction work dries up. This is the safety net at the bottom of the stack, not a benefit to chase first.",
    "benefit_amount": "VERIFY — do not show a wage rate or number of days until checked at the official portal",
    "rules": [
      { "check_en": "Rural household", "check_mr": "ग्रामीण कुटुंब", "pass_if": "area == rural", "reason_pass_en": "Rural household", "reason_fail_en": "Urban household — MGNREGA does not apply" },
      { "check_en": "Adult member willing to do unskilled manual work", "check_mr": "प्रौढ सदस्य अकुशल काम करण्यास तयार", "pass_if": "willing_unskilled_work == true", "reason_pass_en": "Willing to do unskilled work", "reason_fail_en": "Not willing / not applicable" }
    ],
    "documents": ["Job card — VERIFY exact list at the portal", "Aadhaar — SHOW at the centre, never type the number into the app", "Bank account details"],
    "apply_at": "Gram Panchayat",
    "official_source": "VERIFY — confirm portal and current wage/days before shipping",
    "last_verified": "2026-11-21",
    "status": "VERIFY — wage rate and days"
  }
]
```

**How the app must use this JSON:** the rule engine reads `rules[]` and evaluates `pass_if` against the structured profile. `benefit_amount` values marked VERIFY are **never rendered as numbers** — the UI shows the scheme name + "likely eligible — amount to be confirmed at the portal" instead. The demo's moving ₹ number comes ONLY from `bocw-toolkit` (₹5,000) plus the words "scholarship eligibility unlocked" (no figure).

---

## 4. The 3 personas (one-tap — fictional samples, label them as such in the app)

Every persona is a **fictional sample for the demo**. The app must label them "नमुना व्यक्ती — Sample persona" and never claim a real person was helped. Persona inputs are the exact values the demo uses.

### Persona 1 — Ramesh (the demo hero)
- **Name / age / work / place:** Ramesh, 41, mason (गवंडी), Nagpur.
- **Story (Marathi):** "मी रमेश. मी ४१ वर्षांचा आहे. मी नागपूरमध्ये गवंडी काम करतो. गेल्या वर्षी मी ८२ दिवस काम केले. माझी दोन मुले शाळेत जातात."
- **Demo inputs:** age 41 · construction, Maharashtra · bank account: yes · EPFO/ESIC: no · income-tax payer: no · monthly income ₹12,000 (sample) · married: yes · school-going children: 2 (Class 9 and Class 5 — sample) · BOCW registered: no (not yet).
- **Two states — the packet's key design decision:**
  - **BEFORE (opens the story):** 82 days in the past 12 months → the 90-day gate is **blocked, 8 days short**. The agent tells him exactly what to do: work 8 more days, get the certificate from his contractor, then apply. This is the pitch's opening — "nobody told him".
  - **AFTER (the 60-second demo, §7):** new certificate shows **96 days** in the past 12 months → the gate **clears**. The demo uses the AFTER state for the red → green moment. Never mix the two states on one screen.
- **AFTER-state outcomes:** e-Shram ✓ · PMSBY ✓ (age window VERIFY — show "?") · PMJJBY ✓ (age window VERIFY — show "?") · PM-SYM ✓ (41 is outside 18–40 entry → **✗ — show this honestly: "PM-SYM: too late to join at 41; your ₹3,000/month pension route is BOCW pension instead — VERIFY at the portal"**) · PM-JAY ? (eligibility VERIFY) · MahaBOCW ✓ (96 days, age 41) · tool-kit aid **₹5,000 unlocked** · scholarship eligibility unlocked (no ₹ figure) · marriage assistance: not applicable now · Ladki Bahin ✗ (not a woman) · MGNREGA fallback: not needed.
- **Note the PM-SYM ✗:** Ramesh at 41 cannot newly join PM-SYM (entry 18–40). Showing a fail honestly is a strength — it proves the engine is real and it is exactly the kind of per-rule reasoning judges reward. Do not hide it.

### Persona 2 — Delivery rider (the gate fails honestly)
- **Name / age / work / place:** Arjun (sample name), 24, platform delivery rider, Nagpur.
- **Story (Marathi):** "मी अर्जुन. मी २४ वर्षांचा आहे. मी नागपूरमध्ये डिलिव्हरीचे काम करतो. माझे महिन्याचे उत्पन्न सुमारे ₹१२,००० आहे."
- **Demo inputs:** age 24 · gig/delivery work (not construction), Maharashtra · bank account: yes · EPFO/ESIC: no · income-tax payer: no · monthly income ₹12,000 (sample) · construction days in past 12 months: 0.
- **Outcomes:** e-Shram ✓ · PMSBY ✓ (age window VERIFY — "?") · PMJJBY ✓ (age window VERIFY — "?") · PM-SYM ✓ (24, income ≤ ₹15,000; contribution ₹80/month at age 25 — show the nearest band, labelled as the age-25 figure) · PM-JAY ? (eligibility VERIFY) · **MahaBOCW ✗ — 0 construction days: the gate fails, and the app says so plainly** ("तुम्ही बांधकाम कामगार नाही — BOCW तुमच्यासाठी नाही; e-Shram हाच तुमचा मार्ग आहे") · Ladki Bahin ✗ · MGNREGA fallback: not needed (urban).
- **Why include him:** he proves the engine is not a "everyone passes" toy. A judge who taps the second persona and sees a real ✗ trusts the first persona's ✓.

### Persona 3 — Woman construction worker (the full stack clears)
- **Name / age / work / place:** Sunita (sample name), 35, construction worker (helper/mason), Nagpur.
- **Story (Marathi):** "मी सुनीता. मी ३५ वर्षांची आहे. मी नागपूरमध्ये बांधकामावर काम करते. गेल्या वर्षी मी १२० दिवस काम केले. माझी दोन मुले शाळेत जातात."
- **Demo inputs:** age 35 · construction, Maharashtra · bank account: yes (own name, Aadhaar-linked) · EPFO/ESIC: no · income-tax payer: no · monthly income ₹10,000 (sample) · married: yes · school-going children: 2 (sample) · construction days in past 12 months: 120 · family income < ₹2.5 lakh/year (sample).
- **Outcomes:** e-Shram ✓ · PMSBY ✓ (age window VERIFY — "?") · PMJJBY ✓ (age window VERIFY — "?") · PM-SYM ✓ (35, income ≤ ₹15,000; contribution ₹150/month at age 35) · PM-JAY ? (eligibility VERIFY) · MahaBOCW ✓ (120 days) · tool-kit aid **₹5,000 unlocked** · scholarship eligibility unlocked (no ₹ figure) · health/maternity eligibility ✓ (amount VERIFY — no ₹ figure) · **Ladki Bahin: "already enrolled? keep your eKYC current" — NEVER offer it as a new application** (window VERIFY, §3) · MGNREGA fallback: not needed.

---

## 5. The agent flow, step by step

**The shape (winning pattern #1):** the user does ONE thing (tells their story / taps a persona); the agent does the multi-step job (read → check → prove → draft → remind). The demo is the agent working, not a dashboard.

| Step | What the user does | What the agent does | What shows on screen |
|---|---|---|---|
| 1. Open | Taps a persona (or tells their story via chips) | Loads the structured profile | Home screen: persona card + Marathi greeting (§6) |
| 2. Story → profile | Confirms the chips (work, days, age, family, bank) | Parses the story into the structured profile; shows the profile back for confirmation ("मी हे समजलो — बरोबर आहे का?" / "This is what I understood — is it right?") | Profile summary card, editable before continuing |
| 3. Rule check | Taps "माझ्या योजना तपासा" ("Check my schemes") | Runs the 12 JSON rules (§3) in stack order; each rule returns ✓ / ✗ / ? with its reason | Per-rule reasoning list in Marathi + English; "?" rules say what to check, never a guess |
| 4. **Gate-proof moment** | Uploads / taps the sample certificate photo | Extracts the values (days worked, dates, issuer) — **and shows the photo crop next to EACH extracted value** | Left: cropped photo region. Right: extracted value + "हे बरोबर आहे का?" ("Is this right?") confirm buttons. Then the gate verdict |
| 5. Gate verdict | Confirms the extracted values | Computes the 90-day gate from the confirmed values only | **Gate flips red → green** (or stays red with the exact shortfall: "८ दिवस कमी आहेत" / "8 days short") |
| 6. ₹ unlocked | — | Sums only VERIFIED amounts | **The number moves on screen: ₹5,000 tool-kit aid** + "scholarship eligibility unlocked" (words, no figure) + renewal date that protects it |
| 7. Document quest | Taps each document to tick it off | Shows where / cost / days / appeal officer per document | Quest checklist (6 documents below) + progress bar + "pack ready" state |
| 8. Pack + renewal | Taps "माझा अर्ज पॅक छापा" ("Print my application pack") | Generates the printable pack (profile + verdicts + checklist + steps + where to check status) and starts the renewal countdown from the registration date | Printable pack + renewal ring ("नूतनीकरणाला X दिवस बाकी" / "X days to renewal"), saved in localStorage |

### The 6 documents in the quest
1. **90-day work certificate** — from: employer / contractor. Cost: VERIFY (usually free from the employer — do not state a fee). Days: VERIFY. Note: this is the gate document; without it nothing else moves.
2. **Aadhaar card** — SHOW at the centre only. **Never type the Aadhaar number into the app, never store it.** The app records only "shown ✓" — no number, no photo of the number side.
3. **Bank passbook / account details** — Aadhaar-seeded account, for DBT. Where: your bank branch. Cost: none for the passbook itself (VERIFY).
4. **Income certificate** — where: Nagpur tahsil / Setu Seva Kendra / Aaple Sarkar portal. Cost **₹50**. Days **15**. Issued by: Naib Tahsildar. First appeal: Tahsildar. Second appeal: SDO. (Verified in the research files.)
5. **Age proof** — e.g. birth certificate / school leaving certificate. Where: as applicable. Cost/days: VERIFY.
6. **Passport-size photos** — 2–4 copies (VERIFY exact count at the portal). Where: any photo studio.

### The honesty rule (non-negotiable)
- **Show the crop next to each extracted value, never a bare "verified ✓".** If the extraction cannot be shown with its crop, the value is "?" (unconfirmed), not ✓.
- If the LLM/photo step fails or is unavailable, the deterministic rule engine still produces every verdict from the typed profile, and the agent text degrades to templates. The app never invents an extracted value.
- Sample personas and sample documents are labelled "नमुना / Sample" on screen. Never claim a real person was helped.

---

## 6. Marathi UI copy

Marathi first, English alongside. Toggle: मराठी / English, Marathi default. Use Devanagari digits in Marathi strings (८२, ९०, ५,०००).

| Where | Marathi | English |
|---|---|---|
| App name | कामगारसाथी | KamgarSaathi — a friend for the worker |
| Welcome | नमस्कार! मी कामगारसाथी आहे. तुमची गोष्ट सांगा — कोणत्या योजना मिळतील, का मिळतील, आणि काय आणायचे, ते सांगतो. | Hello! I am KamgarSaathi. Tell me your story — I'll tell you which schemes you'll get, why, and what to bring. |
| Story prompt | तुम्ही काय काम करता? गेल्या १२ महिन्यांत किती दिवस काम केले? | What work do you do? How many days did you work in the last 12 months? |
| Check my schemes (button) | माझ्या योजना तपासा | Check my schemes |
| Profile confirmation | मी हे समजलो — बरोबर आहे का? | This is what I understood — is it right? |
| Gate verdict — pass | दार उघडले! ९० दिवस पूर्ण — तुम्ही पात्र आहात. | Gate open! 90 days complete — you are eligible. |
| Gate verdict — fail | अजून ८ दिवस बाकी आहेत. | 8 days still remain. |
| Gate verdict — near | फक्त ८ दिवस कमी आहेत. | Only 8 days short. |
| Rule pass | पात्र — कारण: … | Likely eligible — because: … |
| Rule fail | पात्र नाही — कारण: … | Not eligible — because: … |
| Rule unknown | तपासा — … | Check — … |
| "Likely eligible" (use everywhere, never "guaranteed") | बहुधा पात्र | Likely eligible |
| Money unlocked | तुमच्यासाठी उघडलेले पैसे | Money unlocked for you |
| Document checklist title | कागदपत्रांची यादी | Document checklist |
| Print my pack (button) | माझा अर्ज पॅक छापा | Print my application pack |
| Renewal countdown | नूतनीकरणाला X दिवस बाकी | X days to renewal |
| Renewal warning | नोंदणी संपली तर फायदे थांबतात — वेळेवर नूतनीकरण करा. | If registration lapses, benefits stop — renew on time. |
| Sample label | नमुना व्यक्ती | Sample persona |
| Check status | स्थिती तपासा | Check status |
| Confirm extraction | हे बरोबर आहे का? | Is this right? |
| Pack ready | तुमचा पॅक तयार आहे! | Your pack is ready! |
| What to bring, where, by when | काय आणायचे, कुठे, आणि कधीपर्यंत | What to bring, where, and by when |

**Copy rules for the IDE prompts:** Marathi is the primary language; every Marathi string has its English next to it in the strings file. Never show a scheme as "guaranteed" — always "बहुधा पात्र / likely eligible". Never ask for or display an Aadhaar number. Keep sentences short; the user may be reading on a shared basic phone.

---

## 7. Demo script (60 seconds)

The demo uses **Ramesh, AFTER state (96 days)**. It opens on the story, not on a scheme list. Rehearse it twice before recording the LinkedIn video.

| Time | Beat | What the judge sees | What you say (one line) |
|---|---|---|---|
| 0–8s | The person | Ramesh's card: "रमेश, ४१, गवंडी, नागपूर — ८२ दिवस" and his Marathi story. | "Ramesh is a 41-year-old mason from Nagpur. Last year he worked 82 days — and nobody told him he needs 90." |
| 8–20s | The agent reads | Certificate photo uploads; the agent extracts "९६ दिवस" — **the crop shown next to the number**. | "His new certificate says 96 days. The agent shows you the crop it read it from — nothing hidden." |
| 20–32s | The gate flips | **Gate flips red → green.** Per-rule reasons appear: "✓ 90 days: 96 days shown". | "The gate clears. And look — the rules show their work, in Marathi." |
| 32–45s | The number moves | **₹5,000 tool-kit aid appears** + "scholarship eligibility unlocked" + the renewal ring. | "Five thousand rupees unlocked, his children's scholarship eligible — and a renewal date that protects it." |
| 45–55s | The pack | Document quest: 6 documents, where/cost/days, printable pack. | "And exactly what to bring, where, and by when — a pack he can print and take to the centre." |
| 55–60s | The close | Renewal countdown + the stack order (e-Shram → insurance → BOCW). | "One worker, one agent, three gates. That is KamgarSaathi." |

**If anything breaks live:** fall back to the BEFORE state (82 days, gate blocked, agent's exact instructions) — it is still a complete, honest demo. Never re-run a failed extraction and pretend it worked.

---

## 8. The pitch (for the submission + jury)

**Problem (30 seconds):** Maharashtra has ~17.5 lakh construction workers. The money exists — BOCW benefits, scholarships, tool-kit aid — but it does not reach them, because the path is blocked by gates nobody explains: a 90-day work certificate, an annual renewal that quietly lapses, and a claim order nobody tells them. The official portal is a bare 3-question check. So workers depend on middlemen who charge for help that should be free. Nationally, e-Shram has 31.89 crore registrations — but only ~11.5 lakh platform/gig workers are registered. The unregistered gap is the market.

**Mechanism (30 seconds):** KamgarSaathi is not another scheme list. It is a gate agent: the worker tells their story in Marathi; the agent proves the 90-day gate from a certificate photo (crop shown next to every value); it runs 12 real schemes as editable rules with per-rule reasoning; it orders the claims (e-Shram → insurance/pension → BOCW → BOCW benefits); and it guards the renewal with a countdown. The differentiator is the gates + renewal clock + stack order — no Devpost/GitHub scheme-finder targets construction/gig workers.

**Payer — name them explicitly (this is the Business score):** the workers do not pay. The payers are **CSC / Setu Seva Kendra operators** (they earn per onboarding — an operator keeps ₹32.50 of every ₹50 service fee under Maharashtra's 27 Mar 2025 resolution, so an agent that cuts sent-back applications is money in their pocket) and **contractors doing bulk onboarding** of their workers, plus unions and CSR/welfare boards as the scale channel. Say this sentence in the pitch, verbatim if needed: *"The worker never pays. The Setu operator and the contractor pay — because every worker the agent gets past the gate is a completed onboarding they earn on."* If the pitch does not name the payer, the Business score drops from 8 to 6 and the overall falls from 8.55 to ~8.15.

**Scale (the numbers, all verified in the research files):** ~17.5 lakh construction workers in Maharashtra · 31.89 crore e-Shram registrations nationally · only ~11.5 lakh platform workers registered — the gap is the market · ₹5,000 tool-kit aid is the verified per-worker figure the demo moves.

**The proof-point gap (say it honestly):** the one thing this pitch does not yet have is a named real-world user. One 10-minute call with a CSC/Setu operator or a contractor (§9) turns "plausible problem" into "verified problem with a named first user" — the lever from 8.55 to ~8.7. If the call happens, name them in the pitch (with permission). If it does not, do not invent a user — say "first user: a Nagpur Setu operator, conversation scheduled" only if it is true.

---

## 9. The 10-minute phone-call script (the proof point)

**Who to call (in order):** (1) a CSC / Setu Seva Kendra operator in Nagpur — best, because they are the named payer; (2) a building contractor who employs masons/helpers — second best, bulk-onboarding payer; (3) a union representative for construction workers — acceptable. Do NOT call a random worker and present them as a "user" — the proof point is the operator/contractor confirming the gate problem, not a testimonial.

**Before the call:** explain in one line who you are and why you are calling: "I am a Nagpur developer building a free tool that helps construction workers get their government benefits. I need 10 minutes to check I am solving a real problem — I am not selling anything."

**The 5 questions (ask all five, in this order):**
1. "In a typical week, how many construction workers come to you asking about government schemes — and what do they ask for first?" *(You want a number and the top ask.)*
2. "When a construction worker's BOCW application gets stuck or rejected, what is the most common reason?" *(Listen for: 90-day certificate, lapsed registration, wrong documents.)*
3. "Do workers know about the 90-day work certificate before they apply? What happens when they don't have it?" *(This is the gate — you want their words.)*
4. "What happens when a worker's BOCW registration lapses — do they come back, and what does renewal involve for you?" *(This is the renewal clock — you want the pain described.)*
5. "If an app told a worker exactly which documents to bring, in which order, before they reached your counter — would you use it, and what would it be worth to you per worker or per month?" *(This is the payer test — you want a yes/no and a number, not a polite "nice idea".)*

**What counts as a usable quote (all three needed):**
- A **name + role + place**, with explicit permission to use it in the pitch ("Can I name you as the operator who told me this?").
- A **specific number or story** — e.g. "8 out of 10 workers who come to me don't have the 90-day certificate" or "I send back 5 applications a week for lapsed registration".
- A **yes/no on use and pay** — "Yes, I would use it" and ideally a price ("₹20 per worker" / "₹500 a month").
- If they decline to be named: use role + area only ("a Setu operator in Nagpur told me…") — never invent a name.
- If the call does not happen: do NOT invent a user. The pitch says the problem is documented (17.5 lakh workers, bare portal) and the first user conversation is pending.

---

## 10. LinkedIn post draft

Post **during the build (23 Nov)** with a native video of the demo (the gate flipping red → green and the ₹ number appearing). Tag Codebenders. Label the persona as a sample — never claim a real person was helped.

**Draft:**

> Ramesh has laid bricks for 82 days. He needs 90 — and nobody told him — to unlock his children's scholarship and a ₹5,000 tool-kit grant.
>
> Maharashtra has ~17.5 lakh construction workers. The money exists. What blocks it isn't eligibility — it's gates nobody explains: a 90-day work certificate, a renewal that quietly lapses, and a claim order nobody tells them. The official portal is a 3-question check.
>
> So I built KamgarSaathi for ACE Builders 2026: a Marathi-first agent that reads a worker's story, proves the 90-day gate from their certificate photo (showing the crop it read, not a bare "verified"), runs 12 real schemes as editable rules with the reasoning shown, and tells them exactly what to bring, where, and by when.
>
> The worker never pays. The Setu operator and the contractor pay — because every worker the agent gets past the gate is a completed onboarding they earn on.
>
> Built solo in the Codebenders IDE. Demo personas are samples. PS5 — Claim What's Yours.
>
> #Codebenders #ACEBuilders #BuildWithAI #AIGlobalHackathon @Codebenders

**Honesty notes for the post:** the video must be the real app running (screen recording, not a mockup). The ₹5,000 figure is the verified tool-kit aid; do not put a ₹ figure on the scholarship in the post (amount VERIFY, §3). Do not claim any real worker was helped. Do not mention Karnataka gig-worker law.

---

## 11. Submission checklist

- [ ] **Public repo** with an **open-source licence** (MIT recommended — permissive; never GPL/AGPL/LGPL in this entry). Licence file committed, not just mentioned in the README.
- [ ] **Working app link** — deployed as a static app (GitHub Pages). Test the link in a fresh browser with no login, on mobile data if possible. The app must work with zero backend.
- [ ] **PRD + architecture + generated tests + API docs in the repo** — the Codebenders build loop, visible. This is the "Use of Codebenders Platform" evidence.
- [ ] **Problem statement: PS5 only** — the submission names one statement. Do not mention other statements anywhere in the repo or pitch.
- [ ] **LinkedIn post** — posted 23 Nov with the demo video, hashtags #Codebenders #ACEBuilders #BuildWithAI #AIGlobalHackathon, Codebenders tagged.
- [ ] **Project name + description + team details** filled in on the submission form (solo, Ronit Shrimankar).
- [ ] **Token reserve** — ~25% of the 8,000,000 tokens kept for the final fix pass; check the dashboard before the last generation. Tokens expire Sun 22 Nov 23:59 IST.
- [ ] **No secrets in the repo** — no API keys, no Aadhaar numbers, no real personal data. Any runtime LLM key is yours, in env, never committed. Run a secret scan before pushing.
- [ ] **All VERIFY items re-checked** — BOCW scholarship/marriage/health amounts, PMSBY/PMJJBY age windows, PM-JAY eligibility route, Ladki Bahin new-application window, MGNREGA wage/days, e-Shram/Jan Suraksha/PM-JAY portal URLs. Anything still VERIFY shows "?" in the app, never a guessed value.
- [ ] **Demo rehearsed twice** — the 60-second script (§7) plus the fallback (BEFORE state, 82 days) if the photo step fails live.
- [ ] **Submit in the window: 23–24 Nov.** Do not submit before the window opens; do not leave it to the last hour.

---

## 12. Risks to avoid

1. **The Business-score trap.** The single biggest scoring risk. If the pitch does not name the payer (CSC/Setu operators + contractors), Business drops 8 → 6 and the overall falls 8.55 → ~8.15. Say the payer sentence (§8) out loud in the pitch and on the submission description.
2. **The fake-proof trap.** If the certificate-photo extraction looks faked, the whole agent story collapses. Show the crop next to each extracted value; confirm before verdict; never a bare "verified ✓". If the photo step cannot be shown honestly, cut it and demo the typed-profile flow instead.
3. **Karnataka gig-worker law — DO NOT USE.** Wrong state, and the benefits do not exist yet (Karnataka's Platform-Based Gig Workers Act 2025 is being challenged in court; no scheme distributes the money). Maharashtra gig workers' real route is central e-Shram + the Code on Social Security 2020 — which is what this app encodes. Never cite Karnataka law in the app, pitch, or post.
4. **Never collect Aadhaar numbers or other sensitive IDs.** Aadhaar is show-only at the centre. The app stores no Aadhaar number, no bank account number, no photo of an ID. This is a PS5 guardrail and a trust point — say it in the pitch.
5. **"Likely eligible", never "guaranteed".** Every verdict in the app, the pitch, and the post uses "बहुधा पात्र / likely eligible". A scheme match is a reasoned likelihood, not a promise.
6. **No ₹ figure you have not verified.** The demo's moving number is ₹5,000 (tool-kit aid) only. Scholarship, marriage, health, and MGNREGA amounts are VERIFY — show eligibility in words, never a number, until re-checked at mahabocw.in.
7. **Ladki Bahin is not a new-application route in this app.** New-applications window status is VERIFY. Show it only as "already enrolled? keep your eKYC current". Do not build a flow that re-enrols people into a possibly closed scheme.
8. **The split weekend.** You are at the hackFront finale until Sunday noon. If ACE only gets a few tired hours, no idea wins — and forcing it risks the finale. Build demo-first, cut everything in §2's cut list, and stop at a working 60-second demo rather than a complete product.
9. **Clone risk.** A generic national scheme chatbot is a rebuild (6–8 Sahayak clones exist on Devpost, zero verified wins). The defence is the mechanism: gates + renewal clock + stack order + one group in one state. If the app drifts generic, it loses.
10. **Token expiry.** 8,000,000 tokens expire Sun 22 Nov 23:59 IST. The fix-pass reserve (§11) is not optional — a broken demo with no tokens left to fix it is worse than a smaller demo.

---

*Packet written 21 Nov 2026 from `ace-first-place-plays.md` (Play 1) and `ace-ideas-near-10.md` (KamgarSaathi §2), plus web checks the same day (PIB for PM-SYM; Indian Express + Maharashtra WCD Dept for Majhi Ladki Bahin; aimindia.in / pmyojanah.com / sarkariyojana.com for BOCW benefits). Facts marked VERIFY were unconfirmed at writing — re-check them at the official portals before submitting. Nothing in this packet is app code to paste as a finished product; it is the spec, data, and copy for Ronit to build from inside the Codebenders IDE.*
