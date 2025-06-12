"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()

  // Fonction pour transformer le chemin en titre
  const getPageTitle = () => {
    if (!pathname || pathname === "/") return "Accueil"
    const parts = pathname.split("/").filter(Boolean)
    const first = parts[0] || ""
    return first.charAt(0).toUpperCase() + first.slice(1)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {getPageTitle()}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
