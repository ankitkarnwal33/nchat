"use client";

import { Suspense, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/src/components/ui/field";

import { InputGroup } from "@/src/components/ui/input-group";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { authClient } from "@/src/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/src/components/Header";
import { LockIcon } from "lucide-react";

const updatePasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(8, { message: "Confirm password must be at least 8 characters" }),
    token: z.string().min(1, { message: "Token is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token");
      router.push("/reset-password");
    }
  }, [token, router]);

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token ?? "",
    },
  });
  const onSubmit = async (data: UpdatePasswordSchema) => {
    await authClient.resetPassword(
      {
        newPassword: data.password,
        token: data.token,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error("Failed to update password");
        },
      },
    );
  };
  const isPending = form.formState.isSubmitting;

  return (
    <div>
      <Header />
      <div className="flex min-h-svh items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Update your password</CardTitle>
            <CardDescription>
              Enter your new password to update your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
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
                              autoComplete="password"
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
                              autoComplete="confirmPassword"
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

                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating password..." : "Update password"}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Sign in to your account?{" "}
                  <Link
                    href="/login"
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div>
          <Header />
          <div className="flex min-h-svh items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Update your password</CardTitle>
                <CardDescription>Loading…</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
