import { z } from 'zod';

export const DependencyStatusSchema = z.enum(['up', 'down']);

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.string(),
  version: z.string(),
  uptimeSeconds: z.number().nonnegative(),
  checks: z.record(z.string(), DependencyStatusSchema),
});

export type DependencyStatus = z.infer<typeof DependencyStatusSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
