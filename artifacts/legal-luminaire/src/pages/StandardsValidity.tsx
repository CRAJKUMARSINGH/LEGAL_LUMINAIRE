import { Printer, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StandardsValidity() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl font-bold text-foreground">मानक वैधता नोट</h1>
          <p className="text-sm text-muted-foreground">Standards Validity Note - Court Annexure (1 Page)</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Printer className="w-4 h-4" />
          प्रिंट करें
        </button>
      </div>

      <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-700 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800 text-sm">मूल आपत्ति (Foundational Objection)</p>
            <p className="text-sm text-rose-800 mt-1 leading-relaxed">
              अभियोजन ने IS 1199:2018 (fresh concrete standard) को existing stone masonry के hardened mortar पर लागू किया है।
              यह तकनीकी रूप से गलत अनुप्रयोग है, जिससे फोरेंसिक रिपोर्ट का आधार संदिग्ध हो जाता है।
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-base mb-3">सही मानक-स्थिति (Correct Standards Position)</h2>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>IS 2250:1981</strong> - चिनाई मोर्टार (masonry mortar) संदर्भ में मूल भारतीय मानक।</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>IS 3535:1986</strong> - नमूनाकरण अनुशासन, प्रतिनिधिक संग्रह और प्रलेखन संदर्भ।</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>ASTM C1324</strong> - Hardened masonry mortar examination हेतु उपयुक्त अंतर्राष्ट्रीय ढांचा।</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>ASTM C780 / BS EN 1015-2</strong> - field sampling/weather caution के सहायक संदर्भ।</span>
          </li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-base mb-3">न्यायालय हेतु संक्षिप्त प्रस्तुतिकरण</h2>
        <p className="text-sm leading-relaxed text-foreground">
          "माननीय न्यायालय, अभियोजन की फोरेंसिक रिपोर्ट का तकनीकी आधार गलत मानक पर निर्मित है।
          IS 1199:2018 ताज़ा कंक्रीट के लिए है, जबकि वर्तमान नमूने existing stone masonry के hardened mortar से संबंधित हैं।
          सही मानक-ढांचा IS 2250, IS 3535 एवं ASTM C1324 है। अतः रिपोर्ट को निर्णायक दोषारोपण सामग्री के रूप में स्वीकार करना सुरक्षित नहीं है।"
        </p>
      </div>
    </div>
  );
}

