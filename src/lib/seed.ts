import prisma from "./prisma";

import "dotenv/config";
export const PLANS: {
  name: string;
  accounts: number;
  automations: number;
  actionsPerMonth: number;
  followRequired: boolean;
}[] = [
  {
    name: "Free",
    accounts: 1,
    automations: 1,
    actionsPerMonth: 50,
    followRequired: false,
  },

  {
    name: "Starter",
    accounts: 1,
    automations: 5,
    actionsPerMonth: 500,
    followRequired: false,
  },

  {
    name: "Growth",
    accounts: 3,
    automations: 50,
    actionsPerMonth: 5000,
    followRequired: true,
  },

  {
    name: "Pro",
    accounts: 10,
    automations: Infinity,
    actionsPerMonth: 20000,
    followRequired: true,
  },
];

export const seedPlans = async () => {
  for (const plan of PLANS) {
    await prisma.plans.create({
      data: plan,
    });
  }
};

seedPlans();
