"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Home, Settings, LogOut, Search, Plus } from "lucide-react";
import Button from "./ui/button/Button";
import { useState } from "react";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm text-gray-900 "
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full px-6">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold hidden sm:block">
              <span className="text-blue-600">Emerald</span> Estates
            </span>
          </Link>

          {isDashboardPage && authUser && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span>New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Middle section - only visible on non-dashboard pages */}
        {!isDashboardPage && (
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none dropdown-toggle"
              >
                {authUser.userInfo?.image ? (
                  <div className="overflow-hidden rounded-full h-9 w-9 border border-gray-200">
                    <Image
                      width={36}
                      height={36}
                      src={authUser.userInfo.image}
                      alt={authUser.userInfo?.name || "User avatar"}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {authUser.userInfo?.name?.charAt(0).toUpperCase() ||
                        authUser.userRole?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {authUser.userInfo?.name}
                </span>
                <svg
                  className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {authUser.userInfo?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {authUser.userInfo?.email}
                    </p>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={() => {
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites"
                      );
                      closeDropdown();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      router.push(`/${authUser.userRole?.toLowerCase()}s/settings`);
                      closeDropdown();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeDropdown();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-gray-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;