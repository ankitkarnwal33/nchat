"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import google from "@/public/google.svg";
import github from "@/public/github.svg";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { signInWithGitHub, signInWithGoogle } from "@/src/lib/auth-client";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/src/components/ui/field";

import { InputGroup, InputGroupButton } from "@/src/components/ui/input-group";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Input } from "@/src/components/ui/input";
import { EyeClosedIcon, EyeIcon, MailIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/src/components/Header";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginSchema) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/home",
      },
      {
        onSuccess: () => {
          toast.success("Logged in successfully");
          router.push("/home");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };
  const isPending = form.formState.isSubmitting;

  return (
    <>
      <Header />
      <div className="flex min-h-svh items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full"
                    disabled={isPending}
                    type="button"
                    onClick={() => void signInWithGoogle()}
                  >
                    {/* <GoogleLogoIcon className="size-4" /> */}
                    <Image
                      src={google}
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full"
                    disabled={isPending}
                    type="button"
                    onClick={() => void signInWithGitHub()}
                  >
                    {/* <FacebookLogoIcon className="size-4" /> */}
                    <Image
                      src={github}
                      alt="Github"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Continue with Github
                  </Button>
                </div>

                <Separator />
                <div className="grid gap-6">
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">
                          <MailIcon className="size-4" />
                          Email
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <Input
                              id="email"
                              aria-invalid={fieldState.invalid}
                              placeholder="Enter your email"
                              autoComplete="email"
                              autoFocus
                              {...field}
                            />
                          </InputGroup>
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">
                          <LockIcon className="size-4" />
                          Password
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <Input
                              id="password"
                              aria-invalid={fieldState.invalid}
                              placeholder="********"
                              autoComplete="email"
                              type={isPasswordVisible ? "text" : "password"}
                              {...field}
                            />
                            <InputGroupButton
                              type="button"
                              variant="ghost"
                              className="size-6 hover:bg-transparent"
                              onClick={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                              }
                            >
                              {isPasswordVisible ? (
                                <EyeIcon
                                  className="size-4"
                                  onClick={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                  }
                                />
                              ) : (
                                <EyeClosedIcon
                                  className="size-4"
                                  onClick={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                  }
                                />
                              )}
                            </InputGroupButton>
                          </InputGroup>
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="text-center text-sm flex justify-between gap-4">
                  <Link
                    href="/reset-password"
                    className="text-primary underline underline-offset-4 hover:text-primary"
                  >
                    Forgot password?
                  </Link>

                  <Link
                    href="/sign-up"
                    className="hover:text-primary underline underline-offset-4  text-blue-500"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
