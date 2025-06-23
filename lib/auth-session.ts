// app/lib/auth-sessions.ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getSession = async () => {
  try {
    // Ping pour réveiller Neon (facultatif mais utile)
    await prisma.$queryRaw`SELECT 1`;

    const session = await auth.api.getSession({
      headers: await headers(), // ✅ Ne pas utiliser await ici
    });

    return session;
  } catch (error) {
    console.error("Erreur dans getSession:", error);
    return null;
  }
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user || null;
};
