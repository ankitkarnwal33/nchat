"use client";

import { TooltipHelp } from "@/src/components/TooltipHelp";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/src/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Separator } from "@/src/components/ui/separator";

import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, SendIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AllAutomationList } from "./AllAutomations";
import { InstagramMedia } from "@/types/types";
import Iphone from "@/src/components/Iphone";
import IphoneComment from "@/src/components/IphoneComment";
import IphoneHome from "@/src/components/IphoneHome";
import IphoneMessage from "@/src/components/IphoneMessage";
import DMInput from "./DMInput";
import LinkSwitch from "./LinkSwitch";
import LinkDM from "./LinkDM";
import FollowSwitch from "./FollowSwitch";
import FollowMessage from "./FollowMessage";
import CommentInput from "./CommentInput";

const ACTIONS: { title: string; value: string }[] = [
  { title: "Send DM", value: "SEND_DM" },
  { title: "Reply to Comment", value: "REPLY_COMMENT" },
  { title: "Reply to Comment and Send DM", value: "REPLY_COMMENT_SEND_DM" },
];

const TABS_LIST: { title: string; value: string }[] = [
  { title: "Home", value: "home" },
  { title: "Comment", value: "comment" },
  { title: "DM", value: "dm" },
];

export default function AutomationEdit({
  automation,
  mediaData,
}: {
  automation: AllAutomationList;
  mediaData: InstagramMedia;
}) {
  // Automation Name
  const [automationName, setAutomationName] = useState("");
  // Trigger Type
  const [triggerType, setTriggerType] = useState<"COMMENT" | "DM">(
    automation.targetMediaId ? "COMMENT" : "DM",
  );
  // Trigger Keywords
  const [input, setInput] = useState("");
  // Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  // Message To Send in DM
  const [message, setMessage] = useState("");

  const [addLink, setAddLink] = useState(false);
  // Action
  const [action, setAction] = useState("REPLY_COMMENT");
  // Comment To Reply to the comment
  const [comment, setComment] = useState("");
  // Ask for Follow Before Sending DM (Link)
  const [askForFollow, setAskForFollow] = useState(false);
  // Link To The Private Message
  const [link, setLink] = useState("");
  // Link Text
  const [linkText, setLinkText] = useState("");
  // Follow Message
  const [followMessage, setFollowMessage] = useState("");
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    trpc.instagram.updateAutomation.mutationOptions(),
  );

  useEffect(() => {
    if (automation) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setAutomationName(automation.name);
      setTriggerType(automation.targetMediaId ? "COMMENT" : "DM");
      setKeywords(automation.triggers.map((t) => t.keyword || ""));

      if (automation.actions.length == 2) {
        // Means the action is REPLY_COMMENT_SEND_DM
        setAction("REPLY_COMMENT_SEND_DM");
        setComment(
          automation.actions.find((a) => a.type === "REPLY_COMMENT")?.message ||
            "",
        );
        setMessage(
          automation.actions.find((a) => a.type === "SEND_DM")?.message || "",
        );
        const meta = automation.actions.find((a) => a.type === "SEND_DM")
          ?.meta as {
          link: string;
          linkText: string;
          askForFollow: boolean;
          followMessage: string;
        };

        if (meta) {
          setLink(meta.link);
          setLinkText(meta.linkText);
          setAskForFollow(meta.askForFollow);
          setFollowMessage(meta.followMessage);
          setAddLink(meta.link ? true : false);
        }
      } else if (automation.actions.length == 1) {
        setAction(automation.actions[0]?.type as "SEND_DM" | "REPLY_COMMENT");
        if (automation.actions[0]?.type === "REPLY_COMMENT") {
          setComment(automation.actions[0]?.message || "");
        } else if (automation.actions[0]?.type === "SEND_DM") {
          setMessage(automation.actions[0]?.message || "");
          const meta = automation.actions.find((a) => a.type === "SEND_DM")
            ?.meta as {
            link: string;
            linkText: string;
            askForFollow: boolean;
            followMessage: string;
          };
          if (meta) {
            setLink(meta.link);
            setLinkText(meta.linkText);
            setAskForFollow(meta.askForFollow);
            setFollowMessage(meta.followMessage);
            setAddLink(meta?.link?.length > 0 ? true : false);
          }
        }
      }
    }
  }, [automation]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const normalizedLink = link.trim();
    const normalizedLinkText = linkText.trim();
    const normalizedFollowMessage = followMessage.trim();
    const hasMeta =
      !!normalizedLink ||
      !!normalizedLinkText ||
      askForFollow ||
      !!normalizedFollowMessage;
    const dmMeta = hasMeta
      ? {
          link: normalizedLink,
          linkText: normalizedLinkText,
          askForFollow,
          followMessage: normalizedFollowMessage,
        }
      : undefined;

    const payload = {
      automationId: automation.id,
      name: automationName,
      triggerType,
      targetMediaId: automation.targetMediaId || undefined,

      triggers: keywords.map((k) => ({
        keyword: k,
        matchType: "CONTAINS",
      })) as { keyword: string; matchType: "CONTAINS" | "EXACT" }[],

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      actions: [] as any[],
    };

    if (action === "SEND_DM") {
      payload.actions.push({
        type: "SEND_DM",
        message,
        delaySeconds: 0,
        meta: dmMeta,
      });
    }
    if (action === "REPLY_COMMENT") {
      payload.actions.push({
        type: "REPLY_COMMENT",
        message: comment,
      });
    }

    if (action === "REPLY_COMMENT_SEND_DM") {
      payload.actions.push(
        {
          type: "REPLY_COMMENT",
          message: comment,
        },
        {
          type: "SEND_DM",
          message,
          meta: dmMeta,
        },
      );
    }
    mutate(payload, {
      onSuccess: async () => {
        toast.success("Automation updated successfully");
        router.push(`/automations/`);
        await queryClient.invalidateQueries(trpc.getAutomations.queryFilter());
        await queryClient.invalidateQueries(
          trpc.getAutomationsCount.queryFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.instagram.getAutomation.queryFilter({
            automationId: automation.id,
          }),
        );
        router.refresh();
      },
      onError: () => {
        toast.error("Failed to update automation");
      },
    });
  };

  // Creating chips of the keywords
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();

      const value = input.trim().toLowerCase();

      if (!value) return;

      // avoid duplicates
      if (!keywords.includes(value)) {
        setKeywords((prev) => [...prev, value]);
      }

      setInput("");
    }
  };

  // Removing chips of the keywords
  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  // for steps
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start justify-start">
            <Card>
              <CardContent>
                {step === 1 && (
                  <div>
                    <CardTitle className="text-xl font-semibold mb-4">
                      When someone comments on this post:
                    </CardTitle>
                    <div className="flex gap-4">
                      <Image
                        src={
                          mediaData.media_type === "VIDEO"
                            ? mediaData.thumbnail_url
                            : mediaData.media_url
                        }
                        alt="Automation Image"
                        width={150}
                        height={100}
                        className="rounded-lg object-cover border-2 p-px border-gray-200 aspect-square"
                        loading="eager"
                      />
                      <div className="flex flex-col gap-2">
                        <CardDescription className=" line-clamp-3  max-w-2xl">
                          {mediaData.caption}
                        </CardDescription>
                        <CardDescription className=" text-muted-foreground">
                          @{mediaData.username}
                        </CardDescription>
                      </div>
                    </div>
                    <Separator className="my-4" />

                    {/* Keywords UI (same as your existing code) */}
                    {mediaData.id ? (
                      <div className="flex flex-col gap-2">
                        <CardDescription className=" text-muted-foreground font-semibold text-[17px]">
                          <TooltipHelp
                            title="Define words that users must type in their comment to trigger this automation.
Example: If you add “price”, automation will run when someone comments “price” or “Price”. If empty, any comment will trigger the automation."
                          >
                            And comment contains any of these keywords (Case
                            Insensitive)
                          </TooltipHelp>
                        </CardDescription>
                        <div className="flex items-center gap-2 flex-row">
                          {keywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              // variant="outline"
                              onClick={() => removeKeyword(keyword)}
                              className="cursor-pointer  relative pr-6"
                            >
                              {keyword}
                              <X className="w-5 h-5 font-semibold  absolute top-1/2 -translate-y-1/2 right-1 text-red-500" />
                            </Badge>
                          ))}
                        </div>
                        <Input
                          type="text"
                          className={cn(
                            "w-full",
                            keywords.length >= 3
                              ? "opacity-50 cursor-not-allowed"
                              : "",
                          )}
                          placeholder="Enter keywords (press Enter to add)"
                          value={input}
                          disabled={keywords.length >= 3}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setInput(e.target.value)}
                          // onChange={(e) => setTriggerKeyword(e.target.value)}
                        />
                        <CardDescription className="text-muted-foreground">
                          💡 Add up to 3 keywords. Automation will trigger when
                          a comment contains any of these words, if no keywords
                          are added, any comment will trigger the automation.
                        </CardDescription>
                        {keywords.length >= 3 && (
                          <CardDescription className="text-yellow-500 text-xs">
                            Maximum 3 keywords can be added, you can add more by
                            removing some.
                          </CardDescription>
                        )}
                        <Separator className="my-4" />
                      </div>
                    ) : null}
                    <Button
                      onClick={nextStep}
                      className="mt-4 w-full flex items-center gap-2"
                    >
                      Next <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <div>
                      <div className="flex flex-col gap-2">
                        <CardDescription className=" text-muted-foreground font-semibold text-[17px] mb-2">
                          <TooltipHelp title="Choose what should happen when the automation is triggered.">
                            Then perform this action:
                          </TooltipHelp>
                        </CardDescription>
                        <Select
                          value={action}
                          onValueChange={(value) =>
                            setAction(
                              value as
                                | "SEND_DM"
                                | "REPLY_COMMENT"
                                | "REPLY_COMMENT_SEND_DM",
                            )
                          }
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select Action" />
                          </SelectTrigger>
                          <SelectContent className="p-2 w-full ">
                            {ACTIONS.map((action) => (
                              <SelectItem
                                value={action.value}
                                key={action.value}
                                className="cursor-pointer"
                              >
                                {action.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Action: Send DM */}

                        {action === "SEND_DM" && (
                          <>
                            <DMInput
                              message={message || ""}
                              setMessage={(value) => setMessage(value)}
                            />
                            <div>
                              {/* Switch for link */}

                              <LinkSwitch
                                addLink={addLink}
                                setAddLink={setAddLink}
                              />

                              {addLink && (
                                <LinkDM
                                  link={link}
                                  setLink={(value) => setLink(value)}
                                  linkText={linkText || ""}
                                  setLinkText={(value) => setLinkText(value)}
                                />
                              )}
                              <div className="flex flex-col gap-2 my-3">
                                <FollowSwitch
                                  askForFollow={askForFollow}
                                  setAskForFollow={setAskForFollow}
                                />
                                {askForFollow && (
                                  <FollowMessage
                                    followMessage={followMessage || ""}
                                    setFollowMessage={(value) =>
                                      setFollowMessage(value)
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {/* Action: Reply to Comment */}
                        {action === "REPLY_COMMENT" && (
                          <CommentInput
                            comment={comment || ""}
                            setComment={(value) => setComment(value)}
                          />
                        )}
                        {/* Action: Reply to Comment and Send DM */}
                        {action === "REPLY_COMMENT_SEND_DM" && (
                          <div className="flex flex-col gap-2">
                            <CommentInput
                              comment={comment || ""}
                              setComment={(value) => setComment(value)}
                            />
                            <DMInput
                              message={message || ""}
                              setMessage={(value) => setMessage(value)}
                            />
                            <div>
                              {/* Switch for link */}

                              <LinkSwitch
                                addLink={addLink}
                                setAddLink={setAddLink}
                              />

                              {addLink && (
                                <LinkDM
                                  link={link}
                                  setLink={(value) => setLink(value)}
                                  linkText={linkText || ""}
                                  setLinkText={(value) => setLinkText(value)}
                                />
                              )}

                              <div className="flex flex-col gap-2 my-3">
                                <FollowSwitch
                                  askForFollow={askForFollow}
                                  setAskForFollow={setAskForFollow}
                                />
                                {askForFollow && (
                                  <FollowMessage
                                    followMessage={followMessage || ""}
                                    setFollowMessage={(value) =>
                                      setFollowMessage(value)
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6 justify-between">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="w-fit flex-1/2"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="w-fit flex-1/2"
                        disabled={!action}
                      >
                        Next <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 mb-4">
                      <CardDescription className="text-muted-foreground text-lg font-semibold">
                        Automation Name <span className="text-red-500">*</span>
                      </CardDescription>
                      <Input
                        type="text"
                        className="w-full md:w-2/3 "
                        placeholder="Enter Automation Name"
                        value={automationName}
                        required
                        aria-required="true"
                        autoFocus
                        onChange={(e) => setAutomationName(e.target.value)}
                      />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      <b className="text-muted-foreground">Name:</b>{" "}
                      {automationName}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      <b className="text-muted-foreground">Trigger:</b>{" "}
                      {triggerType}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      <b className="text-muted-foreground">Keywords:</b>{" "}
                      {keywords.join(", ") ||
                        "Automation will run on each unique comment "}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      <b className="text-muted-foreground">Action:</b> {action}
                    </p>

                    {/* Optional: show message/comment preview */}

                    <div className="flex gap-2 mt-4">
                      <Button
                        className="w-fit  flex-1"
                        variant="outline"
                        onClick={prevStep}
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        className="w-fit flex-1/2"
                      >
                        Publish Automation
                        <SendIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Tabs className="flex flex-col items-center justify-center mx-auto md:w-1/2 w-full">
              <TabsContent value="home">
                <Iphone>
                  <IphoneHome
                    username={mediaData.username || ""}
                    imageUrl={
                      mediaData.media_type === "VIDEO"
                        ? mediaData.thumbnail_url
                        : mediaData.media_url || ""
                    }
                    caption={mediaData.caption || ""}
                  />
                </Iphone>
              </TabsContent>
              <TabsContent value="comment">
                <Iphone>
                  <IphoneComment
                    username={mediaData.username || ""}
                    postImage={
                      mediaData.media_type === "VIDEO"
                        ? mediaData.thumbnail_url
                        : mediaData.media_url || ""
                    }
                    commentMessage={comment || ""}
                    commentKeyword={keywords.join(", ") || "Any"}
                  />
                </Iphone>
              </TabsContent>
              <TabsContent value="dm">
                <Iphone>
                  <IphoneMessage
                    message={message || ""}
                    linkText={linkText || ""}
                    link={addLink}
                  />
                </Iphone>
              </TabsContent>
              <TabsList className="w-full rounded-full mt-5 shadow-md p-6">
                {TABS_LIST.map((tab) => (
                  <TabsTrigger
                    value={tab.value}
                    key={tab.value}
                    className="rounded-full p-4"
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
