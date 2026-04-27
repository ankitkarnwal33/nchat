import { z } from "zod/v3";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { getCache, setCache } from "@/src/lib/cache";
import { InstagramMedia } from "@/types/types";
import { redis } from "@/src/lib/redis";
import { AllAutomationList } from "@/src/components/AllAutomations";
import {
  decryptAccessToken,
  encryptAccessToken,
} from "@/src/lib/hashAccessToken";

import { openai } from "@/src/lib/openai";

export const instagramRouter = createTRPCRouter({
  // Get uploaded media of the instagram account
  getUploadedMedia: protectedProcedure.query(async ({ ctx }) => {
    try {
      const activeAccountId =
        (await cookies()).get("activeAccountId")?.value || "";
      const cacheKey = `instagram:media:${activeAccountId}`;
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        return cachedData as InstagramMedia[];
      }
      const userId = ctx.auth.session.userId;
      // Get the active instagram account using the active account id and the user id
      const instagramAccount = await prisma.instagramAccount.findUnique({
        where: {
          id: (await cookies()).get("activeAccountId")?.value || "",
          userId: userId,
        },
        select: {
          instagramUserId: true,
          accessToken: true,
        },
      });

      // Set the params for the get uploaded media request
      const params = new URLSearchParams();
      params.set(
        "fields",
        "id,caption,media_type,media_url,thumbnail_url,timestamp,username,permalink",
      );
      // Get decrypted acces token from the database
      const decryptedAccessToken = decryptAccessToken(
        instagramAccount?.accessToken || "",
      );
      params.set("access_token", decryptedAccessToken || "");
      params.set("limit", "12");
      const url = `https://graph.instagram.com/v25.0/${instagramAccount?.instagramUserId}/media?${params.toString()}`;

      // Make the request to the get uploaded media endpoint
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      await setCache(cacheKey, data, 60 * 5); // 5 minutes

      return data || [];
    } catch (error) {
      console.error("Error is ", error);
      throw new Error((error as Error).message);
    }
  }),
  getMediaWithPagination: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const activeAccountId =
          (await cookies()).get("activeAccountId")?.value || "";
        if (!activeAccountId) {
          throw new Error("No active account found");
        }
        const { cursor } = input;
        const cacheKey = `media:${activeAccountId}:cursor:${cursor ?? "first"}`;
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
          return cachedData as {
            data: InstagramMedia[];
            hasNextPage: boolean;
            cursor: string | null;
          };
        }
        const userId = ctx.auth.session.userId;
        // Get the active instagram account using the active account id and the user id
        const instagramAccount = await prisma.instagramAccount.findUnique({
          where: {
            id: (await cookies()).get("activeAccountId")?.value || "",
            userId: userId,
          },
          select: {
            instagramUserId: true,
            accessToken: true,
          },
        });
        if (!instagramAccount) {
          throw new Error("No instagram account found");
        }

        // Set the params for the get uploaded media request
        const params = new URLSearchParams();
        params.set(
          "fields",
          "id,caption,media_type,media_url,thumbnail_url,timestamp,username,permalink",
        );
        // Get decrypted acces token from the database
        const decryptedAccessToken = decryptAccessToken(
          instagramAccount?.accessToken || "",
        );
        params.set("access_token", decryptedAccessToken || "");
        params.set("limit", "9");
        let url = `https://graph.instagram.com/v25.0/${instagramAccount?.instagramUserId}/media?${params.toString()}`;
        if (cursor) {
          url += `&after=${cursor}`;
        }

        // Make the request to the get uploaded media endpoint
        const response = await fetch(url, {
          method: "GET",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const result = {
          data: data.data || [],
          hasNextPage: !!data.paging?.next,
          cursor: data.paging?.cursors?.after || null,
        };
        await setCache(cacheKey, result);

        return result;
      } catch (error) {
        console.error("Error is ", error);
        throw new Error((error as Error).message);
      }
    }),

  createAutomation: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        triggerType: z.enum(["COMMENT", "DM"]),
        targetMediaId: z.string().optional(),
        triggers: z.array(
          z.object({
            keyword: z.string(),
            matchType: z.enum(["CONTAINS", "EXACT"]),
          }),
        ),
        actions: z.array(
          z.object({
            type: z.enum(["SEND_DM", "REPLY_COMMENT"]),
            message: z.string().optional(),
            meta: z.any().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activeAccountId =
        (await cookies()).get("activeAccountId")?.value || "";
      if (!activeAccountId) {
        throw new Error("No active account found");
      }

      try {
        const keys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${
            (await cookies()).get("activeAccountId")?.value
          }:*`,
        );
        if (keys.length) {
          for (const key of keys) {
            await redis.del(key);
          }
        }
        return await prisma.automation.create({
          data: {
            userId: ctx.auth.session.userId,
            accountId: activeAccountId,

            name: input.name,
            triggerType: input.triggerType,
            targetMediaId: input.targetMediaId,

            triggers: {
              create: input.triggers,
            },

            actions: {
              create: input.actions,
            },
          },
        });
      } catch (error) {
        console.error("Error is ", error);
        throw new Error((error as Error).message);
      }
    }),
  updateAutomation: protectedProcedure
    .input(
      z.object({
        automationId: z.string(),
        name: z.string(),
        triggerType: z.enum(["COMMENT", "DM"]),
        targetMediaId: z.string().optional(),
        triggers: z.array(
          z.object({
            keyword: z.string(),
            matchType: z.enum(["CONTAINS", "EXACT"]),
          }),
        ),
        actions: z.array(
          z.object({
            type: z.enum(["SEND_DM", "REPLY_COMMENT"]),
            message: z.string().optional(),
            meta: z.any().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activeAccountId =
        (await cookies()).get("activeAccountId")?.value || "";
      if (!activeAccountId) {
        throw new Error("No active account found");
      }
      try {
        const keys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${
            (await cookies()).get("activeAccountId")?.value
          }:*`,
        );
        if (keys.length) {
          for (const key of keys) {
            await redis.del(key);
          }
        }

        return await prisma.automation.update({
          where: {
            id: input.automationId,
            userId: ctx.auth.session.userId,
            accountId: activeAccountId,
          },
          data: {
            name: input.name,
            triggerType: input.triggerType,
            targetMediaId: input.targetMediaId,
            triggers: {
              deleteMany: {},
              create: input.triggers,
            },
            actions: {
              deleteMany: {},
              create: input.actions,
            },
          },
          include: {
            triggers: true,
            actions: true,
          },
        });
      } catch (error) {
        console.error("Error is ", error);
        throw new Error(
          (error as Error).message ||
            "Failed to update automation. Please try again.",
        );
      }
    }),

  pauseAutomation: protectedProcedure
    .input(z.object({ automationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { automationId } = input;
      try {
        const keys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${
            (await cookies()).get("activeAccountId")?.value
          }:*`,
        );
        if (keys.length) {
          for (const key of keys) {
            await redis.del(key);
          }
        }
        return await prisma.automation.update({
          where: { id: automationId, userId: ctx.auth.session.userId },
          data: { isActive: false },
        });
      } catch (error) {
        console.error("Error is ", error);
        throw new Error(
          (error as Error).message ||
            "Failed to pause automation. Please try again.",
        );
      }
    }),

  resumeAutomation: protectedProcedure
    .input(z.object({ automationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { automationId } = input;
      try {
        const keys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${
            (await cookies()).get("activeAccountId")?.value
          }:*`,
        );
        if (keys.length) {
          for (const key of keys) {
            await redis.del(key);
          }
        }
        return await prisma.automation.update({
          where: { id: automationId, userId: ctx.auth.session.userId },
          data: { isActive: true },
        });
      } catch (error) {
        console.error("Error is ", error);
        throw new Error(
          (error as Error).message ||
            "Failed to start automation. Please try again.",
        );
      }
    }),

  deleteAutomation: protectedProcedure
    .input(z.object({ automationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { automationId } = input;
      try {
        const keys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${
            (await cookies()).get("activeAccountId")?.value
          }:*`,
        );
        if (keys.length) {
          for (const key of keys) {
            await redis.del(key);
          }
        }

        return await prisma.automation.delete({
          where: {
            id: automationId,
            userId: ctx.auth.session.userId,
            accountId: {
              in: [(await cookies()).get("activeAccountId")?.value || ""],
            },
          },
        });
      } catch (error) {
        console.error("Error is ", error);
        throw new Error(
          (error as Error).message ||
            "Failed to delete automation. Please try again.",
        );
      }
    }),
  getAutomation: protectedProcedure
    .input(z.object({ automationId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { automationId } = input;
        const redisKey = `automations:${ctx.auth.session.userId}:${
          (await cookies()).get("activeAccountId")?.value
        }:${automationId}`;
        const cachedData = await getCache(redisKey);
        if (cachedData) {
          return cachedData as {
            automation: AllAutomationList;
            mediaData: InstagramMedia;
          };
        }
        const automation = await prisma.automation.findUnique({
          where: { id: automationId, userId: ctx.auth.session.userId },
          include: {
            triggers: true,
            actions: true,
            account: {
              select: {
                accessToken: true,
              },
            },
          },
        });
        if (!automation) {
          throw new Error("Automation not found");
        }

        // Get the instagram media image and caption also
        const params = new URLSearchParams();
        params.set(
          "fields",
          "id,caption,media_type,media_url,thumbnail_url, username",
        );
        // Get decrypted acces token from the database
        const decryptedAccessToken = decryptAccessToken(
          automation?.account?.accessToken || "",
        );
        params.set("access_token", decryptedAccessToken || "");
        params.set("limit", "12");
        const url = `https://graph.instagram.com/v25.0/${automation.targetMediaId}?${params.toString()}`;
        const mediaResponse = await fetch(url, {
          method: "GET",
        });
        if (!mediaResponse.ok) {
          throw new Error(await mediaResponse.text());
        }
        // mask the access token becuase it is not needed to be shown to the user
        automation.account.accessToken = "********";
        const mediaData = await mediaResponse.json();
        await setCache(redisKey, { automation, mediaData }, 60 * 5); // 5 minutes
        return { automation: automation as AllAutomationList, mediaData };
      } catch (error) {
        console.error("Error is ", error);
        throw new Error((error as Error).message);
      }
    }),

  disconnectInstagramAccount: protectedProcedure
    .input(z.object({ instagramUserId: z.string(), accountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { accountId } = input;

      try {
        // Get the instagram account
        const instagramAccount = await prisma.instagramAccount.findUnique({
          where: { id: accountId, userId: ctx.auth.session.userId },
          select: {
            accessToken: true,
            instagramUserId: true,
          },
        });
        if (!instagramAccount) throw new Error("Instagram account not found");

        // Get decrypted acces token from the database
        const decryptedAccessToken = decryptAccessToken(
          instagramAccount?.accessToken || "",
        );
        // Unsubscribe from the webhook for this perticular account

        const webhookResponse = await fetch(
          `https://graph.instagram.com/v25.0/${instagramAccount.instagramUserId}/subscribed_apps`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decryptedAccessToken}`,
            },
          },
        );
        if (!webhookResponse.ok) {
          console.error("Error is ", await webhookResponse.text());
          throw new Error(
            "Failed to unsubscribe from webhook. Please try again.",
          );
        }
        // Delete all automations associated with this account

        await prisma.automation.deleteMany({
          where: { accountId: accountId, userId: ctx.auth.session.userId },
        });
        await prisma.instagramAccount.delete({
          where: { id: accountId, userId: ctx.auth.session.userId },
        });
        // Clear cookies
        (await cookies()).delete("activeAccountId");
        // Clear the cache
        const automationKeys = await redis.keys(
          `automations:${ctx.auth.session.userId}:${accountId}:*`,
        );
        if (automationKeys.length) {
          for (const key of automationKeys) {
            await redis.del(key);
          }
        }
        // invalidate the accounts queries

        // Redirect to the home page
        return { success: true, message: "Account disconnected successfully" };
      } catch (error) {
        console.error("Error is ", error);
        throw new Error(
          (error as Error).message ||
            "Failed to disconnect account. Please try again.",
        );
      }
    }),
});

export const appRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.auth.session.userId,
      },
      include: {
        instagramAccounts: {
          select: {
            id: true,
            instagramUserId: true,
            profilePicture: true,
            username: true,
            connectedAt: true,
          },
        },
      },
    });
    return user;
  }),
  exchangeInstagramToken: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { code } = input;
      const formData = new FormData();
      formData.append("code", code);
      formData.append("client_id", process.env.INSTAGRAM_CLIENT_ID || "");
      formData.append(
        "client_secret",
        process.env.INSTAGRAM_CLIENT_SECRET || "",
      );
      formData.append("grant_type", "authorization_code");
      formData.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI || "");
      try {
        const response = await fetch(
          `https://api.instagram.com/oauth/access_token`,
          {
            method: "POST",
            body: formData,
          },
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        // Get the access token and userId from the data
        const shortToken = data.access_token;
        // const userId = data.user_id;
        // Save the access token and userId to the database
        // Create  new request to get the permanent access token
        const permanentAccessTokenResponse = await fetch(
          `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`,
          {
            method: "GET",
          },
        );

        if (!permanentAccessTokenResponse.ok) {
          throw new Error(await permanentAccessTokenResponse.text());
        }

        const permanentAccessTokenData =
          await permanentAccessTokenResponse.json();

        // console.log("Permanent access token data: ", permanentAccessTokenData);

        const { access_token, expires_in } = permanentAccessTokenData;

        const igUserResponse = await fetch(
          `https://graph.instagram.com/v25.0/me?fields=user_id,username,profile_picture_url&access_token=${access_token}`,
          {
            method: "GET",
          },
        );
        if (!igUserResponse.ok) {
          throw new Error(await igUserResponse.text());
        }

        const igUser = await igUserResponse.json();

        const existingInstagramAccount =
          await prisma.instagramAccount.findUnique({
            where: {
              instagramUserId: igUser.user_id,
            },
          });

        // Encrypt the access token before saving to the database
        const encryptedAccessToken = encryptAccessToken(access_token);

        if (existingInstagramAccount) {
          // Access token has been changed, so we need to update the account
          await prisma.instagramAccount.update({
            where: {
              id: existingInstagramAccount.id,
            },
            data: {
              accessToken: encryptedAccessToken,
              tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
            },
          });
          throw new Error("This Instagram account is already connected.");
        }

        // Subscribe to the webhook for this perticular account

        const webhookResponse = await fetch(
          `https://graph.instagram.com/v25.0/${igUser.user_id}/subscribed_apps?access_token=${access_token}&subscribed_fields=comments,messages`,
          {
            method: "POST",
          },
        );

        if (!webhookResponse.ok) {
          throw new Error(await webhookResponse.text());
        }

        // Create a new Instagram account
        await prisma.instagramAccount.create({
          data: {
            userId: ctx.auth.session.userId, //  logged-in user

            instagramUserId: igUser.user_id,
            profilePicture: igUser.profile_picture_url,
            username: igUser.username,

            accessToken: encryptedAccessToken,
            tokenExpiresAt: new Date(Date.now() + expires_in * 1000),

            connectedAt: new Date(),
          },
        });

        // Update the user's profile picture. first account profile picture will be used as the user's profile picture

        await prisma.user.update({
          where: {
            id: ctx.auth.session.userId,
          },
          data: {
            image: igUser.profile_picture_url,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Error is ", error);

        throw new Error((error as Error).message);
      }
    }),
  getInstagramAccounts: protectedProcedure.query(async ({ ctx }) => {
    const instagramAccounts = await prisma.instagramAccount.findMany({
      where: {
        userId: ctx.auth.session.userId,
      },
      select: {
        id: true,
        instagramUserId: true,
        profilePicture: true,
        username: true,
        userId: true,
      },
    });
    return instagramAccounts;
  }),
  setActiveAccount: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ input }) => {
      const { accountId } = input;
      try {
        (await cookies()).set("activeAccountId", accountId, {
          httpOnly: true,
          path: "/",
        });
        return { success: true, message: "Active account set successfully" };
      } catch (error) {
        console.error("Error is ", error);
        return { success: false, error: (error as Error).message };
      }
    }),
  getAutomationsCount: protectedProcedure.query(async ({ ctx }) => {
    try {
      const redisKey = `automations:${ctx.auth.session.userId}:${
        (await cookies()).get("activeAccountId")?.value
      }:count`;
      const cachedData = await getCache(redisKey);
      if (cachedData) {
        return cachedData as {
          active: number;
          inactive: number;
          total: number;
        };
      }
      const groupedCounts = await prisma.automation.groupBy({
        by: ["isActive"],
        where: {
          userId: ctx.auth.session.userId,
          accountId: {
            in: [(await cookies()).get("activeAccountId")?.value || ""],
          },
        },
        _count: {
          _all: true,
        },
      });

      const active =
        groupedCounts.find((item) => item.isActive)?._count._all ?? 0;
      const inactive =
        groupedCounts.find((item) => !item.isActive)?._count._all ?? 0;

      await setCache(
        redisKey,
        { active, inactive, total: active + inactive },
        60 * 5,
      ); // 5 minutes

      return {
        active,
        inactive,
        total: active + inactive,
      };
    } catch (error) {
      console.error("Error is ", error);
      throw new Error((error as Error).message);
    }
  }),

  getAutomations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.coerce.date(),
          })
          .nullish(),
        search: z.string().optional(),
        status: z.enum(["all", "active", "inactive"]).optional(),
        sort: z.enum(["desc", "asc"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const redisKey = `automations:${ctx.auth.session.userId}:${
        (await cookies()).get("activeAccountId")?.value
      }:${input.search || ""}:${input.status || "all"}:${
        input.sort || "desc"
      }:${input.cursor?.id || "first"}`;
      const limit = input.limit ?? 10;
      const cachedData = await getCache(redisKey);
      if (cachedData) {
        return cachedData;
      }
      const automations = await prisma.automation.findMany({
        where: {
          userId: ctx.auth.session.userId,
          accountId: {
            in: [(await cookies()).get("activeAccountId")?.value || ""],
          },
          ...(input.cursor && {
            OR: [
              {
                createdAt: {
                  lt: input.cursor.createdAt,
                },
              },
              {
                createdAt: input.cursor.createdAt,
                id: {
                  lt: input.cursor.id,
                },
              },
            ],
          }),
          ...(input.search &&
            input.search.length > 2 && {
              name: {
                contains: input.search,
                mode: "insensitive",
              },
            }),
          ...(input.status === "active" && { isActive: true }),
          ...(input.status === "inactive" && { isActive: false }),
        },
        take: limit + 1, // fetch one extra to check if there is next page
        orderBy: [
          { createdAt: input.sort ?? "desc" },
          { id: input.sort ?? "desc" },
        ],
        include: {
          triggers: true,
          actions: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (automations.length > limit) {
        automations.pop();
        const nextItem = automations[automations.length - 1];

        nextCursor = {
          id: nextItem!.id,
          createdAt: nextItem!.createdAt,
        };
      }

      await setCache(redisKey, { automations, nextCursor }, 60 * 5); // 5 minutes

      return {
        automations,
        nextCursor,
      };
    }),

  getAIResponse: protectedProcedure
    .input(
      z.object({
        type: z.enum(["improve", "generate"]),
        message: z.string(),
        commentOrDm: z.enum(["comment", "dm"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { type, message, commentOrDm } = input;

        const AI_MODES_COMMENTS: Record<"improve" | "generate", string> = {
          improve:
            "Rewrite Instagram replies. Keep same meaning, short, friendly. Never answer.",
          // generate:
          //   "Generate Instagram DMs. Friendly, engaging, under 200 characters.",
          generate:
            "Generate a 1-sentence Instagram comment reply. Friendly and appreciative. No questions or conversation. Only reply text.",
        };

        const AI_MODES_DM: Record<"improve" | "generate", string> = {
          improve:
            "Rewrite this Instagram DM. Same meaning, 1 short sentence, friendly and natural. Do not add new info. Only rephrase.",
          generate:
            "Write a 1-sentence thank you Instagram DM. Friendly and appreciative. No questions. use 1 emoji,",
        };

        const response = await openai.chat.completions.create({
          // This is the cheapest and fast model
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                commentOrDm === "comment"
                  ? AI_MODES_COMMENTS[type as "improve" | "generate"]
                  : AI_MODES_DM[type as "improve" | "generate"],
            },
            {
              role: "user",
              content: message,
            },
          ],
        });

        return { status: "success", data: response.choices[0].message.content };
      } catch (error) {
        console.error("Error is ", error);
        throw new Error((error as Error).message);
      }
    }),

  instagram: instagramRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type InstagramRouter = typeof instagramRouter;
