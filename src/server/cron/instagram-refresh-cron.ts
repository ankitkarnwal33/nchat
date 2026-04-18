"use server";
import cron from "node-cron";
import prisma from "@/src/lib/prisma";

async function refreshInstagramToken(accountId: string, token: string) {
  try {
    const params = new URLSearchParams({
      grant_type: "ig_refresh_token",
      access_token: token,
    });
    console.log(`Refreshing token for account ${accountId}`);
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?${params.toString()}`,
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Refresh failed:", data);
      return;
    }

    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        accessToken: data.access_token,
        tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });

    console.log(`✅ Refreshed token for account ${accountId}`);
  } catch (err) {
    console.error("Cron refresh error:", err);
  }
}

// 🔥 Run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🚀 Running Instagram token refresh cron...");

  try {
    const accounts = await prisma.instagramAccount.findMany({
      where: {
        tokenExpiresAt: {
          lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expiring in 3 days
        },
      },
    });

    for (const acc of accounts) {
      await refreshInstagramToken(acc.id, acc.accessToken);
    }
    console.log(`✅ Checked ${accounts.length} accounts`);
  } catch (err) {
    console.error("Cron refresh error:", err);
  }
});
