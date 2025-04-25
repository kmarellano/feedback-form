import { z } from 'zod';

export const emailSchema = z
  .string({ message: 'A valid email is required.' })
  .email('Invalid email format');

export const mobileSchema = z
  .string({ invalid_type_error: 'A valid mobile is required.' })
  .regex(/^\d+$/, 'Mobile number must contain only numbers');

export const uuidSchema = z
  .string({ invalid_type_error: 'A valid ID is required.' })
  .uuid('A valid ID is required.');
