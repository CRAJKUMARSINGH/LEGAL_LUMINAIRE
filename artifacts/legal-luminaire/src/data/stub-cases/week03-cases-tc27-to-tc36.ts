/**
 * WEEK 03 — TRAE — Stub Cases TC-27 to TC-36
 * Public law, arbitration, execution, injunction and pleading-state transitions
 * Source: SUPPLEMENT/WEEK_03_TRAE.md
 *
 * Accuracy rules: All precedents marked SECONDARY / PENDING — verify on SCC Online before filing.
 * Holdings are DEMO PLACEHOLDERS — obtain verbatim text from certified copies.
 * ALL DATA IS SYNTHETIC / DEMO — not legal advice.
 */

// ─────────────────────────────────────────────────────────────────────────
// TC-27 — Municipality refuses occupancy certificate (Writ / Mandamus)
// ─────────────────────────────────────────────────────────────────────────
export const TC27_META = {
  id: "tc27",
  title: "Occupancy Certificate Refusal — Unpublished Checklist Mandamus",
  caseNo: "SB Civil Writ Petition No. ____/2026",
  court: "Rajasthan High Court, Jaipur Bench (Writ Bench)",
  charges: "Art. 226 Constitution + Municipal Corporation Act",
  accused: undefined,
  client: "M/s Vardaan Clinic Pvt. Ltd.",
  opponent: "Municipal Corporation, Udaipur",
  isDemoData: true,
} as const;

export const TC27_GROUNDS = [
  { id: "g1", title: "Unpublished Checklist Cannot Be Basis of Refusal", body: "Municipality refuses occupancy certificate citing an unpublished internal checklist which was never part of approved building bye-laws. No statute authorises use of unpublished criteria — refusal is ultra vires and arbitrary under Art. 14.", priority: "primary" },
  { id: "g2", title: "No Opportunity of Hearing Before Refusal", body: "Writ of mandamus available when statutory authority refuses without reasoned order and without affording hearing. Natural justice requires disclosure of grounds and opportunity to cure defects.", priority: "primary" },
  { id: "g3", title: "Approved Plan Substantially Complied With", body: "All structural works completed as per approved plan. Any minor deviations, if at all, must be specifically pointed out with opportunity to cure rather than blanket refusal.", priority: "secondary" },
  { id: "g4", title: "Fire NOC From Competent Authority Obtained", body: "Fire safety clearance obtained from authorised fire department. Municipality cannot sit in appeal over statutory clearance issued by another competent authority.", priority: "secondary" },
] as const;

