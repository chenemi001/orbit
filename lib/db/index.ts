import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import * as relations from "./relations";

const fullSchema = { ...schema, ...relations };

type Database = PostgresJsDatabase<typeof fullSchema>;

let cached: Database | undefined;

function getDb(): Database {
  if (cached) {
    return cached;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  // `prepare: false` is required when DATABASE_URL points at Supabase's
  // transaction-mode pooler (port 6543), which doesn't support session-level
  // prepared statements. `max: 1` keeps each serverless function instance to
  // a single pooled connection — safe because the pooler (not this client)
  // is what actually multiplexes many concurrent callers, and Vercel can run
  // many function instances at once, each importing this module fresh.
  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  cached = drizzle(client, { schema: fullSchema });

  return cached;
}

// `db` only connects on first actual use, not on import. Next.js's build
// step imports every route module to collect metadata — if this threw
// eagerly for a missing DATABASE_URL, `next build` would fail even though
// no request was ever served (a real problem for CI/Vercel builds that run
// before environment variables are configured). Methods are bound to the
// real instance because `proxyDb.transaction(...)` calls the retrieved
// function with `this` set to the proxy, not to the real database object.
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, real);

    return typeof value === "function" ? value.bind(real) : value;
  },
});
