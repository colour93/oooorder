import { z } from 'zod';

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0, 'Page must be positive').optional().default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional().default('10')
});

export const idParamsSchema = z.object({
  id: uuidSchema
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdParamsInput = z.infer<typeof idParamsSchema>;
