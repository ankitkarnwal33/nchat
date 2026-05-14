"use client";
import ButtonLoading from "@/src/components/ButtonLoading";
import { Button } from "@/src/components/ui/button";
import { SubscriptionPlan } from "@/src/lib/generated/prisma/client";
import { useTRPC } from "@/src/trpc/client";
import { useMutation } from "@tanstack/react-query";

declare global {
  interface Window {
    Cashfree: (config: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: string;
      }) => Promise<{ error?: unknown; redirect?: boolean }>;
    };
  }
}

export default function UpgradeCta({
  plan,
  currentSubscription,
}: {
  plan: SubscriptionPlan;
  currentSubscription: string;
}) {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation({
    ...trpc.subscription.createOrder.mutationOptions(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      console.log("data", data);
      // window.location.href = data.payment_link;
      const cashfree = window.Cashfree({
        mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      });

      cashfree
        .checkout({
          paymentSessionId: data?.payment_session_id || "",
          redirectTarget: "_self",
        })
        .then((result) => {
          if (result.error) {
            console.error("Cashfree checkout error", result.error);
          }
          if (result.redirect) {
            console.log("Redirecting to Cashfree...");
          }
        });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return (
    <>
      {!isPending ? (
        <Button
          variant={plan.popular ? "default" : "outline"}
          className="w-full"
          onClick={() => mutate({ plan: plan.name.toLowerCase() })}
        >
          {currentSubscription.toLowerCase().trim() ===
          plan.name.toLowerCase().trim()
            ? "Current Plan"
            : plan.cta}
        </Button>
      ) : (
        <ButtonLoading
          idle="Upgrade to Starter"
          success="Upgraded to Starter"
          buttonState="loading"
        />
      )}
    </>
  );
}
