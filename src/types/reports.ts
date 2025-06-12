import { Employee, Department } from './payroll';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  date: string;
  status: ReportStatus;
  format: ReportFormat;
  data?: any;
}

export type ReportType = 
  | 'social'      // Bilan social
  | 'salary'      // Analyse salariale
  | 'budget'      // Prévisions budgétaires
  | 'hr'          // Indicateurs RH
  | 'custom';     // Rapport personnalisé

export type ReportStatus = 
  | 'draft'       // En cours de rédaction
  | 'pending'     // En attente de validation
  | 'validated'   // Validé
  | 'archived';   // Archivé

export type ReportFormat = 'pdf' | 'excel' | 'word';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  type: 'table' | 'chart' | 'text';
  data: any;
}

export interface Deadline {
  id: string;
  title: string;
  type: 'cnss' | 'ipts' | 'irpp' | 'other';
  dueDate: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  amount?: number;
  documents?: string[];
}

export interface SocialReport {
  period: string;
  employeeStats: {
    total: number;
    byDepartment: { [key: string]: number };
    byStatus: { [key: string]: number };
    turnover: number;
  };
  salaryStats: {
    totalPayroll: number;
    averageSalary: number;
    medianSalary: number;
    salaryRanges: { range: string; count: number }[];
  };
  trainingStats: {
    totalHours: number;
    totalBudget: number;
    employeesCovered: number;
    programs: { name: string; participants: number }[];
  };
}

export interface SalaryAnalysis {
  period: string;
  departmentAnalysis: {
    department: string;
    headcount: number;
    totalSalary: number;
    averageSalary: number;
    salaryRange: { min: number; max: number };
    yearOverYearGrowth: number;
  }[];
  positionAnalysis: {
    position: string;
    count: number;
    averageSalary: number;
    marketComparison: number;
  }[];
  benefitsAnalysis: {
    type: string;
    totalCost: number;
    employeesCovered: number;
    averagePerEmployee: number;
  }[];
}

export interface BudgetForecast {
  year: number;
  monthly: {
    month: string;
    baseSalaries: number;
    benefits: number;
    taxes: number;
    total: number;
  }[];
  projections: {
    newHires: { department: string; count: number; cost: number }[];
    raises: { type: string; employees: number; cost: number }[];
    departures: { department: string; count: number; savings: number }[];
  };
  scenarios: {
    name: string;
    description: string;
    totalCost: number;
    impact: number;
  }[];
}

export interface HRMetrics {
  period: string;
  workforce: {
    headcount: number;
    fte: number;
    turnover: number;
    absenteeism: number;
  };
  recruitment: {
    openPositions: number;
    applications: number;
    interviews: number;
    offers: number;
    acceptanceRate: number;
  };
  performance: {
    reviewsCompleted: number;
    averageRating: number;
    promotions: number;
    highPerformers: number;
  };
  training: {
    programsOffered: number;
    participationRate: number;
    completionRate: number;
    satisfactionScore: number;
  };
} 