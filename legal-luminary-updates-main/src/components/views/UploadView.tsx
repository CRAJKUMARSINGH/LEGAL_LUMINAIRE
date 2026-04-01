import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UploadView = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Case Documents</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload PDFs, .md, .docx, or judgment images for RAG indexing
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-foreground font-medium">Drop files here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-1">
          Supports: PDF, MD, DOCX, JPG, PNG
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.md,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
            <Button className="w-full mt-3" disabled>
              <Upload className="h-4 w-4 mr-2" /> Index to Vector DB
            </Button>
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Requires backend connection (ChromaDB / Pinecone)
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <p className="font-medium text-amber-700 mb-2">Backend Integration Required</p>
          <p>
            File upload and RAG indexing require the Python backend with ChromaDB/Pinecone vector store.
            Once deployed, uploaded files will be auto-indexed and available to the AI Drafter agents.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
