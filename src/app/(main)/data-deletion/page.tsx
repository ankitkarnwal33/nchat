// src/app/data-deletion/page.tsx
import Link from "next/link";

const steps = [
  "Log in to your ChatNinjas account.",
  'Go to the "Accounts" page.',
  'In the Connected Accounts list, find the Instagram account you want to remove. Every connected account has a "Remove Account" button.',
  'Click the "Remove Account" button.',
  'To confirm, type "Remove" in the input box.',
  'Click "Remove Account". Your account is removed along with all the automations linked to it.',
];

export const metadata = {
  title: "Data Deletion | Chat Ninjas",
  description: "How to delete your Instagram account data from Chat Ninjas.",
};

export default async function DataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Delete your data</h1>
      <p className="mt-3 text-muted-foreground">
        You can delete your data from ChatNinjas at any time. Follow the steps
        below to disconnect an Instagram account and remove everything linked to
        it.
      </p>

      {code && (
        <div className="mt-6 rounded-lg border p-4">
          <p className="font-medium">
            Your deletion request has been processed.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirmation code: <span className="font-mono">{code}</span>
          </p>
        </div>
      )}

      <h2 className="mt-10 text-xl font-semibold">How to remove an account</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-semibold">What gets deleted</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>The connected Instagram account and its profile details</li>
        <li>The access token we stored for that account</li>
        <li>All automations linked to that account</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">
        Remove ChatNinjas from Instagram
      </h2>
      <p className="mt-3">
        You can also revoke access from Instagram: go to Settings, then Apps and
        Websites, and remove ChatNinjas.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Need help?</h2>
      <p className="mt-3">
        If you can&apos;t log in or the steps don&apos;t work, email{" "}
        <a className="underline" href="mailto:you@yourdomain.com">
          karnwalankit89@gmail.com
        </a>{" "}
        from the email address on your ChatNinjas account and we&apos;ll delete
        your data manually. See also our{" "}
        <Link className="underline" href="/privacy-policy">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
