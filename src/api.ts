import axios from 'axios';
import {
  SimulationParameters,
  SimulationResult,
  ExistingEmployee,
  CustomCompanyRule,
} from './types/simulation';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchExistingEmployees(companyId: string): Promise<ExistingEmployee[]> {
  try {
    const response = await api.get(`/employees?company_id=${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    throw error;
  }
}

export async function fetchCustomCompanyRules(companyId: string): Promise<CustomCompanyRule[]> {
  try {
    const response = await api.get(`/custom-rules?company_id=${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des règles personnalisées:', error);
    throw error;
  }
}

export async function runSimulation(params: SimulationParameters): Promise<SimulationResult> {
  try {
    const response = await api.post('/simulations/lancer', params);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la simulation:', error);
    throw error;
  }
} 