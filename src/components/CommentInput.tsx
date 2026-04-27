import { CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { TooltipHelp } from "./TooltipHelp";
import { Textarea } from "@/src/components/ui/textarea";
import { useTRPC } from "@/src/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoadingCommentSVG, LoadingIcon } from "./ImproveCommentSVG";
import { AISvg, LoadingAISvg } from "./AISvg";
import { Skeleton } from "./ui/skeleton";

export default function CommentInput({
  comment,
  setComment,
}: {
  comment: string;
  setComment: (comment: string) => void;
}) {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.getAIResponse.mutationOptions(),
  );

  const handleAI = async (type: "improve" | "generate") => {
    mutate(
      {
        type,
        message: comment,
        commentOrDm: "comment",
      },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setComment(data.data || "");
          }
        },
        onError: (error) => {
          console.error("Error is ", error);
        },
      },
    );
  };
  return (
    <div>
      <CardDescription className=" text-muted-foreground my-2">
        <TooltipHelp
          title="This is the reply users will see on your post.
Keep it short and engaging. Example: “Thanks! Check your DM 😊”"
        >
          Public Reply To Comment
        </TooltipHelp>
      </CardDescription>
      <div className="relative">
        <Textarea
          className="w-full mt-2 min-h-30 whitespace-pre-line"
          placeholder={`${!isPending ? "Thank you for your comment 😊" : ""}`}
          value={isPending ? "" : comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {isPending && (
          <div className="absolute top-4 left-2 w-full flex gap-2 flex-col">
            <Skeleton className="w-3/4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="w-2/3 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}
        {comment.length > 0 ? (
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
