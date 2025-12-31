"use client";
import { AuctionListingCard } from "@/components/cards/auction-listing-card";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useSocketContext } from "@/providers/SocketProvider";
import type { Car } from "@/types/api";
import { formatPrice } from "@/lib/auctionUtils";

interface WishlistCardProps {
  car: Car;
}

export function WishlistCard({ car }: WishlistCardProps) {
  const tl = useCountdownTimer(car.endTime);
  const { currentBids } = useSocketContext();

  const timeLeft = {
    days: tl.days,
    hours: tl.hours,
    minutes: tl.minutes,
    seconds: tl.seconds,
  };

  const priceStr = formatPrice(
    currentBids[car._id]?.amount || car.currentPrice || car.startingPrice || 0
  );

  const rating = (car as any).rating || 4;

  const status = car.isCompleted
    ? null
    : tl.isEnded
    ? null
    : tl.days === 0 && tl.hours <= 24
    ? "ending"
    : "trending";

  return (
    <AuctionListingCard
      id={car._id}
      name={car.title}
      image={car.photos?.[0] || "/placeholder.svg"}
      price={priceStr}
      totalBids={currentBids[car._id]?.count || car.bids?.length || 0}
      timeLeft={timeLeft}
      endTime={car.endTime}
      rating={rating}
      description={car.description || ""}
      status={status as any}
      stacked={true}
    />
  );
}
