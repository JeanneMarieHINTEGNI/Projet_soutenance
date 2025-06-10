// Types for simulation parameters
export interface SimulationParameters {
  country_code: 'BJ' | 'TG';
  company_id: string;
  simulation_type: 'current_state' | 'new_scenario';
  period_months: number;
  adjustments: SimulationAdjustments;
  existing_employees_data: EmployeeData[];
}

export interface SimulationAdjustments {
  global_salary_increase_percent: number;
  departmental_adjustments: { [key: string]: number };
  new_employee_profiles: EmployeeProfileInput[];
  custom_rules_to_activate: string[];
}

// Types for employee data
export interface EmployeeData {
  id: string;
  salaire_base_mensuel: number;
  departement: string;
}

export interface EmployeeProfileInput {
  salaire_base_mensuel: number;
  departement: string;
  nb_employees?: number;
}

// Types for simulation results
export interface SimulationResult {
  total_simulated_employer_cost: number;
  total_simulated_net_salary: number;
  net_to_cost_ratio: number;
  employees_results: EmployeeSimulationResult[];
}

export interface EmployeeSimulationResult {
  employee_id: string;
  initial_gross: number;
  simulated_gross: number;
  simulated_employer_social_charges: number;
  simulated_net_salary: number;
}

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CustomCompanyRule {
  id: string;
  nom_regle: string;
  description?: string;
}

export interface ExistingEmployee {
  id: string;
  nom: string;
  prenom: string;
  salaire_base_mensuel: number;
  departement: string;
  selected?: boolean;
  benefits?: { [key: string]: number };
} 