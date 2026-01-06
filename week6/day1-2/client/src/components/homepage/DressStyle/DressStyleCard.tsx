"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useFilterStore } from "@/store/useFilterStore";

type DressStyleCardProps = {
  title: string;
  url: string;
  className?: string;
};

const DressStyleCard = ({ title, url, className }: DressStyleCardProps) => {
  const setStyle = useFilterStore((state) => state.setStyle);

  return (
    <Link
      href={url}
      onClick={() => setStyle(title.toLowerCase())}
      className={cn([
        "w-full md:h-full rounded-[20px] bg-white bg-top text-2xl md:text-4xl font-bold text-left py-4 md:py-[25px] px-6 md:px-9 bg-no-repeat bg-cover flex items-start justify-start hover:scale-[1.02] transition-transform",
        className,
      ])}
    >
      {title}
    </Link>
  );
};

export default DressStyleCard;
