import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import UpgradeCta from "@/src/features/components/UpgradeCta";
import { SubscriptionPlan } from "@/src/lib/generated/prisma/client";
import { subscriptionCaller } from "@/src/trpc/server";
import { Check } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Upgrade",
  description: "Choose a plan to scale your Instagram automation",
};

export default async function Upgrade() {
  const subscriptionPlans =
    (await subscriptionCaller.getSubscriptionPlans()) as SubscriptionPlan[];
  const userSubscription = await subscriptionCaller.getUserSubscription();
  // Get the current user's subscription

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
      />
      <div className="flex flex-col items-center gap-10 py-10 px-4 w-full max-w-6xl mx-auto">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Choose your plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free, grow fast. Pick the plan that fits your Instagram
            automation goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {subscriptionPlans
            .filter((plan) => plan.name != "free")
            ?.map((plan: SubscriptionPlan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col transition-all duration-200 ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20 scale-[1.02] ring-2 ring-primary"
                    : "hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}

                {userSubscription?.plan.toLowerCase().trim() ===
                plan.name.toLowerCase().trim() ? (
                  <div className="absolute top-0 left-0 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow">
                      Current Plan
                    </Badge>
                  </div>
                ) : null}

                <CardHeader className="pb-2 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {plan.name}
                  </p>
                  <CardTitle className="flex items-end gap-1 mt-1">
                    <span className="text-4xl font-extrabold">
                      ₹ {plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1">
                      / month
                    </span>
                  </CardTitle>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      plan.popular ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {plan.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 gap-5">
                  <Separator />

                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span
                          className={
                            f.includes("Follow-required")
                              ? "font-semibold text-primary"
                              : ""
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {"highlight" in plan && plan.highlight && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1">
                      <p className="text-xs font-medium text-primary">
                        {plan.highlight}
                      </p>
                    </div>
                  )}

                  {"socialProof" in plan && plan.socialProof && (
                    <p className="text-xs text-muted-foreground/70 text-center italic">
                      ✨ {plan.socialProof}
                    </p>
                  )}

                  {"highlight" in plan && plan.highlight && (
                    <p className="text-xs text-muted-foreground italic">
                      {plan.highlight}
                    </p>
                  )}

                  {plan.limitNote && (
                    <p className="text-xs text-muted-foreground text-center">
                      {plan.limitNote}
                    </p>
                  )}
                  {userSubscription?.plan.toLowerCase().trim() ===
                  plan.name.toLowerCase().trim() ? null : (
                    <UpgradeCta
                      plan={plan}
                      currentSubscription={userSubscription?.plan}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="text-primary">●</span> 1 action = 1 DM or 1 reply
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">●</span> Actions reset every month
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">●</span> Upgrade anytime. No
            downtime.
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">●</span> No hidden charges
          </span>
        </div>
      </div>
    </>
  );
}
