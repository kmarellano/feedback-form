import { z } from 'zod';

export const nameSchema = z
  .string()
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: 'Name can only contain letters, spaces, apostrophes, and hyphens',
  })
  .trim();

export const emailSchema = z
  .string({ message: 'A valid email is required.' })
  .email('Invalid email format')
  .trim();

export const mobileSchema = z
  .string({ invalid_type_error: 'A valid mobile is required.' })
  .trim()
  .regex(/^\d+$/, 'Mobile number must contain only numbers');

export const uuidSchema = z
  .string({ invalid_type_error: 'A valid ID is required.' })
  .trim()
  .uuid('A valid ID is required.');

export const dateSchema = z
  .string()
  .date('Date must be in the format YYYY-MM-DD')
  .trim();

export const postCodeSchema = z
  .string({ required_error: 'Post code is required' })
  .regex(
    /^[\w .-]+$/,
    'Invalid postal code. Only alphanumeric characters, spaces, dashes (-), and dots (.) are allowed.',
  );

export const paginationSchema = z.object({
  paginate: z.boolean().default(true),
  page: z
    .number()
    .int()
    .positive({ message: 'Page must be a positive number' })
    .default(1),
  limit: z
    .number()
    .int()
    .positive({ message: 'Limit must be a positive number' })
    .default(10),
});

export const ServiceTypeEnum = z.enum(['DELIVERY', 'PAYMENT', 'PICKUP']);
