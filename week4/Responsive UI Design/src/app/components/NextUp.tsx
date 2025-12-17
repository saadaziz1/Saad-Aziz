import imgRectangle23 from "../../assets/06fe234479336fa7203d8f082dced8242b1edf29.png";
import imgRectangle24 from "../../assets/e52ec348db43d2be47f9210039f5e616c5fd669f.png";
import imgRectangle25 from "../../assets/01473f310f3624f5c1168fa2ffcb5baca2ea293d.png";
import imgRectangle26 from "../../assets/f23759cbfa5b390345aa245ddd3a0b4291ade77e.png";

const upcomingGames = [
  { image: imgRectangle23, title: "GTA V : Premier edition", price: "₹2,499" },
  { image: imgRectangle24, title: "Spiderman : Miles Morales", price: "₹3,999" },
  { image: imgRectangle25, title: "Batman : Arkham Knight", price: "₹1,999" },
  { image: imgRectangle26, title: "Fall Guys", price: "Free" },
];

export function NextUp() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg md:text-xl">Next Up for you</h2>
        <button className="border border-[#f5f5f5] text-[#f5f5f5] px-4 py-2 rounded text-sm hover:bg-white/10 transition-colors">
          view more
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {upcomingGames.map((game, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 bg-[#1a1a1a] rounded p-3 hover:bg-[#252525] transition-colors cursor-pointer"
          >
            <div className="w-[60px] h-[80px] rounded overflow-hidden shrink-0">
              <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-[#f5f5f5] text-sm truncate">{game.title}</p>
              <p className="text-white text-xs">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
