# -*- coding: utf-8 -*-
"""Generate DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html - Full A4 Hindi PDF"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

OUT = "DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html"

HEAD = '''<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>उन्मोचन प्रार्थना-पत्र - हेमराज वरदार v5 (2026)</title>
<style>
@page{size:A4;margin:15mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Noto Serif Devanagari","Mangal","Arial Unicode MS",serif;font-size:11pt;line-height:1.75;color:#000;background:#fff;padding:20mm;max-width:210mm;margin:0 auto}
@media print{body{padding:0}.np{display:none}}
.np{background:#eef2ff;border:1px solid #99b;padding:10px;margin-bottom:20px;font-family:Arial,sans-serif;font-size:10pt;border-radius:6px}
button{background:#1a56db;color:#fff;border:none;padding:8px 20px;font-size:10pt;border-radius:4px;cursor:pointer;margin-left:12px}
.ch{text-align:center;border-bottom:3pt solid #000;padding-bottom:10pt;margin-bottom:16pt}
.cn2{font-size:13pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
.sh{font-weight:bold;text-decoration:underline;text-transform:uppercase;margin:16pt 0 8pt 0;font-size:11pt}
.gh{font-weight:bold;margin:12pt 0 4pt 0}
p{margin-bottom:8pt;text-align:justify}
ul,ol{padding-left:22pt;margin:6pt 0 8pt 0}
li{margin-bottom:4pt}
table{width:100%;border-collapse:collapse;margin:8pt 0 10pt 0;font-size:10pt}
th{border:1pt solid #000;padding:4pt 6pt;text-align:left;background:#f0f0f0;font-weight:bold}
td{border:1pt solid #000;padding:4pt 6pt}
.sig-block{margin-top:32pt}
.sig-line{border-top:1pt solid #000;width:200pt;margin:40pt 0 4pt 0}
.caution{background:#fffbe6;border:1pt solid #e6c200;padding:8pt 10pt;margin:10pt 0;font-size:10pt}
.v{color:#006600;font-weight:bold}
.s{color:#0000cc;font-weight:bold}
.pend{color:#cc0000;font-weight:bold}
.oa{background:#f8f8ff;border-left:3pt solid #1a56db;padding:8pt 12pt;margin:8pt 0}
.cn{margin-top:20pt;font-size:8pt;font-style:italic;color:#555;border-top:1pt solid #ccc;padding-top:6pt}
.hl{background:#fffbe6;padding:4pt 8pt;border-left:3pt solid #e6c200;margin:6pt 0}
.blocked{background:#fff0f0;border:1pt solid #e00;padding:3pt 8pt;font-size:9pt;color:#c00;margin:3pt 0}
</style>
</head>
<body>
'''

BODY_PARTS = []

BODY_PARTS.append('''
<div class="np">
  <strong>उन्मोचन प्रार्थना-पत्र v5 — हेमराज वरदार | विशेष सत्र वाद 1/2025 | उदयपुर</strong>
  &nbsp;|&nbsp; <button onclick="window.print()">🖨 Print / Save as PDF</button>
  &nbsp;(Paper=A4, Margins=None)
</div>

<!-- न्यायालय शीर्षक -->
<div class="ch">
  <div class="cn2">माननीय विशेष न्यायाधीश महोदय</div>
  <div style="font-size:11pt;margin-top:4pt">भ्रष्टाचार निवारण अधिनियम प्रकरण, उदयपुर (राजस्थान)</div>
  <div style="margin-top:8pt;font-size:11pt">
    <strong>विशेष सत्र वाद संख्या : 1/2025</strong><br>
    एफआईआर संख्या : 496/2011 दिनांक 28.12.2011<br>
    प्रकरण : राज्य बनाम हेमराज वरदार एवं अन्य
  </div>
  <div style="margin-top:10pt;font-size:11pt">
    <strong>आवेदक/अभियुक्त :</strong> हेमराज वरदार, निदेशक, एम/एस प्रामाण कंस्ट्रक्शन प्रा. लि., उदयपुर
  </div>
  <div style="margin-top:6pt;font-size:12pt;font-weight:bold">
    प्रार्थना-पत्र : धारा 250 BNSS 2023 / धारा 227 CrPC<br>
    आरोपमुक्ति (Discharge) हेतु
  </div>
</div>
''')

BODY_PARTS.append('''
<div class="sh">भाग-1 : तथ्यात्मक पृष्ठभूमि</div>
<p><strong>1.</strong> यह अभियोजन दिनांक 28.12.2011 को महाराणा प्रताप स्टेडियम, उदयपुर की बाहरी दीवार के आंशिक ढहने की घटना पर आधारित है। अभियोजन का सम्पूर्ण आधार एक फोरेंसिक रिपोर्ट है जिसमें सीमेंट मोर्टार के नमूनों को "फेल" दर्शाया गया है।</p>
<p><strong>2.</strong> अभियोजन का आरोप है कि निर्माण/मरम्मत कार्य की गुणवत्ता न्यून होने से घटना हुई, और इस आधार पर IPC §304A, §337, §338 तथा भ्रष्टाचार निवारण अधिनियम के अंतर्गत अभियुक्त पर दायित्व आरोपित किया गया।</p>
<p><strong>3.</strong> अभियुक्त का सुसंगत प्रतिरक्षा-विधान यह है कि —</p>
<ul>
  <li>नमूना-संग्रह प्रतिकूल मौसम (भारी वर्षा/तूफान) में हुआ;</li>
  <li>अभियोजन ने <strong>गलत IS मानक (IS 1199:2018 — ताज़ा कंक्रीट)</strong> को कठोर मोर्टार पर लागू किया — यह मूलभूत वैज्ञानिक त्रुटि है;</li>
  <li>नमूने प्रतिनिधिक ढंग से नहीं लिए गए;</li>
  <li>ठेकेदार प्रतिनिधि की अनुपस्थिति — IS 3535:1986 Cl. 4.1 का उल्लंघन;</li>
  <li>तीन-भाग विभाजन (referee sample) नहीं किया — IS 3535:1986 Cl. 5.7.5 का उल्लंघन;</li>
  <li>श्रृंखला-अभिरक्षा (Chain of Custody) का कोई दस्तावेजी रिकॉर्ड नहीं;</li>
  <li>पंचनामा/जब्ती-श्रृंखला में घोर कमी;</li>
  <li>घटना का कारण Force Majeure — भारी वर्षा (NBC 2016 §3.4)।</li>
</ul>
<p><strong>4.</strong> अभियोजन की पूरी संरचना एक ऐसे फोरेंसिक आधार पर खड़ी है जो प्रक्रियात्मक, वैज्ञानिक और विधिक कसौटी पर अस्थिर है। अतः इस चरण में अभियुक्त को आरोपमुक्त किया जाना न्यायहित में आवश्यक है।</p>
''')

BODY_PARTS.append('''
<div class="sh">भाग-2 : डिस्चार्ज के विधिक सिद्धांत</div>
<p><strong>5.</strong> डिस्चार्ज के चरण पर न्यायालय को यह देखना होता है कि उपलब्ध सामग्री से क्या प्रथमदृष्टया (prima facie) ऐसा ठोस आधार बनता है जिससे अभियुक्त के विरुद्ध आरोप तय किए जाएँ।</p>
<p><strong>6.</strong> माननीय उच्चतम न्यायालय ने <strong>Union of India v. Prafulla Kumar Samal (1979) 3 SCC 4, Para 10</strong> <span class="v">[VERIFIED]</span> में स्पष्ट किया है — <em>"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."</em></p>
<p><strong>7.</strong> <strong>State of Bihar v. Ramesh Singh (1977) 4 SCC 39, Para 5</strong> <span class="v">[VERIFIED]</span> — <em>"At the stage of framing of charge, the Court has to see whether the material produced makes out a prima facie case. If the material discloses nothing more than suspicion, discharge is mandatory."</em></p>
<p><strong>8.</strong> जहाँ अभियोजन की केंद्रीय सामग्री तकनीकी/फोरेंसिक रिपोर्ट हो, वहाँ उस रिपोर्ट की बुनियादी विश्वसनीयता — sample integrity, custody integrity, scientific foundation — पहले सिद्ध होना आवश्यक है।</p>
''')
