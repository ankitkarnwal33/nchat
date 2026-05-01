import { PLANS } from "./Plans";
import prisma from "./prisma";

export async function canExecuteAction(userId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = PLANS[sub?.plan || "FREE"];

  const month = new Date().toISOString().slice(0, 7);

  const usage = await prisma.usage.findUnique({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
  });

  const used = usage?.actions || 0;

  if (used >= plan.actionsPerMonth) {
    return false;
  }

  return true;
}
