export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  grossSalary: number;
  benefits: {
    transport?: number;
    housing?: number;
    performance?: number;
  };
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  headcount: number;
  growthRate: number;
  plannedPositions: number;
}

export interface PayrollStats {
  totalGrossSalary: number;
  totalBenefits: number;
  socialContributions: number;
  netSalaries: number;
  totalCost: number;
  monthlyTrend: {
    month: string;
    value: number;
  }[];
  departmentDistribution: {
    name: string;
    value: number;
  }[];
  benefitsDistribution: {
    name: string;
    value: number;
  }[];
} 