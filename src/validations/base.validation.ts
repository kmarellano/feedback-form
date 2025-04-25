import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email format');

export const mobileSchema = z
  .string()
  .regex(/^\d+$/, 'Mobile number must contain only numbers');

export const uuidSchema = z.string().uuid('Invalid ID format');
