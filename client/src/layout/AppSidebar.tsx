
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { Building, Heart, MessageCircle, Settings } from "lucide-react";
import { HorizontaLDots } from "@/icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar = ({ userType }: { userType: string }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const managerNavItems: NavItem[] = [
    {
      icon: <Building />,
      name: "Properties",
      path: "/managers/properties",
    },

    {
      icon: <Settings />,
      name: "Settings",
      path: "/managers/settings",
    },
    {
      icon: <MessageCircle />,
      name: "Chat",
      path: "/managers/chat",
    },
  ];

  const tenantNavItems: NavItem[] = [
    {
      icon: <Heart />,
      name: "Favorites",
      path: "/tenants/favorites",
    },
    {
      icon: <Settings />,
      name: "Settings",
      path: "/tenants/settings",
    }, {
      icon: <MessageCircle />,
      name: "Chat",
      path: "/tenants/chat",
    },
  ];

  const navItems = userType === "manager" ? managerNavItems : tenantNavItems;

  // const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  // const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  // const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname]
  );

  // const handleSubmenuToggle = (index: number) => {
  //   setOpenSubmenu((prev) => (prev === index ? null : index));
  // };

  // useEffect(() => {
  //   if (openSubmenu !== null) {
  //     const key = `${openSubmenu}`;
  //     if (subMenuRefs.current[key]) {
  //       setSubMenuHeight((prevHeights) => ({
  //         ...prevHeights,
  //         [key]: subMenuRefs.current[key]?.scrollHeight || 0,
  //       }));
  //     }
  //   }
  // }, [openSubmenu]);




  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <Image
              src="/images/logo/logo.svg" // Update with your logo
              alt="Logo"
              width={150}
              height={40}
              className="dark:hidden"
            />
          ) : (
            <Image
              src="/images/logo/logo-icon.svg" // Update with your icon logo
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => (
                  <li key={nav.name}>
                    <Link
                      href={nav.path || "#"}
                      className={`menu-item group ${isActive(nav.path || "")
                        ? "menu-item-active"
                        : "menu-item-inactive"
                        } ${!isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "justify-start"
                        }`}
                    >
                      <span
                        className={`${isActive(nav.path || "")
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                          }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;