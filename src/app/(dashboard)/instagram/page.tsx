"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/src/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/src/components/ui/spinner";
import { toast } from "sonner";

export default function InstagramCallback() {
  const params = useSearchParams();
  const code = params.get("code");
  const trpc = useTRPC();

  const hasTriggered = useRef(false);
  const { mutate } = useMutation(trpc.exchangeInstagramToken.mutationOptions());
  useEffect(() => {
    if (!code || hasTriggered.current) return;
    hasTriggered.current = true;
    mutate(
      { code },
      {
        onSuccess: () => {
          toast.success("Instagram account connected successfully");
          window.location.href = "/account";
        },
        onError: (error) => {
          toast.error(error.message);
          setTimeout(() => {
            window.location.href = "/account";
          }, 2000);
        },
      },
    );
  }, [code, mutate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Connecting Instagram...</h1>
      <p className="text-lg text-gray-500">
        Please wait while we connect your Instagram account...
      </p>
      <Spinner className="size-10" />
    </div>
  );
}
