"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { Progress } from "@/components/ui/progress";
import { useLoadingProgress } from "@/hooks/useLoadingProgress";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { progress, isRouteChanging } = useLoadingProgress();

  useEffect(() => {
    if (authUser) {
      setIsLoading(true);
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/")
      ) {
        router.push("/managers/properties", { scroll: false });
      } else {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <Loading />;

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col bg-white`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {isRouteChanging && (
          <Progress value={progress} className="fixed top-0 left-0 right-0 z-50" />
        )}
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
};

export default Layout;
