import { Search, Bell, Menu, X } from "lucide-react";
import svgPaths from "../../imports/svg-7pvnrvwdck";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/80 backdrop-blur-md border-b border-[#262626]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative size-[30px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                <path d={svgPaths.pa27c400} fill="white" />
              </svg>
            </div>
            <span className="font-bold text-white text-xl">Streamvibe</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-[#e50000] transition-colors">Home</a>
            <a href="#" className="text-[#999] hover:text-white transition-colors">Movies & Shows</a>
            <a href="#" className="text-[#999] hover:text-white transition-colors">Support</a>
            <a href="#" className="text-[#999] hover:text-white transition-colors">Subscriptions</a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <Search className="size-6 text-white" />
            </button>
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <Bell className="size-6 text-white" />
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-6 text-white" />
              ) : (
                <Menu className="size-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#262626]">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-white hover:text-[#e50000] transition-colors py-2">Home</a>
              <a href="#" className="text-[#999] hover:text-white transition-colors py-2">Movies & Shows</a>
              <a href="#" className="text-[#999] hover:text-white transition-colors py-2">Support</a>
              <a href="#" className="text-[#999] hover:text-white transition-colors py-2">Subscriptions</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}