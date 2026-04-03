import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useAccuracyContext } from '@/context/AccuracyContext';

interface AccuracyBadgeProps {
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AccuracyBadge({ showDetails = false, size = 'md' }: AccuracyBadgeProps) {
  const { metrics, accuracyLevel, verifyAccuracy } = useAccuracyContext();

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const levelConfig = {
    CRITICAL: {
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: ShieldCheck,
      label: 'CRITICAL ACCURACY',
      description: '10/10 - Ready for deployment'
    },
    HIGH: {
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle,
      label: 'HIGH ACCURACY',
      description: '8.0-9.4/10 - Good quality'
    },
    MEDIUM: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: AlertTriangle,
      label: 'MEDIUM ACCURACY',
      description: '6.0-7.9/10 - Needs improvement'
    },
    LOW: {
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle,
      label: 'LOW ACCURACY',
      description: 'Below 6.0/10 - Requires review'
    }
  };

  const config = levelConfig[accuracyLevel];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 border rounded-lg ${sizeClasses[size]} ${config.color}`}>
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{config.label}</span>
      
      {showDetails && (
        <div className="ml-4 text-sm">
          <div>Overall: {metrics.overallScore.toFixed(1)}/10</div>
          <div>Legal: {metrics.legalCitations.toFixed(1)}/10</div>
          <div>Technical: {metrics.technicalStandards.toFixed(1)}/10</div>
          <div>Factual: {metrics.factualClaims.toFixed(1)}/10</div>
          <div>Procedural: {metrics.proceduralReferences.toFixed(1)}/10</div>
          <div className="mt-1 text-xs">{config.description}</div>
        </div>
      )}
    </div>
  );
}
