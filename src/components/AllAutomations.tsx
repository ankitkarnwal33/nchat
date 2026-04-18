"use client";

import { AutomationModal } from "./AutomationModal";
import { Action, Trigger, TriggerType } from "../lib/generated/prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "../trpc/client";
import AutomationCard from "./AutomationCard";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, Loader2Icon } from "lucide-react";
import Filter from "./Filter";
import { useSearchParams } from "next/navigation";

export interface AllAutomationList {
  name: string;
  id: string;
  createdAt: Date;
  userId: string;
  accountId: string;
  triggerType: TriggerType;
  targetMediaId: string | null;
  isActive: boolean;
  triggeredCount: number;
  triggers: Trigger[];
  actions: Action[];
  account?: {
    accessToken: string;
  };
}

export default function AllAutomationList() {
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  // const accountId = searchParams.get("accountId") ?? "";
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const sort = searchParams.get("sort") ?? "desc";
  type Cursor =
    | {
        id: string;
        createdAt: Date;
      }
    | undefined;

  const { data, fetchNextPage, isFetching, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.getAutomations.infiniteQueryOptions(
        {
          limit: 12,
          search,
          status: (status as "all" | "active" | "inactive") || "all",
          sort: (sort as "desc" | "asc") || "desc",
        },
        {
          initialCursor: undefined as Cursor,
          getNextPageParam: (lastPage) =>
            (lastPage as { nextCursor: Cursor }).nextCursor,
          staleTime: 1000 * 60 * 1, // 1 minute
          gcTime: 0,
          placeholderData: (prev) => prev,
        },
      ),
    );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Load more automations when the user scrolls to the bottom of the page
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-6 pb-20">
      {data &&
      data.pages[0] &&
      (data.pages[0] as { automations: AllAutomationList[] }).automations
        .length > 0 ? (
        <Filter />
      ) : search || status || sort ? (
        <Filter />
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data &&
          data.pages
            .flatMap(
              (page) =>
                (page as { automations: AllAutomationList[] }).automations,
            )
            .map((automation) => {
              return (
                <AutomationCard
                  key={automation.id}
                  automation={automation as unknown as AllAutomationList}
                />
              );
            })}
        {/* Loading Skeleton */}
        {isFetching &&
          [1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 mb-2" />
              </CardContent>
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 mt-5" />
              </CardHeader>
            </Card>
          ))}
        {/* Load more button when there are more automations but scroll is not working (fallback) */}
        {hasNextPage && (
          <div ref={loadMoreRef}>
            {isFetchingNextPage ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <Button
                type="button"
                className="col-span-full w-fit mx-auto text-sm hover:scale-105 transition-all duration-300"
                onClick={() => void fetchNextPage()}
              >
                Load more <ArrowDown className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      {/* No more automations reached the bottom of the page */}
      {data &&
        (data.pages[0] as { automations: AllAutomationList[] }).automations
          .length > 0 &&
        !hasNextPage &&
        !isFetching && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="text-4xl">⚡</div>
            <h2 className="text-xl font-semibold">No more automations</h2>
            <p className="text-muted-foreground max-w-md">
              You&apos;ve reached the end of your automation list.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="col-span-full w-fit mx-auto text-sm hover:scale-105 transition-all duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Go back to the top <ArrowUp className="w-4 h-4" />
              </Button>
              <AutomationModal />
            </div>
          </div>
        )}

      {/* Empty State - No automations found */}
      {data &&
        (data.pages[0] as { automations: AllAutomationList[] }).automations
          .length === 0 &&
        !isFetching && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="text-4xl">⚡</div>
            <h2 className="text-xl font-semibold">No Automations Yet</h2>
            <p className="text-muted-foreground max-w-md">
              Create your first automation to start replying to comments and DMs
              automatically.
            </p>
            <AutomationModal />
          </div>
        )}
    </div>
  );
}
