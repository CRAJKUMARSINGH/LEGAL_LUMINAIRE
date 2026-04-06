/**
 * Case Selector Component - Legal Luminaire
 * Allows users to switch between different cases
 */

import { useState } from 'react';
import { useCaseContext } from '@/context/CaseContext';
import { loadMultiCases, deleteCase, duplicateCase } from '@/lib/multi-case-store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Trash2, FileText, Scale, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaseSelectorProps {
  onCreateCase?: () => void;
  showStats?: boolean;
}

export function CaseSelector({ onCreateCase, showStats = false }: CaseSelectorProps) {
  const { cases, selectedCaseId, setSelectedCaseId } = useCaseContext();
  const { toast } = useToast();
  const [isManageOpen, setIsManageOpen] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const allCases = loadMultiCases();

  const handleDuplicateCase = (caseId: string) => {
    const duplicated = duplicateCase(caseId);
    if (duplicated) {
      toast({
        title: "Case Duplicated",
        description: `Case "${duplicated.title}" has been duplicated successfully.`,
      });
      setSelectedCaseId(duplicated.id);
    } else {
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate the case. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCase = (caseId: string) => {
    if (allCases.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one case.",
        variant: "destructive",
      });
      return;
    }

    const success = deleteCase(caseId);
    if (success) {
      toast({
        title: "Case Deleted",
        description: "Case has been deleted successfully.",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the case. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCaseIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'criminal law':
        return <Scale className="h-4 w-4" />;
      case 'civil law':
        return <FileText className="h-4 w-4" />;
      case 'family law':
        return <Users className="h-4 w-4" />;
      case 'corporate law':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Case Selector */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a case">
                {selectedCase && (
                  <div className="flex items-center gap-2">
                    {getCaseIcon(selectedCase.metadata?.category || 'General')}
                    <span>{selectedCase.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedCase.caseNo}
                    </Badge>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cases.map((case_) => (
                <SelectItem key={case_.id} value={case_.id}>
                  <div className="flex items-center gap-2 w-full">
                    {getCaseIcon(case_.metadata?.category || 'General')}
                    <div className="flex-1">
                      <div className="font-medium">{case_.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {case_.court} • {case_.caseNo}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {case_.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Manage Cases
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Cases</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {allCases.map((case_) => (
                  <Card key={case_.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getCaseIcon(case_.metadata?.category || 'General')}
                          <div>
                            <CardTitle className="text-lg">{case_.title}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {case_.court} • {case_.caseNo}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(case_.status)}>
                            {case_.status}
                          </Badge>
                          <Badge className={getComplexityColor(case_.metadata?.complexity || 'Basic')}>
                            {case_.metadata?.complexity || 'Basic'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {case_.brief}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {case_.documents?.length || 0} documents
                          </div>
                          <div className="flex items-center gap-1">
                            <Scale className="h-4 w-4" />
                            {case_.caseLaw?.length || 0} case laws
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {case_.metadata?.estimatedDuration || 'Unknown'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {case_.metadata?.category || 'General'}
                          </Badge>
                          <Badge variant="outline">
                            {case_.charges || 'To be determined'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCaseId(case_.id)}
                            disabled={case_.id === selectedCaseId}
                          >
                            Select
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateCase(case_.id)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCase(case_.id)}
                            disabled={allCases.length <= 1}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={onCreateCase} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Case
          </Button>
        </div>
      </div>

      {/* Case Stats */}
      {showStats && selectedCase && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCase.documents?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCase.caseLaw?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Case Laws</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCase.timeline?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Timeline Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCase.strategy?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Strategy Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
