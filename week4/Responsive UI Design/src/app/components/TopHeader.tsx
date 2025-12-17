import { Search, User, Download } from "lucide-react";
import imgImage2 from "../../assets/a95851f24983fa54346bbe346186cc6aed3039a5.png";

export function TopHeader() {
  return (
    <div className="bg-[#313131] h-[42px] relative w-full">
      <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="w-6 h-[28.8px]">
            <img src={imgImage2} alt="Epic Games" className="w-full h-full object-contain" />
          </div>
          <nav className="flex gap-6">
            <a href="#" className="text-[rgba(170,170,170,0.87)] text-[12px] font-['Poppins'] relative">
              STORE
              <div className="absolute bottom-[-13px] left-0 right-0 h-[5px] bg-[#007aff]" />
            </a>
            <a href="#" className="text-[#aaa] text-[12px] font-['Poppins'] hover:text-white">FAQ</a>
            <a href="#" className="text-[#aaa] text-[12px] font-['Poppins'] hover:text-white">HELP</a>
            <a href="#" className="text-[#aaa] text-[12px] font-['Poppins'] hover:text-white">UNREAL ENGINE</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-6 h-6">
            <Search className="w-full h-full text-[#aaa]" />
          </button>
          <button className="flex items-center gap-2 px-4 h-[42px]">
            <User className="w-6 h-6 text-[#aaa]" />
            <span className="text-[#aaa] text-[12px] font-['Poppins']">SIGN IN</span>
          </button>
          <button className="bg-[#007aff] px-6 h-[42px] flex items-center">
            <span className="text-white text-[12px] font-['Poppins']">DOWNLOAD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
