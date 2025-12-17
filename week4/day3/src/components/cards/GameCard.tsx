interface GameCardProps {
  image: string | { src: string };
  title: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
}

export function GameCard({ image, title, originalPrice, discountPrice, discount }: GameCardProps) {
  return (
    <div className="flex flex-col gap-2.5 group cursor-pointer">
      <div className="relative rounded overflow-hidden aspect-[3/4]">
        <img 
          src={typeof image === 'string' ? image : image.src} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[#f5f5f5] truncate">{title}</p>
        <div className="flex items-center gap-2">
          <span className="bg-[#0074e4] text-white text-sm px-2 py-0.5 rounded">
            {discount}
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[rgba(245,245,245,0.6)] line-through">
              {originalPrice}
            </span>
            <span className="text-[#f5f5f5]">{discountPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
