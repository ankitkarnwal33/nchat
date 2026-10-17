import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});
export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  } catch (error) {
    console.log("error", error);
  }
};
export const signInWithGitHub = async () => {
  try {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/home",
    });
  } catch (error) {
    console.log("error", error);
  }
};
