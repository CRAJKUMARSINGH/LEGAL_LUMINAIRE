import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const cases = [
  { id: "01", type: "Building collapse / forensic", court: "Sessions, Udaipur", charges: "IPC 304A + PCA" },
  { id: "02", type: "Bail — NDPS", court: "HC Rajasthan", charges: "NDPS §8/21/29" },
  { id: "03", type: "Discharge — NI Act", court: "MM Court Delhi", charges: "NI Act §138" },
  { id: "04", type: "Bail — Domestic Violence", court: "Sessions, Jaipur", charges: "IPC 498A + DV Act" },
  { id: "05", type: "Bail — Cyber Fraud", court: "Sessions, Mumbai", charges: "IT Act §66C/66D" },
  { id: "06", type: "Writ — Land Acquisition", court: "HC Rajasthan", charges: "Art. 226" },
  { id: "07", type: "Discharge — Medical Negligence", court: "Sessions, Delhi", charges: "IPC 304A" },
  { id: "08", type: "Bail — Road Accident", court: "Sessions, Jodhpur", charges: "IPC 304A/279" },
  { id: "09", type: "Bail — Forest Offence", court: "Sessions, Udaipur", charges: "Forest Act §26" },
  { id: "10", type: "Discharge — Arms Act", court: "Sessions, Jaipur", charges: "Arms Act §25/27" },
  { id: "11", type: "Discharge — Corruption", court: "Special Court", charges: "PCA §7/13" },
  { id: "12", type: "Bail — Murder", court: "HC Rajasthan", charges: "IPC 302" },
  { id: "13", type: "Discharge — POCSO", court: "Sessions, Kota", charges: "POCSO §4 + IPC 376" },
  { id: "14", type: "Bail — GST Fraud", court: "Sessions, Delhi", charges: "CGST Act §132" },
  { id: "15", type: "Writ — Environment", court: "NGT", charges: "EP Act + Water Act" },
  { id: "16", type: "Written Sub — Landlord/Tenant", court: "HC Rajasthan", charges: "Transfer of Property Act" },
  { id: "17", type: "Writ — Service Matter", court: "HC Rajasthan", charges: "Art. 226" },
  { id: "18", type: "Written Sub — Insurance", court: "Consumer Forum", charges: "Consumer Protection Act" },
  { id: "19", type: "Written Sub — Contract", court: "Commercial Court", charges: "Contract Act §73/74" },
  { id: "20", type: "Application — Maintenance", court: "Family Court", charges: "CrPC §125 / BNSS §144" },
  { id: "21", type: "Written Sub — Election", court: "HC Rajasthan", charges: "RPA §100" },
];

const TestCasesSection = () => {
  return (
    <section id="cases" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-primary mb-3 block">
            Battle-Tested
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span className="text-gradient-gold">21</span> Comprehensive Test Cases
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Spanning the full spectrum of Indian criminal and civil law — from Sessions Courts to High Courts, NGT to Consumer Forums.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto rounded-xl bg-glass"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-subtle">
                <th className="px-4 py-3 text-left font-mono text-xs text-primary uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary uppercase tracking-wider hidden md:table-cell">Court</th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary uppercase tracking-wider hidden lg:table-cell">Charges / Act</th>
                <th className="px-4 py-3 text-center font-mono text-xs text-primary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-muted-foreground">{c.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{c.type}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.court}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">{c.charges}</td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default TestCasesSection;
