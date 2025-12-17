import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import imgFrame45 from "../../assets/7bf027e9b290820af6ca2bd1d00eed5dcb48bd34.png";
import imgFrame46 from "../../assets/54364899fd13169565b2a4dbbac9b606471bbb30.png";
import imgFrame47 from "../../assets/3bac29753c33f37047eadc86e42ade41bfb3ee41.png";

const featuredGames = [
  {
    id: 1,
    image: imgFrame45,
    title: "NFS UNBOUND",
    description: "Pre-purchase NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,499"
  },
  {
    id: 2,
    image: imgFrame46,
    title: "FIFA 23",
    description: "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup",
    price: "₹3,699"
  },
  {
    id: 3,
    image: imgFrame47,
    title: "UNCHARTED 4",
    description: "Get the definitive Uncharterd 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,199"
  }
];

export function FeaturedGames() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mt-[450px] mb-[100px]">
      <div className="absolute left-[calc(12.5%-6px)] w-full">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={3}
          className="!px-[calc(12.5%+1px)]"
        >
          {featuredGames.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="relative">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-[353px] h-[198px] rounded-[20px] object-cover"
                />
                <div className="mt-6 font-['Poppins']">
                  <p className="text-white text-[16px] mb-2">{game.title}</p>
                  <p className="text-[rgba(255,255,255,0.6)] text-[14px] mb-8">
                    {game.description}
                  </p>
                  <p className="text-white text-[16px]">{game.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="h-[350px]" />
    </div>
  );
}
