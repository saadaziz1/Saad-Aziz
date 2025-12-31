"use client"

import { HeroSection } from "@/components/layout/hero-section"
import { ImageGallery } from "@/components/layout/image-gallery"
import { BiddingInterface } from "@/components/bidding/bidding-interface"
import { BidderList } from "@/components/bidding/bidder-list"
import { PaymentSteps } from "@/components/layout/payment-steps"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { useCar } from "@/hooks/useCars"
import { useBids } from "@/hooks/useBids"
import { useAuthStore } from "@/stores/authStore"
import { formatPrice, formatTimeRemaining } from "@/lib/auctionUtils"
import { useState, useEffect, useCallback } from "react"
import { useSocketContext } from "@/providers/SocketProvider"
import { Car } from "@/types/api"
import { toast } from "sonner"

export default function AuctionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const user = useAuthStore((state) => state.user)
  
  const { data: car, isLoading: carLoading, refetch: refetchCar } = useCar(id)
  const { data: bids, isLoading: bidsLoading, refetch: refetchBids } = useBids()
  
  // Real-time state for bid updates
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
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
    if (id && isConnected) {
      console.log(`🏠 AuctionDetail: Joining auction room ${id}`);
      joinAuction(id);
    }
  }, [id, isConnected, joinAuction]);
  
  // Update time countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      if (car) {
        const typedCar = car as Car;
        if (typedCar.endTime) {
          const now = new Date().getTime();
          const endTime = new Date(typedCar.endTime).getTime();
          const difference = endTime - now;
          
          if (difference > 0) {
            setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
          } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          }
        }
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [car]);
  // Handle socket updates
  useEffect(() => {
    if (currentBids[id]) {
      const socketData = currentBids[id];
      console.log(`📨 AuctionDetail: Socket update for ${id}:`, socketData);
      
      // Show notification for other users
      if (socketData.bidderId && socketData.bidderId !== user?._id) {
        toast.success(`New bid placed: ${formatPrice(socketData.amount)}`);
      }
      
      // Refresh database data for consistency
      refetchBids();
      refetchCar();
    }
  }, [currentBids, id, refetchBids, refetchCar, user]);
  
  if (carLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
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
  const isWinner = topBidder && user && (() => {
    const bidderId = typeof topBidder.bidderId === 'string' ? topBidder.bidderId : (topBidder.bidderId as any)?._id;
    return bidderId === user._id;
  })();
  const winningAmount = topBidder ? topBidder.amount : (typedCar.currentPrice || typedCar.startingPrice || 0)
  
  // Merge database bidders (no realtime state needed)
  const bidderMap = new Map();
  carBids.forEach(bid => {
    const bidderId = typeof bid.bidderId === 'string' ? bid.bidderId : (bid.bidderId as any)?._id;
    const bidderKey = bidderId?.slice(-4) || 'Unknown';
    
    if (!bidderMap.has(bidderKey) || bidderMap.get(bidderKey).amount < bid.amount) {
      bidderMap.set(bidderKey, {
        id: bid._id,
        name: bidderKey,
        amount: formatPrice(bid.amount),
        time: new Date(bid.placedAt).toLocaleTimeString(),
        avatar: "/placeholder-user.jpg"
      });
    }
  });
  
  const realBidders = Array.from(bidderMap.values())
    .sort((a, b) => parseFloat(b.amount.replace(/[^0-9.-]+/g, "")) - parseFloat(a.amount.replace(/[^0-9.-]+/g, "")));

  // Payment steps for winner
  const paymentSteps = [
    {
      date: new Date().toLocaleDateString(),
      time: "Immediate",
      amount: formatPrice(winningAmount),
      id: `${id}-payment`,
      status: "current" as const,
      label: "Payment Due",
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "2-3 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-processing`,
      status: "pending" as const,
      label: "Payment Processing",
    },
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "5-7 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-shipping`,
      status: "pending" as const,
      label: "Ready For Shipping",
    },
    {
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "10-14 Days",
      amount: formatPrice(winningAmount),
      id: `${id}-delivery`,
      status: "pending" as const,
      label: "Delivered",
    },
  ];

  const handleBidUpdate = () => {
    // Socket will handle the real-time updates
    // Just refresh data to ensure consistency
    setTimeout(() => {
      refetchBids();
      refetchCar();
    }, 500);
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
                  status={typedCar.isCompleted ? undefined : "trending"}
                />


          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            {/* Left Column - Image Gallery */}
            <div className=" space-y-6 w-full lg:w-3/4">

              {/* Auction Info Section */}
              <div className="bg-[#F1F2FF] px-5 py-2.5 rounded-sm">
                <div className="flex flex-col md:flex-row justify-center gap-2  md:justify-between items-start md:items-center">
                  {/* Time Left Section */}
                  <div >
                  <div className="flex ">
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.days}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Days</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.hours}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Hours</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.minutes}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Mins</div>
                    </div>
                    <div className="text-center bg-white rounded-sm mr-3 p-0.5">
                      <div className="text-[10px] font-bold text-[#2E3D83]">{timeLeft.seconds}</div>
                      <div className="text-[8px] font-medium text-[#939393]">Secs</div>
                    </div>
                   
                  </div>
                   <div >
                      <div className="text-[10px] text-[#939393]">Time Left</div>
                    </div>
                  </div>
                  
                  {/* Current Bid */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{displayCurrentPrice}</div>
                    <div className="text-[10px] text-[#939393]">Current Bid</div>
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
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">100</div>
                    <div className="text-[10px] text-[#939393]">Min. Increment</div>
                  </div>
                  
                  {/* Total Bids */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{displayBidCount}</div>
                    <div className="text-[10px] text-[#939393]">Total Bids</div>
                  </div>
                  
                  {/* Lot No */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">{typedCar._id?.slice(-6) || '379831'}</div>
                    <div className="text-[10px] text-[#939393]">Lot No.</div>
                  </div>
                  
                  {/* Odometer */}
                  <div >
                    <div className="text-sm font-bold text-[#2E3D83] mb-1.25">10,878 KM</div>
                    <div className="text-[10px] text-[#939393]">Odometer</div>
                  </div>
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

              {/* Payment Section for Winner */}
              {typedCar.isCompleted && isWinner && (
                <>
                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="bg-green-500 text-white mb-2">🎉 Congratulations! You Won!</Badge>
                        <p className="text-orange-800 font-medium">
                          Please make your payment within 6 days
                        </p>
                      </div>
                      <button 
                        className="bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white px-6 py-2 rounded-lg font-medium"
                        onClick={() => toast.success("Payment processing initiated!")}
                      >
                        Make Payment
                      </button>
                    </div>
                  </div>

                  <Card className="shadow-sm">
                    <div className="bg-[#4A5FBF] text-white p-4">
                      <h3 className="text-lg font-semibold">Winner Details</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src="/professional-headshot.png"
                          alt={user?.fullName || "Winner"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Full Name:</span>
                            <span className="ml-2 font-medium">{user?.fullName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2">{user?.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Winning Bid:</span>
                            <span className="ml-2 font-bold text-[#4A5FBF]">{formatPrice(winningAmount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Bids:</span>
                            <span className="ml-2">{displayBidCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <PaymentSteps steps={paymentSteps} />
                </>
              )}

              {/* Top Bidder for non-winners or ongoing auctions */}
              {(!typedCar.isCompleted || !isWinner) && topBidder && (
                <Card className="shadow-sm overflow-hidden py-0 rounded-sm bg-[#F1F2FF]">
                  <div className="bg-[#2E3D83] text-white p-4">
                    <h3 className="text-lg font-semibold">Top Bidder</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src="/professional-headshot.png"
                        alt="Top Bidder"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bidder ID:</span>
                            <span className="font-semibold">{(() => {
                              const bidderId = typeof topBidder.bidderId === 'string' ? topBidder.bidderId : (topBidder.bidderId as any)?._id;
                              return bidderId?.slice(-8) || 'Unknown';
                            })()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bid Amount:</span>
                            <span className="font-bold text-[#4A5FBF] text-lg">{displayCurrentPrice}</span>
                          </div>
                        </div>
                      </div>
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
                  timeRemaining={typedCar.endTime || new Date().toISOString()}
                  totalBids={displayBidCount}
                  isEnded={typedCar.isCompleted}
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
