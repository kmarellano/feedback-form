import { z } from 'zod';
import { emailSchema, mobileSchema, uuidSchema } from './base.validation';

export const ServiceTypeEnum = z.enum(['DELIVERY', 'PAYMENT', 'PICKUP']);

export const leadInputSchema = z.object({
  name: z.string(),
  email: emailSchema,
  mobile: mobileSchema,
  postcode: z.string({ required_error: 'Post code is required' }),
  preferredService: ServiceTypeEnum,
});

export const leadIdSchema = z.object({
  id: uuidSchema,
});
