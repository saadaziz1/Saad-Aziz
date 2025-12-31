"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
            className={navClass(active, isMobile ? false : isHome)} // Mobile always uses dark text
          >
            {label}
            {active && (
              <>
                {isMobile ? (
                   // Mobile: Indicator to the right
                  <span className="ml-2 inline-block h-[6px] w-[6px] rounded-full bg-[#FFCB23]" />
                ) : (
                  // Desktop: Indicator at bottom center
                  <span
                    className={clsx(
                      "absolute left-1/2 -translate-x-1/2 -bottom-2 h-[3px] w-[16px] rounded-full",
                      "bg-[#FFCB23]",
                      "transition-all duration-300 ease-out",
                      "scale-x-100 opacity-100 origin-center"
                    )}
                  />
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
        "py-4 px-4 transition-all duration-300",
        isHome
          ? "absolute top-9 left-0 w-full bg-transparent z-50"
          : "bg-white shadow-sm relative"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/car-deposit%20Logo.png"
            alt="logo"
            className="object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks isHome={isHome} />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Bell icon/Notification Menu only if authenticated */}
          {isAuthenticated && <NotificationMenu />}

          {/* Desktop auth / dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className={clsx(
                      "cursor-pointer bg-transparent hover:bg-white hover:text-gray-900",
                      isHome
                        ? "text-white border-white"
                        : "text-[#2E3D83] border-[#2E3D83]"
                    )}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="cursor-pointer bg-[#4A5FBF] hover:bg-[#3A4FAF]">
                    Register now
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile?tab=wishlist">
                   <IconStar />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer">
                      <IconCar />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="ml-2">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="space-y-6 pt-10">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation links</SheetDescription>
                <div className="flex flex-col gap-4 text-lg">
                  <NavLinks isHome={isHome} isMobile={true} />
                </div>

                {/* Mobile auth / dashboard */}
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3 pt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button variant="default" asChild className="w-full">
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 pt-8 pb-8 px-2 border-t border-gray-100">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-4 text-lg font-medium text-gray-700 hover:text-[#4A5FBF] transition-colors"
                    >
                      <div className="w-6 flex justify-center">
                        <IconCar />
                      </div>
                      Profile
                    </Link>
                    
                    <Link 
                      href="/profile?tab=wishlist" 
                      className="flex items-center gap-4 text-lg font-medium text-gray-700 hover:text-[#4A5FBF] transition-colors"
                    >
                      <div className="w-6 flex justify-center">
                        <IconStar />
                      </div>
                      Wishlist
                    </Link>
                    
                    <button 
                      onClick={logout}
                      className="flex items-center gap-4 text-lg font-medium text-red-600 hover:text-red-700 transition-colors text-left"
                    >
                      <div className="w-6 flex justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      </div>
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

/* helpers */
const navClass = (active: boolean, isHome: boolean) =>
  clsx(
    "relative font-medium transition-colors duration-200",
    isHome
      ? "text-white hover:text-yellow-300"
      : "text-gray-700 hover:text-[#4A5FBF]",
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
      fill="#2E3D83"
    />
  </svg>
);

const IconStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
