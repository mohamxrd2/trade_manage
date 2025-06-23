import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { Resend } from "resend";
import { nextCookies } from "better-auth/next-js";

// If your Prisma file is located elsewhere, you can change the path

const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${data.token}`;

      await resend.emails.send({
        from:  "bricohack813@gmail.com",
        to: data.user.email,
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour le faire :</p>
          <a href="${resetLink}" style="background-color:#4CAF50;padding:10px 20px;color:white;text-decoration:none;border-radius:5px;">Réinitialiser le mot de passe</a>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p>${data.url}</p>
          <p>Si vous n’avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()] 
});
