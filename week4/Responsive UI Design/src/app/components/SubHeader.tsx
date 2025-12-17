import { Search } from "lucide-react";

export function SubHeader() {
  return (
    <div className="relative w-full h-[100px] max-w-[1440px] mx-auto px-4">
      <div className="absolute left-[calc(12.5%+1px)] top-[30px] flex items-center gap-8">
        <div className="bg-[#202020] flex items-center gap-2 px-3 py-2 rounded-full">
          <Search className="w-5 h-5 text-[#a0a0a0]" />
          <span className="text-[#a0a0a0] text-[12px] font-['Poppins']">Search Store</span>
        </div>
        <nav className="flex gap-6">
          <a href="#" className="text-white text-[12px] font-['Poppins']">Discover</a>
          <a href="#" className="text-[#666] text-[12px] font-['Poppins'] hover:text-white">Browse</a>
          <a href="#" className="text-[#666] text-[12px] font-['Poppins'] hover:text-white">News</a>
        </nav>
      </div>
    </div>
  );
}
