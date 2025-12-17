import imgFrame45 from "../../assets/7bf027e9b290820af6ca2bd1d00eed5dcb48bd34.png";
import imgFrame46 from "../../assets/54364899fd13169565b2a4dbbac9b606471bbb30.png";
import imgFrame47 from "../../assets/3bac29753c33f37047eadc86e42ade41bfb3ee41.png";
import { useState } from "react";

const featuredGames = [
  {
    image: imgFrame45,
    title: "NFS UNBOUND",
    description: "Pre-purchase NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,999"
  },
  {
    image: imgFrame46,
    title: "FIFA 23",
    description: "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup",
    price: "₹4,999"
  },
  {
    image: imgFrame47,
    title: "UNCHARTED 4",
    description: "Get the definitive Uncharterd 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,999"
  }
];

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="px-4 md:px-16 lg:px-24 py-8">
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto scrollbar-hide">
        {featuredGames.map((game, index) => (
          <div key={index} className="flex-shrink-0 w-full md:w-[calc(33.33%-0.67rem)] min-w-[280px]">
            <div className="relative rounded-[20px] overflow-hidden h-[200px] group cursor-pointer">
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            </div>
            <div className="mt-4 text-white">
              <h3 className="text-base mb-2">{game.title}</h3>
              <p className="text-sm text-[rgba(255,255,255,0.6)] mb-3 line-clamp-2">
                {game.description}
              </p>
              <p className="text-base">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
