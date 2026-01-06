"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, Menu } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";
import { NotificationMenu } from "./NotificationMenu";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useLogout();

  const NavLinks = ({
    isHome,
    isMobile = false,
  }: {
    isHome: boolean;
    isMobile?: boolean;
  }) => (
    <>
      {[
        { href: "/", label: "Home" },
        { href: "/car-auction", label: "Car Auction" },
        { href: "/sell-your-car", label: "Sell Your Car" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ].map(({ href, label }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={navClass(active, isHome, isMobile)}
          >
            {label}
            {active && (
              <>
                {isMobile ? (
                  <span className="ml-2 h-2 w-2 rounded-full bg-[#FFCB23]" />
                ) : (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[3px] w-4 rounded-full bg-[#FFCB23]" />
                )}
              </>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav
      className={clsx(
        "w-full py-4 transition-all duration-300",
        isHome
          ? "absolute top-9 left-0 z-50 bg-transparent"
          : "relative bg-white shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/car-deposit Logo.png"
            alt="logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLinks isHome={isHome} />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && <NotificationMenu />}

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className={clsx(
                      isHome
                        ? "border-[#2E3D83] text-[#2E3D83]"
                        : "border-[#2E3D83] text-[#2E3D83]"
                    )}
                  >
                    Sign in
                  </Button>
                </Link>

                <Link href="/register">
                  <Button className="bg-[#4A5FBF] hover:bg-[#3A4FAF]">
                    Register now
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile?tab=wishlist" className="text-[#2E3D83]">
                  <IconStar />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-[#2E3D83]">
                      <IconCar />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* ✅ MOBILE MENU */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="flex items-center justify-center w-12 h-12 rounded-md text-[#2E3D83] hover:bg-black/5"
                >
                  <Menu className="w-7 h-7" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-[#2E3D83] text-white pt-10"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile navigation
                </SheetDescription>

                <div className="flex flex-col gap-5 px-6 text-lg">
                  <NavLinks isHome={false} isMobile />
                </div>

                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3 px-6 pt-10">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white text-[#2E3D83]"
                    >
                      <Link href="/login">Sign in</Link>
                    </Button>

                    <Button
                      asChild
                      className="bg-white text-[#2E3D83]"
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-10 border-t border-white/20 px-6 pt-6 space-y-6">
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 text-lg"
                    >
                      <IconCar />
                      Profile
                    </Link>

                    <Link
                      href="/profile?tab=wishlist"
                      className="flex items-center gap-4 text-lg"
                    >
                      <IconStar />
                      Wishlist
                    </Link>

                    <button
                      onClick={logout}
                      className="flex items-center gap-4 text-lg text-red-300"
                    >
                      <LogOutIcon />
                      Logout
                    </button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ================= helpers ================= */

const navClass = (active: boolean, isHome: boolean, isMobile?: boolean) =>
  clsx(
    "relative font-medium transition-colors",
    isMobile
      ? "text-white hover:text-yellow-300"
      : isHome
        ? "text-white hover:text-yellow-300"
        : "text-[#2E3D83] hover:text-[#4A5FBF]",
    active && "font-bold"
  );
/* icons */
const IconCar = () => (
  <svg
    width="27"
    height="24"
    viewBox="0 0 27 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.2167 1.47292C22.925 0.6125 22.1083 0 21.1458 0H5.10417C4.14167 0 3.33958 0.6125 3.03333 1.47292L0.160417 9.74167C0.0583332 10.0479 0 10.3688 0 10.7042V21.1458C0 22.3563 0.977083 23.3333 2.1875 23.3333C3.39792 23.3333 4.375 22.3563 4.375 21.1458V20.4167H21.875V21.1458C21.875 22.3417 22.8521 23.3333 24.0625 23.3333C25.2583 23.3333 26.25 22.3563 26.25 21.1458V10.7042C26.25 10.3833 26.1917 10.0479 26.0896 9.74167L23.2167 1.47292ZM5.10417 16.0417C3.89375 16.0417 2.91667 15.0646 2.91667 13.8542C2.91667 12.6438 3.89375 11.6667 5.10417 11.6667C6.31458 11.6667 7.29167 12.6438 7.29167 13.8542C7.29167 15.0646 6.31458 16.0417 5.10417 16.0417ZM21.1458 16.0417C19.9354 16.0417 18.9583 15.0646 18.9583 13.8542C18.9583 12.6438 19.9354 11.6667 21.1458 11.6667C22.3563 11.6667 23.3333 12.6438 23.3333 13.8542C23.3333 15.0646 22.3563 16.0417 21.1458 16.0417ZM2.91667 8.75L4.76875 3.17917C4.97292 2.59583 5.52708 2.1875 6.15417 2.1875H20.0958C20.7229 2.1875 21.2771 2.59583 21.4813 3.17917L23.3333 8.75H2.91667Z"
      fill="currentColor"
    />
  </svg>
);

const IconStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
