import { Link } from "wouter";
import { Scale, BookOpen, Table2, CheckSquare, Mic, ArrowRight, Shield, AlertTriangle, Clock } from "lucide-react";

const cards = [
  {
    path: "/discharge-application",
    icon: Scale,
    title: "प्रार्थना-पत्र",
    subtitle: "Discharge Application",
    desc: "धारा २५० BNSS के अंतर्गत सम्पूर्ण हिंदी प्रार्थना-पत्र — न्यायालय में सीधे फाइल करने योग्य",
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    iconColor: "text-amber-700 bg-amber-100",
    badge: "25+ पृष्ठ",
  },
  {
    path: "/case-research",
    icon: BookOpen,
    title: "विधिक शोध",
    subtitle: "Legal Research",
    desc: "सर्वोच्च न्यायालय एवं उच्च न्यायालय के निर्णय, BIS मानक, CPWD नियमावली एवं अंतर्राष्ट्रीय मानक",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconColor: "text-blue-700 bg-blue-100",
    badge: "15+ निर्णय",
  },
  {
    path: "/cross-reference",
    icon: Table2,
    title: "क्रॉस-रेफरेंस मैट्रिक्स",
    subtitle: "Cross Reference Matrix",
    desc: "प्रत्येक तथ्यात्मक उल्लंघन → IS धारा → न्यायिक निर्णय का सारणीबद्ध विश्लेषण",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    iconColor: "text-green-700 bg-green-100",
    badge: "सारणी",
  },
  {
    path: "/oral-arguments",
    icon: Mic,
    title: "मौखिक तर्क",
    subtitle: "Oral Arguments",
    desc: "5 तैयार-उपयोगी मौखिक तर्क अनुच्छेद — न्यायालय में तुरंत प्रयोग योग्य",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconColor: "text-purple-700 bg-purple-100",
    badge: "5 तर्क",
  },
  {
    path: "/filing-checklist",
    icon: CheckSquare,
    title: "फाइलिंग चेकलिस्ट",
    subtitle: "Filing Checklist",
    desc: "प्रार्थना-पत्र दाखिल करने से पूर्व सम्पूर्ण जाँच-सूची — एक पृष्ठ में सब कुछ",
    color: "bg-red-50 border-red-200 hover:border-red-400",
    iconColor: "text-red-700 bg-red-100",
    badge: "1 पृष्ठ",
  },
];

const keyPoints = [
  {
    icon: AlertTriangle,
    title: "गलत मानक + वर्षा में नमूनाकरण",
    desc: "IS 1199 (fresh concrete) का गलत प्रयोग; सही संदर्भ hardened masonry mortar standards हैं",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: Shield,
    title: "श्रृंखला-अभिरक्षा शून्य",
    desc: "सर्वोच्च न्यायालय (कट्टावेल्लई 2025) — पूर्ण अभिरक्षा दस्तावेज़ीकरण अनिवार्य",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Clock,
    title: "प्राकृतिक न्याय का हनन",
    desc: "ठेकेदार प्रतिनिधि की अनुपस्थिति — IS 3535 एवं नैसर्गिक न्याय का उल्लंघन",
    color: "text-blue-600 bg-blue-50",
  },
];

export default function Home() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-amber-900 to-amber-700 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Legal Luminaire</h1>
            <p className="text-amber-200 text-sm mt-1">अधिवक्ता शोध एवं प्रारूप मंच</p>
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-amber-300 text-xs uppercase tracking-wide">न्यायालय</span>
                  <p className="font-medium mt-0.5">Special Session Judge (PC Act), Udaipur, Rajasthan</p>
                </div>
                <div>
                  <span className="text-amber-300 text-xs uppercase tracking-wide">वाद संख्या</span>
                  <p className="font-medium mt-0.5">Special Session Case No. 1/2025</p>
                </div>
                <div>
                  <span className="text-amber-300 text-xs uppercase tracking-wide">अभियुक्त</span>
                  <p className="font-medium mt-0.5">हेमराज वर्दार (निदेशक, M/s प्रमाण कंस्ट्रक्शन)</p>
                </div>
                <div>
                  <span className="text-amber-300 text-xs uppercase tracking-wide">FIR</span>
                  <p className="font-medium mt-0.5">496/2011 दिनांक 28-12-2011</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">प्रमुख बचाव बिंदु</h2>
        <p className="text-sm text-muted-foreground mb-4">Key Defence Points at a Glance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {keyPoints.map((kp) => {
            const Icon = kp.icon;
            return (
              <div key={kp.title} className={`rounded-xl p-4 ${kp.color}`}>
                <Icon className="w-5 h-5 mb-2" />
                <h3 className="font-semibold text-sm mb-1">{kp.title}</h3>
                <p className="text-xs leading-relaxed opacity-90">{kp.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">दस्तावेज़ नेविगेशन</h2>
        <p className="text-sm text-muted-foreground mb-4">Document Navigation</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.path} href={card.path}>
                <div className={`group border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${card.color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium bg-white/80 px-2 py-0.5 rounded-full border">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{card.subtitle}</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{card.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    देखें <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold text-base mb-3">आरोप एवं बचाव — सारांश</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-2">अभियोजन का आरोप</h4>
            <ul className="text-sm space-y-2">
              {[
                "महाराणा प्रताप स्टेडियम की बाहरी दीवार का आंशिक ध्वंस",
                "फोरेंसिक रिपोर्ट में सीमेंट मोर्टार 'अनुत्तीर्ण' घोषित",
                "IPC 304A/337/338 + भ्रष्टाचार निवारण अधिनियम",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-600 mb-2">बचाव के मुख्य आधार</h4>
            <ul className="text-sm space-y-2">
              {[
                "गलत मानक (IS 1199) का प्रयोग + वर्षा/तूफान में नमूनाकरण",
                "सतह संदूषण — बाहरी 5-10mm परत परीक्षित",
                "श्रृंखला-अभिरक्षा पूर्णतः अनुपस्थित",
                "ठेकेदार प्रतिनिधि अनुपस्थित — नैसर्गिक न्याय हनन",
                "पंचनामा शून्य — साक्ष्य अग्राह्य",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
