interface FeaturedGameCardProps {
  image: { src: string };
  title: string;
  description: string;
  price: string;
}

export function FeaturedGameCard({ image, title, description, price }: FeaturedGameCardProps) {
  return (
    <div className="flex-shrink-0 w-full md:w-[calc(33.33%-0.67rem)] min-w-[280px]">
      <div className="relative rounded-[20px] overflow-hidden h-[200px] group cursor-pointer">
        <img 
          src={image.src} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      </div>
      <div className="mt-4 text-white">
        <h3 className="text-base mb-2">{title}</h3>
        <p className="text-sm text-[rgba(255,255,255,0.6)] mb-3 line-clamp-2">
          {description}
        </p>
        <p className="text-base">{price}</p>
      </div>
    </div>
  );
}