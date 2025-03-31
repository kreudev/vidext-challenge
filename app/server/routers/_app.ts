import { router } from '../trpc';
import { documentRouter } from './document';

export const appRouter = router({
  document: documentRouter,
});

export type AppRouter = typeof appRouter; 