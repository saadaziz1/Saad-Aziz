"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useSocketContext } from "@/providers/SocketProvider";
import type { Car } from "@/types/api";
import { formatPrice } from "@/lib/auctionUtils";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

interface MyBidCardProps {
  car: Car;
  userBids: Array<{ amount: number; bidderId: string; auctionId: string }>;
  onPlaceBid?: (car: Car) => void;
}

export function MyBidCard({ car, userBids, onPlaceBid }: MyBidCardProps) {
  const timeLeft = useCountdownTimer(car.endTime);
  const { currentBids } = useSocketContext();
  const user = useAuthStore((state) => state.user);

  const realtimePrice =
    currentBids[car._id]?.amount ||
    car.currentPrice ||
    car.startingPrice ||
    0;

  const myHighestBid =
    userBids.length > 0 ? Math.max(...userBids.map((b) => b.amount)) : 0;
  const isWinning = myHighestBid >= realtimePrice;
  const realTimeBidCount =
    currentBids[car._id]?.count || car.bids?.length || 0;

  const isOwner = !!(user && car.sellerId && (String(user._id) === String(car.sellerId) || String((user as any).id) === String(car.sellerId) || String((user as any).sub) === String(car.sellerId)));

  return (
    <Card className="bg-white py-0 overflow-hidden">
      <div className="relative">
        <h3 className="py-5.5 border-b text-center font-semibold text-lg mt-2 z-5 text-[#2E3D83]">
          {car.title}
        </h3>

        {timeLeft.isEnded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              SOLD
            </span>
          </div>
        )}

        <div className="h-39 w-full overflow-hidden flex items-center justify-center">
          <img
            src={car.photos?.[0] || "/placeholder.svg"}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-2.5 pt-0">
        <div className="flex items-center justify-between space-y-2 mb-2">
          <div className="text-sm bg-[#F1F2FF] rounded-sm p-3">
            <p className="font-bold text-[#2E3D83]">{formatPrice(realtimePrice)}</p>
            <p className="text-xs text-[#939393]">Winning Bid</p>
          </div>
          <div
            className={`text-sm rounded-sm p-3 text-right ${isWinning ? "bg-[#E8FFEC] text-[#01DB0A]" : "bg-[#FEE0E0] text-[#FF451D]"
              }`}
          >
            <p className="font-bold">{formatPrice(myHighestBid)}</p>
            <p className="text-xs text-[#939393]">Your Bid</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-xs">
            <div className="flex justify-start">
              <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                <div className="text-[8px] font-bold text-[#2E3D83]">{timeLeft.days}</div>
                <div className="text-[6px] font-medium text-[#939393]">Days</div>
              </div>
              <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                <div className="text-[8px] font-bold text-[#2E3D83]">{timeLeft.hours}</div>
                <div className="text-[6px] font-medium text-[#939393]">Hours</div>
              </div>
              <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                <div className="text-[8px] font-bold text-[#2E3D83]">{timeLeft.minutes}</div>
                <div className="text-[6px] font-medium text-[#939393]">Mins</div>
              </div>
              <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1">
                <div className="text-[8px] font-bold text-[#2E3D83]">{timeLeft.seconds}</div>
                <div className="text-[6px] font-medium text-[#939393]">Secs</div>
              </div>
            </div>
            <p className="text-[#939393]">Time Left</p>
          </div>
          <div className="text-xs text-right">
            <p className="font-bold text-[#2E3D83]">{realTimeBidCount}</p>
            <p className="text-[#939393]">total bid count</p>
          </div>
        </div>
        <Link href={`/auction/${car._id}`}>
          <Button
            variant="outline"
            disabled={isOwner && !timeLeft.isEnded}
            className="w-full text-sm font-bold py-3 border-[#2E3D83] text-[#2E3D83]"
          >
            {timeLeft.isEnded ? "Sold" : isOwner ? "Your Auction" : "Submit A Bid"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
