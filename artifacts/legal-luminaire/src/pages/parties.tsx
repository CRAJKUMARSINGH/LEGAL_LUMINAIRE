import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building2, User, Landmark, Briefcase, Network, Landmark as Institution } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useListParties } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { snakeToTitle } from "@/lib/format";

export default function PartiesList() {
  const [search, setSearch] = useState("");

  const { data: parties, isLoading } = useListParties();

  const filteredParties = parties?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.contactPerson && p.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getIconForPartyType = (type: string) => {
    switch(type) {
      case 'company': return <Building2 className="h-5 w-5" />;
      case 'individual': return <User className="h-5 w-5" />;
      case 'government': return <Landmark className="h-5 w-5" />;
      case 'firm': return <Briefcase className="h-5 w-5" />;
      case 'trust': return <Institution className="h-5 w-5" />;
      case 'contractor': return <Network className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Parties</h1>
            <p className="text-muted-foreground mt-1">Manage clients, contractors, and other entities.</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Add Party
          </Button>
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search parties by name, contact, or email..." 
              className="pl-9 bg-background w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredParties?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border">
            <h3 className="text-lg font-medium">No parties found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or add a new party.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParties?.map((party) => (
              <Card key={party.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-md text-primary">
                      {getIconForPartyType(party.partyType)}
                    </div>
                    <div>
                      <CardTitle className="text-base line-clamp-1" title={party.name}>{party.name}</CardTitle>
                      <CardDescription className="mt-1">{snakeToTitle(party.partyType)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  {party.contactPerson && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" /> 
                      <span className="truncate">{party.contactPerson}</span>
                    </div>
                  )}
                  {party.email && (
                    <div className="flex items-center gap-2">
                      <span className="truncate break-all">📧 {party.email}</span>
                    </div>
                  )}
                  {party.phone && (
                    <div className="flex items-center gap-2">
                      <span>📞 {party.phone}</span>
                    </div>
                  )}
                  {party.gstin && (
                    <div className="mt-2 pt-2 border-t text-xs font-mono">
                      GSTIN: {party.gstin}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
