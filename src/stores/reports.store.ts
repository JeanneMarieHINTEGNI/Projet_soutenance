import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  Report, 
  ReportType, 
  ReportStatus, 
  Deadline,
  SocialReport,
  SalaryAnalysis,
  BudgetForecast,
  HRMetrics
} from '@/types/reports';
import { Employee, Department } from '@/types/payroll';

interface ReportsState {
  reports: Report[];
  deadlines: Deadline[];
  selectedReport: Report | null;
  
  // Actions pour les rapports
  addReport: (report: Omit<Report, 'id'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  selectReport: (report: Report | null) => void;
  
  // Actions pour les échéances
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
  updateDeadline: (id: string, updates: Partial<Deadline>) => void;
  deleteDeadline: (id: string) => void;
  
  // Génération de rapports
  generateSocialReport: (employees: Employee[], departments: Department[]) => SocialReport;
  generateSalaryAnalysis: (employees: Employee[], departments: Department[]) => SalaryAnalysis;
  generateBudgetForecast: (employees: Employee[], departments: Department[]) => BudgetForecast;
  generateHRMetrics: (employees: Employee[], departments: Department[]) => HRMetrics;
  
  // Export de rapports
  exportReportToPDF: (report: Report) => void;
  exportReportToExcel: (report: Report) => void;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  deadlines: [],
  selectedReport: null,

  addReport: (report) => set((state) => ({
    reports: [...state.reports, { ...report, id: uuidv4() }]
  })),

  updateReport: (id, updates) => set((state) => ({
    reports: state.reports.map(report => 
      report.id === id ? { ...report, ...updates } : report
    )
  })),

  deleteReport: (id) => set((state) => ({
    reports: state.reports.filter(report => report.id !== id)
  })),

  selectReport: (report) => set({ selectedReport: report }),

  addDeadline: (deadline) => set((state) => ({
    deadlines: [...state.deadlines, { ...deadline, id: uuidv4() }]
  })),

  updateDeadline: (id, updates) => set((state) => ({
    deadlines: state.deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, ...updates } : deadline
    )
  })),

  deleteDeadline: (id) => set((state) => ({
    deadlines: state.deadlines.filter(deadline => deadline.id !== id)
  })),

  generateSocialReport: (employees, departments) => {
    const totalEmployees = employees.length;
    const byDepartment = departments.reduce((acc, dept) => {
      acc[dept.name] = employees.filter(e => e.department === dept.name).length;
      return acc;
    }, {} as { [key: string]: number });

    const salaryRanges = [
      { range: '< 300k', count: employees.filter(e => e.grossSalary < 300000).length },
      { range: '300k - 500k', count: employees.filter(e => e.grossSalary >= 300000 && e.grossSalary < 500000).length },
      { range: '500k - 800k', count: employees.filter(e => e.grossSalary >= 500000 && e.grossSalary < 800000).length },
      { range: '> 800k', count: employees.filter(e => e.grossSalary >= 800000).length },
    ];

    return {
      period: new Date().toISOString(),
      employeeStats: {
        total: totalEmployees,
        byDepartment,
        byStatus: {
          permanent: employees.filter(e => e.grossSalary > 500000).length,
          temporary: employees.filter(e => e.grossSalary <= 500000).length
        },
        turnover: 0.15 // À calculer avec l'historique
      },
      salaryStats: {
        totalPayroll: employees.reduce((sum, e) => sum + e.grossSalary, 0),
        averageSalary: employees.reduce((sum, e) => sum + e.grossSalary, 0) / totalEmployees,
        medianSalary: 450000, // À calculer correctement
        salaryRanges
      },
      trainingStats: {
        totalHours: 120,
        totalBudget: 5000000,
        employeesCovered: Math.floor(totalEmployees * 0.8),
        programs: [
          { name: 'Formation technique', participants: 15 },
          { name: 'Management', participants: 8 },
          { name: 'Soft skills', participants: 12 }
        ]
      }
    };
  },

  generateSalaryAnalysis: (employees, departments) => {
    const departmentAnalysis = departments.map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept.name);
      const totalSalary = deptEmployees.reduce((sum, e) => sum + e.grossSalary, 0);
      return {
        department: dept.name,
        headcount: deptEmployees.length,
        totalSalary,
        averageSalary: totalSalary / deptEmployees.length,
        salaryRange: {
          min: Math.min(...deptEmployees.map(e => e.grossSalary)),
          max: Math.max(...deptEmployees.map(e => e.grossSalary))
        },
        yearOverYearGrowth: 0.08 // À calculer avec l'historique
      };
    });

    return {
      period: new Date().toISOString(),
      departmentAnalysis,
      positionAnalysis: [
        {
          position: 'Développeur',
          count: 8,
          averageSalary: 650000,
          marketComparison: 1.05
        },
        // Autres positions...
      ],
      benefitsAnalysis: [
        {
          type: 'Transport',
          totalCost: employees.reduce((sum, e) => sum + (e.benefits.transport || 0), 0),
          employeesCovered: employees.filter(e => e.benefits.transport).length,
          averagePerEmployee: 50000
        },
        // Autres avantages...
      ]
    };
  },

  generateBudgetForecast: (employees, departments) => {
    const currentYear = new Date().getFullYear();
    const monthlyBaseSalaries = employees.reduce((sum, e) => sum + e.grossSalary, 0);
    const monthlyBenefits = employees.reduce((sum, e) => 
      sum + (e.benefits.transport || 0) + (e.benefits.housing || 0) + (e.benefits.performance || 0), 
    0);

    return {
      year: currentYear,
      monthly: Array(12).fill(null).map((_, i) => ({
        month: new Date(currentYear, i).toLocaleString('default', { month: 'long' }),
        baseSalaries: monthlyBaseSalaries,
        benefits: monthlyBenefits,
        taxes: monthlyBaseSalaries * 0.154,
        total: monthlyBaseSalaries + monthlyBenefits + (monthlyBaseSalaries * 0.154)
      })),
      projections: {
        newHires: departments.map(dept => ({
          department: dept.name,
          count: Math.ceil(dept.headcount * 0.1),
          cost: dept.budget * 0.1
        })),
        raises: [
          { type: 'Annuel', employees: Math.floor(employees.length * 0.8), cost: monthlyBaseSalaries * 0.05 },
          { type: 'Performance', employees: Math.floor(employees.length * 0.2), cost: monthlyBaseSalaries * 0.03 }
        ],
        departures: departments.map(dept => ({
          department: dept.name,
          count: Math.floor(dept.headcount * 0.05),
          savings: dept.budget * 0.05
        }))
      },
      scenarios: [
        {
          name: 'Croissance modérée',
          description: 'Augmentation progressive des effectifs',
          totalCost: monthlyBaseSalaries * 12 * 1.1,
          impact: 0.1
        },
        {
          name: 'Expansion rapide',
          description: 'Recrutement accéléré et nouveaux départements',
          totalCost: monthlyBaseSalaries * 12 * 1.25,
          impact: 0.25
        }
      ]
    };
  },

  generateHRMetrics: (employees, departments) => {
    const totalEmployees = employees.length;
    
    return {
      period: new Date().toISOString(),
      workforce: {
        headcount: totalEmployees,
        fte: totalEmployees - Math.floor(totalEmployees * 0.1), // Estimation des temps partiels
        turnover: 0.15,
        absenteeism: 0.03
      },
      recruitment: {
        openPositions: departments.reduce((sum, d) => sum + (d.plannedPositions || 0), 0),
        applications: 150,
        interviews: 45,
        offers: 15,
        acceptanceRate: 0.8
      },
      performance: {
        reviewsCompleted: Math.floor(totalEmployees * 0.9),
        averageRating: 3.8,
        promotions: Math.floor(totalEmployees * 0.1),
        highPerformers: Math.floor(totalEmployees * 0.2)
      },
      training: {
        programsOffered: 8,
        participationRate: 0.75,
        completionRate: 0.85,
        satisfactionScore: 4.2
      }
    };
  },

  exportReportToPDF: (report) => {
    // Logique d'export PDF à implémenter
    console.log('Exporting to PDF:', report);
  },

  exportReportToExcel: (report) => {
    // Logique d'export Excel à implémenter
    console.log('Exporting to Excel:', report);
  }
})); 