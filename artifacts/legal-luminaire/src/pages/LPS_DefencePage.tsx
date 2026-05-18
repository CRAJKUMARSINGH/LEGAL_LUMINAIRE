import { useState } from "react";
import { mergedGrounds, prayerMerged } from "@/data/mergedGrounds";
import { Printer, Scale } from "lucide-react";

export default function DefencePage() {
  const [lang, setLang] = useState<"both" | "hi" | "en">("both");

  const show_hi = lang === "both" || lang === "hi";
  const show_en = lang === "both" || lang === "en";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">पूर्ण प्रतिरक्षा — Full Defence</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            नौ आधार · तर्क, IS संदर्भ एवं न्यायिक पूर्व-निर्णय — एकीकृत सतत अनुच्छेद शैली<br />
            Nine grounds · Logic, IS references &amp; precedents — unified continuous paragraph style
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
            {(["both", "hi", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-2 transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {l === "both" ? "हिंदी + English" : l === "hi" ? "हिंदी" : "English"}
              </button>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">

        {/* Letterhead */}
        <div className="bg-accent text-accent-foreground text-center px-8 py-6 border-b border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scale className="w-6 h-6 text-sidebar-primary" />
            <span className="text-lg font-bold tracking-wide">Legal Luminaire</span>
          </div>
          {show_hi && (
            <h2 className="text-base font-bold text-sidebar-primary mt-1">
              अनुचित नमूनाकरण एवं परीक्षण के विरुद्ध ठेकेदार की विस्तृत प्रतिरक्षा
            </h2>
          )}
          {show_en && (
            <h2 className={`text-base font-semibold mt-1 ${show_hi ? "text-accent-foreground/70" : "text-sidebar-primary"}`}>
              Contractor's Comprehensive Defence Against Improper Sampling &amp; Testing Allegations
            </h2>
          )}
        </div>

        {/* Preamble */}
        <div className="px-8 py-6 border-b border-border/40 bg-muted/20 space-y-3">
          {show_hi && (
            <p className="text-sm leading-[2] text-foreground">
              <strong className="text-primary">प्रास्ताविका —</strong> हम, ठेकेदार, अधोहस्ताक्षरी, उक्त जांच/कारण बताओ नोटिस के उत्तर में यह औपचारिक प्रतिरक्षा प्रस्तुत करते हैं। दोषपूर्ण कारीगरी के सभी आरोपों को हम <strong>स्पष्ट रूप से नकारते हैं</strong> क्योंकि वे तथ्य के विपरीत, वैज्ञानिक दृष्टि से अस्वीकार्य और कानूनी दृष्टि से अटिकाऊ हैं। जांच प्राधिकरण द्वारा उपयोग किया गया नमूनाकरण और परीक्षण अभ्यास निम्नलिखित नौ स्वतंत्र, संचयी और घातक आधारों द्वारा दोषपूर्ण सिद्ध होता है — जिनमें से प्रत्येक अकेले ही प्रतिकूल निष्कर्ष के साक्ष्य-आधार को नष्ट करने के लिए पर्याप्त है, और सब मिलकर निर्विवाद रूप से अभिभावी हैं।
            </p>
          )}
          {show_en && (
            <p className={`text-sm leading-[2] ${show_hi ? "text-muted-foreground italic" : "text-foreground"}`}>
              <strong className="text-primary not-italic">Preamble —</strong> We, the Contractor, hereby submit this formal defence in response to the above Enquiry / Show Cause Notice and <strong className="not-italic">unequivocally deny</strong> all allegations of defective workmanship as being contrary to fact, scientifically untenable, and legally unsustainable. The sampling and testing exercise relied upon by the Enquiry Authority is vitiated by the following nine independent, cumulative, and fatal grounds — each of which is individually sufficient to destroy the evidentiary basis of any adverse finding, and all of which together are overwhelmingly conclusive.
            </p>
          )}
        </div>

        {/* Grounds — each is ONE continuous paragraph */}
        <div className="divide-y divide-border/40">
          {mergedGrounds.map((ground) => (
            <section key={ground.id} className="px-8 py-7">

              {/* Heading */}
              <div className="flex items-start gap-4 mb-5">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">
                  {ground.id}
                </span>
                <div>
                  {show_hi && (
                    <h3 className="font-bold text-foreground text-[15px] leading-snug">
                      {ground.heading_hi}
                    </h3>
                  )}
                  {show_en && (
                    <h3 className={`text-[14px] leading-snug font-semibold ${show_hi ? "text-muted-foreground mt-0.5" : "text-foreground font-bold text-[15px]"}`}>
                      {ground.heading_en}
                    </h3>
                  )}
                </div>
              </div>

              {/* Single continuous paragraph — Hindi */}
              {show_hi && (
                <p className="text-[13.5px] leading-[2.05] text-foreground text-justify hyphens-auto">
                  {ground.para_hi}
                </p>
              )}

              {/* Single continuous paragraph — English (indented / italic when both shown) */}
              {show_en && (
                <p className={`text-[13.5px] leading-[2.05] text-justify hyphens-auto ${
                  show_hi
                    ? "mt-4 pl-5 border-l-2 border-primary/25 text-muted-foreground italic"
                    : "text-foreground"
                }`}>
                  {ground.para_en}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Prayer */}
        <div className="mx-8 my-6 rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-primary" />
            <span className="font-bold uppercase tracking-wider text-primary text-xs">
              {show_hi ? "प्रार्थना" : ""}
              {show_hi && show_en ? " / " : ""}
              {show_en ? "Prayer" : ""}
            </span>
          </div>
          {show_hi && (
            <p className="text-[13.5px] leading-[2] text-foreground">{prayerMerged.hi}</p>
          )}
          {show_hi && show_en && <div className="my-3 border-t border-border/40" />}
          {show_en && (
            <p className={`text-[13.5px] leading-[2] ${show_hi ? "text-muted-foreground italic" : "text-foreground"}`}>
              {prayerMerged.en}
            </p>
          )}
        </div>

        {/* Signature */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end flex-wrap gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {show_hi ? "तारीख" : ""}{show_hi && show_en ? " / " : ""}{show_en ? "Date" : ""}
              </div>
              <div className="text-sm font-medium text-foreground border-b border-foreground/50 w-52 pb-1">
                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground border-b border-foreground/50 w-52 pb-6 mb-1" />
              <div className="text-xs text-muted-foreground">
                {show_hi ? "अधिकृत हस्ताक्षरकर्ता" : ""}{show_hi && show_en ? " / " : ""}{show_en ? "Authorised Signatory" : ""}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-5 italic leading-relaxed">
            {show_hi
              ? "बिना किसी अधिकार और उपाय के पूर्वाग्रह के। यह प्रतिनिधित्व प्रारंभिक तथ्यों पर आधारित है; ठेकेदार अतिरिक्त साक्ष्य, कानूनी प्रस्तुतियों और विशेषज्ञ राय के साथ इन आधारों को पूरक करने का अधिकार सुरक्षित रखता है।"
              : ""}
            {show_hi && show_en ? " | " : ""}
            {show_en
              ? "Without prejudice to all rights and remedies. The Contractor reserves the right to supplement these grounds with additional evidence, legal submissions, and expert opinions."
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
