"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { formatTimeRemaining, formatPrice } from "@/lib/auctionUtils";
import { useCreateBid } from "@/hooks/useBids";
import { useAuthStore } from "@/stores/authStore";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BiddingInterfaceProps {
  currentBid: string;
  timeRemaining: string;
  totalBids: number;
  isLive?: boolean;
  isEnded?: boolean;
  isWinner?: boolean;
  onMakePayment?: () => void;
  ownerId?: string;
}

export function BiddingInterface({
  currentBid,
  timeRemaining,
  totalBids,
  isLive,
  isEnded,
  isWinner,
  onMakePayment,
  ownerId,
}: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState<number[]>([0]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [currentBidAmount, setCurrentBidAmount] = useState(currentBid);
  const [totalBidCount, setTotalBidCount] = useState(totalBids);
  const [minBid, setMinBid] = useState(0);
  const [maxBid, setMaxBid] = useState(100000);
  const router = useRouter();
  const params = useParams();
  const auctionId = params?.id as string;
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const createBidMutation = useCreateBid();

  // Update local state when props change (from parent's socket updates)
  useEffect(() => {
    console.log(`📊 BiddingInterface: Props updated - currentBid: ${currentBid}, totalBids: ${totalBids}`);
    if (currentBid && currentBid !== "0" && currentBid !== "$0") {
      setCurrentBidAmount(currentBid);
      const currentValue = getCurrentBidValue();
      setMinBid(currentValue);
      setMaxBid(Math.max(currentValue * 2, 100000));
      setBidAmount([currentValue + 1000]); // Set initial slider value slightly above current bid
    }
    // Always update totalBidCount to match props
    setTotalBidCount(totalBids);
  }, [currentBid, totalBids]);

  // Update time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatTimeRemaining(timeRemaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Parse currentBid to number (remove non-numeric chars)
  const getCurrentBidValue = () => {
    const num = Number(String(currentBidAmount).replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const handleSliderChange = (value: number[]) => {
    setBidAmount(value);
    setError("");
  };

  const STEP = 1000;

  const increaseBid = () => {
    setBidAmount((prev) => {
      const next = Math.min(prev[0] + STEP, maxBid);
      return [next];
    });
    setError("");
  };

  const decreaseBid = () => {
    setBidAmount((prev) => {
      const next = Math.max(prev[0] - STEP, minBid + STEP);
      return [next];
    });
    setError("");
  };

  const isOwner = !!(user && ownerId && (String(user._id) === String(ownerId) || String((user as any).id) === String(ownerId) || String((user as any).sub) === String(ownerId)));

  useEffect(() => {
    if (user && ownerId) {
      console.log('🧐 Owner Check:', {
        userId: user?._id || (user as any)?.id || (user as any)?.sub,
        ownerId,
        isOwner
      });
    }
  }, [user, ownerId, isOwner]);

  const handleSubmit = async () => {


    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      router.push('/login');
      return;
    }

    if (isOwner) {
      toast.error("You cannot bid on your own auction");
      return;
    }

    if (!bidAmount[0] || bidAmount[0] <= 0) {
      toast.error("Please select a bid amount");
      return;
    }

    if (!auctionId) {
      toast.error("Auction ID is missing");
      return;
    }

    const userId = user?._id || (user as any)?.id;
    if (!userId) {
      toast.error("User information is missing");
      return;
    }

    const bidNum = bidAmount[0];
    const minBidValue = getCurrentBidValue();

    if (bidNum <= minBidValue) {
      setError(`Bid must be higher than ${currentBidAmount}`);
      return;
    }

    console.log('Submitting bid:', { auctionId, bidderId: userId, amount: bidNum });

    try {
      await createBidMutation.mutateAsync({
        auctionId: auctionId,
        bidderId: userId,
        amount: bidNum
      });

      setBidAmount([minBid + 1000]);
      setError("");
      toast.success("Bid placed successfully!");

    } catch (error: any) {
      console.error('Bid creation error:', error.response?.data || error.message);

      let message = "Failed to place bid";
      if (error.response?.data?.message) {
        message = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      setError(message);
      toast.error(message);
    }
  };

  return (
    <Card className={cn("relative overflow-hidden bg-[#F1F2FF] rounded-sm p-5", isEnded && "p-2 bg-white")}>
      {isOwner && !isEnded && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] cursor-not-allowed flex items-center justify-center p-6 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-[#2E3D83] font-bold text-sm">Owner View</p>
            <p className="text-[#939393] text-xs mt-1">You cannot bid on your own auction</p>
          </div>
        </div>
      )}
      <div className={cn(isOwner && !isEnded && "opacity-50 grayscale-[0.5]")}>
        {!isEnded && <div className="flex justify-between items-center mb-8">
          <div className="">
            <div className="text-sm font-bold text-[#2E3D83] mb-1">{currentBidAmount}</div>
            <div className="text-sm text-[#939393] ">Bid Starts from</div>
          </div>
          <div className="">
            <div className="text-sm font-bold text-[#2E3D83] mb-1">{currentBidAmount}</div>
            <div className="text-sm text-[#939393] ">Current Bid</div>
          </div>



        </div>}

        {isEnded ? (
          <div className=" flex flex-col gap-8 mb-6">
            <p className="text-xs text-[#939393]">
              Note: <span className="text-red-500 font-bold">Please make your payment in next 6 Days</span>
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-yellow-500">{currentBidAmount}</p>
                <p className="text-xs text-[#939393]">{isWinner ? "Pending Payment" : "Winning Bid"}</p>

              </div>
              {isWinner && (
                <Button
                  className="text-[#2E3D83] border border-[#2E3D83]"
                  variant="outline"
                  onClick={onMakePayment}
                >Make Payment</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">


            <div className="space-y-6">
              <div className="space-y-4">

                <div className="px-2">
                  <Slider
                    value={bidAmount}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={maxBid}
                    step={100}
                    disabled={isOwner}
                    className="w-full accent-[#2E3D83]"
                  />
                </div>


                <div className=" flex items-center justify-between pr-5">
                  <div>
                    <span className="text-sm font-bold text-[#2E3D83] ">

                      {totalBidCount}
                    </span>
                    <p className="text-sm text-[#939393] ">Bid Placed</p>
                  </div>

                  <div className="flex items-center gap-2.5 max-w-32.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decreaseBid}
                      disabled={bidAmount[0] <= minBid + STEP || isOwner}
                      className="h-8 w-8 text-base font-bold text-[#2E3D83] border border-[#C6D8F9] rounded-sm"
                    >
                      −
                    </Button>

                    <span className=" bg-white text-center text-[10px] p-1.5 px-3 border border-[#F9C146] rounded-sm font-semibold text-[#2E3D83]">
                      {formatPrice(bidAmount[0] || 0)}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={increaseBid}
                      disabled={bidAmount[0] >= maxBid || isOwner}
                      className="h-8 w-8 text-base font-bold text-[#2E3D83] border border-[#C6D8F9] rounded-sm"
                    >
                      +
                    </Button>
                  </div>

                </div>
              </div>

              <Button
                className="w-full bg-[#2E3D83] hover:bg-[#3A4FAF] py-6 text-lg font-semibold rounded-lg transition-colors"
                onClick={handleSubmit}
                disabled={!bidAmount[0] || bidAmount[0] <= minBid || createBidMutation.isPending || isOwner}
              >
                {isOwner
                  ? "You cannot bid on your own auction"
                  : createBidMutation.isPending
                    ? "Placing Bid..."
                    : "Submit A Bid"}
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-3 text-center bg-red-50 p-3 rounded-lg">{error}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}
