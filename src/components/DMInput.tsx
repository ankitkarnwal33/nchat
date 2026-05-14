import { CardDescription } from "@/src/components/ui/card";
import { TooltipHelp } from "./TooltipHelp";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "./ui/button";
import { LoadingCommentSVG, LoadingIcon } from "./ImproveCommentSVG";
import { AISvg, LoadingAISvg } from "./AISvg";

import { useTRPC } from "@/src/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
export default function DMInput({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (message: string) => void;
}) {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.getAIResponse.mutationOptions(),
  );

  const handleAI = async (type: "improve" | "generate") => {
    mutate(
      {
        type,
        message: message,
        commentOrDm: "dm",
      },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setMessage(data.data || "");
          }
        },
        onError: () => {
          toast.error("Please try again.");
        },
      },
    );
  };
  return (
    <div>
      <CardDescription className="font-semibold text-muted-foreground my-2">
        <TooltipHelp
          title="This is the message users will receive in their DM.
Example: “Hi there! Thanks for commenting 😊. Here’s the offer 🎉: ”"
        >
          Private Message
        </TooltipHelp>
      </CardDescription>
      <div className="relative">
        <Textarea
          className="w-full mt-2 h-30"
          placeholder={`${!isPending ? "Hi there! Thanks for commenting 😊. Here’s the offer 🎉  ..." : ""}`}
          value={isPending ? "" : message}
          onChange={(e) => setMessage(e.target.value)}
          required={true}
        />
        {isPending && (
          <div className="absolute top-4 left-2 w-full flex gap-2 flex-col">
            <Skeleton className="w-3/4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="w-2/3 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}
        {message.length > 0 ? (
          <Button
            // variant="secondary"
            className="absolute bottom-2 right-2 bg-[#17161A] disabled:opacity-100 hover:bg-zinc-800  p-2 rounded-full dark:bg-zinc-900/90"
            onClick={() => handleAI("improve")}
            disabled={isPending}
            title="Improve with AI"
          >
            {!isPending ? <LoadingCommentSVG /> : <LoadingIcon />}
          </Button>
        ) : (
          <Button
            // variant="secondary"
            className="absolute  bottom-2 right-2 bg-zinc-900 disabled:opacity-100 hover:bg-zinc-800  rounded-full dark:bg-zinc-900/90"
            onClick={() => handleAI("generate")}
            disabled={isPending}
            title="Generate with AI"
          >
            {!isPending ? <AISvg /> : <LoadingAISvg />}
          </Button>
        )}
      </div>
    </div>
  );
}
