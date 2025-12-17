import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import imgRectangle10 from "../../assets/ace660b3272b459cb07653c0c5a7bfbe6530e401.png";
import imgRectangle11 from "../../assets/aed35050dc954faf85dd15e22f9b91d81f0007ba.png";
import imgRectangle12 from "../../assets/1c0a834c52ed9f15b204b8039b8199f08c01b7a5.png";
import imgRectangle13 from "../../assets/a599eae9568cc75a17d206b0411a747562d180e9.png";
import imgRectangle14 from "../../assets/1b388b60087ffe48b7503901b598572ff5bdff6c.png";

const gamesWithAchievements = [
  {
    id: 1,
    image: imgRectangle10,
    title: "Valorant",
    originalPrice: "₹900",
    discountPrice: "₹850",
    discount: "-10%"
  },
  {
    id: 2,
    image: imgRectangle11,
    title: "Assassin's creed Valhalla",
    originalPrice: "₹3,499",
    discountPrice: "₹2,999",
    discount: "-20%"
  },
  {
    id: 3,
    image: imgRectangle12,
    title: "Red Dead Redemption 2",
    originalPrice: "₹3,199",
    discountPrice: "₹1,599",
    discount: "-50%"
  },
  {
    id: 4,
    image: imgRectangle13,
    title: "The Tomb Raider",
    originalPrice: "₹2,195",
    discountPrice: "₹2,000",
    discount: "-20%"
  },
  {
    id: 5,
    image: imgRectangle14,
    title: "Cyberpunk 2077",
    originalPrice: "₹4,000",
    discountPrice: "₹2,000",
    discount: "-50%"
  }
];

export function GameWithAchievements() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mb-[80px]">
      <div className="absolute left-[calc(12.5%+1px)] w-full">
        <div className="flex items-center justify-between mb-6 pr-[calc(12.5%)]">
          <div className="flex items-center gap-1">
            <h2 className="text-[#f5f5f5] text-[18px] font-['Poppins']">Game with Achievements</h2>
            <ChevronRight className="w-[9px] h-[9px] text-[#f5f5f5] rotate-[-90deg]" />
          </div>
          <div className="flex gap-2">
            <button className="game-achievements-prev w-[30px] h-[30px] rounded-full border-2 border-[#f5f5f5] border-opacity-50 flex items-center justify-center hover:border-opacity-100 transition-opacity">
              <ChevronLeft className="w-4 h-4 text-[#f5f5f5]" />
            </button>
            <button className="game-achievements-next w-[30px] h-[30px] rounded-full border-2 border-[#f5f5f5] flex items-center justify-center hover:border-opacity-80 transition-opacity">
              <ChevronRight className="w-4 h-4 text-[#f5f5f5]" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.game-achievements-prev',
            nextEl: '.game-achievements-next',
          }}
          spaceBetween={20}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }
          }}
        >
          {gamesWithAchievements.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="flex flex-col gap-[10px]">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-[200px] h-[284px] rounded-[4px] object-cover"
                />
                <div className="flex flex-col gap-[10px] w-[213px]">
                  <p className="text-[#f5f5f5] text-[16px] font-['Poppins']">{game.title}</p>
                  <div className="flex gap-2 items-center">
                    <span className="bg-[#0074e4] text-white text-[16px] px-2 rounded-[4px] font-['Poppins']">
                      {game.discount}
                    </span>
                    <span className="text-[rgba(245,245,245,0.6)] text-[16px] line-through font-['Poppins']">
                      {game.originalPrice}
                    </span>
                    <span className="text-[#f5f5f5] text-[16px] font-['Poppins']">
                      {game.discountPrice}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="h-[380px]" />
    </div>
  );
}
