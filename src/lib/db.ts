import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL || "file:./dev.db";

  let client: PrismaClient;

  // SQLite connection support via @prisma/adapter-libsql (e.g. file:./dev.db)
  if (
    connectionString.startsWith("file:") ||
    connectionString.includes(".db") ||
    connectionString.includes("sqlite")
  ) {
    const adapter = new PrismaLibSql({ url: connectionString });
    client = new PrismaClient({ adapter });
  } else {
    // PostgreSQL connection support via @prisma/adapter-pg
    const pool = globalForPrisma.pool ?? new Pool({ connectionString });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.pool = pool;
    }
    const adapter = new PrismaPg(pool);
    client = new PrismaClient({ adapter });
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Lazy proxy so db.xxx resolves to live PrismaClient dynamically
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
