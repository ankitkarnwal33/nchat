// import { authClient } from "@/lib/auth-client";

import { AutomationModal } from "@/src/components/AutomationModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";

import { ArrowRightIcon, Plus } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/src/components/ui/separator";

import { FcWorkflow } from "react-icons/fc";
import AllAutomations from "@/src/components/AllAutomations";
import { caller } from "@/src/trpc/server";
import { Button } from "@/src/components/ui/button";

export default async function Automations() {
  const automationsCount = await caller.getAutomationsCount();
  const instagramAccounts = await caller.getInstagramAccounts();
  const { subscription, plan } = await caller.getSubscriptionAndPlan();

  const canCreateAutomation =
    (subscription?.automationsUsed || 0) < (plan?.automations || 0);

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {instagramAccounts.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <FcWorkflow className="w-5 h-5 mr-2" />
                Automations
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your Instagram comment and DM automations
              </p>
            </div>

            {canCreateAutomation ? <AutomationModal /> : null}
          </div>
          <Separator />
          {/* // active and inactive automations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Active Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{automationsCount?.active}</p>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Inactive Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{automationsCount?.inactive}</p>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Total runs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pending</p>
              </CardContent>
            </Card>
          </div>
          <Separator />
          <div className="flex flex-col">
            {!canCreateAutomation ? (
              <>
                <Card className="border-destructive  border border-dashed">
                  <CardHeader>
                    <CardTitle>Limit Reached</CardTitle>
                    <CardDescription className="text-destructive">
                      You have reached the limit of automations. Upgrade to a
                      paid plan to create more automations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/upgrade"
                      className="col-span-full w-fit  text-sm hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold flex items-center gap-2"
                    >
                      Upgrade Now <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
                <Separator className="my-6" />
              </>
            ) : null}

            <p className=" text-md text-muted-foreground mb-6 max-w-2xl">
              Manage your automations
            </p>
            <AllAutomations canCreateAutomation={canCreateAutomation} />
          </div>
        </>
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
