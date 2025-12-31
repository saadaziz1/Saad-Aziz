import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function AuctionListingCardSkeleton() {
    return (
        <Card className="relative bg-white border py-0 border-gray-200 rounded-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Image skeleton */}
                <div className="w-full md:w-1/4 h-64 md:h-auto md:min-h-full relative overflow-hidden shrink-0">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                </div>

                {/* Details skeleton */}
                <div className="w-full md:w-1/4 p-4 flex flex-col">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="w-18 h-[4px] my-2.5" />

                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="w-3.5 h-3.5 rounded-full" />
                        ))}
                    </div>

                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Bid info skeleton */}
                <div className="w-full md:w-2/4">
                    <div className="flex flex-row">
                        <div className="w-full md:w-1/2 px-4 py-0 md:py-4 flex flex-col justify-center">
                            <Skeleton className="h-5 w-20 mb-3" />
                            <Skeleton className="h-4 w-16 mb-3" />

                            <div className="flex justify-start gap-2 mb-2">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="w-10 h-12" />
                                ))}
                            </div>
                            <Skeleton className="h-3 w-16" />
                        </div>

                        <div className="w-full md:w-1/2 px-4 py-0 pt-2 md:py-4 md:pt-0 flex flex-col justify-center">
                            <Skeleton className="h-5 w-12 mb-3" />
                            <Skeleton className="h-4 w-20 mb-3" />
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    <div className="m-4 md:m-5">
                        <Skeleton className="w-full h-12" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
