import { Search } from "lucide-react";

export function SubNav() {
  return (
    <div className="px-4 md:px-16 lg:px-24 py-4 md:py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
        {/* Search Bar */}
        <div className="bg-[#202020] rounded-full px-4 py-2.5 flex items-center gap-2 w-full md:w-auto md:max-w-[220px]">
          <Search className="w-5 h-5 text-[#a0a0a0]" />
          <input 
            type="text" 
            placeholder="Search Store" 
            className="bg-transparent text-[#a0a0a0] text-xs outline-none flex-1"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <a href="#" className="text-white text-xs hover:text-[#aaa] transition-colors">Discover</a>
          <a href="#" className="text-[#666] text-xs hover:text-white transition-colors">Browse</a>
          <a href="#" className="text-[#666] text-xs hover:text-white transition-colors">News</a>
        </nav>
      </div>
    </div>
  );
}
