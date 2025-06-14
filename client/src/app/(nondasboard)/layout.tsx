"use client";

import { useGetAuthUserQuery } from "@/src/state/api";
import Navbar from "../../components/navbar";
import { NAVBAR_HEIGHT } from "../../lib/constants";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/src/components/Loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  console.log("authUser:", authUser);

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (userRole === "manager") {
        router.push("/managers/properties", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <Loading />;

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;