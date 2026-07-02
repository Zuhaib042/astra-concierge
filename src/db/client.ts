import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "MissingDatabaseUrlError";
  }
}

type AstraDatabase = NeonHttpDatabase<typeof schema>;

let db: AstraDatabase | null = null;

function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new MissingDatabaseUrlError();
  }

  const sql = neon(databaseUrl);

  return drizzle(sql, { schema });
}

export function getDb() {
  if (!db) {
    db = createDatabase();
  }

  return db;
}
