import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getPlanDetailsMain } from "@/src/trpc/routers/_app";
import { Plans } from "@/src/lib/generated/prisma/client";

export async function POST(req: NextRequest) {
  // This webhook is called only when the payment is successful
  try {
    const body = await req.json();
    const orderId = body?.data?.order?.order_id;
    const paymentStatus = body?.data?.payment?.payment_status;

    const paymentMethod = body?.data?.payment?.payment_group;

    if (!orderId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) return NextResponse.json({ success: true });

    //  Failed payment
    if (paymentStatus === "SUCCESS") {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: "PAID",
          paymentId: `${body?.data?.payment?.cf_payment_id}` || null,
          method: paymentMethod,
        },
      });

      // Get the plan from the database
      const planData = await getPlanDetailsMain(payment.plan);
      if (!planData) {
        return NextResponse.json({ error: "Plan not found" }, { status: 400 });
      }
      //   Activate subscription
      await prisma.subscription.update({
        where: { userId: payment.userId },
        data: {
          plan: payment.plan,
          status: "active",
          allocatedActions: (planData as Plans)?.actionsPerMonth || 0,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
