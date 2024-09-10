import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    CLERK_SECRET_KEY: z.string(),
    WEBHOOK_SECRET: z.string(),
    // DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    // DATABASE_PRISMA_URL: z.string(),
    // DATABASE_URL_NO_SSL: z.string(),
    // DATABASE_URL_NON_POOLING: z.string(),
    // DATABASE_USER: z.string(),
    // DATABASE_HOST: z.string(),
    // DATABASE_PASSWORD: z.string(),
    // DATABASE_DATABASE: z.string(),

    DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    DATABASE_NEXT_PUBLIC_SUPABASE_URL: z.string(),
    DATABASE_POSTGRES_DATABASE: z.string(),
    DATABASE_POSTGRES_HOST: z.string(),
    DATABASE_POSTGRES_PASSWORD: z.string(),
    DATABASE_POSTGRES_PRISMA_URL: z.string(),
    DATABASE_POSTGRES_URL: z.string(),
    DATABASE_POSTGRES_URL_NON_POOLING: z.string(),
    DATABASE_POSTGRES_USER: z.string(),
    DATABASE_SUPABASE_ANON_KEY: z.string(),
    DATABASE_SUPABASE_JWT_SECRET: z.string(),
    DATABASE_SUPABASE_SERVICE_ROLE_KEY: z.string(),
    DATABASE_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    //   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    // DATABASE_PRISMA_URL: process.env.DATABASE_PRISMA_URL,
    // DATABASE_URL_NO_SSL: process.env.DATABASE_URL_NO_SSL,
    // DATABASE_URL_NON_POOLING: process.env.DATABASE_URL_NON_POOLING,
    // DATABASE_USER: process.env.DATABASE_USER,
    // DATABASE_HOST: process.env.DATABASE_HOST,
    // DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    // DATABASE_DATABASE: process.env.DATABASE_DATABASE,

    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY,
    DATABASE_NEXT_PUBLIC_SUPABASE_URL:
      process.env.DATABASE_NEXT_PUBLIC_SUPABASE_URL,
    DATABASE_POSTGRES_DATABASE: process.env.DATABASE_POSTGRES_DATABASE,
    DATABASE_POSTGRES_HOST: process.env.DATABASE_POSTGRES_HOST,
    DATABASE_POSTGRES_PASSWORD: process.env.DATABASE_POSTGRES_PASSWORD,
    DATABASE_POSTGRES_PRISMA_URL: process.env.DATABASE_POSTGRES_PRISMA_URL,
    DATABASE_POSTGRES_URL:
      process.env.NODE_ENV === "development"
        ? process.env.LOCAL_DATABASE_URL
        : process.env.DATABASE_POSTGRES_URL,
    DATABASE_POSTGRES_URL_NON_POOLING:
      process.env.DATABASE_POSTGRES_URL_NON_POOLING,
    DATABASE_POSTGRES_USER: process.env.DATABASE_POSTGRES_USER,
    DATABASE_SUPABASE_ANON_KEY: process.env.DATABASE_SUPABASE_ANON_KEY,
    DATABASE_SUPABASE_JWT_SECRET: process.env.DATABASE_SUPABASE_JWT_SECRET,
    DATABASE_SUPABASE_SERVICE_ROLE_KEY:
      process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_SUPABASE_URL: process.env.DATABASE_SUPABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
