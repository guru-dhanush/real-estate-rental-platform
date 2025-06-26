"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Home, Settings, LogOut, Search, Plus, Menu, X, User, ChevronDown } from "lucide-react";
import Button from "./ui/button/Button";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);



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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Properties" },
    { href: "/about-us", label: "About" }, // Updated path
    { href: "/contact", label: "Contact" },
  ];



  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm text-gray-900 border-b border-gray-100"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center text-3xl font-bold text-[#004B93]">
            Dwelt <span className="text-[#c9002b]">in</span>
          </Link>

          {isDashboardPage && authUser && (
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-[#004B93] transition-colors"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mobile-menu-toggle"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>

        {/* Desktop Navigation */}
        {!isDashboardPage && (
          <div className="hidden lg:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-[#004B93] font-medium transition-colors ${pathname === link.href ? 'text-[#004B93]' : ''
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right section - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {authUser ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dropdown-toggle transition-colors"
              >
                {authUser.userInfo?.image ? (
                  <div className="overflow-hidden rounded-full h-9 w-9 border-2 border-gray-200">
                    <Image
                      width={36}
                      height={36}
                      src={authUser.userInfo.image}
                      alt={authUser.userInfo?.name || "User avatar"}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-sm">
                    <span className="text-sm font-semibold text-white">
                      {authUser.userInfo?.name?.charAt(0).toUpperCase() ||
                        authUser.userRole?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
                <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-32 truncate">
                  {authUser.userInfo?.name}
                </span>
                <ChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  size={16}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 dropdown-menu overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {authUser.userInfo?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {authUser.userInfo?.email}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                      {authUser.userRole}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push(
                          authUser.userRole?.toLowerCase() === "manager"
                            ? "/managers/properties"
                            : "/tenants/favorites"
                        );
                        closeDropdown();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004B93] transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push(`/${authUser.userRole?.toLowerCase()}s/settings`);
                        closeDropdown();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004B93] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeDropdown();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button
                  variant="none"
                  className="text-gray-700 hover:text-[#004B93] hover:bg-gray-50 border-gray-300 transition-colors"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="none"
                  className="text-gray-700 hover:text-[#004B93] hover:bg-gray-50 border-gray-300 transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 bg-white border-b border-gray-200 shadow-lg mobile-menu max-h-[calc(100vh-60px)] overflow-y-auto">
          {/* Dashboard Action Button for Mobile */}
          {isDashboardPage && authUser && (
            <div className="px-4 py-3 border-b border-gray-100">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-[#004B93] transition-colors"
                onClick={() => {
                  router.push(
                    authUser.userRole?.toLowerCase() === "manager"
                      ? "/managers/newproperty"
                      : "/search"
                  );
                  closeMobileMenu();
                }}
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
            </div>
          )}

          {/* Navigation Links */}
          {!isDashboardPage && (
            <div className="py-2">
              {navigationLinks.map((link, index) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-[#004B93] font-medium transition-colors ${pathname === link.href ? 'bg-blue-50 text-[#004B93] border-r-2 border-blue-600' : ''
                      }`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                  {index < navigationLinks.length - 1 && (
                    <div className="mx-6 border-b border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* User Section */}
          {authUser ? (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* User Info */}
              <div className="px-6 py-4 flex items-center gap-3">
                {authUser.userInfo?.image ? (
                  <div className="overflow-hidden rounded-full h-12 w-12 border-2 border-gray-200 flex-shrink-0">
                    <Image
                      width={48}
                      height={48}
                      src={authUser.userInfo.image}
                      alt={authUser.userInfo?.name || "User avatar"}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-sm flex-shrink-0">
                    <span className="text-lg font-semibold text-white">
                      {authUser.userInfo?.name?.charAt(0).toUpperCase() ||
                        authUser.userRole?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {authUser.userInfo?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {authUser.userInfo?.email}
                  </p>
                  <p className="text-xs text-blue-600 font-medium capitalize">
                    {authUser.userRole}
                  </p>
                </div>
              </div>

              {/* User Actions */}
              <div className="py-2 bg-white">
                <button
                  onClick={() => {
                    router.push(
                      authUser.userRole?.toLowerCase() === "manager"
                        ? "/managers/properties"
                        : "/tenants/favorites"
                    );
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center gap-3 px-6 py-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004B93] transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <div className="mx-6 border-b border-gray-100"></div>
                <button
                  onClick={() => {
                    router.push(`/${authUser.userRole?.toLowerCase()}s/settings`);
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center gap-3 px-6 py-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004B93] transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <div className="mx-6 border-b border-gray-100"></div>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center gap-3 px-6 py-4 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Auth Buttons for Non-authenticated Users */
            <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
              <Link href="/signin" className="block">
                <Button
                  variant="outline"
                  className="w-full text-gray-700 hover:text-[#004B93] hover:bg-white border-gray-300 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button
                  variant="none"
                  className="w-full bg-[#004B93] text-white hover:bg-[#004B93] border-blue-600 hover:border-[#004B93] transition-colors !py-1"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;