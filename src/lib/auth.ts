/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passwordResetEmailQueue } from "./emailQueue";

import prisma from "./prisma";
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      linkURL: process.env.GITHUB_LINK_URL as string,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 1800,
    sendResetPassword: async ({
      user,
      token,
    }: {
      user: any;
      token: string;
    }) => {
      await passwordResetEmailQueue.add("password_reset_email_queue", {
        user,
        token,
      });
    },
  },
  trustedOrigins: ["http://localhost:3000", "https://chatninjas.in"],

  // After a user is signed up, create the new subscription record with Free plan

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              plan: "Free",
              status: "active",
            },
          });
        },
      },
    },
  },
});
