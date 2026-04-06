import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronDown, ChevronRight, FlaskConical, Scale, ShieldCheck } from "lucide-react";

type FAQ = { q: string; a: string[]; tags: string[] };

const MATERIAL_FAQS: FAQ[] = [
  {
    q: "What are the standard protocols for reserving construction materials for retesting?",
    a: [
      "ISO 9001: Quality management systems mandate material sampling and retention.",
      "ASTM C42 / C94 / C1157: Standard methods for concrete, ready-mixed concrete, and cement.",
      "IS 456: Plain and reinforced concrete — primary Indian standard.",
      "IS 4926: Ready-mixed concrete code.",
      "IS 10262: Concrete mix design guidelines.",
    ],
    tags: ["IS 456", "ASTM", "ISO 9001", "sampling"],
  },
  {
    q: "What materials must be reserved for retesting — mortar, cement, concrete?",
    a: [
      "Concrete: Minimum 3 cubes per batch (150mm³), retained for 28 days at 20±2°C, 90%+ humidity.",
      "Cement: Minimum 1 kg per batch, in airtight moisture-free containers for 90 days.",
      "Mortar: Minimum 3 cubes per batch (70.6mm), documented with mix proportions and application details.",
    ],
    tags: ["mortar", "cement", "concrete", "sample size"],
  },
  {
    q: "What transparency requirements exist for material testing?",
    a: [
      "Complete chain of custody documentation — collection → sealing → transport → storage → lab.",
      "Third-party verification via independent NABL/ISO 17025 accredited laboratories.",
      "All stakeholders must have access to test results — no ex-parte testing.",
      "Digital audit trails for all material handling are mandatory under quality assurance frameworks.",
    ],
    tags: ["chain of custody", "transparency", "NABL", "third-party"],
  },
  {
    q: "What legal precedents support material reservation requirements?",
    a: [
      "FIDIC and NEC construction contracts include explicit material testing and retention clauses.",
      "Government public works contracts mandate material retention under CPWD Works Manual.",
      "Courts have upheld material testing requirements in construction disputes regarding professional liability.",
      "Consumer protection laws support material preservation for defect and safety claims.",
    ],
    tags: ["FIDIC", "CPWD", "legal precedent", "professional liability"],
  },
  {
    q: "How are disputes over material testing results resolved?",
    a: [
      "Independent testing: Third-party NABL laboratory verification as primary mechanism.",
      "Expert opinion: Independent qualified forensic engineer assessment.",
      "Reference to established standards (IS, ASTM, ISO) as arbitral benchmark.",
      "Arbitration per contract, followed by litigation if unresolved.",
    ],
    tags: ["dispute resolution", "arbitration", "independent testing"],
  },
  {
    q: "What documentation is required throughout the testing process?",
    a: [
      "Pre-testing: Sample collection log with exact location, date, time, weather conditions, witnesses.",
      "During testing: Laboratory acceptance receipts, chain-of-custody signatures, environmental conditions.",
      "Post-testing: Signed test reports, deviations from procedure, interpretation basis.",
      "All records must be retained for minimum 5 years for potential litigation.",
    ],
    tags: ["documentation", "records", "chain of custody", "retention"],
  },
];

