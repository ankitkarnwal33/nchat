import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AccountRemoveModal({
  instagramUserId,
  username,
  accountId,
  open,
  setOpen,
}: {
  instagramUserId: string;
  username: string;
  accountId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [confirmationValue, setConfirmationValue] = useState("");
  const { mutate: removeAccount, isPending } = useMutation(
    trpc.instagram.disconnectInstagramAccount.mutationOptions({
      onSuccess: async () => {
        toast.success("Account removed successfully", {
          duration: 3000,
          style: {
            backgroundColor: "#008000",
            border: "1px solid #008000",
            color: "#ffffff",
          },
        });
        setOpen(false);
        setConfirmationValue("");
        await queryClient.invalidateQueries(
          trpc.getInstagramAccounts.queryFilter(),
        );
        await queryClient.invalidateQueries(trpc.getUser.queryFilter());
        await queryClient.invalidateQueries(trpc.getAutomations.queryFilter());
        await queryClient.invalidateQueries(
          trpc.getAutomationsCount.queryFilter(),
        );
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
        setOpen(false);
        setConfirmationValue("");
      },
    }),
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="self-start justify-self-end mt-5">
        <Button
          size="sm"
          className="self-start justify-self-end mt-5 bg-red-500 text-red-50 hover:bg-red-600 hover:text-red-100 hover:scale-105 transition-all duration-200 ease  cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2 transition-all duration-300 ease">
              <Spinner className="size-4" />
              Removing
            </div>
          ) : (
            "Remove Account"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive font-bold text-lg">
            Remove Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-primary "> @{username}</span>{" "}
            account?
          </DialogDescription>
          <DialogDescription className="text-destructive">
            This action cannot be undone. All your automations associated with
            this account will be deleted permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogDescription>
          To Confirm, Please Enter{" "}
          <span className="text-destructive">&quot;Remove&quot;</span>:
        </DialogDescription>
        <Input
          className="w-full"
          placeholder="Remove"
          value={confirmationValue}
          onChange={(e) => setConfirmationValue(e.target.value)}
          disabled={confirmationValue === "Remove"}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              removeAccount({ instagramUserId, accountId });
            }}
            disabled={confirmationValue !== "Remove"}
          >
            Remove Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
