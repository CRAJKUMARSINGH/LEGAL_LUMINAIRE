import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight } from "lucide-react";
import { useCaseContext } from "@/context/CaseContext";
import {
  caseInfo, caseLawMatrix, standardsMatrix,
  timelineEvents, caseDocuments,
} from "@/data/caseData";

interface SuggestedQuestion {
  id: string;
  question: string;
  questionHi: string;
  category: "facts" | "contradictions" | "deadlines" | "documents" | "precedents" | "chronology";
}

const generateSuggestedQuestions = (): SuggestedQuestion[] => {
  const questions: SuggestedQuestion[] = [];

  // Facts-based questions
  if (caseInfo) {
    questions.push({
      id: "facts-1",
      question: "What are the key facts of this case?",
      questionHi: "इस केस के मुख्य तथ्य क्या हैं?",
      category: "facts"
    });
    questions.push({
      id: "facts-2",
      question: "Who are the main parties involved?",
      questionHi: "मुख्य पक्ष कौन हैं?",
      category: "facts"
    });
  }

  // Contradictions-based questions
  const pendingCitations = caseLawMatrix.filter(c => c.status === "PENDING");
  if (pendingCitations.length > 0) {
    questions.push({
      id: "contradictions-1",
      question: "Summarise the contradictions found so far",
      questionHi: "अब तक मिले विरोधाभासों का सारांश दें",
      category: "contradictions"
    });
    questions.push({
      id: "contradictions-2",
      question: `What are the ${pendingCitations.length} pending citation issues?`,
      questionHi: `${pendingCitations.length} लंबित उद्धरण मुद्दे क्या हैं?`,
      category: "contradictions"
    });
  }

  // Deadlines-based questions
  const timelineWithNotes = timelineEvents.filter(e => e.note);
  if (timelineWithNotes.length > 0) {
    questions.push({
      id: "deadlines-1",
      question: "What are the pending deadlines?",
      questionHi: "लंबित समयसीमा क्या हैं?",
      category: "deadlines"
    });
    questions.push({
      id: "deadlines-2",
      question: "What is due this week?",
      questionHi: "इस सप्ताह क्या देय है?",
      category: "deadlines"
    });
  }

  // Chronology-based questions (Week 10)
  if (caseInfo) {
    questions.push({
      id: "chronology-1",
      question: "What happened after the arrest?",
      questionHi: "गिरफ्तारी के बाद क्या हुआ?",
      category: "chronology"
    });
    questions.push({
      id: "chronology-2",
      question: "Show me the case timeline events",
      questionHi: "मुझे केस टाइमलाइन घटनाएं दिखाएं",
      category: "chronology"
    });
  }

  // Documents-based questions
  if (caseDocuments.length > 0) {
    questions.push({
      id: "documents-1",
      question: "Which documents support the alibi?",
      questionHi: "कौन से दस्तावेज एलिबाई का समर्थन करते हैं?",
      category: "documents"
    });
    questions.push({
      id: "documents-2",
      question: "What evidence gaps exist in the documents?",
      questionHi: "दस्तावेजों में क्या सबूत अंतराल मौजूद हैं?",
      category: "documents"
    });
  }

  // Precedents-based questions
  if (caseLawMatrix.length > 0) {
    questions.push({
      id: "precedents-1",
      question: "Which precedents are most relevant to this case?",
      questionHi: "इस केस के लिए कौन से पूर्वाधिकार सबसे प्रासंगिक हैं?",
      category: "precedents"
    });
    questions.push({
      id: "precedents-2",
      question: "How do the verified citations strengthen the defence?",
      questionHi: "सत्यापित उद्धरण रक्षा को कैसे मजबूत करते हैं?",
      category: "precedents"
    });
  }

  // Standards-based questions
  if (standardsMatrix.length > 0) {
    questions.push({
      id: "standards-1",
      question: "Which standards are referenced in this case?",
      questionHi: "इस केस में कौन से मानक संदर्भित हैं?",
      category: "precedents"
    });
  }

  // Return up to 3 questions, prioritizing by category
  return questions.slice(0, 3);
};

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  maxQuestions?: number;
}

export function SuggestedQuestions({ onQuestionClick, maxQuestions = 3 }: SuggestedQuestionsProps) {
  const { selectedCase } = useCaseContext();
  const questions = React.useMemo(() => generateSuggestedQuestions(), [selectedCase]);

  if (questions.length === 0) {
    return null;
  }

  const displayQuestions = questions.slice(0, maxQuestions);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">Suggested Questions</p>
        <Badge variant="outline" className="text-xs">SYNTHETIC</Badge>
      </div>
      
      <div className="space-y-2">
        {displayQuestions.map((q) => (
          <Button
            key={q.id}
            variant="outline"
            size="sm"
            onClick={() => onQuestionClick(q.question)}
            className="w-full justify-start text-left h-auto py-2 px-3 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm">{q.question}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{q.questionHi}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
          </Button>
        ))}
      </div>
    </div>
  );
}