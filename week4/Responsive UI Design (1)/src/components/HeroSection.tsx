import img171977081 from "@/assets/48e5cc7f89a5f380aff3a32ce4b835507dbe5e89.png";
import imgRectangle9 from "@/assets/ba1fd8dec62acef25501bc0fef5bd7fad8e8e87c.png";
import imgRectangle15 from "@/assets/a2888ef431be14ca3dade77b93edc59e47dbb060.png";
import imgRectangle16 from "@/assets/0e92ed4c747d7e4432a3c5cb56167cc56a3cb7ea.png";

export function HeroSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Featured Game */}
        <div className="lg:col-span-2 bg-white rounded-[20px] overflow-hidden relative h-[400px] md:h-[432px]">
          <img 
            src={img171977081} 
            alt="God of War" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <div className="flex flex-col gap-6 md:gap-10 text-white">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase">Pre-purchase available</p>
                <p className="text-sm md:text-base max-w-[300px]">
                  Kratos now lives as a man in the realm of Norse Gods and monsters. 
                  It is in this harsh, unforgiving world that he must fight to survive
                </p>
              </div>
              <button className="bg-white text-black px-6 py-3 rounded hover:bg-gray-100 transition-colors text-sm md:text-base w-fit">
                PRE-PURCHASE NOW
              </button>
            </div>
          </div>
        </div>

        {/* Side Cards */}
        <div className="flex flex-col gap-3">
          <GameSideCard 
            image={imgRectangle9}
            title="JUST FOR X"
            price="₹2,500"
          />
          <GameSideCard 
            image={imgRectangle15}
            title="Ghost Recon"
            price="Free"
            tag="FREE NOW"
          />
          <GameSideCard 
            image={imgRectangle16}
            title="FIFA 24"
            price="₹4,799"
          />
          <GameSideCard 
            image={imgRectangle16}
            title="Gensys 7"
            price="₹1,799"
          />
        </div>
      </div>
    </div>
  );
}

interface GameSideCardProps {
  image: string;
  title: string;
  price: string;
  tag?: string;
}

function GameSideCard({ image, title, price, tag }: GameSideCardProps) {
  return (
    <div className="bg-[#252525] rounded-2xl p-4 flex gap-3 items-center hover:bg-[#303030] transition-colors cursor-pointer">
      <div className="w-[60px] h-[80px] rounded overflow-hidden shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {tag && (
          <span className="bg-[#0074e4] text-white text-xs px-2 py-0.5 rounded w-fit">
            {tag}
          </span>
        )}
        <h3 className="text-white text-sm truncate">{title}</h3>
        <p className="text-[#f5f5f5] text-xs">{price}</p>
      </div>
    </div>
  );
}
