import imgImage2 from "@/assets/a95851f24983fa54346bbe346186cc6aed3039a5.png";
import { Search, User, Download, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#313131] sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-[42px]">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div className="w-6 h-7">
            <img src={imgImage2} alt="Epic Games" className="w-full h-full object-cover" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">STORE</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">FAQ</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">HELP</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">UNREAL ENGINE</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#aaa]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs">SIGN IN</span>
          </button>
          <button className="bg-[#007aff] text-white text-xs px-6 h-[42px] hover:bg-[#0066d9] transition-colors">
            DOWNLOAD
          </button>
        </div>
      </div>

      {/* Active indicator */}
      <div className="h-[5px] bg-[#007aff] w-[52px] ml-[58px] hidden md:block" />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#202020] p-4">
          <nav className="flex flex-col gap-3">
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">STORE</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">FAQ</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">HELP</a>
            <a href="#" className="text-[#aaa] hover:text-white transition-colors text-xs">UNREAL ENGINE</a>
            <button className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors text-left">
              <User className="w-5 h-5" />
              <span className="text-xs">SIGN IN</span>
            </button>
            <button className="bg-[#007aff] text-white text-xs px-6 py-3 hover:bg-[#0066d9] transition-colors rounded">
              DOWNLOAD
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
