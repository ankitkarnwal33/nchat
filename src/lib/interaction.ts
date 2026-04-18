import prisma from "./prisma";

export async function isWithin24Hours(
  instagramUserId: string,
  accountId: string,
) {
  const interaction = await prisma.userInteraction.findUnique({
    where: {
      instagramUserId_accountId: {
        instagramUserId,
        accountId,
      },
    },
  });

  if (!interaction) return false;

  const diff = Date.now() - new Date(interaction.lastInteractionAt).getTime();

  return diff < 24 * 60 * 60 * 1000;
}
