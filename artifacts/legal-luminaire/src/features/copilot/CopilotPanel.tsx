import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, X, Send, Plus, ChevronRight, 
  Sparkles, AlertCircle, RefreshCw 
} from "lucide-react";
import { CitationChip } from "./CitationChip";
import { integrationFlags } from "@/lib/featureFlags";
import { useCaseContext } from "@/context/CaseContext";

// Types for copilot functionality
export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  contentHi?: string;
  citations?: Citation[];
  timestamp: Date;
  isRefusal?: boolean;
  refusalReason?: string;
  retrySuggestions?: string[];
  retrySuggestionsHi?: string[];
}

export interface Citation {
  id: string;
  type: "document" | "timeline" | "register" | "standard";
  title: string;
  titleHi?: string;
  reference: string;
  status: "VERIFIED" | "SECONDARY";
  page?: number;
  section?: string;
}

export interface CopilotSession {
  id: string;
  name: string;
  messages: CopilotMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "copilot_sessions";

// Helper functions for localStorage
const loadSessions = (): CopilotSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
    }
  } catch (e) {
    console.error("Failed to load copilot sessions:", e);
  }
  return [];
};

const saveSessions = (sessions: CopilotSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save copilot sessions:", e);
  }
};

const generateSessionName = (messages: CopilotMessage[]): string => {
  const firstUserMessage = messages.find(m => m.role === "user");
  if (firstUserMessage) {
    const name = firstUserMessage.content.slice(0, 30);
    return name.length < firstUserMessage.content.length ? name + "..." : name;
  }
  return "New Conversation";
};

export function CopilotPanel() {
  const { selectedCase } = useCaseContext();
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<CopilotSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded[0].id : null;
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Persist sessions
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const createNewSession = useCallback(() => {
    const newSession: CopilotSession = {
      id: `session-${Date.now()}`,
      name: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
    setStreamError(null);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        // Create a new session if all are deleted
        const newSession: CopilotSession = {
          id: `session-${Date.now()}`,
          name: "New Conversation",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming || !activeSessionId) return;

    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date()
    };

    // Update session with user message
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const updated = {
          ...session,
          messages: [...session.messages, userMessage],
          updatedAt: new Date()
        };
        // Update session name if it's the first user message
        if (session.messages.length === 0) {
          updated.name = generateSessionName([userMessage]);
        }
        return updated;
      }
      return session;
    }));

    setInput("");
    setIsStreaming(true);
    setStreamError(null);

    try {
      // Try streaming first
      await streamResponse(activeSessionId, userMessage.content);
    } catch (error) {
      console.error("Streaming failed, falling back to non-streaming:", error);
      try {
        await fallbackResponse(activeSessionId, userMessage.content);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setStreamError("Failed to get response. Please try again.");
        
        // Add error message to session
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, {
                id: `msg-${Date.now()}`,
                role: "assistant",
                content: "I apologize, but I encountered an error processing your request. Please try again.",
                contentHi: "मैं क्षमा चाहता हूं, लेकिन मैं आपके अनुरोध को संसाधित करने में त्रुटि का सामना कर रहा हूं। कृपया पुनः प्रयास करें।",
                timestamp: new Date(),
                isRefusal: true,
                refusalReason: "technical_error"
              }],
              updatedAt: new Date()
            };
          }
          return session;
        }));
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const streamResponse = async (sessionId: string, query: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";
    const response = await fetch(`${API_BASE}/copilot/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        caseId: selectedCase?.id,
        sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is null");
    }

    const decoder = new TextDecoder();
    let assistantMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date()
    };

    // Add empty assistant message first
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, assistantMessage],
          updatedAt: new Date()
        };
      }
      return session;
    }));

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.content) {
              assistantMessage.content += parsed.content;
            }
            if (parsed.contentHi) {
              assistantMessage.contentHi = (assistantMessage.contentHi || "") + parsed.contentHi;
            }
            if (parsed.citations) {
              assistantMessage.citations = parsed.citations;
            }
            if (parsed.isRefusal) {
              assistantMessage.isRefusal = true;
              assistantMessage.refusalReason = parsed.refusalReason;
              assistantMessage.retrySuggestions = parsed.retrySuggestions;
              assistantMessage.retrySuggestionsHi = parsed.retrySuggestionsHi;
            }

            // Update the message in state
            setSessions(prev => prev.map(session => {
              if (session.id === sessionId) {
                return {
                  ...session,
                  messages: session.messages.map(msg => 
                    msg.id === assistantMessage.id ? assistantMessage : msg
                  ),
                  updatedAt: new Date()
                };
              }
              return session;
            }));
          } catch (e) {
            console.error("Failed to parse SSE data:", e);
          }
        }
      }
    }
  };

  const fallbackResponse = async (sessionId: string, query: string) => {
    const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";
    const response = await fetch(`${API_BASE}/copilot/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        caseId: selectedCase?.id,
        sessionId,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const assistantMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: data.content || "",
      contentHi: data.contentHi,
      citations: data.citations,
      timestamp: new Date(),
      isRefusal: data.isRefusal,
      refusalReason: data.refusalReason,
      retrySuggestions: data.retrySuggestions,
      retrySuggestionsHi: data.retrySuggestionsHi
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, assistantMessage],
          updatedAt: new Date()
        };
      }
      return session;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Escape to close panel
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Keyboard shortcut to open panel (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  // Focus trap when panel is open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    panelRef.current.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      panelRef.current?.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  if (!integrationFlags.ask_copilot) return null;

  if (!isOpen) {
    // Floating toggle button
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="lg"
        aria-label="Open Ask Luminaire panel"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="ml-2 hidden sm:inline">Ask Luminaire</span>
        <span className="ml-2 hidden sm:inline text-xs opacity-70">Ctrl+K</span>
      </Button>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed inset-y-0 right-0 w-[450px] bg-background border-l shadow-2xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Ask Luminaire panel"
    >
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Ask Luminaire</h2>
            <Badge variant="outline" className="text-xs">SYNTHETIC / DEMO</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {sessions.slice(0, 5).map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                activeSessionId === session.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {session.name}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewSession}
            className="shrink-0"
            aria-label="New conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div 
          className="space-y-4"
          role="log"
          aria-live="polite"
          aria-atomic="false"
        >
          {activeSession?.messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Ask about your case facts, contradictions, deadlines, or documents
              </p>
              <p className="text-sm text-muted-foreground/70">
                अपने केस के तथ्य, विरोधाभास, समयसीमा या दस्तावेजों के बारे में पूछें
              </p>
            </div>
          )}

          {activeSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.isRefusal ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{message.content}</p>
                        {message.contentHi && (
                          <p className="text-sm mt-1 opacity-80">{message.contentHi}</p>
                        )}
                      </div>
                    </div>
                    
                    {message.retrySuggestions && message.retrySuggestions.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium mb-2">Try asking differently:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.retrySuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(suggestion)}
                              className="text-xs px-2 py-1 rounded bg-background border hover:bg-background/80 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.contentHi && (
                      <p className="text-sm mt-2 leading-relaxed opacity-80">{message.contentHi}</p>
                    )}
                    
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-medium mb-2">Citations:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation) => (
                            <CitationChip key={citation.id} citation={citation} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isStreaming && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          {streamError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{streamError}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStreamError(null)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your case..."
            disabled={isStreaming}
            className="flex-1"
            aria-label="Ask Luminaire input"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            size="icon"
            aria-label="Send message"
          >
            {isStreaming ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Escape to close • All answers include citations
        </p>
      </div>
    </div>
  );
}