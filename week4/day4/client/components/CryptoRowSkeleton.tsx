'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const CryptoRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-12 sm:hidden" />
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-12" />
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-8 w-16" />
      </TableCell>
    </TableRow>
  );
};

export default CryptoRowSkeleton;