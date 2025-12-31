import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CarCardSkeleton() {
    return (
        <Card className="bg-white py-0 max-h-[400px] overflow-hidden">
            <div className="relative">
                <Skeleton className="h-6 w-3/4 mx-auto my-6" />
                <div className="h-39 w-full">
                    <Skeleton className="w-full h-full" />
                </div>
            </div>

            <div className="p-5.5 pt-0">
                <div className="flex items-center justify-between space-y-2 mb-4">
                    <div className="text-sm">
                        <Skeleton className="h-5 w-20 mb-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="text-sm text-right">
                        <Skeleton className="h-5 w-20 mb-2" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>

                <Skeleton className="w-full h-12" />
            </div>
        </Card>
    );
}
