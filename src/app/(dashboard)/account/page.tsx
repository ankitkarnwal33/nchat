import InstagramAccountCard from "@/src/components/InstagramAccountCard";
import { Button } from "@/src/components/ui/button";

import { caller } from "@/src/trpc/server";
import { ArrowRightIcon, Plus } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const user = await caller.getUser();
  const { subscription, plan } = await caller.getSubscriptionAndPlan();
  return (
    <div className="relative flex flex-col justify-center mt-10">
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Instagram Accounts</h1>
          <p className="text-sm text-muted-foreground ">
            Connect and manage your Instagram accounts to start automating
            replies, comments, and DMs.
          </p>
        </div>
        <Button>
          {(subscription?.accountsUsed || 0) < (plan?.accounts || 0) ? (
            <Link href={process.env.INSTAGRAM_LINK_URL || ""}>
              <Button className="">Connect Instagram</Button>
            </Link>
          ) : (
            <Link href={"/upgrade"}>
              <Button className="">
                Upgrade Now <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </Button>
      </div>
      {user && user?.instagramAccounts?.length > 0 ? (
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-lg font-semibold">Connected Accounts</h2>
            <div className="flex flex-col gap-2">
              {user.instagramAccounts.map((account) => (
                <InstagramAccountCard
                  key={account.id}
                  account={{
                    id: account.id,
                    instagramUserId: account.instagramUserId,
                    profilePicture: account.profilePicture || "",
                    username: account.username || "",
                    connectedAt: account.connectedAt,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center mt-5">
            <h2 className="text-2xl font-semibold">
              Add Another Instagram Account
            </h2>
            <p className="text-normal text-muted-foreground">
              Connect multiple Instagram accounts and manage all your
              conversations in one place.
            </p>
            <div className="flex flex-col gap-2 items-center justify-center mt-5">
              {(subscription?.accountsUsed || 0) < (plan?.accounts || 0) ? (
                <Link href={process.env.INSTAGRAM_LINK_URL || ""}>
                  <Button className="">Connect Instagram</Button>
                </Link>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    You have reached the maximum number of accounts.
                  </p>
                  <Link href={"/upgrade"}>
                    <Button className="">
                      Upgrade Now <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center py-20 text-center space-y-4">
          <h2 className="text-4xl font-bold max-w-3xl text-center">
            Connect Your First Instagram Account
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            Start automating replies to comments and DMs. Connect your Instagram
            account securely using Meta Official API.
          </p>
          <div className="mt-6">
            <Link
              href={process.env.INSTAGRAM_LINK_URL || ""}
              className="w-full "
            >
              <Button className="w-full px-10">
                <Plus className="w-4 h-4 mr-2" />
                Connect Instagram Account
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-4 space-y-1 ">
              <p>
                <span className="text-green-500">✔</span> Secure via Meta Graph
                API
              </p>
              <p>
                <span className="text-green-500">✔</span> No password required
              </p>
              <p>
                <span className="text-green-500">✔</span> Takes less than 30
                seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
