import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface PayrollState {
  employees: Employee[];
  departments: Department[];
  totalGrossSalary: number;
  totalBenefits: number;
  socialContributions: number;
  netSalaries: number;
  totalCost: number;
  
  // Actions
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, "id">) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  calculateStats: () => void;
}

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Technique",
    budget: 5000000,
    headcount: 10,
    growthRate: 0.05,
    plannedPositions: 2
  },
  {
    id: "2",
    name: "Commercial",
    budget: 3000000,
    headcount: 5,
    growthRate: 0.03,
    plannedPositions: 1
  }
];

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Jean Dupont",
    position: "Développeur Senior",
    department: "Technique",
    grossSalary: 800000,
    benefits: {
      transport: 50000,
      housing: 100000,
      performance: 50000
    }
  },
  {
    id: "2",
    name: "Marie Martin",
    position: "Commercial",
    department: "Commercial",
    grossSalary: 600000,
    benefits: {
      transport: 40000,
      performance: 80000
    }
  }
];

export const usePayrollStore = create<PayrollState>()(
  persist(
    (set, get) => ({
      employees: initialEmployees,
      departments: initialDepartments,
      totalGrossSalary: 0,
      totalBenefits: 0,
      socialContributions: 0,
      netSalaries: 0,
      totalCost: 0,

      addEmployee: (employee) => {
        const newEmployee = {
          ...employee,
          id: (get().employees.length + 1).toString()
        };
        set((state) => ({
          employees: [...state.employees, newEmployee]
        }));
        get().calculateStats();
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updates } : emp
          )
        }));
        get().calculateStats();
      },

      removeEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id)
        }));
        get().calculateStats();
      },

      addDepartment: (department) => {
        const newDepartment = {
          ...department,
          id: (get().departments.length + 1).toString()
        };
        set((state) => ({
          departments: [...state.departments, newDepartment]
        }));
        get().calculateStats();
      },

      updateDepartment: (id, updates) => {
        set((state) => ({
          departments: state.departments.map((dept) =>
            dept.id === id ? { ...dept, ...updates } : dept
          )
        }));
      },

      removeDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((dept) => dept.id !== id)
        }));
        get().calculateStats();
      },

      calculateStats: () => {
        const { employees } = get();
        
        const totalGrossSalary = employees.reduce((sum, emp) => sum + emp.grossSalary, 0);
        
        const totalBenefits = employees.reduce((sum, emp) => {
          return sum + 
            (emp.benefits.transport || 0) + 
            (emp.benefits.housing || 0) + 
            (emp.benefits.performance || 0);
        }, 0);
        
        const socialContributions = totalGrossSalary * 0.154; // 15.4% employer contributions
        
        const netSalaries = employees.reduce((sum, emp) => {
          const employeeSocialContribution = emp.grossSalary * 0.036; // 3.6% employee contribution
          const taxableIncome = emp.grossSalary - employeeSocialContribution;
          
          // Simplified tax calculation
          let incomeTax = 0;
          if (taxableIncome <= 50000) {
            incomeTax = 0;
          } else if (taxableIncome <= 130000) {
            incomeTax = (taxableIncome - 50000) * 0.1;
          } else if (taxableIncome <= 280000) {
            incomeTax = 8000 + (taxableIncome - 130000) * 0.15;
          } else if (taxableIncome <= 530000) {
            incomeTax = 30500 + (taxableIncome - 280000) * 0.2;
          } else {
            incomeTax = 80500 + (taxableIncome - 530000) * 0.35;
          }
          
          const netSalary = emp.grossSalary - employeeSocialContribution - incomeTax;
          return sum + netSalary;
        }, 0);
        
        const totalCost = totalGrossSalary + totalBenefits + socialContributions;
        
        set({
          totalGrossSalary,
          totalBenefits,
          socialContributions,
          netSalaries,
          totalCost
        });
      },
    }),
    {
      name: 'payroll-storage',
    }
  )
); 