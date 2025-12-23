import { Facebook, Twitter, Linkedin } from "lucide-react";
import svgPaths from "../../imports/svg-7pvnrvwdck";

const footerLinks = {
  home: ["Categories", "Devices", "Pricing", "FAQ"],
  movies: ["Gernes", "Trending", "New Release", "Popular"],
  shows: ["Gernes", "Trending", "New Release", "Popular"],
  support: ["Contact Us"]
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#262626]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Home Links */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Home</h4>
            <ul className="space-y-3">
              {footerLinks.home.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#999] hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Movies Links */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Movies</h4>
            <ul className="space-y-3">
              {footerLinks.movies.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#999] hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shows Links */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Shows</h4>
            <ul className="space-y-3">
              {footerLinks.shows.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#999] hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#999] hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscription Links */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Subscription</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#999] hover:text-white transition-colors">
                  Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-[#999] hover:text-white transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-6">Connect With Us</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:border-[#e50000] transition-colors"
              >
                <Facebook className="size-5 text-white" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:border-[#e50000] transition-colors"
              >
                <Twitter className="size-5 text-white" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:border-[#e50000] transition-colors"
              >
                <Linkedin className="size-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative h-px mb-8">
          <svg className="absolute inset-0 w-full h-px" fill="none" preserveAspectRatio="none" viewBox="0 0 758 1">
            <line stroke="url(#paint0_linear_footer)" x2="758" y1="0.5" y2="0.5" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_footer" x1="0" x2="758" y1="1" y2="1">
                <stop stopColor="#E50000" stopOpacity="0" />
                <stop offset="0.166667" stopColor="#E50000" />
                <stop offset="1" stopColor="#E50000" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#999] text-sm">
          <p>@2023 streamvib, All Rights Reserved</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <span className="text-[#262626]">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-[#262626]">|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
