import imgRectangle22 from "../../assets/62f707b97e78f207e1a79a64f3a7d6ed0bed1f73.png";
import imgRectangle23 from "../../assets/06fe234479336fa7203d8f082dced8242b1edf29.png";
import imgRectangle24 from "../../assets/e52ec348db43d2be47f9210039f5e616c5fd669f.png";
import imgRectangle25 from "../../assets/01473f310f3624f5c1168fa2ffcb5baca2ea293d.png";
import imgRectangle26 from "../../assets/f23759cbfa5b390345aa245ddd3a0b4291ade77e.png";
import imgRectangle27 from "../../assets/3f71da0e63dd85e777f69b8d41b0f4cef6462be5.png";
import imgRectangle28 from "../../assets/7bfad6e91ccbc2c1cc4deac9c9e5b7ac31846e92.png";
import imgRectangle29 from "../../assets/fd2e445b75165b8e0e02481f91270101cabd84bd.png";
import imgRectangle30 from "../../assets/47205029def6e01824e7bd165fcbbcfc3e849e7b.png";

const topSellersCol1 = [
  { id: 1, image: imgRectangle22, title: "Ghostbusters: Spirits Unleashed", price: "₹939" },
  { id: 2, image: imgRectangle23, title: "GTA V : Premier edition", price: "₹2,499" },
  { id: 3, image: imgRectangle24, title: "Daysgone", price: "₹2,699" },
  { id: 4, image: imgRectangle25, title: "Last of Us", price: "₹1,499" },
  { id: 5, image: imgRectangle26, title: "God of War 4", price: "₹2,659" }
];

const bestSellersCol2 = [
  { id: 1, image: imgRectangle27, title: "Fortnite", price: "Free" },
  { id: 2, image: imgRectangle23, title: "GTA V : Premier edition", price: "₹2,499" },
  { id: 3, image: imgRectangle28, title: "IGI 2", price: "₹499" },
  { id: 4, image: imgRectangle29, title: "Tomb Raider", price: "₹2,499" },
  { id: 5, image: imgRectangle30, title: "Uncharted 4", price: "₹3,499" }
];

export function TopSellers() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mb-[80px]">
      <div className="absolute left-[calc(12.5%+1px)] w-full">
        <div className="grid grid-cols-3 gap-[40px] pr-[calc(12.5%)]">
          {/* Column 1: Top Sellers */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-[22px] font-['Poppins']">Top Sellers</h2>
              <button className="border border-[#f5f5f5] rounded-[5px] px-4 py-1 text-[#f5f5f5] text-[16px] font-['Poppins'] hover:bg-[#f5f5f5] hover:text-black transition-colors">
                view more
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {topSellersCol1.map((game) => (
                <div key={game.id} className="flex items-center gap-3">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-[60px] h-[80px] rounded-[4px] object-cover"
                  />
                  <div className="font-['Poppins']">
                    <p className="text-[#f5f5f5] text-[14px]">{game.title}</p>
                    <p className="text-white text-[12px] mt-1">{game.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical separator */}
          <div className="w-px bg-white opacity-10 absolute left-[calc(37.5%+4px)] h-[511px]" />

          {/* Column 2: Best Seller */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-[22px] font-['Poppins']">Best Seller</h2>
              <button className="border border-[#f5f5f5] rounded-[5px] px-4 py-1 text-[#f5f5f5] text-[16px] font-['Poppins'] hover:bg-[#f5f5f5] hover:text-black transition-colors">
                view more
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {bestSellersCol2.map((game) => (
                <div key={game.id} className="flex items-center gap-3">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-[60px] h-[80px] rounded-[4px] object-cover"
                  />
                  <div className="font-['Poppins']">
                    <p className="text-[#f5f5f5] text-[14px]">{game.title}</p>
                    <p className="text-white text-[12px] mt-1">{game.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical separator */}
          <div className="w-px bg-white opacity-10 absolute left-[calc(62.5%+5px)] h-[511px]" />

          {/* Column 3: Next Up */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-[22px] font-['Poppins']">Next Up</h2>
              <button className="border border-[#f5f5f5] rounded-[5px] px-4 py-1 text-[#f5f5f5] text-[16px] font-['Poppins'] hover:bg-[#f5f5f5] hover:text-black transition-colors">
                view more
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {topSellersCol1.map((game) => (
                <div key={game.id} className="flex items-center gap-3">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-[60px] h-[80px] rounded-[4px] object-cover"
                  />
                  <div className="font-['Poppins']">
                    <p className="text-[#f5f5f5] text-[14px]">{game.title}</p>
                    <p className="text-white text-[12px] mt-1">{game.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[580px]" />
    </div>
  );
}
