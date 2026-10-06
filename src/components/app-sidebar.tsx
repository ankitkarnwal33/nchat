"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  CreditCardIcon,
  HomeIcon,
  LogOutIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { FaInstagram } from "react-icons/fa";

const menuItems = [
  {
    title: "Home",

    items: [
      {
        title: "Dashboard",
        href: "/home",
        icon: HomeIcon,
      },
      {
        title: "Automations",
        href: "/automations",
        icon: ZapIcon,
      },
      {
        title: "Accounts",
        href: "/account",
        icon: FaInstagram,
      },
    ],
  },
];

import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/src/components/ui/sidebar";

import { authClient } from "../lib/auth-client";
import { toast } from "sonner";

import AccountChange from "./AccountChange";

export default function AppSidebar({
  instagramAccounts,
  activeAccountId,
}: {
  instagramAccounts: {
    id: string | null;
    username: string | null;
    instagramUserId: string | null;
    profilePicture: string | null;
  }[];
  activeAccountId: string | null;
}) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {open && <h2 className="text-2xl font-bold mt-2">ChatNinjas</h2>}
        <SidebarTrigger
          className={cn("absolute top-3 right-2", open ? "rotate-180" : "")}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={cn(!open ? "mt-10" : "")}>
          {instagramAccounts.length > 0 ? (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <AccountChange
                    instagramAccounts={instagramAccounts}
                    activeAccountId={activeAccountId}
                  />
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
          {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupContent>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.href === "/home"
                          ? pathname === "/home"
                          : pathname.startsWith(item.href)
                      }
                      render={(props) => (
                        <Link
                          {...props}
                          href={item.href}
                          prefetch={true}
                          className={cn(
                            props.className,
                            "flex text-normal items-center gap-2 px-3 py-2 flex-row hover:bg-foreground/10 hover:text-foreground",
                          )}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                      className="gap-x-4 h-10 px-4"
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Logout"
            render={(props) => (
              <Link
                {...props}
                href="/upgrade"
                prefetch={true}
                className={cn(
                  props.className,
                  "flex text-normal items-center gap-2 px-3 py-3 flex-row hover:bg-foreground/10 hover:text-foreground",
                )}
              >
                <StarIcon className="size-4 text-primary" />
                <span>Upgrade to pro</span>
              </Link>
            )}
          ></SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator />
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Logout"
            render={(props) => (
              <Link
                {...props}
                href="/billing"
                prefetch={true}
                className={cn(
                  props.className,
                  "flex text-normal items-center gap-2 px-3 py-3 flex-row hover:bg-foreground/10 hover:text-foreground",
                )}
              >
                <CreditCardIcon className="size-4" />
                <span>Billing</span>
              </Link>
            )}
          ></SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator />
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Logout"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logged out");
                    router.push("/login");
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                },
              });
            }}
          >
            <LogOutIcon className="size-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
