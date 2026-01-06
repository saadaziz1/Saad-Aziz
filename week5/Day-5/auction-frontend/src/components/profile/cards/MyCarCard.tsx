"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useSocketContext } from "@/providers/SocketProvider";
import type { Car } from "@/types/api";
import { formatPrice } from "@/lib/auctionUtils";

interface MyCarCardProps {
  car: Car;
  onEndAuction?: (carId: string) => void;
}

export function MyCarCard({ car, onEndAuction }: MyCarCardProps) {
  const timeLeft = useCountdownTimer(car.endTime);
  const { currentBids } = useSocketContext();

  const realtimePrice =
    currentBids[car._id]?.amount ||
    car.currentPrice ||
    car.startingPrice ||
    0;
  const realTimeBidCount =
    currentBids[car._id]?.count || car.bids?.length || 0;

  const handleEndAuction = () => {
    onEndAuction?.(car._id);
    console.log("End auction for:", car._id);
  };

  return (
    <Card className="bg-white py-0 rounded-sm max-h-[400px] overflow-hidden">
      <div className="relative">
        <h3 className="py-5 border-b text-center font-semibold text-lg mt-2 z-10 text-[#2E3D83]">
          {car.title}
        </h3>

        {timeLeft.isEnded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              SOLD
            </span>
          </div>
        )}

        <div className="h-40 w-full overflow-hidden flex items-center justify-center">
          <img
            src={car.photos?.[0] || "/placeholder.svg"}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-2.5 pt-0">
        <div className="flex bg-[#F1F2FF] rounded-sm p-3 items-center justify-between mb-4">
          <div className="text-sm">
            <p className="font-bold text-[#2E3D83]">{formatPrice(realtimePrice)}</p>
            <p className="text-xs text-[#939393]">Winning Bid</p>
          </div>
          <div className="text-sm text-right">
            <p className="font-bold text-[#2E3D83]">{realTimeBidCount}</p>
            <p className="text-xs text-[#939393]">Total Bids</p>
          </div>
        </div>

        <Button
          onClick={handleEndAuction}
          disabled={timeLeft.isEnded}
          className={`w-full ${timeLeft.isEnded
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2E3D83] hover:bg-[#3A4FAF]"
            } text-white py-5`}
        >
          {timeLeft.isEnded ? "Sold" : "End Bid"}
        </Button>
      </div>
    </Card>
  );
}
