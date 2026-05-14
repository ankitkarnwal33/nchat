"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTRPCClient } from "@/src/trpc/client";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  const [status, setStatus] = useState("loading");
  const router = useRouter();
  const trpc = useTRPCClient();

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      // User trpc to get the payment status

      const data = await trpc.subscription.getPaymentStatus.query({
        orderId: orderId as string,
      });

      if (!data) return;

      if (data.status.toLowerCase() === "paid") {
        setStatus("success");
        router.push("/home");
        clearInterval(interval);
      }

      if (data.status.toLowerCase() === "failed") {
        setStatus("failed");
        clearInterval(interval);
      }
    }, 2000); // poll every 2 sec

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      {status === "loading" && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="loader mb-4"></div>
          <h2>Processing your payment...</h2>
          <p>Please wait, do not close this page</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col gap-2  items-center justify-center">
          <h2 className="text-green-600 text-2xl">Payment Successful 🎉</h2>
          <p>Your plan is now active</p>
          <p>You will be redirected to the home page in 5 seconds</p>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col gap-2  items-center justify-center">
          <h2 className="text-red-600 text-2xl">Payment Failed ❌</h2>
          <p>Please try again</p>
        </div>
      )}
    </div>
  );
}
