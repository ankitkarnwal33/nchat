"use client";

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
import Header from "@/src/components/Header";
import { MailIcon } from "lucide-react";

const resetPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

type LoginSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: LoginSchema) => {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
      },
      {
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
        onError: (ctx) => {
          toast.error("Failed to send password reset email");
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
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
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

                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Resetting password..." : "Reset password"}
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
