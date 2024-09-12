import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { noteRouter } from "./routers/note";
import { userRouter } from "./routers/user";
import { wsTest } from "./routers/ws-subscription";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  note: noteRouter,
  user: userRouter,
  wsTest: wsTest,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
