import svgPaths from "../../imports/svg-dbk43sgnxc";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="px-4 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col gap-1">
            <h3 className="text-white text-sm mb-3">Resources</h3>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Support-A-Creator</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Distribute on Epic Games</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Careers</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Company</a>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-white text-sm mb-3">Made by Epic Games</h3>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Battle Breakers</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Fortnite</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Infinity Blade</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Robo Recall</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Shadow Complex</a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors">Unreal Tournament</a>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-white text-sm mb-3">Reach us at</h3>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors flex items-center gap-2">
              <Facebook />
            </a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors flex items-center gap-2">
              <Twitter />
            </a>
            <a href="#" className="text-[#e7e7e7] text-sm hover:text-white transition-colors flex items-center gap-2">
              <YouTube />
            </a>
          </div>
        </div>

        <div className="text-[#888] text-xs space-y-4">
          <p>
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, the Epic Games logo, Fortnite, the Fortnite logo, 
            Unreal, Unreal Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or 
            registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brands or product 
            names are the trademarks of their respective owners. Non-US transactions through Epic Games International, S.à r.l.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Store Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Facebook() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d={svgPaths.p207e8600} />
    </svg>
  );
}

function Twitter() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d={svgPaths.p27e01100} />
    </svg>
  );
}

function YouTube() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d={svgPaths.p141a7a00} />
    </svg>
  );
}