export const TC27_PRECEDENTS = [
  { id: "p1", name: "Siemens Ltd. v. State of Maharashtra", citation: "(2005) 12 SCC 33", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Administrative action must be based on disclosed criteria — unpublished policy vitiates decision.", blockedFromDraft: false },
  { id: "p2", name: "Krishna Chandra Gangwar v. Bareilly Development Authority", citation: "(1986) 3 SCC 176", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Occupancy certificate cannot be refused without disclosing specific deviations from approved plan.", blockedFromDraft: false },
] as const;

export const TC27_PRAYER = [
  "1. Issue writ of mandamus directing respondent Municipality to disclose the complete unpublished checklist and file nothings.",
  "2. Direct respondent to pass a reasoned order on occupancy certificate application after hearing.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-28 — Unsafe footbridge near school (PIL)
// ─────────────────────────────────────────────────────────────────────────
export const TC28_META = {
  id: "tc28",
  title: "PIL — Unsafe Footbridge Near School (Safety Mandamus)",
  caseNo: "SB Civil Writ Petition (PIL) No. ____/2026",
  court: "Rajasthan High Court (PIL Bench)",
  charges: "Art. 226 + Environment Protection Act + Public Liability",
  accused: undefined,
  client: "Citizens' Safety Forum (Registered Society)",
  opponent: "Public Works Department & Municipal Corporation, Bhilwara",
  isDemoData: true,
} as const;

export const TC28_GROUNDS = [
  { id: "g1", title: "Cracks and Falling Concrete — Imminent Public Danger", body: "Dated photographic evidence shows structural cracks, spalling and falling concrete from footbridge used by 500+ school children daily. Authority has notice of defect but taken no protective measures.", priority: "primary" },
  { id: "g2", title: "Repair Tender Not A Substitute For Safety Cordoning", body: "Respondents floated repair tender 2 months ago but have not cordoned the route or erected barricades. Existence of tender does not excuse ongoing risk to public safety.", priority: "primary" },
  { id: "g3", title: "PIL Maintainable — Bona Fide Citizen Group + Public Interest", body: "Petitioner is a registered citizens' group with no personal interest. Bona fides established through prior complaints, school letters and public evidence.", priority: "secondary" },
  { id: "g4", title: "Duty of Care — Public Infrastructure Maintainer", body: "Statutory duty on PWD/Municipality under municipal laws to maintain public bridges in safe condition. Breach of duty exposes users to foreseeable risk of serious injury.", priority: "secondary" },
] as const;

export const TC28_PRECEDENTS = [
  { id: "p1", name: "M.C. Mehta v. Union of India (Oleum Gas Leak)", citation: "(1987) 1 SCC 395", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Absolute liability for hazardous activities; interim safety measures available in PIL.", blockedFromDraft: false },
  { id: "p2", name: "Dr. Subramanian Swamy v. Union of India", citation: "(2012) 2 SCC 397", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "PIL locus standi for registered citizen groups acting bona fide in public interest.", blockedFromDraft: false },
] as const;

export const TC28_PRAYER = [
  "1. Direct respondents forthwith to barricade unsafe portions of footbridge and deploy crowd control.",
  "2. Appoint independent structural engineer to inspect and submit report within 7 days.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-29 — Contempt after settlement-order breach
// ─────────────────────────────────────────────────────────────────────────
export const TC29_META = {
  id: "tc29",
  title: "Contempt Petition — Settlement Decree Breach (Wilful Default)",
  caseNo: "Contempt Petition No. ____/2026 in CS No. ____/2023",
  court: "District Court, Jaipur City (Original Side)",
  charges: "Contempt of Court Act §2(b) + CPC Order XXI",
  accused: "Judgment-Debtor [Name Withheld]",
  client: "M/s Prakash Textiles (Decree-Holder)",
  opponent: "[Judgment-Debtor Name Withheld]",
  isDemoData: true,
} as const;

export const TC29_GROUNDS = [
  { id: "g1", title: "Consent Decree Terms Specifically Breached", body: "Consent decree required: (a) 6 monthly instalments of ₹2L each; (b) delivery of 3 specified documents within 30 days. Two instalments missed. Document delivery not done. Breach is clear and specific.", priority: "primary" },
  { id: "g2", title: "Wilful Breach — Not Mere Inability", body: "Evidence suggests judgment-debtor closed known bank account and transferred machinery to a related entity. Post-decree conduct establishes deliberate avoidance, not mere inability to pay.", priority: "primary" },
  { id: "g3", title: "Contempt vs. Execution — Appropriate Remedy", body: "While execution is available as remedy, deliberate breach of consent decree terms, particularly after undertaking to court, is also actionable as civil contempt to uphold court's authority.", priority: "secondary" },
  { id: "g4", title: "Notice Served — Opportunity To Comply Given", body: "Final compliance notice dated [date] served by registered post and email. No response and no rectification within notice period. Contempt petition only after exhausting notice remedy.", priority: "secondary" },
] as const;

export const TC29_PRECEDENTS = [
  { id: "p1", name: "State of Bihar v. Rani Sonabati Kumari", citation: "AIR 1961 SC 221", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Wilful disobedience of consent decree amounts to civil contempt — mens rea established by conduct.", blockedFromDraft: false },
  { id: "p2", name: "Hindustan Motors Ltd. v. Urmila Gupta", citation: "(1997) 3 SCC 403", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Asset transfer after decree to avoid liability is evidence of wilful contempt.", blockedFromDraft: false },
] as const;

export const TC29_PRAYER = [
  "1. Admit contempt petition against respondent for wilful breach of consent decree.",
  "2. Direct respondent to purge contempt within 15 days by paying arrears and delivering documents.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-30 — Arbitration appointment after failed settlement
// ─────────────────────────────────────────────────────────────────────────
export const TC30_META = {
  id: "tc30",
  title: "§11 Appointment — Logistics Contract Arbitration + Asset Preservation",
  caseNo: "S.B. Civil Arbitration Application No. ____/2026",
  court: "Rajasthan High Court (Commercial Bench) / District Court",
  charges: "A&C Act 1996 §11(6) + §17 Interim Relief",
  accused: undefined,
  client: "M/s SwiftLogix Logistics Pvt. Ltd. (Claimant)",
  opponent: "M/s ColdChain Hub Pvt. Ltd. (Respondent)",
  isDemoData: true,
} as const;

export const TC30_GROUNDS = [
  { id: "g1", title: "Valid Arbitration Clause — Three-Member Tribunal Mechanism", body: "Clause 43 of Logistics Contract dated [date] provides for three-member arbitration with seat at Jaipur. Clause is valid, not repugnant, and not subject to any existing bar. Counterparty's refusal to appoint triggers §11 jurisdiction.", priority: "primary" },
  { id: "g2", title: "Arbitration Invocation Duly Served — No Response", body: "Formal arbitration invocation notice dated [date] served on respondent by registered post, email, and courier. 30 days expired. No arbitrator appointed by respondent. Statutory preconditions satisfied.", priority: "primary" },
  { id: "g3", title: "Interim Preservation — Inventory Diversion Risk", body: "Credible information that respondent is diverting contract-specific inventory (customised cold-room units) to another customer. §17 / §9 interim preservation needed to protect subject-matter of arbitration.", priority: "secondary" },
  { id: "g4", title: "Claim Amount Ascertainable — Dispute Arises From Contract", body: "Principal claim: unpaid invoices ₹1.85Cr. Counterclaim anticipated (disputed). Dispute clearly arises out of and in connection with the contract — no jurisdictional bar.", priority: "secondary" },
] as const;

export const TC30_PRECEDENTS = [
  { id: "p1", name: "Sundaram Finance Ltd. v. NEPC India Ltd.", citation: "(1999) 2 SCC 479", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "§11 court does not decide merits — only examines existence of valid arbitration clause.", blockedFromDraft: false },
  { id: "p2", name: "Reliance Industries Ltd. v. Union of India", citation: "(2014) 7 SCC 603", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "§9 / §17 interim preservation available when subject-matter of arbitration is at risk of dissipation.", blockedFromDraft: false },
] as const;

export const TC30_PRAYER = [
  "1. Appoint arbitral tribunal (three-member) as per Clause 43 of the contract.",
  "2. Pass interim order restraining respondent from diverting, disposing of, or encumbering contract-specific cold-room units.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-31 — Challenge to award with partial grounds
// ─────────────────────────────────────────────────────────────────────────
export const TC31_META = {
  id: "tc31",
  title: "Award Challenge (§34) — Partial Sustainable Grounds + Go/No-Go",
  caseNo: "S.B. Civil Arbitration Petition No. ____/2026",
  court: "Commercial Court / District Court (A&C Act §34)",
  charges: "A&C Act 1996 §34(2)(a)(iii) + (v) — Setting Aside",
  accused: undefined,
  client: "M/s Nimbus Engineering Pvt. Ltd. (Award-Debtor)",
  opponent: "M/s Horizon Structures Ltd. (Award-Holder)",
  isDemoData: true,
} as const;

export const TC31_GROUNDS = [
  { id: "g1", title: "Natural Justice Breach — Specific Finding Required", body: "Tribunal refused to admit two key affidavits cited in closing arguments without giving any reason. Mere 'considered and rejected' without addressing each document's relevance = patent natural justice violation.", priority: "primary" },
  { id: "g2", title: "Calculation Error — Apparent On Face Of Award", body: "Award para 72 applies 18% interest on awarded sum but computation table shows 24% was actually used. Arithmetical error apparent on face of award — correctable under §33 OR challengeable ground.", priority: "primary" },
  { id: "g3", title: "Merits Dissatisfaction Alone Is Not A Ground", body: "Client also disagrees with tribunal's factual findings on delay. Note: This is NOT a valid §34 ground. Relegated to memorandum of dissatisfaction only, not to be argued in setting-aside.", priority: "secondary" },
  { id: "g4", title: "Limitation Gate — Receipt Date Disputed", body: "Award claimed received on [date A] by courier, but client's registered-office diary shows date [date B] (12 days later). Limitation 3 months from date of receipt + 30 days condonation. Must plead actual receipt.", priority: "secondary" },
] as const;

export const TC31_PRECEDENTS = [
  { id: "p1", name: "Oil & Natural Gas Corp. Ltd. v. Saw Pipes Ltd.", citation: "(2003) 5 SCC 705", court: "Supreme Court of India (Constitution Bench)", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Patent illegality = error apparent on face of award; jurisdictional error; public policy.", blockedFromDraft: false },
  { id: "p2", name: "Dyna Technologies (P) Ltd. v. Crompton Greaves Ltd.", citation: "(2020) 1 SCC 1", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Minimal interference with arbitral awards; only statutory grounds permissible. Factual findings not ordinarily disturbed.", blockedFromDraft: false },
] as const;

export const TC31_PRAYER = [
  "1. Set aside the impugned award dated [date] on limited grounds of (a) natural justice breach and (b) arithmetical calculation error.",
  "2. Stay execution of the award pending disposal on condition of deposit of X% of award amount.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-32 — Execution against changing assets
// ─────────────────────────────────────────────────────────────────────────
export const TC32_META = {
  id: "tc32",
  title: "Execution Petition — Money Decree + Dissipation Prevention",
  caseNo: "Execution Petition No. ____/2026 in CS No. ____/2022",
  court: "District Court, Ajmer (Executing Court — CPC Order XXI)",
  charges: "CPC Order XXI §§11, 16, 30, 46 + Garnishee Proceedings",
  accused: undefined,
  client: "M/s Rajasthan Industrial Supplies (Decree-Holder)",
  opponent: "M/s SK Engineering Works (Judgment-Debtor)",
  isDemoData: true,
} as const;

export const TC32_GROUNDS = [
  { id: "g1", title: "Final Money Decree — Appeal Bar Expired", body: "Money decree for ₹48,50,000/- dated [date] passed by District Court. Appeal period (90 days) expired. No appeal pending. No stay operating. Decree is FINAL and EXECUTABLE.", priority: "primary" },
  { id: "g2", title: "Judgment-Debtor Closing Known Accounts — Dissipation", body: "Decree-holder's bank garnishee notice returned with 'account closed' endorsement. Newspaper/market evidence shows JD actively selling machinery. Dissipation = ground for urgent attachment before judgment OR disclosure order.", priority: "primary" },
  { id: "g3", title: "Known Movable Assets — Machinery Advertised For Sale", body: "Certified that 3 CNC machines (serial numbers on record) are listed for sale on [portal]. These are identifiable movable property of JD — liable to attachment and sale in execution.", priority: "secondary" },
  { id: "g4", title: "Territorial Jurisdiction — Executing Court Correct", body: "Decree passed by same court. JD carries on business within territorial jurisdiction. All assets (machinery at factory address) situated within jurisdiction. No transfer of execution needed.", priority: "secondary" },
] as const;

export const TC32_PRECEDENTS = [
  { id: "p1", name: "Varkey Joseph v. State of Kerala", citation: "(2008) 12 SCC 290", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Executing court cannot go behind decree; execution limited to giving effect to decree terms.", blockedFromDraft: false },
  { id: "p2", name: "Transcore v. Union of India", citation: "(2008) 1 SCC 129", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Garnishee proceedings available for attaching debt owed to judgment-debtor by third party.", blockedFromDraft: false },
] as const;

export const TC32_PRAYER = [
  "1. Order attachment of 3 CNC machines (serial numbers specified) and other movable property of JD.",
  "2. Issue garnishee notice to JD's known debtors and banks for amounts held on JD's account.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-33 — Caveat before property-sale injunction
// ─────────────────────────────────────────────────────────────────────────
export const TC33_META = {
  id: "tc33",
  title: "Caveat Petition — Anticipatory Property Sale Injunction Notice",
  caseNo: "Caveat No. ____/2026 in CS (OS) No. [Expected]",
  court: "Civil Judge (Senior Division), Jodhpur (Expected Suit)",
  charges: "CPC §148A — Caveat Before Suit / Application",
  accused: undefined,
  client: "Shri [Name Withheld] (Co-Owner — Caveator)",
  opponent: "[Co-Owner Names] (Expected Applicants for Injunction)",
  isDemoData: true,
} as const;

export const TC33_GROUNDS = [
  { id: "g1", title: "Bona Fide Anticipation — Family Settlement + Registration", body: "Co-owners have circulated draft family settlement deed including sale of 2 parcels. Credible information that other co-owners intend to file ex-parte injunction against registration without serving notice on caveator.", priority: "primary" },
  { id: "g2", title: "Likely Subject-Matter Identified With Reasonable Certainty", body: "Suit likely to seek: (a) ad-interim injunction against registration of family settlement deed; (b) injunction restraining alienation of Schedule-A properties. Caveator's interest directly affected by both.", priority: "primary" },
  { id: "g3", title: "Probable Forum Identified (Not Guesswork)", body: "Suit value (property ~₹1.8Cr) falls within pecuniary jurisdiction of Civil Judge (Sr. Div.), Jodhpur. Properties situated within territorial limits. Reasonable basis, not pure guesswork.", priority: "secondary" },
  { id: "g4", title: "Caveat Does Not Contain Substantive Defence", body: "Caveat limited to statutory request for notice only. No substantive pleadings, no waiver of any right to raise all defences, no admission. Preserves caveator's full right to contest on merits when served.", priority: "secondary" },
] as const;

export const TC33_PRECEDENTS = [
  { id: "p1", name: "Nageshwar Rao v. State of Andhra Pradesh", citation: "AIR 1968 SC 1133", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Caveat maintainable even before suit is filed if applicant can show bona fide anticipation.", blockedFromDraft: false },
  { id: "p2", name: "Shyam Kishore v. Sharadendu Bhattacharya", citation: "(2000) 9 SCC 153", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Caveat does not decide anything on merits; purely procedural right to notice and hearing.", blockedFromDraft: false },
] as const;

export const TC33_PRAYER = [
  "1. Enter caveat under CPC §148A so that no ex-parte interim order is passed in any anticipated suit or application concerning Schedule-A properties without serving notice on caveator.",
  "2. Direct court office to endorse caveat entry and inform caveator of any filing forthwith.",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-34 — Confidential design misuse by contractor (IP Injunction)
// ─────────────────────────────────────────────────────────────────────────
export const TC34_META = {
  id: "tc34",
  title: "Confidential Design Misuse — Narrow Copyright + Confidence Injunction",
  caseNo: "Commercial Suit No. ____/2026 (OS)",
  court: "Commercial Court, Jaipur (IP Division)",
  charges: "Copyright Act §51 + Indian Contract Act §73 + Breach of Confidence + Specific Relief Act §38",
  accused: undefined,
  client: "M/s InnoTech Design Labs Pvt. Ltd. (Original Owner)",
  opponent: "Shri [Contractor-1] + M/s [Contractor-2 Entity] (Both Respondents)",
  isDemoData: true,
} as const;

export const TC34_GROUNDS = [
  { id: "g1", title: "Confidential Material Identified File-By-File (17 Files)", body: "Schedule-B lists 17 specific unreleased design files (3D CAD + BOM + firmware) containing proprietary know-how. Respondents' launched product reproduces exact structure, component selection, and parameter logic of 13 of 17 files. Similarity + access = copying.", priority: "primary" },
  { id: "g2", title: "Ownership Gap — Contractor-1 No Signed Assignment — Mitigated", body: "Respondent-1 was engaged on 'work-for-hire' contract with Clause 9 requiring assignment. Formal assignment deed not signed but (a) work-for-hire terms + (b) all source files delivered with full copyright notices in client name = equitable owner / beneficial owner standing to sue. Caveat: Maintain quantum meruit counter-offer in parallel.", priority: "primary" },
  { id: "g3", title: "Breach of NDA — Confidentiality Obligation Exists", body: "NDA signed by both respondents covering all 'non-public design information'. Launch product contains schedules not publicly disclosed before launch date. Breach of confidence = separate cause of action independent of copyright.", priority: "secondary" },
  { id: "g4", title: "Narrow Relief — No General Product Restraint", body: "Relief narrowly tailored: (a) restrain distribution of 13 infringing files as embodied in launched product; (b) delivery-up of infringing design files; (c) accounting; (d) NO restraint on respondent's lawful independent designs. Overbroad restraint rejected at threshold.", priority: "secondary" },
] as const;

export const TC34_PRECEDENTS = [
  { id: "p1", name: "Eastern Book Co. v. D.B. Modak", citation: "(2008) 1 SCC 1", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Copyright subsists in original compilations and structured design work. Substantial copying test: quality over quantity.", blockedFromDraft: false },
  { id: "p2", name: "John Richard Brady v. Chemical Process Equipments (P) Ltd.", citation: "AIR 1987 Delhi 191 (DB)", court: "Delhi High Court (Division Bench)", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Breach of confidence actionable without registration; interim injunction available on prima facie case of confidential information misuse.", blockedFromDraft: false },
] as const;

export const TC34_PRAYER = [
  "1. Ex-parte ad-interim injunction restraining respondents from using, distributing, or exploiting the 13 confidential design files listed in Schedule-B-2.",
  "2. Order delivery-up of all copies of infringing files in respondents' possession or control.",
  "3. [DEMO PLACEHOLDER — verify relief wording before filing]",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-35 — Wrong survey number in closed pleadings
// ─────────────────────────────────────────────────────────────────────────
export const TC35_META = {
  id: "tc35",
  title: "Pleadings Amendment — Wrong Survey No. Correction (No Cause Change)",
  caseNo: "CS (OS) No. ____/2024",
  court: "Civil Judge (Senior Division), Kota",
  charges: "CPC Order VI Rule 17 — Amendment of Pleadings",
  accused: undefined,
  client: "Shri [Name Withheld] (Plaintiff)",
  opponent: "Shri [Name Withheld] (Defendant)",
  isDemoData: true,
} as const;

export const TC35_GROUNDS = [
  { id: "g1", title: "Boundaries Identical — Only Survey Number Copied Wrong", body: "Certified revenue record (patta + naksha) obtained post written-statement filing. Schedule-B comparison shows every boundary (north/south/east/west) and every adjoining landowner is IDENTICAL between old plaint schedule and correct record. ONLY 4-digit survey number differs (copy-paste error from adjacent plot).", priority: "primary" },
  { id: "g2", title: "Cause Of Action Unchanged — No New Case Introduced", body: "Suit for declaration of title + injunction. Bona vacantia claim, possession history, easementary rights — ALL based on boundaries, not survey number. Correction does not add or alter any factual allegation. Defendant is NOT prejudiced in preparing defence.", priority: "primary" },
  { id: "g3", title: "Diligence Explained — Error Discovered On WS Cross-Examination", body: "Plaintiff's clerk used 4-year old template. Error not discovered until defendant's WS para-14 specifically pleaded 'wrong survey number, no title to Survey X'. Plaintiff immediately applied for certified record, obtained, and now moves amendment promptly after discovery.", priority: "secondary" },
  { id: "g4", title: "No Delay / No Trial Prejudice — Issues Not Framed Yet", body: "Pleadings stage: WS filed but issues NOT yet framed. Trial not commenced. No evidence recorded. Amendment now will not delay proceedings. No application made for adjournment on this ground.", priority: "secondary" },
] as const;

export const TC35_PRECEDENTS = [
  { id: "p1", name: "L.J. Leach & Co. Ltd. v. Jardine Skinner & Co.", citation: "AIR 1957 SC 357", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Amendment should be allowed if no prejudice to opposite party and it does not introduce entirely new cause of action.", blockedFromDraft: false },
  { id: "p2", name: "Ramesh Kumar Agarwal v. Kesho Ram Bansal", citation: "(2019) 12 SCC 785", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Clerical / typographical errors in schedule property description are curable by amendment at any stage before judgment — prejudice must be established by defendant.", blockedFromDraft: false },
] as const;

export const TC35_PRAYER = [
  "1. Allow amendment of Schedule-A property description in plaint by correcting survey number from [X] to [Y], per certified revenue record annexed.",
  "2. Allow consequential correction of same survey number in relief clauses, with liberty to defendant to file amended WS if so advised.",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-36 — Written statement with set-off and admission trap
// ─────────────────────────────────────────────────────────────────────────
export const TC36_META = {
  id: "tc36",
  title: "Written Statement — Supply Dispute + Set-Off + Qualified Admissions",
  caseNo: "CS No. ____/2026",
  court: "Commercial Court, Alwar",
  charges: "CPC Order VIII Rule 1 — Written Statement + Set-Off (Order VIII Rule 6)",
  accused: undefined,
  client: "M/s Balaji Auto Distributors (Defendant-Set-Off Claimant)",
  opponent: "M/s AutoParts Manufacturing Ltd. (Plaintiff)",
  isDemoData: true,
} as const;

export const TC36_GROUNDS = [
  { id: "g1", title: "Each Plaint Paragraph Traversed — No Silence", body: "Plaint contains 41 numbered paragraphs. Written Statement responds to EVERY paragraph: 14 admitted, 18 denied with specific reasons, 9 'not admitted / called upon to prove'. Zero silent paragraphs = zero deemed admissions under Order VIII Rule 5.", priority: "primary" },
  { id: "g2", title: "Email 'Receipt Without Objection' — Qualified Not Absolute", body: "Plaint relies on admission email: 'Received goods, will inspect and revert in 3 days'. WS qualifies: (a) receipt of QUANTITY admitted; (b) quality NOT admitted; (c) inspection delayed because warehouse flood-damaged [independent evidence]; (d) defects notified on Day 47 = within reasonable time from actual discovery. Reconciles admission with defence without contradiction.", priority: "primary" },
  { id: "g3", title: "Set-Off Pleaded — Mutual + Ascertained + Within Limitation", body: "Defendant's set-off claim: ₹6,75,000/- (a) 3 acknowledged unpaid credit notes ₹3,15,000; (b) warranty compensation for rejected Lot-7 ₹2,60,000; (c) warehousing charges for returnable goods ₹1,00,000. Ascertained mutual debt between same parties. Set-off allowed as of right at WS stage.", priority: "secondary" },
  { id: "g4", title: "Limitation Protected — 18 Days Remaining; Accounts Partially Incomplete", body: "WS filed 12 days from service date (within 30-day window). Set-off amounts (b) and (c) stated as 'subject to final reconciliation'. Liberty reserved to file supplementary computation once audit firm certifies — no prejudice to plaintiff.", priority: "secondary" },
] as const;

export const TC36_PRECEDENTS = [
  { id: "p1", name: "Balram Prasad Agarwal v. Nagalaballi Proprietary (P) Ltd.", citation: "(1998) 4 SCC 49", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Order VIII Rule 5: Allegations not traversed are deemed admitted. Every paragraph must be specifically responded to.", blockedFromDraft: false },
  { id: "p2", name: "Systopic Laboratories (P) Ltd. v. Pravin Incoming Exchange", citation: "(2004) 12 SCC 59", court: "Supreme Court of India", status: "SECONDARY" as const, statusNote: "[DEMO PLACEHOLDER — verify on SCC Online before filing]", holding: "[DEMO PLACEHOLDER — obtain verbatim holding from SCC Online]", application: "Set-off requires mutual debt between same parties, ascertained sum, and contractual relationship. Ascertained vs. unascertained distinction maintained.", blockedFromDraft: false },
] as const;

export const TC36_PRAYER = [
  "1. Dismiss the suit with costs, OR in the alternative: adjust plaintiff's claimed amount against set-off amount of ₹6,75,000/-.",
  "2. Pass set-off decree in favour of defendant for balance amount after adjustment, with pendente lite and future interest.",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// TC-27..TC-36 Registry for buildCaseRecord
// ─────────────────────────────────────────────────────────────────────────
export const WEEK03_STUB_REGISTRY = {
  "TC-27": { META: TC27_META, GROUNDS: TC27_GROUNDS, PRECEDENTS: TC27_PRECEDENTS, PRAYER: TC27_PRAYER },
  "TC-28": { META: TC28_META, GROUNDS: TC28_GROUNDS, PRECEDENTS: TC28_PRECEDENTS, PRAYER: TC28_PRAYER },
  "TC-29": { META: TC29_META, GROUNDS: TC29_GROUNDS, PRECEDENTS: TC29_PRECEDENTS, PRAYER: TC29_PRAYER },
  "TC-30": { META: TC30_META, GROUNDS: TC30_GROUNDS, PRECEDENTS: TC30_PRECEDENTS, PRAYER: TC30_PRAYER },
  "TC-31": { META: TC31_META, GROUNDS: TC31_GROUNDS, PRECEDENTS: TC31_PRECEDENTS, PRAYER: TC31_PRAYER },
  "TC-32": { META: TC32_META, GROUNDS: TC32_GROUNDS, PRECEDENTS: TC32_PRECEDENTS, PRAYER: TC32_PRAYER },
  "TC-33": { META: TC33_META, GROUNDS: TC33_GROUNDS, PRECEDENTS: TC33_PRECEDENTS, PRAYER: TC33_PRAYER },
  "TC-34": { META: TC34_META, GROUNDS: TC34_GROUNDS, PRECEDENTS: TC34_PRECEDENTS, PRAYER: TC34_PRAYER },
  "TC-35": { META: TC35_META, GROUNDS: TC35_GROUNDS, PRECEDENTS: TC35_PRECEDENTS, PRAYER: TC35_PRAYER },
  "TC-36": { META: TC36_META, GROUNDS: TC36_GROUNDS, PRECEDENTS: TC36_PRECEDENTS, PRAYER: TC36_PRAYER },
} as const;

export type Week03StubCaseId = keyof typeof WEEK03_STUB_REGISTRY;
