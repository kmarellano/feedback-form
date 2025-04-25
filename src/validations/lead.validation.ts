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

export const findOneLeadSchema = z
  .object({
    id: uuidSchema.optional(),
    email: emailSchema.optional(),
    mobile: mobileSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const nonNullFields = [data.id, data.email, data.mobile].filter(Boolean);
    const nullFieldsLength = nonNullFields.length;

    if (!nullFieldsLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one of id, email, or mobile must be provided.',
      });
    }

    if (nullFieldsLength > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['id', 'email', 'mobile'],
        message: 'Only one of id, email, or mobile can be provided.',
      });
    }
  });
