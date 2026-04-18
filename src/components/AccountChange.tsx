"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSidebar } from "@/src/components/ui/sidebar";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function AccountSwitcher({
  instagramAccounts,
  activeAccountId,
}: {
  instagramAccounts: {
    id: string | null;
    username: string | null;
    instagramUserId: string | null;
    profilePicture: string | null;
  }[];
  activeAccountId: string | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const trpc = useTRPC();
  const { open, toggleSidebar } = useSidebar();
  const [currentAccountId, setCurrentAccountId] = useState(activeAccountId);
  const { mutate } = useMutation(trpc.setActiveAccount.mutationOptions());
  // 🔁 sync when server value changes
  useEffect(() => {
    if (activeAccountId && activeAccountId !== currentAccountId) {
      setCurrentAccountId(activeAccountId);
    }
  }, [activeAccountId]);

  useEffect(() => {
    // If no active account but accounts exist → auto select first
    if (!activeAccountId && instagramAccounts.length > 0) {
      const firstAccountId = instagramAccounts[0].id;

      if (firstAccountId) {
        setCurrentAccountId(firstAccountId);

        mutate(
          { accountId: firstAccountId },
          {
            onSuccess: () => {
              const newParams = new URLSearchParams(params);
              newParams.set("accountId", firstAccountId);
              queryClient.invalidateQueries({
                queryKey: ["automations"],
              });
              router.push(`?${newParams.toString()}`);
            },
          },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instagramAccounts, activeAccountId]);
  const queryClient = useQueryClient();
  // find selected account
  const selectedAccount = useMemo(() => {
    if (!currentAccountId) return instagramAccounts[0];
    return instagramAccounts.find((acc) => acc.id === currentAccountId);
  }, [instagramAccounts, currentAccountId]);

  const handleSwitch = async (accountId: string) => {
    if (accountId === currentAccountId) return;
    setCurrentAccountId(accountId);
    mutate(
      { accountId },
      {
        onSuccess: async () => {
          toast.success("Account switched successfully");
          await queryClient.invalidateQueries({
            queryKey: ["instagram", "getMediaWithPagination"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["automations"],
          });
          const newParams = new URLSearchParams(params);
          newParams.set("accountId", accountId);

          router.push(`?${newParams.toString()}`);
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to set active account");

          setCurrentAccountId(activeAccountId);
        },
      },
    );
  };

  return (
    <>
      {!open ? (
        <>
          {activeAccountId ? (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full"
            >
              <Image
                src={selectedAccount?.profilePicture || ""}
                alt={selectedAccount?.username || ""}
                width={24}
                height={24}
                className="rounded-full shadow-sm"
              />
            </Button>
          ) : null}
        </>
      ) : (
        <Select
          value={currentAccountId || ""}
          onValueChange={(value: string | null) => handleSwitch(value || "")}
        >
          <SelectTrigger className="w-full py-6">
            {selectedAccount ? (
              <div className="flex items-center gap-2">
                <Image
                  src={selectedAccount.profilePicture || ""}
                  alt={selectedAccount.username || ""}
                  width={24}
                  height={24}
                  className="rounded-full shadow-sm"
                />
                <span>@{selectedAccount.username}</span>
              </div>
            ) : (
              <SelectValue placeholder="Select an account">
                <FaInstagram className="size-4" />
              </SelectValue>
            )}
          </SelectTrigger>

          <SelectContent className="px-4 py-3">
            {instagramAccounts.map((account) => (
              <SelectItem
                key={account.id}
                value={account.id || ""}
                disabled={account.id === currentAccountId}
                className="cursor-pointer rounded-md space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={account.profilePicture || ""}
                    alt={account.username || ""}
                    width={24}
                    height={24}
                    className="rounded-full shadow-sm"
                  />
                  <span>@{account.username}</span>
                </div>
              </SelectItem>
            ))}
            <Link href={"/account"}>
              <div className="flex items-center justify-center bg-primary rounded-md p-2 gap-3 text-sm">
                <FaInstagram className="size-4" />
                <span>Add Account</span>
              </div>
            </Link>
          </SelectContent>
        </Select>
      )}
    </>
  );
}
