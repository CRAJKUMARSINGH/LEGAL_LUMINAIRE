import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({
  initialQuery = "",
  onSearch,
  isLoading = false,
}: {
  initialQuery?: string;
  onSearch: (q: string) => void;
  isLoading?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group max-w-2xl mx-auto">
      <div className="relative flex items-center transition-shadow shadow-sm hover:shadow-md rounded-lg focus-within:shadow-md bg-card border">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your legal issue, e.g. 'liability for bridge collapse due to design flaw'"
          className="w-full h-14 pl-12 pr-24 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-lg shadow-none font-serif italic"
          autoFocus
        />
        <div className="absolute right-2 flex items-center">
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="h-10 px-6 font-serif"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
    </form>
  );
}
