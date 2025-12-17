import imgRectangle27 from "../../assets/3f71da0e63dd85e777f69b8d41b0f4cef6462be5.png";
import imgRectangle28 from "../../assets/7bfad6e91ccbc2c1cc4deac9c9e5b7ac31846e92.png";
import imgRectangle29 from "../../assets/fd2e445b75165b8e0e02481f91270101cabd84bd.png";
import imgFrame221 from "../../assets/e00ee2d0aac5ae9d87705b009959a513860aeef8.png";

const catalogGames = [
  { image: imgRectangle27 },
  { image: imgRectangle28 },
  { image: imgRectangle29 },
  { image: imgFrame221 },
];

export function ExploreCatalog() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-[20px] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-white text-xl md:text-2xl mb-3">Explore our Catalog</h2>
            <p className="text-[rgba(255,255,255,0.7)] text-sm md:text-base max-w-[500px]">
              Browse our catalog of over 1,000 games and discover your next favorite
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide w-full md:w-auto">
            {catalogGames.map((game, index) => (
              <div 
                key={index} 
                className="w-[120px] h-[160px] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <img src={game.image} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
