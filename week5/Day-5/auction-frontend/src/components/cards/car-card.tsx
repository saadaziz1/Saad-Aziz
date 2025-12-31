import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/stores/authStore"
import { useAuctionTimer } from "@/hooks/useAuctionTimer"
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist"


export interface CarCardProps {
  id: string
  name: string
  image: string
  price: string
  currentBid: string
  timeRemaining: string
  endTime?: string
  status: "trending" | "Sold" 
  rating: number
  description?: string
  endType: string
}

export interface AuctionListingProps extends CarCardProps {
  year: number
  mileage: string
  fuelType: string
  transmission: string
  location: string
}

export function CarCard({ id, name, image, price, currentBid, timeRemaining, endTime, status, rating }: CarCardProps) {
   const liveTimeRemaining = useAuctionTimer(endTime || null);
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  
  const isInWishlist = wishlist?.carIds?.some(car => 
    typeof car === 'string' ? car === id : car._id === id
  ) || false;
  
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
   
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
    <Card className=" bg-white py-0 max-h-[400px] overflow-hidden">
      <div className="relative">
        <h3 className="py-5.5 border-b text-center font-semibold text-lg mt-2 z-5">{name}</h3>

        {status && (
          <Badge
            className={`absolute top-0 left-0 z-10 rounded-xs  ${
              status === "trending" ? "bg-[#EF233C]" : status === "Sold" ? "bg-[#EAECF3] text-[#2E3D83]" : "bg-green-500"
            }`}
          >
            {status}
          </Badge>
        )}
        <div className="rounded-full absolute -top-6 -right-6 shadow-md w-16.5 h-16.5 z-10">
          <Star 
            className={`relative top-8 -right-3 z-10 w-5 h-5 cursor-pointer transition-colors ${
              isInWishlist ? 'fill-yellow-400 text-yellow-400' : 'text-[#2E3D83] hover:text-red-500'
            }`}
            onClick={handleWishlistToggle}
          />
        </div>
<div className="h-39 w-full overflow-hidden flex items-center justify-center">
  <img
    src={image || "/placeholder.svg"}
    alt={name}
    className="w-full h-full object-cover"
  />
</div>
      </div>

      <div className="p-5.5 pt-0">
        
       

        <div className="flex items-center justify-between space-y-2 mb-4">
          <div className=" text-sm">
            <p className="font-bold">{currentBid}</p>

            <p >Current Bid</p>
          </div>
          <div className=" text-sm text-right">
            <p className="font-bold">{liveTimeRemaining}</p>

            {liveTimeRemaining !== "Auction Ended" && <p >Time Remaining</p>}
          </div>
        </div>

        <Link href={`/auction/${id}`}>
          <Button className={liveTimeRemaining === "Auction Ended" ? "w-full bg-gray-400 py-5 hover:bg-[#3A4FAF] cursor-pointer " : "  w-full bg-[#2E3D83] py-5 hover:bg-[#3A4FAF] cursor-pointer "}>{liveTimeRemaining === "Auction Ended" ? "Sold" : "Submit A Bid"}</Button>
        </Link>
      </div>
    </Card>
  )
}
