import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Non autorisé');
    }

    // Récupérer l'entreprise de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          include: {
            departments: {
              include: {
                employees: true
              }
            }
          }
        }
      }
    });

    if (!user?.company) {
      throw new ApiError(404, 'Entreprise non trouvée');
    }

    // Calculer les statistiques
    const employees = user.company.departments.flatMap(dept => dept.employees);
    const totalEmployees = employees.length;
    const totalSalary = employees.reduce((sum, emp) => sum + emp.grossSalary, 0);
    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    // Statistiques par département
    const departmentStats = user.company.departments.map(dept => {
      const deptEmployees = dept.employees;
      const deptTotalSalary = deptEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0);
      
      return {
        id: dept.id,
        name: dept.name,
        employeeCount: deptEmployees.length,
        totalSalary: deptTotalSalary,
        averageSalary: deptEmployees.length > 0 ? deptTotalSalary / deptEmployees.length : 0
      };
    });

    res.json({
      company: {
        id: user.company.id,
        name: user.company.name,
        stats: {
          totalEmployees,
          totalSalary,
          averageSalary
        }
      },
      departments: departmentStats,
      employees: employees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        position: emp.position,
        grossSalary: emp.grossSalary,
        departmentId: emp.departmentId
      }))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Erreur dashboard entreprise:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
}; 