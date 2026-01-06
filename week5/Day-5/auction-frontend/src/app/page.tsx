"use client";
import { SearchFilters } from "@/components/filters/search-filters";
import { CarCard } from "@/components/cards/car-card";
import { CarCardSkeleton } from "@/components/skeletons/CarCardSkeleton";
import { useCars } from "@/hooks/useCars";
import { useSocketContext } from "@/providers/SocketProvider";
import { formatPrice, formatTimeRemaining, getAuctionStatus } from "@/lib/auctionUtils";
import { Car } from "@/types/api";
import { useEffect, useState } from "react";

export default function HomePage() {

  const [searchFilters, setSearchFilters] = useState({});
  const { data: cars, isLoading, error } = useCars(searchFilters);
  const { currentBids, joinAuction, initializeBidData, timeUpdates } = useSocketContext();

  const displayCars = Array.isArray(cars) ? cars.slice(0, 4).map((car: Car) => {
    const auctionId = car._id;
    const realTimeBid = currentBids[auctionId];
    const realTimeRemaining = timeUpdates[auctionId];
    const currentPrice = realTimeBid?.amount || car.currentPrice || car.startingPrice || 0;
    const timeRemaining = realTimeRemaining || (car.endTime ? formatTimeRemaining(car.endTime) : "Auction Ended");

    return {
      id: car._id,
      name: car.title,
      image: car.photos?.[0] || "/placeholder.jpg",
      price: formatPrice(currentPrice),
      currentBid: formatPrice(currentPrice),
      timeRemaining: timeRemaining,
      endTime: car.endTime,
      status: car.isCompleted ? ("Sold" as const) : ("trending" as const),
      rating: 5,
      endType: car.isCompleted ? "Auction Ended" : "Time Remaining",
      description: car.description || "No description available",
      ownerId: car.sellerId,
    };
  }) : [];

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      cars.slice(0, 4).forEach((car: Car) => {
        joinAuction(car._id);
        initializeBidData(car._id, car.currentPrice || car.startingPrice || 0, 0);
      });
    }
  }, [cars, joinAuction, initializeBidData]);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative  bg-cover bg-center py-32 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="bg-blue-100 text-[#4A5FBF] px-4 py-2 rounded-sm inline-block mb-6 text-sm font-medium">
              WELCOME TO AUCTION
            </div>
            <h1 className="text-5xl md:text-6xl font-medium text-white mb-6 leading-tight">
              Find Your Dream Car
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>
          </div>

          <div className="mt-12">
            <SearchFilters onSearch={setSearchFilters} />
          </div>
        </div>

      </div>

      {/* Live Auction Section */}
      <div className="bg-white w-full py-16">
        <div className="bg-[#2E3D83] w-full py-16 px-0">
          <div className=" mx-auto">
            <div className="text-center mb-12">
              <div className="text-center">
                {/* Title */}
                <h2 className="text-white text-4xl font-semibold mb-6">
                  Live Auction
                </h2>

                {/* Line + Diamond */}
                <div className="relative flex items-center justify-center">
                  {/* Horizontal line */}
                  <div className="w-64 h-[2px] bg-white/70"></div>

                  {/* Diamond */}
                  <div className="absolute w-4 h-4 bg-yellow-400 rotate-45"></div>
                </div>
              </div>
            </div>

            <div className="mb-8 max-w-7xl mx-auto">
              <div className="border-b border-white">
                <div className="inline-block px-6 mx-24 border-b-[5px] border-[#FFC300] pb-2">
                  <span className="text-white font-medium text-xl">Live Auction</span>
                </div>
              </div>
            </div>

            <div className="flex max-w-7xl mx-auto gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="shrink-0 w-80">
                      <CarCardSkeleton />
                    </div>
                  ))}
                </>
              ) : error ? (
                <div className="shrink-0 min-h-screen w-full text-center text-white">
                  Failed to load cars. Please try again.
                </div>
              ) : displayCars.length === 0 ? (
                <div className="shrink-0 min-h-screen w-full text-center text-white">
                  No cars available for auction.
                </div>
              ) : (
                displayCars.map((car) => (
                  <div key={car.id} className="shrink-0 w-80">
                    <CarCard {...car} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
