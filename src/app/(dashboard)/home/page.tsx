import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import UploadedMedia from "@/src/components/UploadedMedia";
import { caller } from "@/src/trpc/server";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { MdPermMedia } from "react-icons/md";
import FreePlanPopup from "@/src/features/components/freePlanPopup";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function Dashboard() {
  const { subscription, plan } = await caller.getSubscriptionAndPlan();
  console.log("subscription", subscription);
  console.log("plan", plan);
  const instagramAccounts = await caller.getInstagramAccounts();
  const onFreePlan: boolean = subscription?.plan === "Free";
  return (
    <>
      <FreePlanPopup onFreePlan={onFreePlan} />
      <div className="flex flex-col gap-6 w-full mx-auto relative ">
        {/* // active and inactive automations */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Linked Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {subscription?.accountsUsed} / {plan?.accounts}
              </p>
              <Progress
                value={
                  ((subscription?.accountsUsed || 0) / (plan?.accounts || 0)) *
                  100
                }
                className="w-full mt-2 h-2"
              />
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Automations Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {subscription?.automationsUsed} /{" "}
                {plan?.automations === -1 ? "Infinity" : plan?.automations}
              </p>
              <Progress
                value={
                  ((subscription?.automationsUsed || 0) /
                    (plan?.automations === -1
                      ? Infinity
                      : plan?.automations || 0)) *
                  100
                }
                className="w-full mt-2 h-2"
              />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Actions Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {subscription?.actionsUsed} / {plan?.actionsPerMonth}
              </p>
              <Progress
                value={
                  ((subscription?.actionsUsed || 0) /
                    (plan?.actionsPerMonth || 0)) *
                  100
                }
                className="w-full mt-2 h-2"
              />
            </CardContent>
          </Card>
        </div>
        <Separator />

        {instagramAccounts.length > 0 ? (
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <MdPermMedia className="w-5 h-5 mr-2" /> Start Automating on your
              Instagram media now
            </h1>
            <p className=" ml-9 text-sm text-muted-foreground mb-6 max-w-2xl">
              Here are your uploaded media on Instagram. You can run automations
              on them to create content for your instagram account.
            </p>
            <UploadedMedia
              canCreateAutomation={
                (subscription?.automationsUsed || 0) < (plan?.automations || 0)
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center py-20 text-center space-y-4">
            <h2 className="text-4xl font-bold max-w-3xl text-center">
              Connect Your First Instagram Account
            </h2>
            <p className="text-muted-foreground max-w-lg text-lg">
              Start automating replies to comments and DMs. Connect your
              Instagram account securely using Meta Official API.
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
                  <span className="text-green-500">✔</span> Secure via Meta
                  Graph API
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
    </>
  );
}
