"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import google from "@/public/google.svg";
import github from "@/public/github.svg";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";

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
import { EyeClosedIcon, EyeIcon, MailIcon, UserIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import { useState } from "react";

import {
  authClient,
  signInWithGitHub,
  signInWithGoogle,
} from "@/src/lib/auth-client";

const signUpSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, {
        message: "Password is required ",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: SignUpSchema) => {
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
          name: data.name,
        },
        {
          onSuccess: async () => {
            toast.success("Account created successfully");
            router.push("/home");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to create account");
    }
  };
  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                  type="button"
                  onClick={() => void signInWithGoogle()}
                >
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
              <div className="grid gap-4">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">
                        <UserIcon className="size-4" />
                        Name
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <Input
                            id="name"
                            aria-invalid={fieldState.invalid}
                            placeholder="John Doe"
                            autoComplete="name"
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
                            placeholder="john.doe@example.com"
                            autoComplete="email"
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
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        <LockIcon className="size-4" />
                        Confirm Password
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <Input
                            id="confirmPassword"
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
                              <EyeIcon className="size-4" />
                            ) : (
                              <EyeClosedIcon className="size-4" />
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
                  {isPending ? "Creating account..." : "Create account"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
