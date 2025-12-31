"use client";
import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/layout/hero-section";
import { AuctionListingCard } from "@/components/cards/auction-listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AutocompleteInput } from "@/components/filters/autocomplete-input";
import { useCars } from "@/hooks/useCars";
import { useBids } from "@/hooks/useBids";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { formatPrice } from "@/lib/auctionUtils";
import { Car } from "@/types/api";
import { useSocketContext } from "@/providers/SocketProvider";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CarAuctionPage() {
  const [searchFilters, setSearchFilters] = useState({});
  const { data: cars, isLoading, error } = useCars(searchFilters);
  const { data: bids } = useBids();
  const { data: filterOptions } = useFilterOptions();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    carType: "",
    color: "",
    make: "",
    model: "",
    style: "",
    minPrice: 0,
    maxPrice: 1000000,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    carType: "",
    color: "",
    make: "",
    model: "",
    style: "",
    minPrice: 0,
    maxPrice: 1000000,
  });

  const { joinAuction, currentBids, isConnected, initializeBidData } = useSocketContext();

  const CARS_PER_PAGE = 10;

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize socket data and join rooms for visible cars
  useEffect(() => {
      if (cars && bids && isConnected) {
          (cars as Car[]).forEach(car => {
              // Join the room for real-time updates
              joinAuction(car._id);
              
              // Initialize data if not already present
               const carBids = bids.filter(bid => {
                const auctionId = typeof bid.auctionId === 'string' ? bid.auctionId : (bid.auctionId as any)?._id;
                return auctionId === car._id;
              });
              const bidCount = carBids.length;
              const currentPrice = car.currentPrice || car.startingPrice || 0;
              // We only initialize if we don't have socket data yet to avoid overwriting newer socket data
              if (!currentBids[car._id]) {
                 initializeBidData(car._id, currentPrice, bidCount);
              }
          });
      }
  }, [cars, bids, isConnected, joinAuction, initializeBidData]);


  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = currentTime.getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false,
    };
  };

  const filteredCars =
    (cars as Car[])?.filter((car: Car) => {
      const carPrice = car.currentPrice || car.startingPrice || 0;
      return (
        (!appliedFilters.carType ||
          car.bodyType
            ?.toLowerCase()
            .includes(appliedFilters.carType.toLowerCase())) &&
        (!appliedFilters.make ||
          car.make
            ?.toLowerCase()
            .includes(appliedFilters.make.toLowerCase())) &&
        (!appliedFilters.model ||
          car.model
            ?.toLowerCase()
            .includes(appliedFilters.model.toLowerCase())) &&
        carPrice >= appliedFilters.minPrice &&
        carPrice <= appliedFilters.maxPrice
      );
    }) || [];

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.currentPrice || a.startingPrice || 0) - (b.currentPrice || b.startingPrice || 0);
      case 'price-high':
        return (b.currentPrice || b.startingPrice || 0) - (a.currentPrice || a.startingPrice || 0);
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'ending-soon':
        return new Date(a.endTime || 0).getTime() - new Date(b.endTime || 0).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedCars.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedCars = sortedCars.slice(startIndex, startIndex + CARS_PER_PAGE);

  const displayCars = paginatedCars.map((car: Car) => {
    const timeLeft = calculateTimeLeft(car.endTime || new Date().toISOString());
    
    // Real-time Socket Data Integration
    const socketData = currentBids[car._id];

    // Fallback/Base data from DB
    const carBids = bids?.filter(bid => {
      const auctionId = typeof bid.auctionId === 'string' ? bid.auctionId : (bid.auctionId as any)?._id;
      return auctionId === car._id;
    }) || [];
    
    const dbPrice = car.currentPrice || car.startingPrice || 0;
    const dbBidCount = carBids.length;

    // Determine final values to display: prefer socket data if available/newer
    const displayPrice = socketData?.amount ? socketData.amount : dbPrice;
    const displayBidCount = socketData?.count !== undefined && socketData.count > dbBidCount ? socketData.count : dbBidCount;

    return {
      id: car._id,
      name: car.title,
      image: car.photos?.[0] || "/placeholder.svg",
      price: formatPrice(displayPrice),
      totalBids: displayBidCount,
      timeLeft: timeLeft,
      endTime: car.endTime || new Date().toISOString(),
      rating: 5,
      description: car.description || "No description available",
      status:
        timeLeft.expired || car.isCompleted ? null : ("trending" as const),
    };
  });

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const searchFilters: any = {};
    if (filters.make) searchFilters.make = filters.make;
    if (filters.model) searchFilters.model = filters.model;
    if (filters.minPrice > 0) searchFilters.minPrice = filters.minPrice.toString();
    if (filters.maxPrice < 1000000) searchFilters.maxPrice = filters.maxPrice.toString();
    
    setSearchFilters(searchFilters);
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handlePriceChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0] * 1000,
      maxPrice: values[1] * 1000,
    }));
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          className={currentPage === i ? "bg-[#2E3D83]" : "bg-[#F7F7FA]"}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    if (totalPages > maxVisiblePages) {
      pages.push(
        <span key="dots" className="mx-2">
          ...
        </span>
      );
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          size="sm"
          className={
            currentPage === totalPages ? "bg-[#2E3D83]" : "bg-[#F7F7FA]"
          }
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (isLoading) {
    return (
      <>
        <HeroSection
          title="Auction"
          description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Auction", href: "/car-auction" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading auctions...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: "/car-auction" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filters - Above cards on small screens */}
        <div className="lg:hidden mb-6">
          <Card className="py-0 bg-[#2E3D83] rounded-sm">
            <div 
              className="bg-[#4658AC] text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <h3 className="font-semibold">Filter By</h3>
              <span className="text-xl">{filtersOpen ? '−' : '+'}</span>
            </div>
            {filtersOpen && (
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Any Car Type..."
                  value={filters.carType}
                  onChange={(e) => handleFilterChange("carType", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <Input
                  placeholder="Any Color..."
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <AutocompleteInput
                  placeholder="Any Make..."
                  value={filters.make}
                  onChange={(value) => handleFilterChange("make", value)}
                  suggestions={filterOptions?.makes || []}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <AutocompleteInput
                  placeholder="Any Model..."
                  value={filters.model}
                  onChange={(value) => handleFilterChange("model", value)}
                  suggestions={filterOptions?.models || []}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <Input
                  placeholder="Search style..."
                  value={filters.style}
                  onChange={(e) => handleFilterChange("style", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <div className="space-y-3">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={1}
                    onValueChange={handlePriceChange}
                  />
                  <Button
                    className="w-full bg-[#F4C23D] hover:bg-yellow-900 text-black font-semibold rounded-none"
                    onClick={applyFilters}
                  >
                    Filter
                  </Button>
                  <div className="text-right text-sm text-white">
                    Price: ${(filters.minPrice / 1000).toFixed(0)}K - $
                    {(filters.maxPrice / 1000).toFixed(0)}K
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Auction Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-[#2E3D83] text-white p-4 rounded-sm flex items-center justify-between mb-6">
              <span className="text-sm">
                Showing {startIndex + 1}-
                {Math.min(startIndex + CARS_PER_PAGE, sortedCars.length)} of{" "}
                {sortedCars.length} Results
              </span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-black px-3 py-1 rounded text-sm"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
            </div>

            <div className="space-y-6">
              {displayCars.map((car: any) => {
                const statusAllowed =
                  car.status &&
                  ["trending", "Sold"].includes(String(car.status))
                    ? (car.status as "trending" | "Sold")
                    : null;
                return (
                  <AuctionListingCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    image={car.image}
                    price={car.price}
                    totalBids={car.totalBids}
                    timeLeft={car.timeLeft}
                    endTime={car.endTime}
                    rating={car.rating}
                    description={car.description}
                    status={statusAllowed}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-[#F7F7FA]"
              >
                <ArrowLeft />
              </Button>
              {renderPagination()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="bg-[#F7F7FA]"
              >
                <ArrowRight />
              </Button>
            </div>
          </div>

          {/* Desktop Filters - Right sidebar on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="py-0 bg-[#2E3D83] rounded-sm">
              <div className="bg-[#4658AC] text-white p-4 rounded-t-lg">
                <h3 className="font-semibold">Filter By</h3>
              </div>
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Any Car Type..."
                  value={filters.carType}
                  onChange={(e) => handleFilterChange("carType", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <Input
                  placeholder="Any Color..."
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <AutocompleteInput
                  placeholder="Any Make..."
                  value={filters.make}
                  onChange={(value) => handleFilterChange("make", value)}
                  suggestions={filterOptions?.makes || []}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <AutocompleteInput
                  placeholder="Any Model..."
                  value={filters.model}
                  onChange={(value) => handleFilterChange("model", value)}
                  suggestions={filterOptions?.models || []}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <Input
                  placeholder="Search style..."
                  value={filters.style}
                  onChange={(e) => handleFilterChange("style", e.target.value)}
                  className="border border-[#828BB5] text-[#BABABA] rounded-sm"
                />
                <div className="space-y-3">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={1}
                    onValueChange={handlePriceChange}
                    color="#F4C23D"
                  />
                  <Button
                    className="w-full bg-[#F4C23D] hover:bg-yellow-900 text-black font-semibold rounded-none"
                    onClick={applyFilters}
                  >
                    Filter
                  </Button>
                  <div className="text-right text-sm text-white">
                    Price: ${(filters.minPrice / 1000).toFixed(0)}K - $
                    {(filters.maxPrice / 1000).toFixed(0)}K
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
