

"use client";

import { Button } from './Button';

interface SectionHeaderProps {
  title: string;
  showViewMore?: boolean;
}

export function SectionHeader({ title, showViewMore = false }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-white text-lg md:text-xl">{title}</h2>
      {showViewMore && (
        <Button variant="outline" size="sm">
          view more
        </Button>
      )}
    </div>
  );
}