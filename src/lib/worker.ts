import "dotenv/config";
import { Worker } from "bullmq";
import { redisQueue } from "./redis-queue";
import prisma from "./prisma";
import {
  instagramFollowUpMessageQueue,
  instagramSendCommentQueue,
  instagramSendDMQueue,
} from "./InstagramEventQueue";
import {
  checkIfUserIsFollowing,
  sendCommentReplyMessageToUser,
  sendPlainMessageToCommentToUser,
  sendPlainMessageToUser,
  sendPostbackMessageToUser,
  sendTemplateMessageToUser,
} from "./Insta";
import { deleteCache, getCache, setCache } from "./cache";
import { isWithin24Hours } from "./interaction";
import { AutomationLog } from "./generated/prisma/client";
import { decryptAccessToken } from "./hashAccessToken";
import { acquireToken } from "./rateLimiter";

const connection = redisQueue;

// Main worker for processing instagram webhook event
const worker = new Worker(
  "instagram_event_queue",
  async (job) => {
    const { data } = job;
    const instagramAccountOwnerID = data?.id;
    const instagramAccountOwner = await prisma.instagramAccount.findUnique({
      where: {
        instagramUserId: instagramAccountOwnerID,
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!instagramAccountOwner) {
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: instagramAccountOwner.userId,
      },
      select: {
        id: true,
        plan: true,
        currentPeriodEnd: true,
        status: true,
        actionsUsed: true,
        allocatedActions: true,
      },
    });
    if (!subscription) {
      return;
    }
    if (subscription.status !== "active") {
      return;
    }
    // Check if the account is already used up the limit
    if (subscription?.actionsUsed >= (subscription?.allocatedActions || 0)) {
      return;
    }

    // Check if the subscription is expired
    if (
      subscription?.currentPeriodEnd &&
      new Date(subscription?.currentPeriodEnd) < new Date() &&
      subscription.plan !== "Free"
    ) {
      return;
    }

    // Get the plan details
    const currentPlan = await prisma.plans.findUnique({
      where: {
        name: subscription.plan,
      },
      select: {
        followRequired: true,
      },
    });
    if (!currentPlan) {
      return;
    }

    // Check the type of the event and process it accordingly
    if (data?.messaging) {
      // If the event is a postback, check whether it is for follow up message or not
      if (data.messaging[0]?.message?.is_self) return;

      // If the postback is for follow up message, process it with follow up message worker
      if (
        data.messaging[0]?.postback &&
        data.messaging[0]?.postback?.payload.includes("follow_up_message")
      ) {
        console.log("Processing event for follow up message");

        // Append subscription id to the data

        data.subscriptionId = subscription.id;

        if (currentPlan?.followRequired) {
          await instagramFollowUpMessageQueue.add(
            "instagram_follow_up_message_queue",
            data,
          );
        }

        return;
      }
      // Process the event for  dm if not postback
      return;
    } else if (data?.changes[0]) {
      // Process the event for comment
      console.log("Processing event for comment");
      const instagramUserId = data?.id;
      const post_id = data?.changes[0]?.value?.media.id;
      const comment_id = data?.changes[0]?.value?.id;
      const comment_text = data?.changes[0]?.value?.text;
      const comment_author_id = data?.changes[0]?.value?.from.id;
      const comment_author_username = data?.changes[0]?.value?.from.username;

      // If the comment is a reply, skip it
      if (data.changes[0]?.value?.parent_id) return;
      // If the comment is from the same user , skip it
      if (comment_author_id === instagramUserId) return;

      // Create a user interaction record for the comment author

      if (comment_author_id && instagramUserId) {
        await prisma.userInteraction.upsert({
          where: {
            instagramUserId_accountId: {
              instagramUserId: comment_author_id,
              accountId: instagramUserId,
            },
          },
          update: {
            lastInteractionAt: new Date(),
          },
          create: {
            instagramUserId: comment_author_id,
            accountId: instagramUserId,
            lastInteractionAt: new Date(),
          },
        });
      }

      // Get all the active automations for the account
      const automations = await prisma.automation.findMany({
        where: {
          // accountId: data.accountId,
          triggerType: "COMMENT",
          isActive: true,
          account: {
            instagramUserId: instagramUserId,
          },
          OR: [
            {
              targetMediaId: post_id,
            },
            {
              targetMediaId: null,
            },
          ],
        },
        include: {
          triggers: true,
          actions: true,
        },
      });

      // Filter the automations that have triggers that match the comment text
      const matched = automations.filter((a) => {
        // If the automation has 0 keywords then it will run on all comments
        if (a.triggers.length === 0) return true;
        // If the automation has keywords then it will check if the comment text includes any of the keywords
        return a.triggers.some((t) =>
          comment_text?.toLowerCase().includes(t?.keyword?.toLowerCase()),
        );
      });

      for (const automation of matched) {
        for (const action of automation.actions) {
          if (action.type === "REPLY_COMMENT") {
            await instagramSendCommentQueue.add(
              "instagram_send_comment_queue",
              {
                instagramUserId,
                commentId: comment_id,
                message: action.message,
                delaySeconds: action.delaySeconds,
                automationId: automation.id,
                comment_author_username,
                subscriptionId: subscription.id,
                comment_author_id,
                createAndUpdateLog:
                  automation.actions.length === 1 ? true : false,
              },
            );
          }

          if (action.type === "SEND_DM") {
            const allowed = await isWithin24Hours(
              comment_author_id,
              instagramUserId,
            );

            if (!allowed) {
              console.log("❌ Outside 24h window");
              continue;
            }
            console.log("Allowed to send DM");
            // Add the DM to the queue
            await instagramSendDMQueue.add("instagram_send_dm_queue", {
              instagramUserId,
              subscriptionId: subscription.id,
              commentId: comment_id,
              automationId: automation.id,
              action,
              comment_author_id,
              updateLogOnly: automation.actions.length === 2 ? true : false,
            });
          }
        }
      }
    }
  },
  {
    connection,
    concurrency: 50,
    limiter: {
      max: 500,
      duration: 1000,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`${job?.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

export default worker;

export const instagramSendCommentWorker = new Worker(
  "instagram_send_comment_queue",
  async (job) => {
    try {
      const { data } = job;
      const {
        subscriptionId,
        instagramUserId,
        commentId,
        message,
        automationId,
        comment_author_username,
        comment_author_id,
        createAndUpdateLog,
      } = data;
      // Instagram rate limit is 195 public replies per 3600 seconds
      const { allowed, waitMs } = await acquireToken(instagramUserId, 195);

      if (!allowed) {
        // Don't fail — re-queue with exact delay until next token
        await instagramSendCommentQueue.add(
          "instagram_send_comment_queue",
          job.data,
          {
            delay: waitMs + 100, // +100ms buffer
            priority: job.opts.priority,
            jobId: `retry-${job.id}`, // idempotent
          },
        );
        return; // job completes successfully, no retry count incremented
      }

      try {
        await prisma.automationLog.create({
          data: {
            automationId,
            instagramUserId: comment_author_id,
            commentId,
            status: "failed",
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        return;
      }
      const accessToken = await prisma.instagramAccount.findUnique({
        where: {
          instagramUserId,
        },
        select: {
          accessToken: true,
        },
      });
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const decryptedAccessToken = decryptAccessToken(
        accessToken?.accessToken || "",
      );
      if (
        !(await sendCommentReplyMessageToUser(
          decryptedAccessToken,
          message,
          commentId,
          comment_author_username,
        ))
      ) {
        throw new Error("Failed to send comment reply message");
      }

      if (createAndUpdateLog) {
        await prisma.automationLog.update({
          where: {
            automationId_instagramUserId: {
              automationId,
              instagramUserId: comment_author_id,
            },
          },
          data: {
            status: "success",
          },
        });
      }
      // Increment the triggered count for the automation
      await prisma.automation.update({
        where: {
          id: automationId,
        },
        data: {
          triggeredCount: { increment: 1 },
        },
      });

      // Increment the actions used for the subscription
      await prisma.subscription.update({
        where: {
          id: subscriptionId || "",
        },
        data: {
          actionsUsed: { increment: 1 },
        },
      });
    } catch (error) {
      console.log(error);
      await prisma.automationLog.update({
        where: {
          automationId_instagramUserId: {
            automationId: job.data.automationId || "",
            instagramUserId: job.data.comment_author_id,
          },
        },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : JSON.stringify(error),
        },
      });
    }
  },
  {
    connection,
    concurrency: 50,
    limiter: {
      max: 500,
      duration: 1000,
    },
  },
);

instagramSendCommentWorker.on("failed", async (job, err) => {
  if (job && job.attemptsMade >= 5) {
    await prisma.automationLog.update({
      where: {
        automationId_instagramUserId: {
          automationId: job.data.automationId || "",
          instagramUserId: job.data.comment_author_id,
        },
      },
      data: { status: "dead", error: err.message },
    });
    await fetch(process.env.SLACK_WEBHOOK_URL_INSTAGRAM || "", {
      method: "POST",
      body: JSON.stringify({
        text: `Automation ${job.data.automationId} failed for user ${job.data.comment_author_id} with error ${err.message}`,
      }),
    });
    // Emit alert to your monitoring
  }
});

export const instagramSendDMWorker = new Worker(
  "instagram_send_dm_queue",
  async (job) => {
    try {
      const { data } = job;
      const {
        subscriptionId,
        instagramUserId,
        commentId,
        automationId,
        action,
        comment_author_id,
        updateLogOnly,
      } = data;
      // Automation log is created to track the status of the DM
      if (!updateLogOnly) {
        try {
          await prisma.automationLog.create({
            data: {
              automationId,
              instagramUserId: comment_author_id,
              commentId,
              status: "failed",
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          return;
        }
      }

      // Instagram rate limit is 750 private replies per 3600 seconds
      const { allowed, waitMs } = await acquireToken(instagramUserId, 745); // 745 is for the buffer

      if (!allowed) {
        // Don't fail — re-queue with exact delay until next token
        await instagramSendDMQueue.add("instagram_send_dm_queue", job.data, {
          delay: waitMs + 100, // +100ms buffer
          priority: job.opts.priority,
          jobId: `retry-${job.id}`, // idempotent
        });
        return; // job completes successfully, no retry count incremented
      }

      const accessToken = await prisma.instagramAccount.findUnique({
        where: {
          instagramUserId,
        },
        select: {
          accessToken: true,
        },
      });
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const decryptedAccessToken = decryptAccessToken(
        accessToken?.accessToken || "",
      );
      const metaLink = action?.meta?.link || "";
      const metaLinkText = action?.meta?.linkText || "";

      // if in action meta is askForFollow is true then check if the user is following the account
      // It could be possible that the meta object is not present so we need to check for that

      if (action?.meta && action?.meta?.askForFollow) {
        // in this case send the message along with the button for the payload postback to follow the account
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pendingAutomation: any;
        // Create the pending automation record for the user to follow the account
        try {
          pendingAutomation = await prisma.pendingAutomation.create({
            data: {
              automationId,
              instagramUserId: comment_author_id,
              commentId,
              status: "WAITING_FOR_FOLLOW",
            },
          });
        } catch (error) {
          console.log(error);
          return;
        }
        // Send the message along with the button for the payload postback to follow the account with the automation id

        await sendPostbackMessageToUser(
          decryptedAccessToken,
          commentId,
          action?.message || "",
          metaLinkText || "Click here",
          `follow_up_message:${pendingAutomation?.id}`,
          true,
        );

        // Increment the triggered count for the automation
        await prisma.automation.update({
          where: {
            id: automationId,
          },
          data: {
            triggeredCount: { increment: 1 },
          },
        });

        return;
      }
      // if in action meta is askForFollow is false then send the message along with the meta link if available
      if (metaLink.length > 0) {
        // Send the message along with the meta link

        const isSent = await sendTemplateMessageToUser(
          commentId,
          decryptedAccessToken,
          action?.message || "",
          metaLink,
          metaLinkText || "Click here",
          true,
        );
        if (!isSent) {
          throw new Error("Failed to send message");
        }
      } else {
        // Send the message without the meta link button.
        const isSent = await sendPlainMessageToCommentToUser(
          commentId,
          decryptedAccessToken,
          action?.message || "",
          instagramUserId,
        );
        if (!isSent) {
          throw new Error("Failed to send message");
        }
      }

      await prisma.automationLog.update({
        where: {
          automationId_instagramUserId: {
            automationId,
            instagramUserId: comment_author_id,
          },
        },
        data: {
          status: "success",
        },
      });

      // Increment the triggered count for the automation
      await prisma.automation.update({
        where: {
          id: automationId,
        },
        data: {
          triggeredCount: { increment: 1 },
        },
      });

      // Increment the actions used for the subscription
      await prisma.subscription.update({
        where: {
          id: subscriptionId || "",
        },
        data: {
          actionsUsed: { increment: 1 },
        },
      });
    } catch (error) {
      console.log(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      await prisma.automationLog.update({
        where: {
          automationId_instagramUserId: {
            automationId: job.data.automationId || "",
            instagramUserId: job.data.comment_author_id,
          },
        },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : JSON.stringify(error),
        },
      });
    }
  },
  {
    connection,
    concurrency: 50,
    limiter: {
      max: 500,
      duration: 1000,
    },
  },
);

export const instagramFollowUpMessageWorker = new Worker(
  "instagram_follow_up_message_queue",
  async (job) => {
    let automationLog: AutomationLog | null = null;
    try {
      const { data } = job;

      const senderId = data.messaging[0]?.sender?.id;
      const postbackPayload = data.messaging[0]?.postback?.payload;
      const pendingAutomationId = postbackPayload.split(":")[1];

      // Get all the pending automations from the database first with for the sender
      // Get all pending automations and include their automation details

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pendingAutomation: any[] = [];

      const cachedPendingAutomation = await getCache(
        `pending_automation:${senderId}:${pendingAutomationId}`,
      );

      if (cachedPendingAutomation) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pendingAutomation = cachedPendingAutomation as any;
      } else {
        pendingAutomation = await prisma.pendingAutomation.findMany({
          where: {
            id: pendingAutomationId,
            instagramUserId: senderId,
          },
          include: {
            automation: {
              include: {
                actions: true,
                triggers: true,
              },
            },
          },
        });
        await setCache(
          `pending_automation:${senderId}:${pendingAutomationId}`,
          pendingAutomation,
        );
      }

      if (pendingAutomation?.length === 0) {
        return;
      }
      const automationOwner = await prisma.instagramAccount.findUnique({
        where: {
          instagramUserId: data.id,
        },
        select: {
          accessToken: true,
          instagramUserId: true,
        },
      });
      if (!automationOwner) {
        return;
      }
      const decryptedAccessToken = decryptAccessToken(
        automationOwner?.accessToken || "",
      );
      // Confirm now if that user following the account or not.
      const isFollowing = await checkIfUserIsFollowing(
        senderId,
        decryptedAccessToken,
      );
      const action = pendingAutomation[0]?.automation?.actions?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any) => a.type === "SEND_DM",
      );
      const meta = action?.meta as {
        followMessage: string;
        link: string;
        linkText: string;
      };
      if (isFollowing) {
        // Send the message to the user now.
        if (action && meta) {
          if (meta.link.length > 0) {
            const isSent = await sendTemplateMessageToUser(
              pendingAutomation[0].instagramUserId,
              decryptedAccessToken,
              action.message || "",
              meta?.link || "",
              meta?.linkText || "Click here",
              false,
            );
            if (!isSent) {
              throw new Error("Failed to send template message");
            }
          } else {
            const isSent = await sendPlainMessageToUser(
              pendingAutomation[0].instagramUserId,
              decryptedAccessToken,
              action.message || "",
              automationOwner?.instagramUserId || "",
            );
            if (!isSent) {
              throw new Error("Failed to send plain message");
            }
          }
          // Delete the pending automation
          await prisma.pendingAutomation.delete({
            where: {
              id: pendingAutomationId,
            },
          });
          // Delete the cache for the pending automation
          await deleteCache(
            `pending_automation:${senderId}:${pendingAutomationId}`,
          );
        }

        // Increment the triggered count for the automation
        await prisma.automation.update({
          where: {
            id: pendingAutomation[0]?.automationId || "",
          },
          data: {
            triggeredCount: { increment: 1 },
          },
        });

        // Increment the actions used for the subscription
        await prisma.subscription.update({
          where: {
            id: data.subscriptionId || "",
          },
          data: {
            actionsUsed: { increment: 1 },
          },
        });

        // Get the automation log and update the status to success
        automationLog = await prisma.automationLog.findUnique({
          where: {
            automationId_instagramUserId: {
              automationId: pendingAutomation[0]?.automationId || "",
              instagramUserId: pendingAutomation[0]?.instagramUserId || "",
            },
          },
        });
        if (automationLog) {
          await prisma.automationLog.update({
            where: {
              id: automationLog.id,
            },
            data: {
              status: "success",
            },
          });
        }
      } else {
        // Send the message to the user to follow the account
        const followMessage = [
          "I Have Followed",
          "I have followed you",
          "Followed You",
          "Followed",
          "Follow Done",
        ];
        if (action && meta) {
          await sendPostbackMessageToUser(
            decryptedAccessToken,
            senderId,
            meta?.followMessage || "Follow us, to get the details 😊",
            followMessage[Math.floor(Math.random() * followMessage.length)] ||
              "Followed You",
            `follow_up_message:${pendingAutomationId}`,
          );
        }
      }
      // Get the automation log and update the status to success
    } catch (error) {
      console.log(error);
      if (automationLog) {
        await prisma.automationLog.update({
          where: {
            id: automationLog.id,
          },
          data: {
            status: "failed",
            error:
              error instanceof Error ? error.message : JSON.stringify(error),
          },
        });
      }
    }
  },
  {
    connection,
    concurrency: 50,
    limiter: {
      max: 500,
      duration: 1000,
    },
  },
);
