"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HeroSection } from "@/components/layout/hero-section";
import { ProfileSidebar } from "@/components/profile/profileSidebar";
import { MyCarCard } from "@/components/profile/cards/MyCarCard";
import { MyBidCard } from "@/components/profile/cards/MyBidCard";
import { WishlistCard } from "@/components/profile/cards/WishlistCard";
import { ProfileForm } from "@/components/profile/forms/ProfileForm";
import { extractId } from "@/lib/profileUtils";
import { useProfileApi } from "@/hooks/useProfileApi";
import { toast } from 'sonner';
import { useCars } from "@/hooks/useCars";
import { useBids } from "@/hooks/useBids";
import { useWishlist } from "@/hooks/useWishlist";
import { useSocketContext } from "@/providers/SocketProvider";
import type { Car } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";
import { useUser } from "@/hooks/useUser";


export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<
    "personal" | "cars" | "bids" | "wishlist"
  >("personal");

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'wishlist' || tab === 'cars' || tab === 'bids' || tab === 'personal') {
      setActive(tab);
    }
  }, [searchParams]);

  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = extractId(user);

  const { data: userData, isLoading: isUserLoading, error: userError } = useUser(userId);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Handle invalid user session (e.g. user deleted from backend)
  useEffect(() => {
    if (userError) {
      console.error("Error fetching user data:", userError);
      // Optional: logout if 404 or 401
      if ((userError as any)?.response?.status === 404 || (userError as any)?.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  }, [userError, logout, router]);

  // ----------------------------
  // ✅ STABLE initialData SOURCE
  // ----------------------------
  // Using useMemo to derive initialData from fetched userData. 
  // This ensures it updates when user loads, fixing the null rendering issue.
  const initialData = useMemo(() => {
    if (!userData) return null;
    return {
      fullName: userData.fullName ?? "",
      email: userData.email ?? "",
      username: (userData as any)?.username ?? "",
      countryCode: (userData as any)?.countryCode ?? "",
      mobileNumber: (userData as any)?.mobileNumber ?? "",
      nationality: (userData as any)?.nationality ?? "",
      profileImage: (userData as any)?.profilePicture ?? "",
      idType: (userData as any)?.idType ?? "",
      idNumber: (userData as any)?.idNumber ?? "",
      password: "",
      address1: (userData as any)?.address1 ?? "",
      address2: (userData as any)?.address2 ?? "",
      city: (userData as any)?.city ?? "",
      poBox: (userData as any)?.poBox ?? "",
      country: (userData as any)?.country ?? "",
      landline: (userData as any)?.landline ?? "",
      trafficType: (userData as any)?.trafficType ?? "",
      trafficFileNumber: (userData as any)?.trafficFileNumber ?? "",
      plateNumber: (userData as any)?.plateNumber ?? "",
      issueCity: (userData as any)?.issueCity ?? "",
      driverLicenseNumber: (userData as any)?.driverLicenseNumber ?? "",
      plateCode: (userData as any)?.plateCode ?? "",
      plateState: (userData as any)?.plateState ?? "",
    };
  }, [userData]);


  // ----------------------------
  // Hydration
  // ----------------------------


  const { data: cars } = useCars();
  const { data: bids } = useBids();
  const { data: wishlist } = useWishlist();
  const { joinAuction } = useSocketContext();

  useEffect(() => {
    if (!isHydrated || !cars) return;
    cars.forEach((car) => joinAuction(car._id));
  }, [cars, isHydrated, joinAuction]);


  const { handleProfileSave } = useProfileApi();

  // Adapter for ProfileForm: ensures return type is void | Promise<void> and shows toast
  const handleProfileFormSubmit = async (data: any, section: string, file?: File | null) => {
    const result = await handleProfileSave(data, section, file);
    if (!result) return;
    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.error || "Update failed");
    }
  };

  // Prevent hydration mismatch and show loading state
  if (!isHydrated || (userId && isUserLoading)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const myCars =
    (cars as Car[])?.filter(
      (car) => extractId(car.sellerId) === extractId(user)
    ) || [];

  const myBidCars =
    bids && cars && user
      ? (cars as Car[]).filter((car) =>
        bids.some(
          (bid) =>
            extractId(bid.bidderId) === extractId(user) &&
            extractId(bid.auctionId) === car._id
        )
      )
      : [];

  const wishlistCars =
    wishlist?.carIds && cars
      ? (cars as Car[]).filter((car) =>
        wishlist.carIds
          .map((id: any) => extractId(id))
          .includes(car._id)
      )
      : [];

  return (
    <>
      <HeroSection
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Profile", href: '/profile' }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {active === "personal" && (
                <ProfileForm
                  key="profile-form"
                  initialData={initialData}
                  onSubmit={handleProfileFormSubmit}
                />
              )}

              {active === "cars" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myCars.map((car) => (
                    <MyCarCard key={car._id} car={car} />
                  ))}
                </div>
              )}

              {active === "bids" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myBidCars.map((car) => {
                    // Extract user's bids for this car
                    const userCarBids = bids
                      ? bids
                        .filter(
                          (bid) =>
                            extractId(bid.bidderId) === extractId(user) &&
                            extractId(bid.auctionId) === car._id
                        )
                        .map((bid) => ({
                          amount: bid.amount,
                          bidderId: extractId(bid.bidderId) || "",
                          auctionId: extractId(bid.auctionId) || "",
                        }))
                      : [];

                    return (
                      <MyBidCard
                        key={car._id}
                        car={car}
                        userBids={userCarBids}
                      />
                    );
                  })}
                </div>
              )}

              {active === "wishlist" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wishlistCars.map((car) => (
                    <WishlistCard key={car._id} car={car} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
