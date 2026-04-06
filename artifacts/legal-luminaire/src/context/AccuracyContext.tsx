import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccuracyMetrics {
  legalCitations: number;
  technicalStandards: number;
  factualClaims: number;
  proceduralReferences: number;
  overallScore: number;
}

interface AccuracyContextType {
  metrics: AccuracyMetrics;
  updateMetric: (metric: keyof AccuracyMetrics, value: number) => void;
  verifyAccuracy: () => boolean;
  resetMetrics: () => void;
  accuracyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const AccuracyContext = createContext<AccuracyContextType | undefined>(undefined);

export function AccuracyProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<AccuracyMetrics>({
    legalCitations: 0,
    technicalStandards: 0,
    factualClaims: 0,
    proceduralReferences: 0,
    overallScore: 0,
  });

  const updateMetric = (metric: keyof AccuracyMetrics, value: number) => {
    setMetrics(prev => {
      const newMetrics = { ...prev, [metric]: value };
      const overall = Object.values(newMetrics).reduce((sum, val, idx) => 
        idx < 4 ? sum + val : sum, 0) / 4;
      return { ...newMetrics, overallScore: overall };
    });
  };

  const verifyAccuracy = (): boolean => {
    return metrics.overallScore >= 9.5; // 10/10 requirement
  };

  const resetMetrics = () => {
    setMetrics({
      legalCitations: 0,
      technicalStandards: 0,
      factualClaims: 0,
      proceduralReferences: 0,
      overallScore: 0,
    });
  };

  const accuracyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 
    metrics.overallScore >= 9.5 ? 'CRITICAL' :
    metrics.overallScore >= 8.0 ? 'HIGH' :
    metrics.overallScore >= 6.0 ? 'MEDIUM' : 'LOW';

  return (
    <AccuracyContext.Provider value={{
      metrics,
      updateMetric,
      verifyAccuracy,
      resetMetrics,
      accuracyLevel,
    }}>
      {children}
    </AccuracyContext.Provider>
  );
}

export function useAccuracyContext() {
  const context = useContext(AccuracyContext);
  if (context === undefined) {
    throw new Error('useAccuracyContext must be used within an AccuracyProvider');
  }
  return context;
}
