"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useTRPC } from "@/src/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";

export default function AutomationDelete({
  automationId,
  open,
  setDeleteOpen,
  automationName,
}: {
  automationId: string | null;
  open: boolean;
  setDeleteOpen: (value: boolean) => void;
  automationName: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [confirmationValue, setConfirmationValue] = useState("");
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation(
    trpc.instagram.deleteAutomation.mutationOptions(),
  );
  const isPending = isDeleting;

  const handleChange = (value: boolean) => {
    setDeleteOpen(value); // open popup on toggle
  };

  const handleConfirm = () => {
    deleteMutate(
      { automationId: automationId || "" },
      {
        onSuccess: async () => {
          toast.success("Automation deleted successfully");
          setDeleteOpen(false);
          await queryClient.invalidateQueries(
            trpc.getAutomations.queryFilter(),
          );
          await queryClient.invalidateQueries(
            trpc.getAutomations.infiniteQueryFilter(),
          );
          await queryClient.invalidateQueries(
            trpc.getAutomationsCount.queryFilter(),
          );
          await queryClient.refetchQueries(
            trpc.getAutomations.infiniteQueryFilter(),
          );
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            (error as unknown as Error).message ||
              "Failed to delete automation",
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Automation?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{automationName}&quot;
            automation?
          </DialogDescription>
          <DialogDescription className="text-destructive">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <DialogDescription>
            To Confirm, Please Enter{" "}
            <span className=" text-destructive">&quot;Delete&quot;</span>:
          </DialogDescription>
          <Input
            className="w-full"
            placeholder="Delete"
            value={confirmationValue}
            onChange={(e) => setConfirmationValue(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>

          {confirmationValue === "Delete" ? (
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirm();
              }}
            >
              {isPending ? (
                <div className="flex items-center gap-2 transition-all duration-300 ease">
                  <Spinner className="size-4" />
                  Deleting
                </div>
              ) : (
                "Delete Now"
              )}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
