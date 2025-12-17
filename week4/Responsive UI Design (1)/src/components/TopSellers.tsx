import imgRectangle18 from "@/assets/1be5fd14f0d86201501c92f4698fc3bec8e7e845.png";
import imgRectangle19 from "@/assets/862f510abd00d067d2f690d1e393b22214be81f1.png";
import imgRectangle20 from "@/assets/57727e74811ee62c7f8ab62f34aa38777d0f96c0.png";
import imgRectangle21 from "@/assets/7e46c618e4893d456011c8175099c5ceeda312ff.png";
import imgRectangle22 from "@/assets/62f707b97e78f207e1a79a64f3a7d6ed0bed1f73.png";

const topGames = [
  { image: imgRectangle18, title: "Scorn : Definitive Edition", price: "₹1,399" },
  { image: imgRectangle19, title: "DEATH STRANDING", price: "₹3,999" },
  { image: imgRectangle20, title: "Call of Duty®", price: "₹5,999" },
  { image: imgRectangle21, title: "Halo Infinite", price: "Free" },
  { image: imgRectangle22, title: "Sea Of Thieves", price: "₹2,499" },
];

export function TopSellers() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg md:text-xl">Top Sellers</h2>
        <button className="border border-[#f5f5f5] text-[#f5f5f5] px-4 py-2 rounded text-sm hover:bg-white/10 transition-colors">
          view more
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {topGames.map((game, index) => (
          <div key={index} className="flex flex-col gap-2.5 group cursor-pointer">
            <div className="relative rounded overflow-hidden aspect-[3/4]">
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#f5f5f5] text-sm truncate">{game.title}</p>
              <p className="text-white text-sm">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
