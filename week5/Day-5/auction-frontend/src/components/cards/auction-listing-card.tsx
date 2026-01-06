import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";

export interface AuctionListingCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  totalBids: number;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  endTime: string;
  rating: number;
  description: string;
  status?: "trending" | "Sold" | null;
  stacked?: boolean;
  ownerId?: string;
}

export function AuctionListingCard({
  id,
  name,
  image,
  price,
  totalBids,
  timeLeft,
  endTime,
  rating,
  description,
  status,
  stacked = false,
  ownerId,
}: AuctionListingCardProps) {
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isOwner = !!(user && ownerId && (String(user._id) === String(ownerId) || String((user as any).id) === String(ownerId) || String((user as any).sub) === String(ownerId)));
  const sold = useCountdownTimer(endTime);

  if (sold.isEnded) {
    status = "Sold";
  }

  const isInWishlist = wishlist?.carIds?.some(car =>
    typeof car === 'string' ? car === id : car._id === id
  ) || false;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync(id);
      } else {
        await addToWishlistMutation.mutateAsync(id);
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };
  return (
    <Card className="relative bg-white border py-0 border-gray-200 rounded-md overflow-hidden">
      {/* Out of flow */}
      {status && (
        <Badge
          className={`absolute top-0 left-0 z-10 rounded-xs  ${status === "trending" ? "bg-[#EF233C]" : status === "Sold" ? "bg-[#EAECF3] text-[#2E3D83]" : "bg-green-500"
            }`}
        >
          {status}
        </Badge>
      )}

      <div className="absolute -top-3 -right-3 z-10 rounded-full w-14.5 h-14.5 bg-[#EAECF3]">
        <Star
          className={`relative top-5 left-4 w-5 h-5 cursor-pointer transition-colors ${isInWishlist ? 'fill-yellow-400 text-yellow-400' : 'text-[#2E3D83]'
            }`}
          onClick={handleWishlistToggle}
        />
      </div>

      {/* MAIN ROW */}
      <div className={stacked ? "flex flex-col" : "flex flex-col md:flex-row"}>
        {/* COLUMN 1 — IMAGE */}
        {stacked && <h3 className="text-md text-center pt-10 pb-2  font-bold text-[#2E3D83]">{name}</h3>}

        <div className={stacked ? "w-full h-39 relative overflow-hidden shrink-0" : "w-full md:w-1/4 h-39 md:h-auto relative overflow-hidden shrink-0"}>
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* COLUMN 2 — DETAILS */}
        <div className={stacked ? "w-full p-4 flex flex-col" : "w-full md:w-1/4 p-4 flex flex-col"}>
          {!stacked && <h3 className="text-lg md:text-xl font-bold text-[#2E3D83]">{name}</h3>}

          {/* Yellow underline */}
          {!stacked && <div className="w-18 h-[4px] bg-[#F4C23D] my-2.5" />}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? "fill-[#F4C23D] text-[#F4C23D]" : "text-gray-300"
                  }`}
              />
            ))}
          </div>

          <p className="text-sm text-[#939393]">
            {description}
            <Link
              href={`/auction/${id}`}
              className="text-[#2E3D83] text-xs font-semibold ml-1 hover:underline"
            >
              View Details
            </Link>
          </p>
        </div>

        {/* COLUMN 3 — CURRENT BID + TIME LEFT */}
        <div className={stacked ? "w-full" : "w-full md:w-2/4"}>
          <div className={"flex flex-row"}>
            <div className={stacked ? "w-full px-4  py-0 flex flex-col justify-center" : "w-full md:w-1/2 px-4 py-0 md:py-4 flex flex-col justify-center"}>
              <div className={stacked ? "text-xs font-bold text-[#2E3D83]" : "text-xs md:text-sm font-bold text-[#2E3D83]"}>{price}</div>
              <div className="text-xs text-[#939393] mb-3">Current Bid</div>

              <div className="flex justify-start">
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1 font-bold text-[#2E3D83]">
                  <div className={stacked ? "text-[8px]" : " text-[8px] md:text-[10px] "}>{timeLeft.days}</div>
                  <div className={stacked ? "text-[6px]" : "text-[6px] md:text-[8px] font-medium text-[#939393]"}>Days</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1 font-bold text-[#2E3D83]">
                  <div className={stacked ? "text-[8px]" : "text-[8px] md:text-[10px]  "}>{timeLeft.hours}</div>
                  <div className={stacked ? "text-[6px]" : "text-[6px] md:text-[8px] font-medium text-[#939393]"}>Hours</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1 font-bold text-[#2E3D83]">
                  <div className={stacked ? "text-[8px]" : "text-[8px] md:text-[10px]  "}>{timeLeft.minutes}</div>
                  <div className={stacked ? "text-[6px]" : "text-[6px] md:text-[8px] font-medium text-[#939393]"}>Mins</div>
                </div>
                <div className="text-center bg-white border border-[#2E3D83] rounded-sm mr-2 p-1 font-bold text-[#2E3D83]">
                  <div className={stacked ? "text-[8px]" : "text-[8px] md:text-[10px]  "}>{timeLeft.seconds}</div>
                  <div className={stacked ? "text-[6px]" : "text-[6px] md:text-[8px] font-medium text-[#939393]"}>Secs</div>
                </div>
              </div>
              <div className="text-xs text-[#939393] ">Time Left</div>
            </div>

            {/* COLUMN 4 — TOTAL BIDS + END TIME */}
            <div className={stacked ? "w-full px-4 py-0 pt-2 flex flex-col justify-center" : "w-full md:w-1/2 px-4 py-0 pt-2 md:py-4 md:pt-0 flex flex-col justify-center"}>
              <div className={stacked ? "text-xs font-bold text-[#2E3D83]" : "text-xs md:text-sm font-bold text-[#2E3D83]"}>
                {totalBids}
              </div>
              <div className="text-xs text-[#939393] mb-3">Total Bids</div>

              <div className={stacked ? "text-xs font-bold text-[#2E3D83]" : "text-xs md:text-sm font-bold text-[#2E3D83]"}>
                {endTime
                  ? new Date(endTime)
                    .toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(",", "")
                  : "06:00pm 03 Jan 2023"}
              </div>
              <div className="text-xs text-[#939393]">End Time</div>
            </div>
          </div>

          <div className={stacked ? "m-4" : "m-4 md:m-5"}>
            <Link href={`/auction/${id}`}>
              <Button
                variant="outline"
                disabled={isOwner && !sold.isEnded}
                className={stacked
                  ? "w-full text-sm font-bold py-3 border-[#2E3D83] text-[#2E3D83]"
                  : "w-full text-sm md:text-base font-bold py-4 md:py-6 border-[#2E3D83] text-[#2E3D83]"}
              >
                {sold.isEnded ? "Sold" : isOwner ? "Your Auction" : "Submit A Bid"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
