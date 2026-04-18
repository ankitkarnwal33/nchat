"use client";

import Iphone from "@/src/components/Iphone";
import IphoneHome from "@/src/components/IphoneHome";
import { TooltipHelp } from "@/src/components/TooltipHelp";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewAutomation() {
  const searchParamsObj = useSearchParams();
  const mediaId = searchParamsObj.get("mediaId");
  const username = searchParamsObj.get("username");
  const imageUrl = searchParamsObj.get("imageUrl");
  const caption = searchParamsObj.get("caption");
  // Automation Name
  const [automationName, setAutomationName] = useState("");
  // Trigger Type
  const [triggerType, setTriggerType] = useState<"COMMENT" | "DM">(
    mediaId ? "COMMENT" : "DM",
  );
  // Trigger Keywords
  const [input, setInput] = useState("");
  // Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  // Message To Send in DM
  const [message, setMessage] = useState("");
  // Action
  const [action, setAction] = useState("SEND_DM");
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
    trpc.instagram.createAutomation.mutationOptions(),
  );
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
      onError: () => {
        toast.error("Failed to create automation");
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
      <div className="flex flex-row justify-between gap-2">
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
      <Separator />
      <div className="grid grid-cols-1 gap-4 align-baseline">
        <Card>
          <CardContent>
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
                <CardDescription className="text-muted-foreground line-clamp-3 max-w-2xl">
                  {caption}
                </CardDescription>
                <CardDescription className=" text-muted-foreground">
                  @{username}
                </CardDescription>
              </div>
            </div>
            <Separator className="my-4" />
            <CardTitle className="text-lg text-center font-semibold mb-4">
              Setup Automation
            </CardTitle>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="text-center font-semibold">
                  Configure Automation
                </CardHeader>
                <CardContent>
                  <div>
                    {mediaId ? (
                      <div className="flex flex-col gap-2">
                        {/* <CardDescription className=" text-muted-foreground font-semibold">
                          <TooltipHelp
                            title="Select what action will activate this automation.
Example: If “Comment” is selected, the automation will run when someone comments on your post."
                          >
                            Trigger Type
                          </TooltipHelp>
                        </CardDescription>
                        <Select
                          value={mediaId ? "COMMENT" : triggerType}
                          onValueChange={(value) =>
                            setTriggerType(value as "COMMENT" | "DM")
                          }
                          disabled={mediaId ? true : false}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Trigger Type" />
                          </SelectTrigger>
                          <SelectContent className="p-2 w-full">
                            <SelectItem value="COMMENT">Comment</SelectItem>
                            <SelectItem value="DM">DM</SelectItem>
                          </SelectContent>
                        </Select> */}
                        {mediaId ? (
                          <CardDescription className=" text-yellow-500 text-xs">
                            Choose how this automation starts. For media, only
                            comments can trigger automation.
                          </CardDescription>
                        ) : null}
                        <Separator className="my-2" />
                        <CardDescription className=" text-muted-foreground">
                          <TooltipHelp
                            title="Define words that users must type in their comment to trigger this automation.
Example: If you add “price”, automation will run when someone comments “price” or “Price”. If empty, any comment will trigger the automation."
                          >
                            Trigger Keywords (Case Insensitive)
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

                    <div className="flex flex-col gap-2">
                      <CardDescription className=" text-muted-foreground">
                        <TooltipHelp title="Choose what should happen when the automation is triggered.">
                          Automation Action
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
                          <SelectItem
                            value="SEND_DM"
                            className="cursor-pointer"
                          >
                            Send DM
                          </SelectItem>
                          <SelectItem
                            value="REPLY_COMMENT"
                            className="cursor-pointer"
                          >
                            Reply to Comment
                          </SelectItem>
                          <SelectItem
                            value="REPLY_COMMENT_SEND_DM"
                            className="cursor-pointer"
                          >
                            Reply to Comment and Send DM
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Action: Send DM */}

                      {action === "SEND_DM" && (
                        <>
                          <div>
                            <CardDescription className="text-muted-foreground mt-2">
                              <TooltipHelp title="The message that will be sent when the automation is triggered.">
                                Private Message
                              </TooltipHelp>
                            </CardDescription>
                            <Textarea
                              className="w-full mt-2"
                              placeholder="Hi there! Thanks for commenting 😊. Here’s the offer 🎉  ..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                          </div>
                          <div>
                            <CardDescription className="font-semibold text-muted-foreground mt-2">
                              <TooltipHelp title="Add a link to your message. Which will be displayed as a button in the DM. Link will be sent in the DM to the user with private message.">
                                Add Link To The Private Message
                              </TooltipHelp>
                            </CardDescription>
                            <div>
                              <Input
                                type="url"
                                className="w-full mt-2"
                                placeholder="https://example.com"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                              />
                              <CardDescription className="font-semibold text-muted-foreground mt-4">
                                <TooltipHelp title="The text that will be displayed as the link. Example: “Click here to get the offer”">
                                  Link Text (Optional)
                                </TooltipHelp>
                              </CardDescription>
                              <Input
                                type="text"
                                className="w-full mt-2"
                                placeholder="Ex: Claim Now"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                              />
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col gap-2 my-3">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={askForFollow}
                                  onCheckedChange={setAskForFollow}
                                  className="data-checked:bg-blue-500 data-checked:hover:bg-blue-600 cursor-pointer "
                                />
                                <CardDescription className="font-semibold text-muted-foreground">
                                  <TooltipHelp title="Ask users to follow your account before receiving the DM. If enabled, the user will be asked to follow your account before receiving the DM. If disabled, the user will not be asked to follow your account before receiving the DM.">
                                    Require Follow Before Sending DM (Link)
                                  </TooltipHelp>
                                </CardDescription>
                              </div>
                              {askForFollow && (
                                <div>
                                  <CardDescription className="font-semibold text-muted-foreground my-2">
                                    <TooltipHelp title="The message that will be sent when the user is asked to follow your account before receiving the DM. Example: “Follow us on Instagram to get the offer 🎉”">
                                      Follow Message (Required)
                                    </TooltipHelp>
                                  </CardDescription>
                                  <Textarea
                                    required
                                    aria-required="true"
                                    className="w-full mt-2"
                                    placeholder="Follow us on Instagram to get the offer 🎉"
                                    value={followMessage}
                                    onChange={(e) =>
                                      setFollowMessage(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {/* Action: Reply to Comment */}
                      {action === "REPLY_COMMENT" && (
                        <div>
                          <CardDescription className=" text-muted-foreground my-2">
                            <TooltipHelp
                              title="This is the reply users will see on your post.
Keep it short and engaging. Example: “Thanks! Check your DM 😊”"
                            >
                              Public Reply To Comment
                            </TooltipHelp>
                          </CardDescription>
                          <Textarea
                            className="w-full mt-2"
                            placeholder="Thank you for your comment 😊"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                      )}
                      {/* Action: Reply to Comment and Send DM */}
                      {action === "REPLY_COMMENT_SEND_DM" && (
                        <div className="flex flex-col gap-2">
                          <div>
                            <CardDescription className="font-semibold text-muted-foreground my-2">
                              <TooltipHelp
                                title="This is the reply users will see on your post.
Keep it short and engaging. Example: “Thanks! Check your DM 😊”"
                              >
                                Public Reply To Comment
                              </TooltipHelp>
                            </CardDescription>
                            <Textarea
                              className="w-full mt-2"
                              placeholder="Thanks! Check your DM 😊"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                          <div>
                            <CardDescription className="font-semibold text-muted-foreground my-2">
                              <TooltipHelp
                                title="This is the message users will receive in their DM.
Example: “Hi there! Thanks for commenting 😊. Here’s the offer 🎉: ”"
                              >
                                Private Message
                              </TooltipHelp>
                            </CardDescription>

                            <Textarea
                              className="w-full mt-2"
                              placeholder="Hi there! Thanks for commenting 😊. Here’s the offer 🎉  ..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                          </div>
                          <div>
                            <CardDescription className="font-semibold text-muted-foreground my-2">
                              <TooltipHelp title="Add a link to your message. Which will be displayed as a button in the DM. Link will be sent in the DM to the user with private message.">
                                Add Link To The Private Message
                              </TooltipHelp>
                            </CardDescription>
                            <div>
                              <Input
                                type="url"
                                className="w-full mt-2"
                                placeholder="https://example.com"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                              />
                              <CardDescription className="font-semibold text-muted-foreground mt-3">
                                <TooltipHelp title="The text that will be displayed as the link. Example: “Click here to get the offer”">
                                  Link Text
                                </TooltipHelp>
                              </CardDescription>
                              <Input
                                type="text"
                                className="w-full mt-2"
                                placeholder="Ex: Click here to get the offer"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                              />
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col gap-2 my-3">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={askForFollow}
                                  onCheckedChange={setAskForFollow}
                                  className="data-checked:bg-blue-500 data-checked:hover:bg-blue-600 cursor-pointer "
                                />
                                <CardDescription className="font-semibold text-muted-foreground">
                                  <TooltipHelp title="Ask users to follow your account before receiving the DM. If enabled, the user will be asked to follow your account before receiving the DM. If disabled, the user will not be asked to follow your account before receiving the DM.">
                                    Require Follow Before Sending DM (Link)
                                  </TooltipHelp>
                                </CardDescription>
                              </div>
                              {askForFollow && (
                                <div>
                                  <CardDescription className="font-semibold text-muted-foreground my-2">
                                    <TooltipHelp title="The message that will be sent when the user is asked to follow your account before receiving the DM. Example: “Follow us on Instagram to get the offer 🎉”">
                                      Follow Message
                                    </TooltipHelp>
                                  </CardDescription>
                                  <Textarea
                                    className="w-full mt-2"
                                    placeholder="Follow us on Instagram to get the offer 🎉"
                                    value={followMessage}
                                    onChange={(e) =>
                                      setFollowMessage(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <Button
                        type="submit"
                        variant="default"
                        className="w-full mt-4"
                      >
                        Publish Automation
                      </Button>
                    </div>
                    <Separator className="my-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Iphone>
                    <IphoneHome
                      username={username || ""}
                      imageUrl={imageUrl || ""}
                      caption={caption || ""}
                    />
                  </Iphone>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
