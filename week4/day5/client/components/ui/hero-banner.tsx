"use client";

interface HeroBannerProps {
  title: string;
  description: string;
  backgroundImage: string;
  onPlay?: () => void;
  onWatchlist?: () => void;
}

export function HeroBanner({ 
  title, 
  description, 
  backgroundImage,
  onPlay,
  onWatchlist 
}: HeroBannerProps) {
  return (
    <div className="relative h-[60vh] overflow-hidden rounded-xl mb-12">
      <img
        src={backgroundImage}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-8 left-8 max-w-2xl">
        <h1 className="text-white text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 text-base mb-6 leading-relaxed">{description}</p>
        <div className="flex gap-4">
          <button
            onClick={onPlay}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          <button
            onClick={onWatchlist}
            className="bg-[#262626] hover:bg-[#333] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            + Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}