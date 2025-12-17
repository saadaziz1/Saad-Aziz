import img171977081 from "../../assets/48e5cc7f89a5f380aff3a32ce4b835507dbe5e89.png";
import imgRectangle9 from "../../assets/ba1fd8dec62acef25501bc0fef5bd7fad8e8e87c.png";
import imgRectangle15 from "../../assets/a2888ef431be14ca3dade77b93edc59e47dbb060.png";
import imgRectangle16 from "../../assets/0e92ed4c747d7e4432a3c5cb56167cc56a3cb7ea.png";
import imgRectangle17 from "../../assets/ba7d392176a03658f6e7b348e15ea4ac3e403800.png";

export function HeroSection() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 mb-[50px]">
      <div className="absolute left-[calc(12.5%+1px)] top-0 flex gap-3">
        {/* Main Hero Banner */}
        <div className="relative w-[798px] h-[432px] rounded-[20px] overflow-hidden bg-white">
          <img src={img171977081} alt="God of War" className="w-full h-full object-cover" />
          <div className="absolute left-[39px] top-[172px] flex flex-col gap-10">
            <div className="flex flex-col gap-2 text-white font-['Poppins']">
              <p className="text-[12px]">PRE-PURCHASE AVAILABLE</p>
              <p className="text-[16px] w-[300px]">
                Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive
              </p>
            </div>
            <button className="bg-white text-black px-4 py-3 rounded-[4px] w-[189px] text-[16px] font-['Poppins']">
              PRE-PURCHASE NOW
            </button>
          </div>
        </div>

        {/* Side Items */}
        <div className="flex flex-col gap-[3px]">
          <div className="bg-[#252525] w-[249px] h-[105.5px] rounded-[16px] px-4 py-3 flex items-center gap-4">
            <img src={imgRectangle9} alt="God Of War 4" className="w-[60px] h-[80px] rounded-[8px] object-cover" />
            <p className="text-[#f5f5f5] text-[16px] font-['Poppins']">God Of War 4</p>
          </div>
          <div className="w-[249px] h-[105.5px] rounded-[16px] px-4 py-3 flex items-center gap-4">
            <img src={imgRectangle15} alt="Farcry 6 Golden Edition" className="w-[60px] h-[80px] rounded-[8px] object-cover" />
            <p className="text-[#f5f5f5] text-[16px] font-['Poppins']">Farcry 6 Golden Edition</p>
          </div>
          <div className="w-[249px] h-[105.5px] rounded-[16px] px-4 py-3 flex items-center gap-4">
            <img src={imgRectangle16} alt="GTA V" className="w-[60px] h-[80px] rounded-[8px] object-cover" />
            <p className="text-[#f5f5f5] text-[16px] font-['Poppins']">GTA V</p>
          </div>
          <div className="w-[249px] h-[105.5px] rounded-[16px] px-4 py-3 flex items-center gap-4">
            <img src={imgRectangle17} alt="Outlast 2" className="w-[60px] h-[80px] rounded-[8px] object-cover" />
            <p className="text-[#f5f5f5] text-[16px] font-['Poppins']">Outlast 2</p>
          </div>
        </div>
      </div>
      <div className="h-[432px]" />
    </div>
  );
}
