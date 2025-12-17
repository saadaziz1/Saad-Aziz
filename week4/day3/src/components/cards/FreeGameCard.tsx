interface FreeGameCardProps {
  image: { src: string };
  title: string;
  availability: string;
  status: string;
}

export function FreeGameCard({ image, title, availability, status }: FreeGameCardProps) {
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <div className="relative">
        <img 
          src={image.src} 
          alt={title} 
          className="w-full aspect-[220/315] rounded-[4px] object-cover"
        />
        <div className={`absolute bottom-0 left-0 right-0 h-[18px] ${status === 'FREE NOW' ? 'bg-[#0074e4]' : 'bg-black'} flex items-center justify-center`}>
          <span className="text-white text-[12px] font-semibold font-['Poppins']">
            {status}
          </span>
        </div>
      </div>
      <p className="text-white text-[14px] font-['Poppins'] mt-3">{title}</p>
      <p className="text-[#aaa] text-[14px] font-['Poppins'] mt-1">{availability}</p>
    </div>
  );
}