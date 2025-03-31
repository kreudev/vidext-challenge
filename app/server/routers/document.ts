import { publicProcedure, router } from '../trpc';

let documentStore: {
  id: string;
  content: Record<string, any>;
  updatedAt: Date;
} = {
  id: '1',
  content: {},
  updatedAt: new Date(),
};

export const documentRouter = router({
  getDocument: publicProcedure.query(async () => {
    return documentStore;
  }),

  updateDocument: publicProcedure
    .input((val: unknown) => {
      if (
        typeof val === 'object' &&
        val !== null &&
        'id' in val &&
        'content' in val &&
        'updatedAt' in val
      ) {
        return val as {
          id: string;
          content: Record<string, any>;
          updatedAt: Date;
        };
      }
      throw new Error('Invalid input');
    })
    .mutation(async ({ input }) => {
      documentStore = {
        ...documentStore,
        ...input,
        updatedAt: new Date(),
      };
      return documentStore;
    }),
}); 