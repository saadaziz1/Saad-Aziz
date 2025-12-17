"use client";

import {  User,  Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('STORE');
  
  const navItems = [
    { name: 'STORE', width: 52 },
    { name: 'FAQ', width: 30 },
    { name: 'HELP', width: 25 },
    { name: 'UNREAL ENGINE', width: 85 }
  ];
  
  const getIndicatorPosition = () => {
    let position = 58; // Base position for STORE
    const activeIndex = navItems.findIndex(item => item.name === activeNav);
    
    for (let i = 0; i < activeIndex; i++) {
      position += navItems[i].width + 24; // width + gap-6
    }
    
    return position;
  };
  
  const getIndicatorWidth = () => {
    const activeItem = navItems.find(item => item.name === activeNav);
    return activeItem ? activeItem.width : 52;
  };

  return (
    <header className="bg-[#313131] sticky top-0 z-50">
      <div className=" max-w-400 mx-auto">
        <div className="flex items-center justify-between pr-4 md:pr-0 pl-4 h-[42px]">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <div className="w-6 h-7">
              <img
                src="/images/a95851f24983fa54346bbe346186cc6aed3039a5.png"
                alt="Epic Games"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`transition-colors text-xs ${
                    activeNav === item.name ? 'text-white' : 'text-[#aaa] hover:text-white'
                  }`}
                  onClick={() => setActiveNav(item.name)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#aaa]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4 h-full">
            <div className="text-[#aaa] hover:text-white ">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10ZM9.375 1.346C8.537 1.601 7.706 2.371 7.016 3.665C6.789 4.095 6.593 4.541 6.431 5H9.375V1.346ZM5.112 5C5.321 4.336 5.589 3.692 5.912 3.076C6.129 2.668 6.378 2.277 6.659 1.91C5.11025 2.55227 3.77775 3.62452 2.819 5H5.112ZM4.385 9.375C4.423 8.279 4.558 7.227 4.775 6.25H2.092C1.62591 7.23132 1.34778 8.29126 1.272 9.375H4.385ZM6.059 6.25C5.81298 7.27474 5.67125 8.32173 5.636 9.375H9.375V6.25H6.059ZM10.625 6.25V9.375H14.363C14.3281 8.32176 14.1868 7.27476 13.941 6.25H10.625ZM5.638 10.625C5.672 11.678 5.813 12.725 6.058 13.75H9.375V10.625H5.638ZM10.625 10.625V13.75H13.941C14.175 12.794 14.324 11.74 14.364 10.625H10.625ZM6.431 15C6.604 15.483 6.8 15.93 7.016 16.335C7.706 17.629 8.539 18.398 9.375 18.654V15H6.431ZM6.659 18.09C6.37823 17.7226 6.12837 17.3326 5.912 16.924C5.58808 16.308 5.32033 15.6641 5.112 15H2.82C3.77871 16.3755 5.11122 17.4478 6.66 18.09H6.659ZM4.775 13.75C4.54896 12.7226 4.4184 11.6765 4.385 10.625H1.273C1.34784 11.7089 1.62601 12.769 2.093 13.75H4.775ZM13.341 18.09C14.8898 17.4478 16.2223 16.3755 17.181 15H14.887C14.6787 15.6641 14.4109 16.308 14.087 16.924C13.871 17.3326 13.6215 17.7226 13.341 18.09ZM10.625 15V18.654C11.463 18.399 12.294 17.629 12.984 16.335C13.2 15.93 13.396 15.483 13.569 15H10.625ZM15.225 13.75H17.907C18.374 12.769 18.6522 11.7089 18.727 10.625H15.615C15.5816 11.6765 15.4511 12.7226 15.225 13.75ZM18.727 9.375C18.6512 8.29126 18.3731 7.23132 17.907 6.25H15.225C15.442 7.227 15.577 8.279 15.615 9.375H18.728H18.727ZM14.087 3.076C14.397 3.656 14.665 4.301 14.887 5H17.181C16.2223 3.62448 14.8898 2.55222 13.341 1.91C13.614 2.265 13.864 2.657 14.087 3.076ZM13.57 5C13.4079 4.54131 13.2123 4.09512 12.985 3.665C12.295 2.371 11.464 1.602 10.626 1.346V5H13.57Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <button className="flex items-center gap-2 text-[#aaa] hover:text-white transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5999 19.2008C3.5999 19.2008 2.3999 19.2008 2.3999 18.0008C2.3999 16.8008 3.5999 13.2008 9.5999 13.2008C15.5999 13.2008 16.7999 16.8008 16.7999 18.0008C16.7999 19.2008 15.5999 19.2008 15.5999 19.2008H3.5999ZM9.5999 12.0008C10.5547 12.0008 11.4704 11.6215 12.1455 10.9464C12.8206 10.2712 13.1999 9.35556 13.1999 8.40078C13.1999 7.446 12.8206 6.53033 12.1455 5.8552C11.4704 5.18007 10.5547 4.80078 9.5999 4.80078C8.64512 4.80078 7.72945 5.18007 7.05432 5.8552C6.37919 6.53033 5.9999 7.446 5.9999 8.40078C5.9999 9.35556 6.37919 10.2712 7.05432 10.9464C7.72945 11.6215 8.64512 12.0008 9.5999 12.0008Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.6001 8.40039C18.6789 8.40039 18.7569 8.41591 18.8297 8.44606C18.9025 8.47622 18.9686 8.52041 19.0244 8.57613C19.0801 8.63184 19.1243 8.69799 19.1544 8.77078C19.1846 8.84358 19.2001 8.9216 19.2001 9.00039V10.8004H21.0001C21.0789 10.8004 21.1569 10.8159 21.2297 10.8461C21.3025 10.8762 21.3686 10.9204 21.4244 10.9761C21.4801 11.0318 21.5243 11.098 21.5544 11.1708C21.5846 11.2436 21.6001 11.3216 21.6001 11.4004C21.6001 11.4792 21.5846 11.5572 21.5544 11.63C21.5243 11.7028 21.4801 11.7689 21.4244 11.8247C21.3686 11.8804 21.3025 11.9246 21.2297 11.9547C21.1569 11.9849 21.0789 12.0004 21.0001 12.0004H19.2001V13.8004C19.2001 13.9595 19.1369 14.1121 19.0244 14.2247C18.9118 14.3372 18.7592 14.4004 18.6001 14.4004C18.441 14.4004 18.2884 14.3372 18.1758 14.2247C18.0633 14.1121 18.0001 13.9595 18.0001 13.8004V12.0004H16.2001C16.1213 12.0004 16.0433 11.9849 15.9705 11.9547C15.8977 11.9246 15.8315 11.8804 15.7758 11.8247C15.7201 11.7689 15.6759 11.7028 15.6458 11.63C15.6156 11.5572 15.6001 11.4792 15.6001 11.4004C15.6001 11.3216 15.6156 11.2436 15.6458 11.1708C15.6759 11.098 15.7201 11.0318 15.7758 10.9761C15.8315 10.9204 15.8977 10.8762 15.9705 10.8461C16.0433 10.8159 16.1213 10.8004 16.2001 10.8004H18.0001V9.00039C18.0001 8.9216 18.0156 8.84358 18.0458 8.77078C18.0759 8.69799 18.1201 8.63184 18.1758 8.57613C18.2315 8.52041 18.2977 8.47622 18.3705 8.44606C18.4433 8.41591 18.5213 8.40039 18.6001 8.40039Z"
                  fill="currentColor"
                />
              </svg>

              <span className="text-xs">SIGN IN</span>
            </button>
            <button className="bg-[#007aff] text-white text-xs px-6 py-2 h-[50px] hover:bg-[#0066d9] transition-colors">
              DOWNLOAD
            </button>
          </div>
        </div>

        {/* Active indicator */}
        <div 
          className="h-[5px] bg-[#007aff] hidden md:block transition-all duration-300 ease-in-out" 
          style={{
            width: `${getIndicatorWidth()}px`,
            marginLeft: `${getIndicatorPosition()}px`
          }}
        />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#202020] p-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-[#aaa] hover:text-white transition-colors text-xs"
              >
                STORE
              </a>
              <a
                href="#"
                className="text-[#aaa] hover:text-white transition-colors text-xs"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-[#aaa] hover:text-white transition-colors text-xs"
              >
                HELP
              </a>
              <a
                href="#"
                className="text-[#aaa] hover:text-white transition-colors text-xs"
              >
                UNREAL ENGINE
              </a>
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
      </div>
    </header>
  );
}
