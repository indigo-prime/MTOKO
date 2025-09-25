// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Ensure a single PrismaClient instance across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;