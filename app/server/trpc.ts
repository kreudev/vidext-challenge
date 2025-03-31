import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const DocumentSchema = z.object({
  id: z.string(),
  content: z.any().nullable(), 
  updatedAt: z.date().or(z.string().transform((str) => new Date(str))),
});

export type Document = z.infer<typeof DocumentSchema>; 