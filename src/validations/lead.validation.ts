import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  mobileSchema,
  uuidSchema,
  dateSchema,
  postCodeSchema,
  ServiceTypeEnum,
  SortOrderEnum,
} from './base.validation';

export const leadInputSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    mobile: mobileSchema,
    postcode: postCodeSchema,
    preferredService: ServiceTypeEnum,
  })
  .strict();

export const updateInputSchema = leadInputSchema.partial();

export const findManyLeadSchema = z
  .object({
    name: nameSchema,
    postcode: postCodeSchema,
    preferredService: ServiceTypeEnum,
    createdAt: dateSchema,
  })
  .partial();

export const findOneLeadSchema = z
  .object({
    id: uuidSchema,
    email: emailSchema,
    mobile: mobileSchema,
  })
  .partial()
  .superRefine((data, ctx) => {
    const nonNullFields = [data.id, data.email, data.mobile].filter(Boolean);
    const nonNullFieldsLength = nonNullFields.length;

    if (!nonNullFieldsLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one of id, email, or mobile must be provided.',
        fatal: true,
      });

      return z.NEVER;
    }

    if (nonNullFieldsLength > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['id', 'email', 'mobile'],
        message: 'Only one of id, email, or mobile can be provided.',
      });
    }
  });

const sortableFields = Object.keys(findManyLeadSchema.shape) as [
  keyof typeof findManyLeadSchema.shape,
];
export const leadSortSchema = z.record(z.enum(sortableFields), SortOrderEnum);
