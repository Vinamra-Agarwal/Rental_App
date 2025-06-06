"use client";

import Navbar from "@/src/components/navbar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import Sidebar from "@/src/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/src/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/src/state/api";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
    const router = useRouter();
    const pathname = usePathname();
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
      if (authUser) {
        const userRole = authUser.userRole?.toLowerCase();
        if (
          (userRole === "manager" && pathname.startsWith("/tenants")) ||
          (userRole === "tenant" && pathname.startsWith("/managers"))
          ) {
          router.push(
            userRole === "manager"
              ? "/managers/properties"
              : "/tenants/favourites",
            { scroll: false }
          )
        } else {
          setIsLoading(false)
        }
      }
    },[authUser, router, pathname]);
    
    if (authLoading || isLoading) return <>Loading...</>
    if(!authUser?.userRole) return null;


    return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar userType={authUser?.userRole.toLowerCase()}/>
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
