"use client";
import { InstagramMedia } from "@/types/types";
import MediaCard from "./MediaCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPCClient } from "../trpc/client";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { IoMdImage } from "react-icons/io";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

function normalizeMediaPage(page: unknown): InstagramMedia[] {
  if (Array.isArray(page)) return page as InstagramMedia[];
  if (
    page &&
    typeof page === "object" &&
    "data" in page &&
    Array.isArray((page as { data: unknown }).data)
  ) {
    return (page as { data: InstagramMedia[] }).data;
  }
  return [];
}

export default function UploadedMedia() {
  const trpcClient = useTRPCClient();

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["instagram", "getMediaWithPagination"],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      return trpcClient.instagram.getMediaWithPagination.query({
        cursor,
        page: 1,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (Array.isArray(lastPage)) return undefined;
      if (!lastPage.hasNextPage) return undefined;
      const c = lastPage.cursor;
      if (typeof c !== "string" || c.length === 0) return undefined;
      return c;
    },
    placeholderData: (prev) => prev,
  });

  const mediaList =
    data?.pages.flatMap((page) => normalizeMediaPage(page)) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="w-full ">
                <CardContent>
                  <Skeleton className="aspect-video w-full relative opacity-30">
                    <IoMdImage className="w-10 h-10 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </Skeleton>
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 mt-5" />
                </CardHeader>
              </Card>
            ))
          : mediaList.map((media: InstagramMedia) => (
              <MediaCard key={media.id} media={media} />
            ))}
        {isFetching &&
          [1, 2, 3].map((item) => <Skeleton key={item} className=" h-80" />)}
      </div>
      <Separator />
      {hasNextPage && !isLoading ? (
        <div className="flex justify-center pb-10">
          <Button
            type="button"
            className="col-span-full w-fit mx-auto text-sm hover:scale-105 transition-all duration-300"
            onClick={() => void fetchNextPage()}
          >
            Load more
            {isFetchingNextPage && (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
