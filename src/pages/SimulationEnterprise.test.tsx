import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SimulationEnterprise from './SimulationEnterprise';
import { useCountry } from '@/hooks/use-country';
import { useNavigate } from 'react-router-dom';

// Mock des hooks
vi.mock('@/hooks/use-country', () => ({
  useCountry: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('SimulationEnterprise', () => {
  beforeEach(() => {
    // Configuration des mocks avant chaque test
    (useCountry as jest.Mock).mockReturnValue({ country: 'benin' });
    (useNavigate as jest.Mock).mockReturnValue(vi.fn());
    localStorage.clear();
  });

  test('renders without crashing', () => {
    render(<SimulationEnterprise />);
    expect(screen.getByText('Simulateur Entreprise')).toBeInTheDocument();
  });

  test('adds new employee correctly', () => {
    render(<SimulationEnterprise />);
    const addButton = screen.getByText('Ajouter un employé');
    fireEvent.click(addButton);
    expect(screen.getAllByPlaceholderText('Ex: Jean Dupont')).toHaveLength(5); // 4 employés initiaux + 1 nouveau
  });

  test('calculates total payroll correctly', () => {
    render(<SimulationEnterprise />);
    const totalGrossSalary = screen.getByText('2 430 000 FCFA'); // Somme des salaires bruts des employés initiaux
    expect(totalGrossSalary).toBeInTheDocument();
  });

  test('validates employee form fields', () => {
    render(<SimulationEnterprise />);
    const nameInput = screen.getAllByPlaceholderText('Ex: Jean Dupont')[0];
    fireEvent.change(nameInput, { target: { value: '' } });
    expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
  });

  test('persists data in localStorage', () => {
    render(<SimulationEnterprise />);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test('loads data from localStorage', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{
      id: '1',
      name: 'Test Employee',
      position: 'Test Position',
      department: 'Test Department',
      grossSalary: 300000,
      benefits: {}
    }]));
    
    render(<SimulationEnterprise />);
    expect(screen.getByText('Test Employee')).toBeInTheDocument();
  });

  test('filters employees correctly', () => {
    render(<SimulationEnterprise />);
    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'Marie' } });
    expect(screen.getByText('Marie Koné')).toBeInTheDocument();
    expect(screen.queryByText('Paul Agossou')).not.toBeInTheDocument();
  });

  test('switches between tabs correctly', () => {
    render(<SimulationEnterprise />);
    const projectionsTab = screen.getByText('Projections');
    fireEvent.click(projectionsTab);
    expect(screen.getByText('Projections budgétaires')).toBeInTheDocument();
  });
}); 