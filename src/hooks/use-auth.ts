import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginData, RegisterData } from '@/services/auth.service';

export interface User {
  id: string;
  email: string;
  token: string;
  role: 'ADMIN' | 'HR_ADMIN' | 'EMPLOYEE' | 'USER';
}

export const PERMISSIONS = {
  SIMULATE_PAYROLL: 'simulate_payroll',
  VIEW_HISTORY: 'view_history',
  EXPORT_PDF: 'export_pdf',
  VIEW_BULLETINS: 'view_bulletins',
  GENERATE_PAYSLIP: 'generate_payslip',
  MANAGE_EMPLOYEES: 'manage_employees',
  MANAGE_TAX_GRIDS: 'manage_tax_grids',
  CONFIGURE_COUNTRIES: 'configure_countries',
  VIEW_PAYROLL: 'view_payroll',
  EDIT_PAYROLL: 'edit_payroll',
  VIEW_EMPLOYEES: 'view_employees',
  EDIT_EMPLOYEES: 'edit_employees',
  VIEW_DEPARTMENTS: 'view_departments',
  EDIT_DEPARTMENTS: 'edit_departments'
} as const;

type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const mapApiResponseToUser = (response: any): User => {
  return {
    id: response.user.id,
    email: response.user.email,
    token: response.token,
    role: response.user.role || 'USER'
  };
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    register: async (data: RegisterData) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authService.register(data);
        const user = mapApiResponseToUser(response);
        setAuthState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
        throw error;
      }
    },

    login: async (data: LoginData) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authService.login(data);
        const user = mapApiResponseToUser(response);
        setAuthState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (error: any) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
        throw error;
      }
    },

    logout: () => {
      authService.logout();
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        error: null,
      }));
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setAuthState((prev) => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
          return;
        }

        // Simuler un appel API pour vérifier le token
        // À remplacer par un vrai appel API
        const mockResponse = {
          token,
          user: {
            id: '1',
            email: 'user@example.com',
            role: 'USER'
          }
        };

        const user = mapApiResponseToUser(mockResponse);
        setAuthState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } catch (error) {
        setAuthState((prev) => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!authState.user) return false;

    const rolePermissions: Record<User['role'], Permission[]> = {
      ADMIN: Object.values(PERMISSIONS),
      HR_ADMIN: [
        PERMISSIONS.VIEW_PAYROLL,
        PERMISSIONS.EDIT_PAYROLL,
        PERMISSIONS.MANAGE_EMPLOYEES,
        PERMISSIONS.VIEW_EMPLOYEES,
        PERMISSIONS.EDIT_EMPLOYEES,
        PERMISSIONS.VIEW_DEPARTMENTS,
        PERMISSIONS.GENERATE_PAYSLIP
      ],
      EMPLOYEE: [
        PERMISSIONS.VIEW_HISTORY,
        PERMISSIONS.VIEW_BULLETINS,
        PERMISSIONS.EXPORT_PDF
      ],
      USER: [
        PERMISSIONS.SIMULATE_PAYROLL,
        PERMISSIONS.VIEW_HISTORY,
        PERMISSIONS.EXPORT_PDF
      ]
    };

    return rolePermissions[authState.user.role].includes(permission);
  };

  const requireAuth = (requiredPermissions: Permission[] = []) => {
    if (authState.isLoading) return false;

    if (!authState.isAuthenticated) {
      navigate('/login', { replace: true });
      return false;
    }

    if (requiredPermissions.length > 0 && !requiredPermissions.every(hasPermission)) {
      navigate('/unauthorized', { replace: true });
      return false;
    }

    return true;
  };

  return {
    ...authState,
    hasPermission,
    requireAuth,
  };
}; 