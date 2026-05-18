import { useState } from "react";
import { Printer, FileText } from "lucide-react";

export default function PrintLetterPage() {
  const [caseDetails, setCaseDetails] = useState({
    contractorName: "M/s [Contractor Name]",
    contractorAddress: "[Contractor's Full Address, City, State - PIN]",
    authority: "[Name & Designation of Enquiry/Show Cause Authority]",
    authorityAddress: "[Department Name, Address, City]",
    subject: "[Work Name / Agreement Number / Reference]",
    noticeDate: "[Date of Show Cause Notice]",
    noticeRefNo: "[Reference No. of Notice]",
    replyDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
  });

  const handleChange = (field: string, value: string) => {
    setCaseDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 no-print">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Formal Defence Representation Letter</h1>
              <p className="text-muted-foreground text-sm">Printable one-page letter with all nine grounds — for submission to the Enquiry Authority</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 bg-muted/30 rounded-xl border border-border">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground col-span-2 mb-1">Customise Details</div>
          {Object.entries(caseDetails).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
              <input
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full mt-0.5 text-sm border border-border rounded px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white text-black rounded-xl shadow-lg p-8 font-serif text-[11pt] leading-[1.6] print:shadow-none print:rounded-none print:p-0">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-[14pt] font-bold uppercase tracking-wider">{caseDetails.contractorName}</h1>
          <p className="text-[9pt] text-gray-600 mt-1">{caseDetails.contractorAddress}</p>
        </div>

        <div className="flex justify-between mb-4 text-[10pt]">
          <div>
            <strong>To,</strong><br />
            {caseDetails.authority}<br />
            {caseDetails.authorityAddress}
          </div>
          <div className="text-right">
            <strong>Date:</strong> {caseDetails.replyDate}<br />
            <em className="text-gray-600">Through: Registered Post / RPAD</em>
          </div>
        </div>

        <div className="mb-4 font-bold border-l-4 border-black pl-3">
          Subject: Reply / Representation in Response to Show Cause Notice Ref. No. {caseDetails.noticeRefNo} dated {caseDetails.noticeDate} — {caseDetails.subject}
        </div>

        <p className="mb-3">Sir/Madam,</p>
        <p className="mb-3">We, <strong>{caseDetails.contractorName}</strong> (hereinafter "the Contractor"), hereby submit this formal representation in response to the above-cited Show Cause Notice. We <strong>unequivocally deny</strong> all allegations of defective workmanship as being contrary to fact, scientifically untenable, and legally unsustainable. The sampling and testing exercise relied upon by the Enquiry Authority is vitiated by the following nine independent, cumulative, and fatal grounds:</p>

        <div className="space-y-3">
          {[
            {
              n: "1",
              title: "Absence of Contractor's Authorised Representative During Sampling",
              body: "No prior notice was served. No authorised representative of the Contractor was present during sample collection. This violates audi alteram partem (right to be heard) as affirmed in A.K. Kraipak v. Union of India, AIR 1970 SC 150 and Maneka Gandhi v. Union of India, AIR 1978 SC 597. The chain of custody is broken from inception."
            },
            {
              n: "2",
              title: "Haphazard Collection on Stormy Day — Gross Violation of IS 1199:1959, IS 2250:1981, IS 516:1959",
              body: "A stormy day was chosen without any emergency justification. Steel ladders with umbrella-holding workmen used hammers to collect plaster samples while the floor was inundated with ~2 feet of water. No tarpaulin was spread. Samples fell 1–6 metres into standing water. Randomisation was absent. Sample quantity was insufficient. Each violation independently destroys sample authenticity. Collectively, they are fatal to the test results."
            },
            {
              n: "3",
              title: "Defective Transportation — Chain of Custody Broken",
              body: "Transportation under the same stormy conditions, without documented chain of custody, without sealed waterproof containers, and without a laboratory receipt log constitutes a fatal break in the chain of custody: State of H.P. v. Jai Lal, (1999) 7 SCC 280."
            },
            {
              n: "4",
              title: "No Evidence of IS-Compliant Storage at Laboratory",
              body: "IS 4031 (Part 6):1988 mandates storage at 27°C ± 2°C, RH ≥ 90%. No laboratory receipt register, no temperature/humidity record, and no sample condition certificate has been produced. Adverse inference must be drawn: N. Sri Rama Reddy v. V.V. Giri, AIR 1971 SC 1162."
            },
            {
              n: "5",
              title: "Time Frame for Testing Not Adhered To — IS 4031 & IS 516:1959",
              body: "The test report does not disclose the date of collection, date of receipt, or date of testing. Without these timestamps, compliance with mandatory IS time windows cannot be verified and must be presumed violated. Results from specimens tested outside prescribed windows are scientifically invalid."
            },
            {
              n: "6",
              title: "Tests Conducted Without Contractor's Presence — Natural Justice Violated",
              body: "Testing was conducted without the Contractor's knowledge or presence, denying the Contractor the opportunity to verify sample identity, instrument calibration, and procedural compliance. This is equivalent to denial of the right of cross-examination: Board of Trustees, Port of Bombay v. Dilipkumar Nadkarni, AIR 1983 SC 109."
            },
            {
              n: "7",
              title: "No Counterpart Sample Retained for Independent Re-Testing — Adverse Inference",
              body: "IS 1199:1959 Clause 3.4 requires duplicate samples. No counterpart was retained for independent re-testing. This permanently destroys the Contractor's right to a second opinion. Adverse inference under Section 114 Illustration (g), Indian Evidence Act 1872 must be drawn against the Enquiry Authority."
            },
            {
              n: "8",
              title: "Test Report Does Not Specify the Indian Standard Applied",
              body: "The test report is silent on the IS standard used. It is impossible to determine whether the correct standard was applied (IS 2250:1981 for masonry mortar vs IS 516 for concrete). In the Hemraj stadium case, applying IS 1199:2018 (fresh concrete) to hardened masonry mortar destroyed the prosecution's case. A report without IS citation violates IS/IEC 17025:2017 and cannot be received as expert evidence: Sterlite Industries v. Union of India, (2013) 4 SCC 575."
            },
            {
              n: "9",
              title: "Test Report Does Not Clarify Whether Result is Maiden Test or Average — Violation of IS 4031 Clause 6.3",
              body: "IS 4031 (Part 6) mandates testing of minimum 3 cubes; reported value must be the average. The report states a single result without disclosing the number of specimens tested. A maiden (single) test result is statistically inadmissible under IS norms. An average without individual values is unverifiable. Either way, the report is fatally incomplete."
            },
          ].map((ground) => (
            <div key={ground.n} className="break-inside-avoid">
              <div className="font-bold text-[10.5pt]">Ground {ground.n}: {ground.title}</div>
              <p className="text-[10pt] mt-0.5 ml-4">{ground.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3 border-l-4 border-black bg-gray-50 font-bold text-[10.5pt]">
          PRAYER: It is most respectfully prayed that the Honourable Enquiry Authority be pleased to: (i) drop all adverse proceedings against the Contractor; (ii) expunge all adverse remarks based on the vitiated test results; (iii) order fresh sampling, if considered necessary, strictly in the Contractor's presence and in full compliance with IS 1199:1959, IS 2250:1981, and IS 4031; and (iv) grant such other relief as the justice of the case demands.
        </div>

        <div className="mt-6">
          <p>Yours faithfully,</p>
          <div className="mt-8 border-t border-black w-48">
            <p className="mt-1 font-bold">{caseDetails.contractorName}</p>
            <p className="text-[9pt]">Authorised Signatory</p>
            <p className="text-[9pt]">Date: {caseDetails.replyDate}</p>
          </div>
        </div>

        <div className="mt-4 text-[8pt] text-gray-500 border-t border-gray-300 pt-2 italic">
          Without prejudice to all rights and remedies. This representation is based on preliminary facts; the Contractor reserves the right to supplement these grounds with additional evidence, legal submissions, and expert opinions.
        </div>
      </div>
    </div>
  );
}
