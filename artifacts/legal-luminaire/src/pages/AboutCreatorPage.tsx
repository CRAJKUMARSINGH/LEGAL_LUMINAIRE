/**
 * About the Creator — Rajkumar Singh Chauhan
 * Senior Counsel | Civil Engineer | Legal Luminaire
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale, Briefcase, GraduationCap, Award,
  Building2, Gavel, BookOpen, ShieldCheck,
  ExternalLink, Mail, Globe, Star,
  HardHat, Layers, CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

// ── Creator Data ──────────────────────────────────────────────────────────
const CREATOR = {
  name:        "Rajkumar Singh Chauhan",
  nameHi:      "राजकुमार सिंह चौहान",
  designation: "Senior Counsel & Civil Engineer",
  designationHi: "वरिष्ठ अधिवक्ता एवं सिविल अभियंता",
  experience:  "30+ Years",
  experienceHi: "30+ वर्षों का अनुभव",
  linkedin:    "https://in.linkedin.com/in/rajkumar-singh-chauhan-76627b18",
  github:      "https://github.com/CRAJKUMARSINGH",
  repoUrl:     "https://github.com/CRAJKUMARSINGH/legal-luminaire",

  education: [
    {
      degree: "B.E. (Civil Engineering)",
      degreeHi: "बी.ई. (सिविल इंजीनियरिंग)",
      icon: HardHat,
      color: "text-amber-600",
      bg: "bg-amber-50",
      note: "Foundation for forensic structural analysis, IS/ASTM standards expertise, and construction contract disputes",
    },
    {
      degree: "LL.B. (Bachelor of Laws)",
      degreeHi: "एलएल.बी. (विधि स्नातक)",
      icon: Scale,
      color: "text-primary",
      bg: "bg-primary/5",
      note: "Legal foundation — criminal procedure, civil litigation, arbitration law, evidence law",
    },
  ],

  practiceAreas: [
    {
      area: "Criminal Law",
      areaHi: "आपराधिक विधि",
      icon: Gavel,
      color: "text-red-600",
      bg: "bg-red-50",
      details: "Discharge applications, bail matters, sessions trials, FSL evidence challenges, Section 304A/337/338 IPC, NDPS Act, NI Act",
    },
    {
      area: "Civil Litigation",
      areaHi: "सिविल वाद",
      icon: Scale,
      color: "text-blue-600",
      bg: "bg-blue-50",
      details: "Property disputes, injunctions, recovery suits, execution proceedings, Civil Procedure Code matters",
    },
    {
      area: "Infrastructure Contracts & Arbitration",
      areaHi: "अवसंरचना अनुबंध एवं मध्यस्थता",
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
      details: "Construction contract disputes, FIDIC/EPC/BOT contract interpretation, arbitration under Arbitration & Conciliation Act 1996, delay & disruption claims, variation disputes",
    },
    {
      area: "Forensic Engineering Evidence",
      areaHi: "फॉरेन्सिक इंजीनियरिंग साक्ष्य",
      icon: HardHat,
      color: "text-amber-600",
      bg: "bg-amber-50",
      details: "IS standard compliance (IS 2250:1981, IS 1199:2018, ASTM C1324), structural failure analysis, FSL report challenges, expert witness coordination",
    },
  ],

  uniqueEdge: [
    "Dual expertise: Civil Engineer + Senior Counsel — uniquely equipped to challenge FSL reports and forensic evidence on technical grounds",
    "Deep command of IS standards: knows IS 2250:1981 (masonry mortar) vs IS 1199:2018 (fresh concrete) — a distinction that has destroyed prosecution cases",
    "30+ years spanning both courtroom advocacy and construction project disputes",
    "Built Legal Luminaire — India's first accuracy-first AI legal workbench — as a practitioner, not a technologist",
    "Infrastructure arbitration expertise: understands CPWD manuals, BOQ disputes, and delay analysis that most advocates cannot read",
  ],

  projectRole: "Creator, Domain Architect & Lead Counsel",
  projectRoleHi: "निर्माता, डोमेन वास्तुकार एवं प्रमुख अधिवक्ता",
  projectDescription:
    "Legal Luminaire was conceived by Rajkumar Singh Chauhan from 30 years of frontline courtroom experience. Every accuracy rule, every IS standard guard, every citation verification tier, and every forensic FAQ was designed by a practitioner who has stood in an Indian sessions court and faced exactly these challenges. The tool is not built for legal tech — it is built for the next Hemraj case.",
};

// ── Stat Cards ────────────────────────────────────────────────────────────
const STATS = [
  { label: "Years Experience", labelHi: "वर्षों का अनुभव", value: "30+", icon: Award, color: "text-amber-500" },
  { label: "Practice Areas",   labelHi: "अभ्यास क्षेत्र",  value: "4",   icon: Layers, color: "text-primary" },
  { label: "Qualifications",   labelHi: "योग्यताएं",        value: "2",   icon: GraduationCap, color: "text-green-500" },
  { label: "Demo Cases Built", labelHi: "डेमो केस",         value: "26",  icon: BookOpen, color: "text-violet-500" },
];

export default function AboutCreatorPage() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">

      {/* ── Hero Card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 text-primary font-bold text-3xl border-2 border-primary/20">
            RC
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{CREATOR.name}</h1>
              <Badge className="bg-primary/10 text-primary border-primary/30">Creator</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">{CREATOR.nameHi}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="gap-1.5 text-sm font-semibold">
                <Scale className="h-3.5 w-3.5 text-primary" />{CREATOR.designation}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />{CREATOR.experience}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{CREATOR.designationHi} · {CREATOR.experienceHi}</p>
            {/* Links */}
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={CREATOR.linkedin} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3 w-3" /> LinkedIn
                </Button>
              </a>
              <a href={CREATOR.github} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Globe className="h-3 w-3" /> GitHub
                </Button>
              </a>
              <a href={CREATOR.repoUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-1.5 text-xs">
                  <BookOpen className="h-3 w-3" /> Legal Luminaire Repo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Card key={s.label} className="glass-surface hover-elevate text-center">
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <s.icon className={`h-7 w-7 ${s.color}`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
              <p className="text-[10px] text-muted-foreground/70">{s.labelHi}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Project Role ─────────────────────────────────────────────── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            Role in Legal Luminaire
            <span className="text-xs font-normal text-muted-foreground ml-1">· {CREATOR.projectRoleHi}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="mb-3 bg-primary text-primary-foreground">{CREATOR.projectRole}</Badge>
          <p className="text-sm leading-relaxed text-foreground/85">{CREATOR.projectDescription}</p>
        </CardContent>
      </Card>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Education · शिक्षा
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {CREATOR.education.map(edu => {
            const Icon = edu.icon;
            return (
              <div key={edu.degree} className={`flex items-start gap-4 rounded-xl border p-4 ${edu.bg}`}>
                <div className={`p-2.5 rounded-lg bg-white shadow-sm shrink-0`}>
                  <Icon className={`h-5 w-5 ${edu.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.degreeHi}</p>
                  <p className="mt-1.5 text-xs text-foreground/70 leading-relaxed">{edu.note}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Practice Areas ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Practice Areas · अभ्यास क्षेत्र
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CREATOR.practiceAreas.map(pa => {
            const Icon = pa.icon;
            return (
              <div key={pa.area} className={`rounded-xl border p-4 ${pa.bg} hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${pa.color}`} />
                  <span className="font-semibold text-sm">{pa.area}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1.5">{pa.areaHi}</p>
                <p className="text-xs text-foreground/75 leading-relaxed">{pa.details}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Unique Edge ──────────────────────────────────────────────── */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            The Dual-Expert Advantage
            <span className="text-xs font-normal text-muted-foreground">· Engineer + Advocate</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {CREATOR.uniqueEdge.map((edge, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/85">{edge}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/how-to-use">
          <Button variant="outline" className="w-full gap-1.5">
            <BookOpen className="h-4 w-4" /> How To Use
          </Button>
        </Link>
        <Link href="/demo-browser">
          <Button variant="outline" className="w-full gap-1.5">
            <Scale className="h-4 w-4" /> 26 Demo Cases
          </Button>
        </Link>
        <Link href="/ai-agents">
          <Button className="w-full gap-1.5">
            <Gavel className="h-4 w-4" /> Launch App
          </Button>
        </Link>
      </div>

    </div>
  );
}
