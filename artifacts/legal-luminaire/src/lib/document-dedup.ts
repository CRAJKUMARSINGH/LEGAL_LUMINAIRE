/**
 * Document Deduplication — Legal Luminaire
 * Detects duplicate uploaded documents by content hash.
 */

export interface DocumentEntry {
  id: string;
  filename: string;
  size: number;
  contentHash: string;
  uploadedAt: number;
}

export interface DedupResult {
  unique: DocumentEntry[];
  duplicates: Array<{ original: DocumentEntry; duplicate: DocumentEntry }>;
  hasDuplicates: boolean;
  summary: string;
}

export async function hashContent(content: ArrayBuffer): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", content);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const bytes = new Uint8Array(content);
  let hash = 5381;
  for (const b of bytes) hash = ((hash << 5) + hash) ^ b;
  return (hash >>> 0).toString(16);
}

export function detectDuplicates(documents: DocumentEntry[]): DedupResult {
  const seen = new Map<string, DocumentEntry>();
  const unique: DocumentEntry[] = [];
  const duplicates: Array<{ original: DocumentEntry; duplicate: DocumentEntry }> = [];
  for (const doc of documents) {
    const existing = seen.get(doc.contentHash);
    if (existing) {
      duplicates.push({ original: existing, duplicate: doc });
    } else {
      seen.set(doc.contentHash, doc);
      unique.push(doc);
    }
  }
  const hasDuplicates = duplicates.length > 0;
  const summary = hasDuplicates
    ? `${duplicates.length} duplicate document(s) detected: ${duplicates.map((d) => d.duplicate.filename).join(", ")}`
    : "No duplicate documents detected.";
  return { unique, duplicates, hasDuplicates, summary };
}

export function buildAnnexureIndex(
  documents: DocumentEntry[]
): Array<{ annexure: string; filename: string; size: string }> {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return documents.map((doc, i) => ({
    annexure: i < 26 ? `A-${letters[i]}` : `A-${i + 1}`,
    filename: doc.filename,
    size: `${(doc.size / 1024).toFixed(1)} KB`,
  }));
}
