"use client";

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-6 w-full mx-auto">{children}</div>;
}
