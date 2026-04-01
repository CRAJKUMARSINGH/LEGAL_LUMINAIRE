import { useState, useCallback, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  sessionId: number;
  onUploadSuccess: () => void;
}

export function DocumentUpload({ sessionId, onUploadSuccess }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload — real backend integration via /api/legal/upload
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Document uploaded", description: `${file.name} added to session.` });
      onUploadSuccess();
    } catch {
      toast({ title: "Upload failed", description: "Error uploading document.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(processFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(processFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
        isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} multiple accept=".txt,.md,.pdf,.docx" />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Uploading document...</p>
        </div>
      ) : (
        <>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <UploadCloud className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground text-center">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground text-center mt-1">TXT, MD, PDF, or DOCX</p>
        </>
      )}
    </div>
  );
}
