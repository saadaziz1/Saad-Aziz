import imgRectangle30 from "@/assets/47205029def6e01824e7bd165fcbbcfc3e849e7b.png";
import imgRectangle31 from "@/assets/e7fc17fd6c1d2c8e2fe4d15d3d884227c7e4c87c.png";
import imgRectangle32 from "@/assets/1a91e670ce0ff50ae362f59e7574d587cffdffb5.png";
import imgRectangle33 from "@/assets/3f09613e320735ed3a0740b6beca4816401f2bcd.png";
import imgRectangle34 from "@/assets/e45ad5cfe732e4743b9eed042cda9315bb066900.png";
import imgRectangle35 from "@/assets/17bdef472f73edaa5f41c06310bf91de36fd19b1.png";

const catalogGames = [
  { image: imgRectangle30, title: "Forza Horizon 5", price: "₹2,999" },
  { image: imgRectangle31, title: "Alan Wake 2", price: "₹3,499" },
  { image: imgRectangle32, title: "Resident Evil 4", price: "₹2,799" },
  { image: imgRectangle33, title: "Like a Dragon", price: "₹1,999" },
  { image: imgRectangle34, title: "Hogwarts Legacy", price: "₹4,999" },
  { image: imgRectangle35, title: "Mortal Kombat 1", price: "₹3,999" },
];

export function CatalogBrowse() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg md:text-xl">Top selling games</h2>
        <button className="border border-[#f5f5f5] text-[#f5f5f5] px-4 py-2 rounded text-sm hover:bg-white/10 transition-colors">
          view more
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {catalogGames.map((game, index) => (
          <div key={index} className="flex flex-col gap-2 group cursor-pointer">
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
