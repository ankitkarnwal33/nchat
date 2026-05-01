"use client";

import CommentInput from "@/src/components/CommentInput";
import DMInput from "@/src/components/DMInput";
import FollowMessage from "@/src/components/FollowMessage";
import FollowSwitch from "@/src/components/FollowSwitch";
import Iphone from "@/src/components/Iphone";
import IphoneComment from "@/src/components/IphoneComment";
import IphoneHome from "@/src/components/IphoneHome";
import IphoneMessage from "@/src/components/IphoneMessage";
import LinkDM from "@/src/components/LinkDM";
import LinkSwitch from "@/src/components/LinkSwitch";
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
import { Separator } from "@/src/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, SendIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

export default function NewAutomation() {
  const searchParamsObj = useSearchParams();
  const mediaId = searchParamsObj.get("mediaId");
  const username = searchParamsObj.get("username");
  const imageUrl = searchParamsObj.get("imageUrl");
  const caption = searchParamsObj.get("caption");
  // Automation Name
  const [automationName, setAutomationName] = useState("");
  // Trigger Type
  const [triggerType] = useState<"COMMENT" | "DM">(mediaId ? "COMMENT" : "DM");

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Trigger Keywords
  const [input, setInput] = useState("");
  // Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  // Message To Send in DM
  const [message, setMessage] = useState("");
  // Action
  const [action, setAction] = useState("");
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
  // Add Link To The Private Message
  const [addLink, setAddLink] = useState(false);
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.instagram.createAutomation.mutationOptions(),
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const payload = {
      name: automationName,
      triggerType,
      targetMediaId: mediaId || undefined,

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
        meta: {
          link,
          linkText,
          askForFollow,
          followMessage,
        },
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
          meta: {
            link,
            linkText,
            askForFollow,
            followMessage,
          },
        },
      );
    }
    mutate(payload, {
      onSuccess: async () => {
        toast.success("Automation created successfully");
        router.push(`/automations/`);
        await queryClient.invalidateQueries(trpc.getAutomations.queryFilter());
        await queryClient.invalidateQueries(
          trpc.getAutomationsCount.queryFilter(),
        );
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
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
                        src={imageUrl || ""}
                        alt="Automation Image"
                        width={150}
                        height={100}
                        className="rounded-lg object-cover border-2 p-px border-gray-200 aspect-square"
                        loading="eager"
                      />
                      <div className="flex flex-col gap-2">
                        <CardDescription className=" line-clamp-3  max-w-2xl">
                          {caption}
                        </CardDescription>
                        <CardDescription className=" text-muted-foreground">
                          @{username}
                        </CardDescription>
                      </div>
                    </div>
                    <Separator className="my-4" />

                    {/* Keywords UI (same as your existing code) */}
                    {mediaId ? (
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
                    username={username || ""}
                    imageUrl={imageUrl || ""}
                    caption={caption || ""}
                  />
                </Iphone>
              </TabsContent>
              <TabsContent value="comment">
                <Iphone>
                  <IphoneComment
                    username={username || ""}
                    postImage={imageUrl || ""}
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
