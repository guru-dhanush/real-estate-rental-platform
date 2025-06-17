"use client";

import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { Progress } from "@/components/ui/progress";
import { useLoadingProgress } from "@/hooks/useLoadingProgress";
import Loading from "@/components/Loading";

// Inner component that consumes the sidebar context
const DashboardLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { progress, isRouteChanging } = useLoadingProgress();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

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
            : "/tenants/favorites",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <Loading />;
  if (!authUser?.userRole) return null;



  return (
    <div className="min-h-screen xl:flex w-full">
      {isRouteChanging && (
        <Progress
          value={progress}
          className="fixed top-0 left-0 right-0 z-50"
        />
      )}

      {/* Sidebar and Backdrop */}
      <AppSidebar userType={authUser.userRole?.toLowerCase()} />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 w-full transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader authUser={authUser} />
        <div className="w-full p-4 md:p-6">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Outer component that provides the sidebar context
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;