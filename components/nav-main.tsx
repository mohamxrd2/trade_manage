"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  IconDashboard,
  IconBox,
  IconChartBar,
  IconListDetails,
  IconUser,
} from "@tabler/icons-react"

import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"

// Map des clés d'icônes aux composants
const iconMap = {
  dashboard: IconDashboard,
  box: IconBox,
  chart: IconChartBar,
  list: IconListDetails,
  user: IconUser
}

type NavItem = {
  title: string
  url: string
  iconKey?: keyof typeof iconMap
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            const Icon = item.iconKey ? iconMap[item.iconKey] : null

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={clsx(
                    "transition-all",
                    isActive
                      ? "bg-accent-foreground text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
