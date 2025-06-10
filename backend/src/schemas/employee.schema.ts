import { z } from 'zod';

const benefitSchema = z.object({
  type: z.enum(['TRANSPORT', 'HOUSING', 'PERFORMANCE', 'OTHER']),
  amount: z.number().min(0),
  description: z.string().optional()
});

export const createEmployeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    position: z.string().min(2, 'Le poste doit contenir au moins 2 caractères'),
    departmentId: z.string().uuid('ID de département invalide'),
    grossSalary: z.number().min(0, 'Le salaire brut doit être positif'),
    benefits: z.array(benefitSchema)
  })
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    email: z.string().email('Email invalide').optional(),
    position: z.string().min(2, 'Le poste doit contenir au moins 2 caractères').optional(),
    departmentId: z.string().uuid('ID de département invalide').optional(),
    grossSalary: z.number().min(0, 'Le salaire brut doit être positif').optional(),
    benefits: z.array(benefitSchema).optional()
  })
}); 