import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Benefits {
  transport: number;
  housing: number;
  thirteenthMonth: boolean;
}

interface EmployeeData {
  id?: string;
  name: string;
  position: string;
  currentSalary: number;
  familyStatus: 'single' | 'married';
  children: number;
  benefits: Benefits;
  lastSimulation?: {
    grossSalary: number;
    netSalary: number;
    socialCharges: number;
    irpp: number;
    date: string;
  };
}

interface EmployeeStore {
  employeeData: EmployeeData | null;
  setEmployeeData: (data: EmployeeData) => void;
  updateLastSimulation: (simulation: EmployeeData['lastSimulation']) => void;
  clearEmployeeData: () => void;
}

export const useEmployeeData = create<EmployeeStore>()(
  persist(
    (set) => ({
      employeeData: null,
      setEmployeeData: (data) => set({ employeeData: data }),
      updateLastSimulation: (simulation) =>
        set((state) => ({
          employeeData: state.employeeData
            ? {
                ...state.employeeData,
                lastSimulation: simulation,
                currentSalary: simulation.grossSalary,
              }
            : null,
        })),
      clearEmployeeData: () => set({ employeeData: null }),
    }),
    {
      name: 'employee-data',
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('Employee data rehydrated:', state?.employeeData);
      },
    }
  )
); 