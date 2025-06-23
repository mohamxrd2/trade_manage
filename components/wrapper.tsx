import React from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { SiteHeader } from "./site-header";
import AppSidebar from "./app-sidebar";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type WrapperProps = {
  children: React.ReactNode;
  user?: User ; // 👈 on accepte user en tant que props ici
};

const Wrapper = ({ children, user }: WrapperProps) => {
  return (
    <div>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={user} variant="inset" /> {/* 👈 on transmet user */}
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Wrapper;
