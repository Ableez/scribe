import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        email: z.string().min(1),
        emailVerified: z.boolean(),
        image: z.string().min(1),
        username: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(users).values({
          email: input.email,
          emailVerified: input.emailVerified,
          id: input.id,
          image: input.image,
          username: input.username,
        });
      } catch (error) {
        console.error("[INTERNAL_ERROR]", error);
      }
    }),
});
