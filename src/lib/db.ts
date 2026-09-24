/**
 * Prisma Client Singleton Boilerplate
 * 
 * Note: Prisma packages will be installed and wired in Phase 2.
 */

// Placeholder client type until @prisma/client is installed in Phase 2
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientType = any;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

export const db: PrismaClientType = globalThis.prisma || null;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
