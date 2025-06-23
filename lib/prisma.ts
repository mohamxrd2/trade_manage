import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"], // Tu peux ajouter "query" pour débug
  });

// Evite les erreurs de hot-reload en dev
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