const FORENSIC_FAQS: FAQ[] = [
  {
    q: "What are the legal requirements for forensic construction material testing?",
    a: [
      "National Building Code 2016 (NBC 2016): Material traceability is mandatory.",
      "BIS/IS codes mandate sample retention for forensic investigation.",
      "Court orders (judicial precedents): Evidence preservation is enforceable.",
      "Consumer protection and public safety laws impose material retention obligations on contractors.",
    ],
    tags: ["NBC 2016", "BIS", "court orders", "forensic"],
  },
  {
    q: "What forensic testing standards govern sample collection from existing structures?",
    a: [
      "ASTM C823: Standard practice for examination and sampling of hardened concrete.",
      "ASTM C42: Standard test method for obtaining and testing drilled cores.",
      "IS 13311: Non-destructive testing of concrete (ultrasonic, rebound hammer).",
      "IS 1199: Methods of sampling and analysis of concrete.",
      "ISO/IEC 17025: Laboratory accreditation — all forensic labs must be NABL accredited.",
    ],
    tags: ["ASTM C823", "ASTM C42", "IS 13311", "NABL", "ISO 17025"],
  },
  {
    q: "What are the chain-of-custody requirements for forensic samples?",
    a: [
      "Collection documentation: Detailed logs with photographs, GPS coordinates, witness signatures.",
      "Sealing: Tamper-evident sealing of all samples immediately upon collection.",
      "Transport: Complete transportation records — vehicle, time, handler, temperature.",
      "Storage: Detailed storage and access logs; chain must be unbroken from collection to testimony.",
      "Any gap in chain of custody is a challengeable defect in the forensic evidence.",
    ],
    tags: ["chain of custody", "sealing", "transport", "storage", "photography"],
  },
  {
    q: "What are the rights of the accused/contractor regarding forensic sample collection?",
    a: [
      "Right to be present or have representative at sample collection (natural justice principle).",
      "Right to split samples — one portion tested by prosecution, one retained for defence retesting.",
      "Right to access all laboratory test records, including raw data and method notes.",
      "Ex-parte sampling (without contractor/accused representation) is legally challengeable.",
      "Refer: Kattavellai @ Devakar v. State of TN — chain-of-custody rigor affirmed by Supreme Court.",
    ],
    tags: ["natural justice", "accused rights", "split samples", "ex-parte"],
  },
  {
    q: "What core drilling procedures are required for forensic investigation of structures?",
    a: [
      "Diamond core drilling, minimum 100mm diameter, full depth — ASTM C42 method.",
      "Location must be selected strategically, documented on drawings, photographed before and after.",
      "Samples must be labeled immediately with unique ID, location, date, and handler.",
      "Weather and environmental conditions at time of drilling must be logged.",
      "Non-representative or haphazard selection of drill locations is a challengeable procedural defect.",
    ],
    tags: ["core drilling", "ASTM C42", "location", "photography", "sampling method"],
  },
  {
    q: "What environmental factors must be documented during forensic sample collection?",
    a: [
      "Temperature and humidity at collection site at time of sampling.",
      "Weather conditions — rain, wind, dust can all contaminate mortar or concrete samples.",
      "Time of day, season, and any recent environmental events (storms, flooding) must be recorded.",
      "Contamination risk assessment must be documented — especially critical for mortar samples.",
      "Failure to document weather conditions is a chain-of-custody gap exploitable in defence.",
    ],
    tags: ["weather", "contamination", "environment", "documentation", "mortar"],
  },
  {
    q: "How should a defence lawyer challenge an FSL report on mortar quality?",
    a: [
      "1. Verify chain of custody: Was collection, sealing, transport, and receipt fully documented?",
      "2. Check sampling method: Was it representative, or haphazard/non-systematic?",
      "3. Confirm standards compliance: Did the lab follow IS 2250, ASTM C109, and IS 13311?",
      "4. Examine weather logs: Were conditions at collection recorded and suitable?",
      "5. Verify representation: Was the contractor present or given notice of collection?",
      "6. Cross-examine FSL analyst on all five points — each gap is a separate ground for challenge.",
    ],
    tags: ["FSL report", "defence strategy", "challenge", "cross-examination", "mortar"],
  },
];

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
          {index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground leading-snug">{faq.q}</span>
        {open
          ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        }
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border/60 bg-muted/20">
          <ul className="space-y-2 mt-2">
            {faq.a.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {faq.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px] px-2 py-0.5 bg-background">{t}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForensicFAQ() {
  const [query, setQuery] = useState("");

  const filterFAQs = (faqs: FAQ[]) => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.some((a) => a.toLowerCase().includes(q)) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const filteredMaterial = filterFAQs(MATERIAL_FAQS);
  const filteredForensic = filterFAQs(FORENSIC_FAQS);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">

      <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <FlaskConical className="h-8 w-8 text-primary shrink-0 mt-0.5" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Forensic &amp; Material Testing FAQ</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Procedural standards, chain-of-custody requirements, and defence strategies for
            construction material and forensic testing disputes. Directly applicable to
            stadium wall collapse and similar IPC 304A cases.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
              <Scale className="h-3 w-3" /> Defence Ready
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 gap-1">
              <ShieldCheck className="h-3 w-3" /> IS / ASTM / NABL Standards
            </Badge>
            <Badge variant="outline" className="text-[11px]">Demo / Educational Data</Badge>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by keyword, standard, or topic (e.g. 'chain of custody', 'IS 456', 'mortar')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="forensic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forensic">
            Forensic Testing ({filteredForensic.length})
          </TabsTrigger>
          <TabsTrigger value="material">
            Material Reservation ({filteredMaterial.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forensic" className="mt-4 space-y-3">
          {filteredForensic.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
          ) : (
            filteredForensic.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)
          )}
        </TabsContent>

        <TabsContent value="material" className="mt-4 space-y-3">
          {filteredMaterial.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
          ) : (
            filteredMaterial.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}
