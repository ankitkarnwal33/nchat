import { requireAuth } from "@/src/lib/auth-utils";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import AppSidebar from "@/src/components/app-sidebar";
import { caller } from "@/src/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const instagramAccounts = await caller.getInstagramAccounts();
  const cookieStore = await cookies();
  const activeAccountId = cookieStore.get("activeAccountId")?.value || null;
  return (
    <SidebarProvider>
      <AppSidebar
        instagramAccounts={instagramAccounts}
        activeAccountId={activeAccountId}
      />
      <SidebarInset>
        <div className="flex flex-col  h-screen w-full px-4 py-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
