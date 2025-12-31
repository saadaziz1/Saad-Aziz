import { Skeleton } from "@/components/ui/skeleton";

export function AuctionDetailSkeleton() {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Image Gallery Skeleton */}
                <div className="mb-10">
                    <Skeleton className="w-full h-96 mb-4" />
                    <div className="flex gap-2">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="w-20 h-20" />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="space-y-6 w-full lg:w-3/4">
                        {/* Auction Info Section */}
                        <div className="bg-[#F1F2FF] px-5 py-2.5 rounded-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6">
                            <Skeleton className="h-8 w-48 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-4/6 mb-6" />

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex justify-between">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bidding Interface */}
                    <div className="w-full lg:w-1/4">
                        <Skeleton className="w-full h-96 mb-5" />
                        <Skeleton className="w-full h-64" />
                    </div>
                </div>
            </div>
        </div>
    );
}
