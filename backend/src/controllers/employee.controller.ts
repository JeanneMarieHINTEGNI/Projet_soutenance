import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

// Récupérer tous les employés d'une entreprise
export const getEmployees = async (req: Request, res: Response) => {
  const { companyId } = req.user!;
  
  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: {
      department: true,
      benefits: true
    }
  });

  res.json({ employees });
};

// Récupérer un employé spécifique
export const getEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyId } = req.user!;

  const employee = await prisma.employee.findFirst({
    where: {
      id,
      companyId
    },
    include: {
      department: true,
      benefits: true,
      salaryHistory: {
        orderBy: {
          effectiveDate: 'desc'
        }
      }
    }
  });

  if (!employee) {
    throw new AppError('Employé non trouvé', 404);
  }

  res.json({ employee });
};

// Créer un nouvel employé
export const createEmployee = async (req: Request, res: Response) => {
  const { companyId } = req.user!;
  const {
    firstName,
    lastName,
    email,
    position,
    departmentId,
    grossSalary,
    benefits
  } = req.body;

  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      position,
      companyId,
      departmentId,
      salaryHistory: {
        create: {
          amount: grossSalary,
          effectiveDate: new Date()
        }
      },
      benefits: {
        create: benefits
      }
    },
    include: {
      department: true,
      benefits: true,
      salaryHistory: true
    }
  });

  res.status(201).json({ employee });
};

// Mettre à jour un employé
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyId } = req.user!;
  const {
    firstName,
    lastName,
    email,
    position,
    departmentId,
    grossSalary,
    benefits
  } = req.body;

  // Vérifier si l'employé existe et appartient à l'entreprise
  const existingEmployee = await prisma.employee.findFirst({
    where: {
      id,
      companyId
    }
  });

  if (!existingEmployee) {
    throw new AppError('Employé non trouvé', 404);
  }

  // Mettre à jour l'employé
  const employee = await prisma.employee.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      position,
      departmentId,
      salaryHistory: {
        create: grossSalary ? {
          amount: grossSalary,
          effectiveDate: new Date()
        } : undefined
      },
      benefits: {
        deleteMany: {},
        create: benefits
      }
    },
    include: {
      department: true,
      benefits: true,
      salaryHistory: {
        orderBy: {
          effectiveDate: 'desc'
        }
      }
    }
  });

  res.json({ employee });
};

// Supprimer un employé
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyId } = req.user!;

  // Vérifier si l'employé existe et appartient à l'entreprise
  const employee = await prisma.employee.findFirst({
    where: {
      id,
      companyId
    }
  });

  if (!employee) {
    throw new AppError('Employé non trouvé', 404);
  }

  // Supprimer l'employé
  await prisma.employee.delete({
    where: { id }
  });

  res.status(204).send();
}; 