"use client";
import {
  Card,
  CardContent,
  CardDescription,
  // CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import AccountRemoveModal from "./AccountRemoveModal";
import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useTRPC } from "@/src/trpc/client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export interface InstagramAccountCardProps {
  id: string;
  instagramUserId: string;
  profilePicture: string;
  username: string;
  connectedAt: Date;
}
export default function InstagramAccountCard({
  account,
}: {
  account: InstagramAccountCardProps;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card key={account.id}>
      <CardContent className="flex justify-between gap-2">
        <div className="flex flex-col  gap-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <CardTitle>@{account.username}</CardTitle>
            <CardDescription>{account.instagramUserId}</CardDescription>
          </div>

          <AccountRemoveModal
            instagramUserId={account?.instagramUserId || ""}
            open={open}
            setOpen={setOpen}
            username={account?.username || ""}
            accountId={account?.id || ""}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 relative">
          <Image
            src={account.profilePicture || ""}
            alt={`${account.username} profile picture`}
            width={100}
            height={100}
            className="rounded-full border-2 shadow-sm"
          />
          {/* <CardDescription className="text-sm text-muted-foreground flex ">
            <span>Connected at </span>
            <span className="font-medium">
              &nbsp;
              {account.connectedAt?.toLocaleDateString()}
            </span>
          </CardDescription> */}

          <Badge variant="outline">
            <span>Connected at </span>
            <span className="font-medium">
              &nbsp;
              {account.connectedAt?.toLocaleDateString()}
            </span>
          </Badge>
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full size-4 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
