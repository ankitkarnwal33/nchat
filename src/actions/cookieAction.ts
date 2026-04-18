"use server";
import { cookies } from "next/headers";

export async function setSigningInWithGoogleCookie(value: boolean) {
  (await cookies()).set("signingInWithGoogle", value.toString(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
export async function getSigningInWithGoogleCookie() {
  return (
    (await cookies()).get("signingInWithGoogle")?.value === "true" || false
  );
}
