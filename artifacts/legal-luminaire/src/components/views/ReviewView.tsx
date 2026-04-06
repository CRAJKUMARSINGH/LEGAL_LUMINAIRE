import { useState } from "react";
import { 
  CheckCircle2, AlertCircle, Save, ArrowLeft, 
  Eye, FileText, ChevronRight, Edit3, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ReviewView = ({ extraction, onSave, onBack }: any) => {
  const [editedData, setEditedData] = useState(extraction);

  const handleUpdateEvent = (index: number, field: string, value: string) => {
    const updatedEvents = [...editedData.timeline_events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEditedData({ ...editedData, timeline_events: updatedEvents });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Upload
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Human-in-the-Loop Review
          </h2>
        </div>
        <Button onClick={() => onSave(editedData)} className="gap-2 bg-slate-900 hover:bg-slate-800">
          <Save className="w-4 h-4" /> Approve & Launch Case
        </Button>
      </div>

      {/* Split Screen */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: Document Preview */}
        <div className="w-1/2 border-r bg-slate-200 flex flex-col p-8 overflow-hidden">
          <div className="bg-slate-300/50 rounded-2xl border-2 border-dashed border-slate-400/50 flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
             <Eye className="w-12 h-12 opacity-20" />
             <div className="text-center">
                <p className="font-bold">Original Document View</p>
                <p className="text-xs">PDF Render Pipeline Active...</p>
             </div>
             {/* Note: In production, this would be an IFrame or PDF.js viewer */}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             <FileText className="w-3 h-3" /> Source: FIR_2011_001.pdf
          </div>
        </div>

        {/* RIGHT: Extraction Review */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden">
          <ScrollArea className="flex-1 p-8">
            <div className="max-w-xl mx-auto space-y-10 pb-20">
              
              {/* Classification Info */}
              <section className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Case Classification</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary">AI MAPPED</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Incident Type</label>
                       <Input value={editedData.incident_type} onChange={(e) => setEditedData({...editedData, incident_type: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Jurisdiction</label>
                       <Input value={editedData.jurisdiction} onChange={(e) => setEditedData({...editedData, jurisdiction: e.target.value})} />
                    </div>
                 </div>
              </section>

              {/* Accused List */}
              <section className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Accused Persons / Entities</h3>
                    <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold">+ ADD PERSON</Button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {editedData.accused_names.map((name: string, i: number) => (
                      <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1 gap-2 border-slate-200">
                        {name}
                        <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                 </div>
              </section>

              {/* Timeline Editor */}
              <section className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Extracted Timeline</h3>
                    <div className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                       <AlertCircle className="w-3 h-3" /> VERIFY DATES
                    </div>
                 </div>
                 <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                    {editedData.timeline_events.map((evt: any, i: number) => (
                      <div key={i} className="relative bg-slate-50 p-4 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                        <div className="absolute -left-[25px] top-6 w-4 h-4 rounded-full bg-white border-2 border-primary z-10" />
                        <div className="grid grid-cols-4 gap-3">
                           <div className="col-span-1">
                              <Input className="text-xs font-mono" value={evt.date} onChange={(e) => handleUpdateEvent(i, "date", e.target.value)} />
                           </div>
                           <div className="col-span-3">
                              <Input className="text-xs font-bold mb-2" value={evt.event} onChange={(e) => handleUpdateEvent(i, "event", e.target.value)} />
                              <textarea 
                                className="w-full text-[11px] bg-transparent border-none focus:ring-0 text-slate-500 resize-none h-12"
                                value={evt.description || "No additional description available."}
                                onChange={(e) => handleUpdateEvent(i, "description", e.target.value)}
                              />
                           </div>
                        </div>
                        {evt.grounding && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/50 p-1 rounded">
                             <Edit3 className="w-3 h-3" /> GROUNDED: {evt.grounding}
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </section>

              <div className="pt-10 border-t flex flex-col items-center gap-4 text-center">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <p className="text-sm font-bold">Review Complete?</p>
                    <p className="text-xs text-slate-500">Approving will instantiate the Case Dashboard with this data.</p>
                 </div>
              </div>

            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
};
