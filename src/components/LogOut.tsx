"use client";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="icon"
      className="w-full"
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged out");
              router.push("/login");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          },
        });
      }}
    >
      <LogOutIcon className="size-4" />
      Log Out
    </Button>
  );
}
