import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const samplePrompts = [
  "Draft superior Hindi discharge application u/s 250 BNSS for Hemraj Vardar",
  "Generate cross-reference matrix for chain-of-custody arguments",
  "Verify Kattavellai @ Devakar citation and extract relevant paras",
  "Draft prayer clause with verified precedents only",
];

export const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "नमस्कार। मैं Legal Luminaire AI हूँ — आपका zero-hallucination legal defence drafting assistant।\n\n**Current Case:** Special Session Case No. 1/2025 (Udaipur) — Stadium Wall Collapse\n\nI can help you:\n• Draft Hindi/English discharge applications\n• Verify case law citations on official sources\n• Generate cross-reference matrices\n• Check BIS/IS/ASTM standard clauses\n\n⚠️ **Note:** This frontend is a UI prototype. Backend agents (Researcher, Verifier, Drafter) require Python + LangChain + CrewAI deployment.\n\nक्या सहायता चाहिए?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: messages.length,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    const botMsg: Message = {
      id: messages.length + 1,
      role: "assistant",
      content:
        "⚠️ **Backend Not Connected**\n\nThis UI is ready to connect to the multi-agent backend (LangChain + CrewAI). To enable live responses:\n\n1. Deploy the Python backend with `legal_agent.py`\n2. Configure API endpoint in environment variables\n3. Connect Tavily/Serper API keys for web verification\n4. Set up ChromaDB/Pinecone for RAG\n\nOnce connected, I will:\n- Search & verify every citation on indiankanoon.org\n- Check BIS/IS clauses on archive.org\n- Cross-reference uploaded case documents\n- Generate court-ready Hindi drafts\n\nFor now, explore the **Case Law Matrix**, **Standards Matrix**, and **Timeline** tabs for pre-loaded case data.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Legal Drafter</h2>
          <p className="text-xs text-muted-foreground">
            Multi-agent system — Researcher · Verifier · Drafter · Formatter
          </p>
        </div>
        <Badge variant="outline" className="ml-auto gap-1 text-amber-600 border-amber-500/30">
          <AlertCircle className="h-3 w-3" /> Backend Pending
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <Card
              className={`p-4 max-w-[75%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <p className="text-[10px] mt-2 opacity-60">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </Card>
            {msg.role === "user" && (
              <div className="rounded-full bg-muted p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick prompts */}
      <div className="px-6 pb-2 flex flex-wrap gap-2">
        {samplePrompts.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-xs rounded-full border border-border px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Sparkles className="inline h-3 w-3 mr-1" />
            {p.length > 50 ? p.slice(0, 50) + "…" : p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Draft superior Hindi discharge application u/s 250 BNSS for Hemraj Vardar..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} size="icon" className="shrink-0 h-[60px] w-[60px]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
