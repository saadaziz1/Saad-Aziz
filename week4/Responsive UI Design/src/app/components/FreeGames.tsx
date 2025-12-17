import imgRectangle18 from "../../assets/1be5fd14f0d86201501c92f4698fc3bec8e7e845.png";
import imgRectangle19 from "../../assets/862f510abd00d067d2f690d1e393b22214be81f1.png";
import imgRectangle20 from "../../assets/57727e74811ee62c7f8ab62f34aa38777d0f96c0.png";
import imgRectangle21 from "../../assets/7e46c618e4893d456011c8175099c5ceeda312ff.png";

const freeGames = [
  {
    id: 1,
    image: imgRectangle18,
    title: "Darkwood",
    availability: "Free Now - Jul 25",
    status: "FREE NOW"
  },
  {
    id: 2,
    image: imgRectangle19,
    title: "Assassin's Creed Black Flag",
    availability: "Free Now - Jul 25",
    status: "FREE NOW"
  },
  {
    id: 3,
    image: imgRectangle20,
    title: "NFS : Shift",
    availability: "Free  Jul 27 - Aug 5",
    status: "COMING SOON"
  },
  {
    id: 4,
    image: imgRectangle21,
    title: "Warface",
    availability: "Free  Jul 27 - Aug 5",
    status: "COMING SOON"
  }
];

export function FreeGames() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mb-[80px]">
      <div className="absolute left-[calc(12.5%+1px)] w-[1078px] bg-[#2a2a2a] rounded-[4px] p-[40px]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-[46px] h-[46px]">
              <svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3L26.09 16.26L38 13L30.18 23L38 33L26.09 29.74L23 43L19.91 29.74L8 33L15.82 23L8 13L19.91 16.26L23 3Z" fill="white"/>
              </svg>
            </div>
            <h2 className="text-white text-[18px] font-['Poppins']">Free Games</h2>
          </div>
          <button className="border border-[#f5f5f5] px-4 py-2 rounded text-[#f5f5f5] text-[16px] font-['Poppins'] hover:bg-[#f5f5f5] hover:text-[#2a2a2a] transition-colors">
            view More
          </button>
        </div>

        <div className="grid grid-cols-4 gap-[22px]">
          {freeGames.map((game) => (
            <div key={game.id} className="relative">
              <div className="relative">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-[220px] h-[315px] rounded-[4px] object-cover"
                />
                <div className={`absolute bottom-0 left-0 right-0 h-[18px] ${game.status === 'FREE NOW' ? 'bg-[#0074e4]' : 'bg-black'} flex items-center justify-center`}>
                  <span className="text-white text-[12px] font-semibold font-['Poppins']">
                    {game.status}
                  </span>
                </div>
              </div>
              <p className="text-white text-[14px] font-['Poppins'] mt-3">{game.title}</p>
              <p className="text-[#aaa] text-[14px] font-['Poppins'] mt-1">{game.availability}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[522px]" />
    </div>
  );
}
