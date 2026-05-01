export const PLANS: Record<
  string,
  {
    name: string;
    accounts: number;
    automations: number;
    actionsPerMonth: number;
    followRequired: boolean;
  }
> = {
  FREE: {
    name: "Free",
    accounts: 1,
    automations: 1,
    actionsPerMonth: 50,
    followRequired: false,
  },

  STARTER: {
    name: "Starter",
    accounts: 1,
    automations: 5,
    actionsPerMonth: 500,
    followRequired: false,
  },

  GROWTH: {
    name: "Growth",
    accounts: 3,
    automations: 50,
    actionsPerMonth: 5000,
    followRequired: true,
  },

  PRO: {
    name: "Pro",
    accounts: 10,
    automations: Infinity,
    actionsPerMonth: 20000,
    followRequired: true,
  },
};
