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
import Link from "next/link";
import { MdPermMedia } from "react-icons/md";

export default async function Dashboard() {
  // const user = await caller.getAutomationsCount();
  const instagramAccounts = await caller.getInstagramAccounts();
  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {/* // active and inactive automations */}
      {instagramAccounts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Active Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>10</p>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Inactive Automations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>10</p>
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
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Actions Used</CardTitle>
              </CardHeader>
              <CardContent>
                <p>10/20000</p>
                <Progress value={50} className="w-full mt-2 h-2" />
              </CardContent>
            </Card>
          </div>
          <Separator />
        </>
      ) : null}
      {instagramAccounts.length > 0 ? (
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <MdPermMedia className="w-5 h-5 mr-2" /> My Uploaded Media
          </h1>
          <p className=" ml-9 text-sm text-muted-foreground mb-6 max-w-2xl">
            Here are your uploaded media on Instagram. You can run automations
            on them to create content for your instagram account.
          </p>
          <UploadedMedia />
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
