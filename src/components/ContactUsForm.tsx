"use client";

import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/src/components/ui/input-group";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/src/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  MailIcon,
  MessageCircleIcon,
  TriangleAlertIcon,
  UserRound,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTRPC } from "@/src/trpc/client";
import { useMutation } from "@tanstack/react-query";
import ButtonLoading from "./ButtonLoading";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(100, "Message must be 100 characters or less"),
  isTermsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});
export type FormSchema = z.infer<typeof formSchema>;
export default function ContactUsForm() {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      isTermsAccepted: false,
    },
  });
  const trpc = useTRPC();

  const { mutate } = useMutation(trpc.contactUs.mutationOptions());

  const onSubmit = async (data: FormSchema) => {
    setButtonState("loading");
    mutate(
      {
        name: data.name,
        email: data.email,
        message: data.message,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setButtonState("success");
            form.reset();
            setTimeout(() => {
              setButtonState("idle");
            }, 3000);
            toast.success(data.message);
          }
        },
        onError: (error) => {
          setButtonState("idle");
          toast.error(
            error.message || "Form submission failed, please try again later",
            {
              duration: 5000,
              position: "top-right",
              style: {
                backgroundColor: "var(--destructive)",
                color: "var(--destructive-foreground)",
              },
              icon: <TriangleAlertIcon className="w-4 h-4" />,
            },
          );
        },
      },
    );
  };
  return (
    <form
      className="space-y-4 w-full md:max-w-xl mx-auto flex-1 bg-background md:p-10 p-5 rounded-xl shadow-md"
      id="form-contact-us"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <p className="text-lg font-semibold text-gray-500">Required details:</p>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-name"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <UserRound className="w-4 h-4 text-primary" />
                <span>
                  Name <span className="text-red-500">*</span>
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="form-name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-email"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <MailIcon className="w-4 h-4 text-primary" />
                <span>
                  Email <span className="text-red-500">*</span>
                </span>
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                type="email"
                id="form-email"
                placeholder="Enter your email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-message"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <MessageCircleIcon className="w-4 h-4 text-primary" />
                <span>
                  Message <span className="text-red-500">*</span>
                </span>
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="form-message"
                  placeholder="Enter your message"
                  rows={6}
                  className="min-h-20 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>
        <Controller
          name="isTermsAccepted"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="form-terms"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                  className="mt-0.5"
                />
                <FieldLabel
                  htmlFor="form-terms"
                  className="text-sm font-normal leading-snug"
                >
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-primary underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      className="text-primary underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <ButtonLoading
        idle="Submit"
        success="Thank you, form submitted."
        buttonState={buttonState}
      />
    </form>
  );
}
