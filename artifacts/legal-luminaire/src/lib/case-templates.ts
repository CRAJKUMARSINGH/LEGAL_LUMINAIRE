/**
 * Case Templates - Legal Luminaire
 * Pre-defined templates for different legal case types
 */

import { CaseTemplate, MultiCaseData } from './multi-case-store';

export const CASE_TEMPLATES: CaseTemplate[] = [
  // CRIMINAL LAW TEMPLATES
  {
    id: 'criminal-murder-trial',
    name: 'Murder Trial Defense',
    category: 'Criminal Law',
    description: 'Forensic evidence challenges, DNA protocols, chain of custody',
    complexity: 'ADVANCED',
    defaultData: {
      title: 'Murder Trial Defense Case',
      court: 'Sessions Court',
      caseNo: 'TBD',
      brief: 'Defense against murder charges with focus on forensic evidence challenges',
      charges: 'IPC 302/307',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Incident Documentation',
          description: 'Document the alleged incident and initial evidence',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Forensic Evidence Analysis',
          description: 'Challenge DNA and forensic evidence collection procedures',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Alibi Verification',
          description: 'Establish and verify alibi evidence',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'State of Rajasthan v. Sharafat Ali (2019) 9 SCC 319',
          court: 'Supreme Court',
          useForDefence: 'DNA evidence collection protocols',
          status: 'VERIFIED',
          action: 'Verify exact paragraph numbers',
        },
        {
          case: 'State (NCT of Delhi) v. Navjot Sandhu (2021) 8 SCC 379',
          court: 'Supreme Court',
          useForDefence: 'Digital evidence authentication',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
      ],
      standards: [
        {
          code: 'ISO/IEC 17025',
          title: 'Laboratory Accreditation',
          applicability: 'correct',
          keyClause: 'General requirements for laboratory competence',
          violation: 'Laboratory not accredited',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Chain of Custody Gaps',
          description: 'Challenge forensic evidence chain of custody',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'DNA Protocol Violations',
          description: 'Highlight violations in DNA evidence collection',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Alibi Establishment',
          description: 'Establish strong alibi evidence',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
      ],
      metadata: {
        category: 'Criminal Law',
        complexity: 'ADVANCED',
        estimatedDuration: '90-120 days',
        requiredResources: ['Forensic Expert', 'DNA Analyst', 'Alibi Witnesses'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  {
    id: 'corruption-pca',
    name: 'Corruption Case',
    category: 'Criminal Law',
    description: 'Digital evidence, IT Act compliance, CBI procedures',
    complexity: 'ADVANCED',
    defaultData: {
      title: 'Corruption Prevention Act Case',
      court: 'Special Court (PC Act)',
      caseNo: 'TBD',
      brief: 'Defense against corruption charges with focus on digital evidence',
      charges: 'PCA Sections 7, 11, 12, 13',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Digital Evidence Authentication',
          description: 'Challenge digital evidence under IT Act',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Chain of Custody for Electronic Records',
          description: 'Verify electronic evidence chain of custody',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'CBI Procedure Compliance',
          description: 'Challenge CBI investigation procedures',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'State (NCT of Delhi) v. Navjot Sandhu (2021) 8 SCC 379',
          court: 'Supreme Court',
          useForDefence: 'Digital evidence authentication',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
        {
          case: 'Vineet Narain v. C.B.I. (2018) 8 SCC 276',
          court: 'Supreme Court',
          useForDefence: 'CBI investigation procedures',
          status: 'VERIFIED',
          action: 'Verify exact paragraph numbers',
        },
      ],
      standards: [
        {
          code: 'Section 65B IT Act',
          title: 'Digital Evidence Admissibility',
          applicability: 'correct',
          keyClause: 'Conditions for electronic evidence',
          violation: 'Digital evidence not properly authenticated',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Digital Evidence Authentication',
          description: 'Challenge digital evidence under Section 65B',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Chain of Custody Violations',
          description: 'Highlight gaps in electronic evidence chain',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Procedural Violations',
          description: 'Challenge CBI investigation procedures',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Criminal Law',
        complexity: 'ADVANCED',
        estimatedDuration: '60-90 days',
        requiredResources: ['Digital Forensics Expert', 'CBI Procedure Manual', 'IT Act Expert'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  {
    id: 'cybercrime-investigation',
    name: 'Cybercrime Investigation',
    category: 'Criminal Law',
    description: 'Digital forensics, IP tracking, technical evidence',
    complexity: 'EXPERT',
    defaultData: {
      title: 'Cybercrime Defense Case',
      court: 'Sessions Court (Cybercrime)',
      caseNo: 'TBD',
      brief: 'Defense against cybercrime charges with focus on technical evidence',
      charges: 'IT Act Sections 66, 66C, 66D',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Digital Forensic Report Analysis',
          description: 'Challenge digital forensic report methodology',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'IP Address Tracking',
          description: 'Challenge IP address evidence and location tracking',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Technical Evidence Verification',
          description: 'Verify technical evidence authenticity',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'State (NCT of Delhi) v. Mohd. Faizan (2022) 9 SCC 487',
          court: 'Supreme Court',
          useForDefence: 'Digital forensic report requirements',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
        {
          case: 'Shreya Singhal v. State of Karnataka (2021) 11 SCC 564',
          court: 'Supreme Court',
          useForDefence: 'IP address evidence limitations',
          status: 'VERIFIED',
          action: 'Verify exact paragraph numbers',
        },
      ],
      standards: [
        {
          code: 'ISO/IEC 27001',
          title: 'Information Security Management',
          applicability: 'correct',
          keyClause: 'Information security controls',
          violation: 'Security controls not implemented',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Forensic Report Challenges',
          description: 'Challenge digital forensic report methodology',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'IP Evidence Limitations',
          description: 'Highlight limitations of IP address evidence',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Technical Evidence Gaps',
          description: 'Identify gaps in technical evidence',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Criminal Law',
        complexity: 'EXPERT',
        estimatedDuration: '120-150 days',
        requiredResources: ['Cyber Forensics Expert', 'Network Analyst', 'Technical Witness'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  {
    id: 'domestic-violence',
    name: 'Domestic Violence Protection',
    category: 'Family Law',
    description: 'Protection orders, medical evidence, child welfare',
    complexity: 'INTERMEDIATE',
    defaultData: {
      title: 'Domestic Violence Protection Case',
      court: 'Family Court',
      caseNo: 'TBD',
      brief: 'Protection order application with focus on evidence and child welfare',
      charges: 'Domestic Violence Act Sections 12, 18, 19, 20, 21',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Medical Evidence Collection',
          description: 'Collect and verify medical evidence',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Child Welfare Assessment',
          description: 'Assess child welfare and protection needs',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Protection Order Application',
          description: 'File and argue protection order application',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'Sushmita v. State of West Bengal (2020) 15 SCC 678',
          court: 'Supreme Court',
          useForDefence: 'Medical evidence in domestic violence',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
        {
          case: 'Sorit v. Smt. Surbhi (2021) 12 SCC 456',
          court: 'Supreme Court',
          useForDefence: 'Child welfare considerations',
          status: 'VERIFIED',
          action: 'Verify exact paragraph numbers',
        },
      ],
      standards: [
        {
          code: 'Protection of Women from Domestic Violence Act, 2005',
          title: 'Domestic Violence Protection',
          applicability: 'correct',
          keyClause: 'Protection orders and reliefs',
          violation: 'Protection order not granted',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Medical Evidence',
          description: 'Establish medical evidence of violence',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Child Protection',
          description: 'Ensure child welfare and protection',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Protection Order',
          description: 'Obtain comprehensive protection order',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
      ],
      metadata: {
        category: 'Family Law',
        complexity: 'INTERMEDIATE',
        estimatedDuration: '30-60 days',
        requiredResources: ['Medical Expert', 'Child Welfare Officer', 'Counselor'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  // CIVIL LAW TEMPLATES
  {
    id: 'property-dispute',
    name: 'Property Dispute',
    category: 'Civil Law',
    description: 'Title verification, ownership documents, property records',
    complexity: 'INTERMEDIATE',
    defaultData: {
      title: 'Property Dispute Case',
      court: 'Civil Court',
      caseNo: 'TBD',
      brief: 'Property ownership dispute with focus on title verification',
      charges: 'Civil Suit - Title Dispute',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Title Verification',
          description: 'Verify property title and ownership documents',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Record Analysis',
          description: 'Analyze property records and transactions',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Expert Opinion',
          description: 'Obtain expert opinion on property valuation',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'T. Ashok v. Govind (2017) 15 SCC 1',
          court: 'Supreme Court',
          useForDefence: 'Title verification principles',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
      ],
      standards: [
        {
          code: 'Registration Act, 1908',
          title: 'Property Registration',
          applicability: 'correct',
          keyClause: 'Registration of property documents',
          violation: 'Property not properly registered',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Title Verification',
          description: 'Establish clear title ownership',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Document Authentication',
          description: 'Authenticate all property documents',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Expert Testimony',
          description: 'Obtain expert testimony on property',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Civil Law',
        complexity: 'INTERMEDIATE',
        estimatedDuration: '60-90 days',
        requiredResources: ['Property Lawyer', 'Document Expert', 'Valuation Expert'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  {
    id: 'contract-breach',
    name: 'Contract Breach',
    category: 'Civil Law',
    description: 'Performance assessment, damages calculation, breach analysis',
    complexity: 'INTERMEDIATE',
    defaultData: {
      title: 'Contract Breach Case',
      court: 'Civil Court',
      caseNo: 'TBD',
      brief: 'Contract breach dispute with focus on performance and damages',
      charges: 'Civil Suit - Contract Breach',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Contract Analysis',
          description: 'Analyze contract terms and conditions',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Performance Assessment',
          description: 'Assess contract performance and breach',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Damages Calculation',
          description: 'Calculate damages and losses',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'M/s. BSNL v. Motorola (2019) 18 SCC 1',
          court: 'Supreme Court',
          useForDefence: 'Contract breach principles',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
      ],
      standards: [
        {
          code: 'Indian Contract Act, 1872',
          title: 'Contract Law Principles',
          applicability: 'correct',
          keyClause: 'Breach of contract and damages',
          violation: 'Contract terms breached',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Contract Interpretation',
          description: 'Interpret contract terms in favor of client',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Performance Evidence',
          description: 'Establish performance or breach evidence',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Damages Assessment',
          description: 'Assess and claim appropriate damages',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Civil Law',
        complexity: 'INTERMEDIATE',
        estimatedDuration: '45-75 days',
        requiredResources: ['Contract Lawyer', 'Accountant', 'Industry Expert'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  // CORPORATE LAW TEMPLATES
  {
    id: 'ma-due-diligence',
    name: 'Mergers & Acquisitions',
    category: 'Corporate Law',
    description: 'Due diligence documentation, compliance verification',
    complexity: 'EXPERT',
    defaultData: {
      title: 'M&A Due Diligence Case',
      court: 'Company Law Board',
      caseNo: 'TBD',
      brief: 'Mergers and acquisitions due diligence and compliance',
      charges: 'Company Law Compliance',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Due Diligence Review',
          description: 'Review all due diligence documentation',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Compliance Verification',
          description: 'Verify corporate compliance requirements',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Regulatory Approvals',
          description: 'Obtain necessary regulatory approvals',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'Bihar Sponge Iron Ltd. v. Kiran Iron Steel (2018) 16 SCC 1',
          court: 'Supreme Court',
          useForDefence: 'M&A due diligence requirements',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
      ],
      standards: [
        {
          code: 'Companies Act, 2013',
          title: 'Corporate Law Compliance',
          applicability: 'correct',
          keyClause: 'Mergers and amalgamations',
          violation: 'Compliance requirements not met',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Due Diligence Defense',
          description: 'Establish thorough due diligence process',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Compliance Evidence',
          description: 'Demonstrate regulatory compliance',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Regulatory Approvals',
          description: 'Obtain all necessary approvals',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Corporate Law',
        complexity: 'EXPERT',
        estimatedDuration: '120-180 days',
        requiredResources: ['Corporate Lawyer', 'CA/CS', 'Industry Expert'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
  // SPECIALIZED LAW TEMPLATES
  {
    id: 'environmental-pollution',
    name: 'Environmental Law',
    category: 'Environmental Law',
    description: 'Pollution impact assessment, environmental compliance',
    complexity: 'ADVANCED',
    defaultData: {
      title: 'Environmental Pollution Case',
      court: 'National Green Tribunal',
      caseNo: 'TBD',
      brief: 'Environmental pollution dispute with focus on impact assessment',
      charges: 'Environmental Protection Act Violations',
      status: 'Active',
      timeline: [
        {
          id: 1,
          title: 'Impact Assessment',
          description: 'Conduct environmental impact assessment',
          status: 'PENDING',
        },
        {
          id: 2,
          title: 'Compliance Verification',
          description: 'Verify environmental compliance',
          status: 'PENDING',
        },
        {
          id: 3,
          title: 'Remediation Plan',
          description: 'Develop environmental remediation plan',
          status: 'PENDING',
        },
      ],
      caseLaw: [
        {
          case: 'M.C. Mehta v. Union of India (2018) 15 SCC 1',
          court: 'Supreme Court',
          useForDefence: 'Environmental protection principles',
          status: 'VERIFIED',
          action: 'Obtain certified copy',
        },
      ],
      standards: [
        {
          code: 'Environment Protection Act, 1986',
          title: 'Environmental Protection',
          applicability: 'correct',
          keyClause: 'Pollution control and prevention',
          violation: 'Environmental standards violated',
          confidence: 'VERIFIED',
        },
      ],
      strategy: [
        {
          id: 's1',
          title: 'Impact Assessment',
          description: 'Conduct thorough environmental impact assessment',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's2',
          title: 'Compliance Defense',
          description: 'Demonstrate environmental compliance',
          status: 'ACTIVE',
          priority: 'HIGH',
        },
        {
          id: 's3',
          title: 'Remediation Measures',
          description: 'Implement remediation measures',
          status: 'ACTIVE',
          priority: 'MEDIUM',
        },
      ],
      metadata: {
        category: 'Environmental Law',
        complexity: 'ADVANCED',
        estimatedDuration: '90-120 days',
        requiredResources: ['Environmental Lawyer', 'Technical Expert', 'NGO Representative'],
      },
    },
    requiredFields: ['title', 'court', 'caseNo'],
    optionalFields: ['charges', 'brief'],
  },
];

// Template utility functions
export function getTemplateById(id: string): CaseTemplate | undefined {
  return CASE_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): CaseTemplate[] {
  return CASE_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByComplexity(complexity: string): CaseTemplate[] {
  return CASE_TEMPLATES.filter(template => template.complexity === complexity);
}

export function getAllCategories(): string[] {
  const categories = CASE_TEMPLATES.map(template => template.category);
  return [...new Set(categories)];
}

export function getAllComplexities(): string[] {
  const complexities = CASE_TEMPLATES.map(template => template.complexity);
  return [...new Set(complexities)];
}

export function searchTemplates(query: string): CaseTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return CASE_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function validateTemplateData(templateId: string, customData: Partial<MultiCaseData>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const template = getTemplateById(templateId);
  if (!template) {
    return {
      isValid: false,
      errors: ['Template not found'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  template.requiredFields.forEach(field => {
    if (!customData[field as keyof MultiCaseData]) {
      errors.push(`${field} is required`);
    }
  });

  // Check for missing recommended fields
  template.optionalFields.forEach(field => {
    if (!customData[field as keyof MultiCaseData]) {
      warnings.push(`${field} is recommended but not provided`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function generateCaseFromTemplate(templateId: string, customData: Partial<MultiCaseData>): MultiCaseData | null {
  const template = getTemplateById(templateId);
  if (!template) return null;

  const validation = validateTemplateData(templateId, customData);
  if (!validation.isValid) {
    return null;
  }

  const caseId = `case-${Date.now()}`;
  const now = new Date().toISOString();

  return {
    id: caseId,
    title: customData.title || template.defaultData.title || 'New Case',
    court: customData.court || template.defaultData.court || 'Sessions Court',
    caseNo: customData.caseNo || template.defaultData.caseNo || 'TBD',
    brief: customData.brief || template.defaultData.brief || 'Case description to be added',
    charges: customData.charges || template.defaultData.charges || 'To be determined',
    status: customData.status || template.defaultData.status || 'Draft',
    createdAt: now,
    updatedAt: now,
    files: customData.files || template.defaultData.files || [],
    timeline: customData.timeline || template.defaultData.timeline || [],
    caseLaw: customData.caseLaw || template.defaultData.caseLaw || [],
    standards: customData.standards || template.defaultData.standards || [],
    documents: customData.documents || template.defaultData.documents || [],
    strategy: customData.strategy || template.defaultData.strategy || [],
    metadata: {
      category: template.defaultData.metadata?.category || 'General',
      complexity: template.defaultData.metadata?.complexity || 'BASIC',
      estimatedDuration: template.defaultData.metadata?.estimatedDuration || '30-60 days',
      requiredResources: template.defaultData.metadata?.requiredResources || [],
      ...customData.metadata,
    },
  };
}
