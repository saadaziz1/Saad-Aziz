interface HeroSideCardProps {
  image: string;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function HeroSideCard({ image, title, isActive = false, onClick }: HeroSideCardProps) {
  return (
    <div 
      className={`w-[256px] rounded-2xl px-4 py-3 flex gap-4 items-center transition-colors cursor-pointer ${
        isActive ? 'bg-[#252525]' : 'hover:bg-[#252525]'
      }`}
      onClick={onClick}
    >
      <div className="w-[60px] h-[80px] rounded overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-normal text-base truncate">{title}</h3>
    </div>
  );
}