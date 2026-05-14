import prisma from "../src/lib/prisma";

import "dotenv/config";
export const PLANS: {
  name: string;
  price: number;
  tagline: string;
  description: string;
  features: string[];
  limitNote: string | null;
  cta: string;
  ctaHref: string;
  highlight?: string | null;
  popular: boolean;
  variant: "outline" | "default";
  socialProof?: string | null;
}[] = [
  {
    name: "Free",
    price: 0,
    tagline: "Start automating your first leads",
    description: "Perfect for testing how comment-to-DM automation works.",
    features: [
      "1 Instagram account",
      "1 automation",
      "Comment → Reply",
      "Comment → DM",
      "Keyword-based triggers",
      "50 actions / month",
    ],
    limitNote: "Upgrade to unlock more automations & higher limits",
    cta: "Current Plan",
    ctaHref: "#",
    highlight: null,
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Starter",
    price: 499,
    tagline: "For creators getting consistent engagement",
    description:
      "Automate replies and DMs to convert comments into real conversations.",
    features: [
      "1 Instagram account",
      "Up to 5 automations",
      "Comment → Reply",
      "Comment → DM",
      "Keyword-based triggers",
      "500 actions / month",
    ],
    limitNote: null,
    highlight: "Save hours replying manually every day",
    cta: "Upgrade to Starter",
    ctaHref: "/checkout/starter",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Growth",
    price: 1299,
    tagline: "Turn comments into followers & customers",
    description:
      "Built for serious creators and businesses ready to scale lead generation.",
    features: [
      "Up to 3 Instagram accounts",
      "Up to 50 automations",
      "Comment → DM + multi-step flows",
      "Comment → Reply + DM",
      "Follow-required automation",
      "5,000 actions / month",
    ],
    limitNote: null,
    socialProof: "Most users upgrade to Growth within 7 days",
    highlight: "🚀 Convert commenters into followers before sending offers",
    cta: "Upgrade to Growth",
    ctaHref: "/checkout/growth",
    popular: true,
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: 3499,
    tagline: "For agencies & high-volume growth",
    description:
      "Run large-scale automation with priority performance and advanced control.",
    features: [
      "Up to 10 Instagram accounts",
      "Unlimited automations",
      "Comment → DM + multi-step flows",
      "Follow-required automation",
      "20,000 actions / month",
      "Priority processing (faster execution)",
      "Priority support",
    ],
    limitNote: null,
    highlight: "⚡ Handle thousands of leads effortlessly",
    cta: "Upgrade to Pro",
    ctaHref: "/checkout/pro",
    popular: false,
    variant: "outline" as const,
  },
];

export const seedPlans = async () => {
  for (const plan of PLANS) {
    await prisma.subscriptionPlan.create({
      data: plan,
    });
  }
};

seedPlans();
