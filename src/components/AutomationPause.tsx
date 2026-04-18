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

export default function AutomationPause({
  automationId,
  open,
  setOpen,
  checked,
  setChecked,
}: {
  automationId: string | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  checked: boolean;
  setChecked: (value: boolean) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: pauseMutate, isPending: isPausing } = useMutation(
    trpc.instagram.pauseAutomation.mutationOptions(),
  );
  const { mutate: resumeMutate, isPending: isResuming } = useMutation(
    trpc.instagram.resumeAutomation.mutationOptions(),
  );
  const isPending = isPausing || isResuming;

  const handleChange = (value: boolean) => {
    setOpen(value); // open popup on toggle
  };

  const handleConfirm = (value: boolean) => {
    const mutate = value ? pauseMutate : resumeMutate;
    mutate(
      { automationId: automationId || "" },
      {
        onSuccess: async () => {
          toast.success(
            value
              ? "Automation paused successfully"
              : "Automation started successfully",
          );
          setOpen(false);
          setChecked(!value);
          await queryClient.invalidateQueries(
            trpc.getAutomations.queryFilter(),
          );
          await queryClient.invalidateQueries(
            trpc.getAutomationsCount.queryFilter(),
          );
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            (error as unknown as Error).message ||
              (value
                ? "Failed to pause automation"
                : "Failed to start automation"),
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {checked ? "Pause Automation?" : "Resume Automation?"}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {checked
            ? "Are you sure you want to pause this automation?"
            : "Are you sure you want to resume this automation?"}
        </DialogDescription>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="default"
            onClick={() => {
              handleConfirm(checked);
            }}
          >
            {isPending ? (
              <div className="flex items-center gap-2 transition-all duration-300 ease">
                <Spinner className="size-4" />
                {checked ? "Pausing" : "Resuming"}
              </div>
            ) : checked ? (
              "Pause Now"
            ) : (
              "Resume Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
