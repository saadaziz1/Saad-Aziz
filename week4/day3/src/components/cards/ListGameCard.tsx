interface ListGameCardProps {
  image: { src: string };
  title: string;
  price: string;
}

export function ListGameCard({ image, title, price }: ListGameCardProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <img 
        src={image.src} 
        alt={title} 
        className="h-[80px] w-[80px] rounded-[4px] object-cover flex-shrink-0"
      />
      <div className="font-['Poppins'] flex-1 min-w-0">
        <p className="text-[#f5f5f5] text-[14px] truncate">{title}</p>
        <p className="text-white text-[12px] mt-1">{price}</p>
      </div>
    </div>
  );
}