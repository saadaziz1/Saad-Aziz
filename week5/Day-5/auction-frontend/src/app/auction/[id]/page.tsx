"use client"

import { HeroSection } from "@/components/layout/hero-section"
import { ImageGallery } from "@/components/layout/image-gallery"
import { BiddingInterface } from "@/components/bidding/bidding-interface"
import { BidderList } from "@/components/bidding/bidder-list"
import { PaymentSteps } from "@/components/layout/payment-steps"
import { AuctionDetailSkeleton } from "@/components/skeletons/AuctionDetailSkeleton"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { useCar } from "@/hooks/useCars"
import { useBids } from "@/hooks/useBids"
import { useAuthStore } from "@/stores/authStore"
import { formatPrice } from "@/lib/auctionUtils"
import { useState, useEffect, useCallback } from "react"
import { useCountdownTimer } from "@/hooks/useCountdownTimer"
import { useSocketContext } from "@/providers/SocketProvider"
import { Car, User } from "@/types/api"
import { toast } from "sonner"

export default function AuctionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const user = useAuthStore((state) => state.user)

  const { data: car, isLoading: carLoading, refetch: refetchCar } = useCar(id)
  const { data: bids, isLoading: bidsLoading, refetch: refetchBids } = useBids()

  // Real-time state for bid updates
  const timer = useCountdownTimer(car?.endTime || new Date());

  const { joinAuction: socketJoinAuction, currentBids, isConnected, initializeBidData } = useSocketContext();

  const joinAuction = useCallback((auctionId: string) => {
    socketJoinAuction(auctionId);
  }, [socketJoinAuction]);

  // Initialize socket data when both car and bids are loaded
  useEffect(() => {
    if (bids && car && !carLoading && !bidsLoading) {
      const typedCar = car as Car;
      const carBids = bids.filter(bid => bid.auctionId === typedCar._id);
      const bidCount = carBids.length;
      const currentPrice = carBids.length > 0 ?
        Math.max(...carBids.map(b => b.amount)) :
        (typedCar.currentPrice || typedCar.startingPrice || 0);

      initializeBidData(id, currentPrice, bidCount);
      console.log(`📊 AuctionDetail: Initialized bid data for ${id}:`, { price: currentPrice, count: bidCount, carBids: carBids.length });
    }
  }, [bids, car, id, initializeBidData, carLoading, bidsLoading]);

  // Join auction room (only once)
  useEffect(() => {
    if (isConnected && id) {
      console.log(`🏠 AuctionDetail: Joining room for ${id}`);
      joinAuction(id);
    }
  }, [isConnected, id, joinAuction]);

  // Handle socket updates
  useEffect(() => {
    const socketData = currentBids[id];
    if (socketData) {
      console.log(`📨 AuctionDetail: Socket update for ${id}:`, socketData);

      // Show notification for other users
      if (socketData.bidderId && socketData.bidderId !== user?._id) {
        toast.success(`New bid placed: ${formatPrice(socketData.amount)}`);
      }

      // Refresh database data for consistency
      refetchBids();
      refetchCar();
    }
  }, [currentBids[id], id, refetchBids, refetchCar, user?._id]);

  if (carLoading) {
    return (
      <>
        <HeroSection
          title="Auction Details"
          description="Loading auction information..."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
        />
        <AuctionDetailSkeleton />
      </>
    );
  }

  if (!car) {
    return <div className="flex justify-center items-center min-h-screen">Car not found</div>
  }

  // Filter bids for this car (using car._id as auctionId)
  const typedCar = car as Car;
  const carBids = bids?.filter(bid => {
    const auctionId = typeof bid.auctionId === 'string' ? bid.auctionId : (bid.auctionId as any)?._id;
    return auctionId === typedCar._id;
  }) || []

  // Calculate current values from database + socket updates
  const socketData = currentBids[id];
  const dbBidCount = carBids.length;
  const dbCurrentPrice = carBids.length > 0 ?
    Math.max(...carBids.map(b => b.amount)) :
    (typedCar.currentPrice || typedCar.startingPrice || 0);

  // Use socket data if available and higher than database data, otherwise use database data
  const displayBidCount = (socketData?.count && socketData.count > dbBidCount) ? socketData.count : dbBidCount;
  const displayCurrentPrice = formatPrice(socketData?.amount ?? dbCurrentPrice);
  const topBidder = carBids.length > 0 ? carBids.reduce((prev, current) =>
    (prev.amount > current.amount) ? prev : current
  ) : null

  // Check if current user is the winner
  const isAuctionEnded = typedCar.isCompleted || timer.isEnded;

  const userId = user?._id || user?.id || (user as any)?.sub;
  const isWinnerMatched = !!(topBidder && userId && (() => {
    const bidderRef = topBidder.bidderId;
    const bId = typeof bidderRef === 'string' ? bidderRef : (bidderRef as any)?._id || (bidderRef as any)?.id;
    const match = String(bId) === String(userId);
    return match;
  })());

  const isWinner = isAuctionEnded && isWinnerMatched;
  // Helper to get bidder info (handles both ID and populated User)
  const extractUser = (bidder: string | User | undefined) => {
    if (!bidder) return { name: 'Unknown', avatar: '/placeholder-user.jpg', id: '' };
    if (typeof bidder === 'string') return {
      name: `User ${bidder.slice(-4)}`,
      avatar: '/placeholder-user.jpg',
      id: bidder
    };
    const bId = bidder._id || (bidder as any).id || '';
    return {
      name: bidder.fullName || bidder.username || `User ${bId.slice(-4)}`,
      avatar: bidder.profilePicture || '/professional-headshot.png',
      id: bId,
      email: bidder.email,
      mobileNumber: bidder.mobileNumber,
      nationality: bidder.nationality,
      idType: bidder.idType
    };
  };

  // Merge database bidders (no realtime state needed)
  const bidderMap = new Map();
  carBids.forEach(bid => {
    const info = extractUser(bid.bidderId);
    const bidderKey = info.id || 'Unknown';

    if (!bidderMap.has(bidderKey) || bidderMap.get(bidderKey).rawAmount < bid.amount) {
      bidderMap.set(bidderKey, {
        id: bid._id,
        name: info.name,
        amount: formatPrice(bid.amount),
        rawAmount: bid.amount,
        time: new Date(bid.placedAt).toLocaleTimeString(),
        avatar: info.avatar
      });
    }
  });

  const realBidders = Array.from(bidderMap.values())
    .sort((a, b) => parseFloat(b.amount.replace(/[^0-9.-]+/g, "")) - parseFloat(a.amount.replace(/[^0-9.-]+/g, "")));

  // Shipping status logic
  const paymentDate = typedCar.endTime ? new Date(typedCar.endTime).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
  const deliveryDate = typedCar.endTime ? new Date(new Date(typedCar.endTime).getTime() + 2 * 1000).toLocaleDateString('en-GB') : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

  const getShippingStatus = () => {
    if (!isAuctionEnded) return "ready";
    // Ensure we use the latest endTime
    const end = typedCar.endTime ? new Date(typedCar.endTime).getTime() : Date.now();
    const timeSinceEnd = Date.now() - end;
    const ONE_SEC = 1 * 1000;
    const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
    if (timeSinceEnd > FIVE_DAYS) return "delivered";
    if (timeSinceEnd > ONE_SEC) return "transit";
    return "ready";
  }
  const shippingStatus = getShippingStatus() as "ready" | "transit" | "delivered";


  const handleBidUpdate = () => {
    // Socket will handle the real-time updates
    // Just refresh data to ensure consistency
    setTimeout(() => {
      refetchBids();
      refetchCar();
    }, 500);
  };

  const scrollToPayment = () => {
    const element = document.getElementById('payment-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeroSection
        title={typedCar.title}
        description={typedCar.description || "Car auction details"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
      />

      <div className=" min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ImageGallery
            mainImage={typedCar.photos?.[0] || "/placeholder.jpg"}
            thumbnails={typedCar.photos || ["/placeholder.jpg"]}
            title={typedCar.title}
            status={isAuctionEnded ? undefined : "trending"}
          />


          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            {/* Left Column - Image Gallery */}
            <div className=" space-y-6 w-full lg:w-3/4">

              {/* Auction Info Section */}
              <div className="bg-[#F1F2FF] px-5 py-2.5 rounded-sm">
                <div className="flex flex-col md:flex-row justify-center gap-2  md:justify-between items-start md:items-center">
                  {/* Time Left Section */}
                  {!isAuctionEnded && <div >
                    <div className="flex ">
                      <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                        <div className="text-[10px] font-bold text-[#2E3D83]">{timer.days}</div>
                        <div className="text-[8px] font-medium text-[#939393]">Days</div>
                      </div>
                      <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                        <div className="text-[10px] font-bold text-[#2E3D83]">{timer.hours}</div>
                        <div className="text-[8px] font-medium text-[#939393]">Hours</div>
                      </div>
                      <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                        <div className="text-[10px] font-bold text-[#2E3D83]">{timer.minutes}</div>
                        <div className="text-[8px] font-medium text-[#939393]">Mins</div>
                      </div>
                      <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                        <div className="text-[10px] font-bold text-[#2E3D83]">{timer.seconds}</div>
                        <div className="text-[8px] font-medium text-[#939393]">Secs</div>
                      </div>

                    </div>
                    <div >
                      <div className="text-[10px] text-[#939393]">Time Left</div>
                    </div>
                  </div>}

                  {/* Current Bid */}
                  <div >
                    <div className={isAuctionEnded ? 'text-sm font-bold text-green-500 mb-1.25' : 'text-sm font-bold text-[#2E3D83] mb-1.25'}>{displayCurrentPrice}</div>
                    <div className="text-[10px] text-[#939393]">{isAuctionEnded ? 'Winning Bid' : 'Current Bid'}</div>
                  </div>

                  {/* End Time */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">
                      {typedCar.endTime ?
                        new Date(typedCar.endTime).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }).replace(',', '') :
                        '06:00pm 03 Jan 2023'
                      }
                    </div>
                    <div className="text-[10px] text-[#939393]">End Time</div>
                  </div>

                  {/* Min Increment */}
                  {!isAuctionEnded && <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">100</div>
                    <div className="text-[10px] text-[#939393]">Min. Increment</div>
                  </div>}

                  {/* Total Bids */}
                  {!isAuctionEnded && <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{displayBidCount}</div>
                    <div className="text-[10px] text-[#939393]">Total Bids</div>
                  </div>}

                  {/* Lot No */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{typedCar._id?.slice(-6) || '379831'}</div>
                    <div className="text-[10px] text-[#939393]">Lot No.</div>
                  </div>

                  {/* Odometer */}
                  {!isAuctionEnded && <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">10,878 KM</div>
                    <div className="text-[10px] text-[#939393]">Odometer</div>
                  </div>}
                </div>
              </div>

              {/* Description */}
              <div className="">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#2E3D83] pb-2 border-b-4 border-yellow-400 inline-block">Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 mt-4">
                    {typedCar.description || "No description available for this vehicle."}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Make:</span>
                        <span className="font-semibold">{typedCar.make}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="font-semibold">{typedCar.model}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Year:</span>
                        <span className="font-semibold">{typedCar.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Body Type:</span>
                        <span className="font-semibold">{typedCar.bodyType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isAuctionEnded && (
                <>
                  {isWinner && (
                    <Card className="shadow-sm gap-0 rounded-sm py-0 overflow-hidden border-none text-[#2E3D83]">
                      <div className="bg-[#2E3D83] text-white p-4">
                        <h3 className="text-lg font-semibold">Winner</h3>
                      </div>
                      <div className="p-8  bg-[#F1F2FF]">
                        <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr] gap-10 items-center">
                          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-full aspect-square">
                            <img
                              src={user?.profilePicture || "/placeholder.svg"}
                              alt={user?.fullName || "Winner"}
                              className="w-full h-full object-cover border-4 border-white shadow-sm rounded-full"
                            />
                          </div>
                          <div className=" text-lg mx-2">
                            <div className="flex justify-between  items-center">
                              <span className="font-bold w-32 shrink-0">Full Name</span>
                              <span className="text-[#939393] text-right">{user?.fullName}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="font-bold w-32 shrink-0">Mobile Number</span>
                              <span className="text-[#939393] text-right ">{user?.mobileNumber || "1234567890"}</span>
                            </div>


                            <div className="flex justify-between  items-center">
                              <span className="font-bold w-32 shrink-0">ID Type</span>
                              <span className="text-[#939393] text-right">{user?.idType}</span>
                            </div>
                          </div>
                          <div className="text-lg mx-2">
                            <div className="flex justify-between  items-center">
                              <span className="font-bold w-32 shrink-0">Email</span>
                              <span className="text-[#939393] text-right">{user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold w-32 shrink-0">Nationality</span>
                              <span className="text-[#939393] text-right">{user?.nationality}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div id="payment-section">
                    <PaymentSteps
                      paymentDate={paymentDate}
                      deliveryDate={deliveryDate}
                      status={isWinner ? shippingStatus : "ended"}
                    />
                  </div>
                </>
              )}
              {/* Top Bidder for non-winners or ongoing auctions */}
              {(!isAuctionEnded || !isWinner) && topBidder && (
                <Card className="shadow-sm overflow-hidden gap-0 py-0 rounded-sm border-none text-[#2E3D83]">
                  <div className="bg-[#2E3D83] text-white p-4">
                    <h3 className="text-lg font-semibold">{isAuctionEnded ? "Winner" : "Top Bidder"}</h3>
                  </div>
                  <div className="p-8 bg-[#F1F2FF]">
                    <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr] gap-10 items-center">
                      {(() => {
                        const info = extractUser(topBidder?.bidderId);
                        return (
                          <>
                            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-full aspect-square">
                              <img
                                src={info.avatar}
                                alt={info.name}
                                className="w-full h-full object-cover border-4 border-white shadow-sm rounded-full"
                              />
                            </div>

                            <div className="text-lg mx-2">
                              <div className="flex justify-between text-left items-center">
                                <span className="font-bold w-32 shrink-0">Full Name</span>
                                <span className="text-[#939393]">{info.name}</span>
                              </div>
                              <div className="flex justify-between text-left items-center">
                                <span className="font-bold w-32 shrink-0">Mobile Number</span>
                                <span className="text-[#939393]">{info.mobileNumber || "N/A"}</span>
                              </div>
                              <div className="flex justify-between text-left items-center">
                                <span className="font-bold w-32 shrink-0">ID Type</span>
                                <span className="text-[#939393]">{info.idType || "N/A"}</span>
                              </div>
                              <div className="flex justify-between text-left items-center">
                                <span className="font-bold w-32 shrink-0">Bid Amount</span>
                                <span className="text-green-600 font-bold">{displayCurrentPrice}</span>
                              </div>
                            </div>
                            <div className="text-lg mx-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold w-32 shrink-0">Email</span>
                                <span className="text-[#939393] truncate">{info.email || " N/A"}</span>
                              </div>
                              <div className="flex justify-between text-left items-center">
                                <span className="font-bold w-32 shrink-0">Nationality</span>
                                <span className="text-[#939393]">{info.nationality || "N/A"}</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Bidder List */}
            <div className=" w-full lg:w-1/4">
              <div className="mb-5 shadow-sm">
                <BiddingInterface
                  currentBid={displayCurrentPrice}
                  timeRemaining={typedCar.endTime}
                  totalBids={displayBidCount}
                  isLive={isConnected}
                  isEnded={isAuctionEnded}
                  isWinner={isWinner}
                  onMakePayment={scrollToPayment}
                  ownerId={typeof typedCar.sellerId === 'string' ? typedCar.sellerId : (typedCar.sellerId as any)?._id || (typedCar.sellerId as any)?.id}
                />
              </div>

              <div>
                <BidderList
                  bidders={realBidders}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
