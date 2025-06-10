import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermissions = [] }) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions requises si elles sont spécifiées
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      // Rediriger vers une page d'erreur si l'utilisateur n'a pas les permissions requises
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si l'utilisateur est connecté et a les permissions requises, afficher le contenu
  return <>{children}</>;
};

export default PrivateRoute; 