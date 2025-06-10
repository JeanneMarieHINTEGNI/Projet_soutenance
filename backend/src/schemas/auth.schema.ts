import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    companyName: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  }),
}); 