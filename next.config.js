await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  logging: { fetches: { fullUrl: true } },
  devIndicators: { buildActivity: true },
};

export default config;
