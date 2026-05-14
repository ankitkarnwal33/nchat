import axios from "axios";
import prisma from "../../lib/prisma";
import { User } from "better-auth";

import { subscriptionCaller } from "@/src/trpc/server";
import { SubscriptionPlan } from "@/src/lib/generated/prisma/client";

export async function createOrder(user: User, plan: string) {
  // get the plans data from the database

  try {
    const planData = (await subscriptionCaller.getSubscriptionPlan({
      plan,
    })) as SubscriptionPlan;
    if (!planData) {
      throw new Error("Plan not found");
    }
    const planAmount = planData?.price;
    const orderId = `order_${user.id}_${Date.now()}` as string;
    console.log("planAmount", planAmount);
    if (!planAmount) {
      throw new Error("Plan amount not found");
    }
    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: planAmount,
        order_currency: "INR",

        customer_details: {
          customer_id: user.id,
          customer_email: user.email,
          customer_phone: "9999999999",
        },

        order_meta: {
          return_url: `https://chatninjas.in/payment-success?order_id=${orderId}`,
        },
      },
      {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        },
      },
    );

    // ✅ Save order in DB
    await prisma.payment.create({
      data: {
        userId: user.id,
        plan,
        amount: planAmount,
        orderId,
        status: "CREATED",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error is ", error);
    throw new Error((error as Error).message || "Failed to create order.");
  }
}
