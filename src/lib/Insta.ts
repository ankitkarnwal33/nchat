export async function checkIfUserIsFollowing(
  senderId: string,
  accessToken: string,
) {
  try {
    const userProfile = await fetch(
      `https://graph.instagram.com/v25.0/${senderId}?access_token=${accessToken}`,
    );
    if (!userProfile.ok) {
      throw new Error(userProfile?.statusText);
    }
    const isUserFollowingBusiness = await userProfile.json();
    if (isUserFollowingBusiness?.is_user_follow_business) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function sendPlainMessageToUser(
  senderId: string,
  accessToken: string,
  message: string,
  instagramUserId: string,
) {
  try {
    const sendMessage = await fetch(
      `https://graph.instagram.com/v25.0/${instagramUserId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: message },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!sendMessage.ok) {
      throw new Error(sendMessage?.statusText);
    }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function sendPlainMessageToCommentToUser(
  commentId: string,
  accessToken: string,
  message: string,
  instagramUserId: string,
) {
  try {
    const sendMessage = await fetch(
      `https://graph.instagram.com/v25.0/${instagramUserId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          recipient: { comment_id: commentId },
          message: { text: message },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!sendMessage.ok) {
      throw new Error(sendMessage?.statusText);
    }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function sendTemplateMessageToUser(
  senderId: string,
  accessToken: string,
  message: string,
  link: string,
  linkText: string,
  isReplyToComment: boolean = false,
) {
  try {
    const sendMessage = await fetch(
      `https://graph.instagram.com/v25.0/me/messages?access_token=${accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({
          recipient: {
            ...(isReplyToComment ? { comment_id: senderId } : { id: senderId }),
          },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "button",
                text: message,
                buttons: [
                  {
                    type: "web_url",
                    url: link,
                    title: linkText || "Click here",
                  },
                ],
              },
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!sendMessage.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function sendPostbackMessageToUser(
  accessToken: string,
  commentId: string,
  message: string,
  postbackTitle: string,
  postbackPayload: string,
  isReplyToComment: boolean = false,
) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v25.0/me/messages?access_token=${accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({
          recipient: {
            ...(isReplyToComment
              ? { comment_id: commentId }
              : { id: commentId }),
          },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "button",
                text: message || "",
                buttons: [
                  {
                    type: "postback",
                    payload: postbackPayload,
                    title: postbackTitle,
                  },
                ],
              },
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        response?.statusText || "Failed to send postback message",
      );
    }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

export async function sendCommentReplyMessageToUser(
  accessToken: string,
  message: string,
  commentId: string,
  comment_author_username: string,
) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v25.0/${commentId}/replies`,
      {
        method: "POST",
        body: JSON.stringify({
          message: `@${comment_author_username} ${message}`,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(response?.statusText);
    }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}
