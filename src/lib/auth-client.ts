import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  //   baseURL: "http://localhost:3000",
});
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
