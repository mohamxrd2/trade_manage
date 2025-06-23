"use client";
import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavMain,  } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItem } from "@/type";

const data: { navMain: NavItem[] } = {
  navMain: [
    { title: "Accueil", url: "/dashboard", iconKey: "dashboard" },
    { title: "Produits", url: "/products", iconKey: "box" },
    { title: "Ventes", url: "/trade", iconKey: "list" },
    { title: "Statistiques", url: "/analytics", iconKey: "chart" },
    {title: "Profile", url: "/profile", iconKey: "user"},
  ],
};

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: User;
};

export default function AppSidebar({ user, ...sidebarProps }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Trade Manage (MM).</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
