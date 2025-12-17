import { ChevronUp } from "lucide-react";
import Link from "next/link";


const footerLinks = [
  ["Creator Support", "Published On Epic", "Profession", "Company"],
  ["Fan Work Policy" ,"User Exp Service", "User Licence"],
  ["Online Service","Community", "Epic Newsroom"],
  [ "Battle Breakers","Fortnite", "Infinity Blade"],
   ["Robo Recall","Shadow Complex", "Unreal Tournament"],
];

export function Footer() {
  return (
    <footer className="bg-[#202020] text-[#999999] text-xs">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Social Icons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_604_7446)">
                  <path
                    d="M18.896 0H1.104C0.494 0 0 0.494 0 1.104V18.896C0 19.506 0.494 20 1.104 20H10.682V12.255H8.076V9.237H10.682V7.01C10.682 4.426 12.26 3.02 14.565 3.02C15.669 3.02 16.617 3.102 16.894 3.139V5.839H15.296C14.042 5.839 13.8 6.435 13.8 7.309V9.236H16.789L16.399 12.254H13.799V20H18.896C19.506 20 20 19.506 20 18.896V1.104C20 0.494 19.506 0 18.896 0Z"
                    fill="#CCCCCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_604_7446">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <svg
                width="21"
                height="18"
                viewBox="0 0 21 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.8048 4.25881C18.7064 11.6787 13.9615 16.7609 6.8786 17.0801C3.95769 17.2138 1.84159 16.2703 0 15.1004C2.15882 15.4449 4.83575 14.582 6.26743 13.3564C4.15133 13.1506 2.89846 12.0735 2.31223 10.3401C2.92371 10.4458 3.56789 10.4177 4.14881 10.2947C2.23929 9.65551 0.875706 8.47531 0.805251 6.00232C1.3411 6.24628 1.89971 6.47561 2.64183 6.52082C1.21277 5.70797 0.156062 2.73654 1.36635 0.771655C3.48729 3.09639 6.03854 4.99344 10.2277 5.25007C9.17599 0.754042 15.1339 -1.68403 17.6275 1.33775C18.6816 1.13383 19.5396 0.733912 20.3649 0.29863C20.0252 1.34273 19.371 2.07239 18.5735 2.6561C19.4489 2.53792 20.2238 2.32401 20.8858 1.99693C20.4752 2.84988 19.5773 3.61476 18.8048 4.25881Z"
                  fill="#CCCCCC"
                />
              </svg>

              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <svg
                width="21"
                height="15"
                viewBox="0 0 21 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.05 2.25C20.2 2.90002 20.35 3.95002 20.4 5.30002L20.45 7.15001V9.10001C20.4 10.5 20.25 11.55 20.1 12.2C20 12.6 19.75 13 19.45 13.3C19.15 13.6 18.75 13.85 18.3 13.95C17.65 14.1 16.15 14.25 13.75 14.35L10.25 14.4L6.84999 14.35C4.44999 14.25 2.94998 14.15 2.29999 13.95C1.84999 13.85 1.44998 13.6 1.14998 13.3C0.75 13 0.549984 12.6 0.399984 12.2C0.249984 11.5 0.0999845 10.5 0.0499923 9.10001L0 7.25002C0 6.70001 7.82311e-08 6.10001 0.0499923 5.4C0.0999845 4.05 0.249984 3 0.399984 2.35001C0.549984 1.8 0.75 1.40002 1.09999 1.10002C1.44998 0.800016 1.8 0.550008 2.25 0.400008C2.89999 0.250008 4.39999 0.100008 6.79999 0.0500157L10.25 0L13.65 0.0500157C16.05 0.100008 17.6 0.250008 18.25 0.400008C18.7 0.500016 19.1 0.75 19.4 1.05C19.7 1.40002 19.95 1.8 20.05 2.25ZM8.14999 10.3L13.5 7.25002L8.14999 4.2V10.3Z"
                  fill="#CCCCCC"
                />
              </svg>

              <span className="sr-only">YouTube</span>
            </Link>
          </div>
          <button className="border border-[#999999] p-1.5 hover:border-white hover:text-white transition-colors">
            <ChevronUp />
            <span className="sr-only">Toggle fullscreen</span>
          </button>
        </div>

        {/* Navigation Links */}
          <h3 className="text-white mb-3 font-medium">Resources</h3>

        <div className="flex flex-wrap gap-6 mb-10">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Text */}
        <div className=" pt-6 pb-4">
          <p className="text-[10px] leading-relaxed text-[#666666] max-w-[888px]">
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic
            Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal
            Engine logo, Unreal Tournament and the Unreal Tournament logo are
            trademarks or registered trademarks of Epic Games, Inc. in the
            United States of America and elsewhere. Other brand or product names
            are trademarks of their respective owners. Transactions outside the
            United States are handled through Epic Games International, S.à r.l.
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap items-center justify-between pt-4 ">
          <div className="flex flex-wrap gap-4 text-[10px]">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Store Refund Policy
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <div className="w-6 h-6 bg-[#333333] rounded flex items-center justify-center">
              <img src="images/a95851f24983fa54346bbe346186cc6aed3039a5.png" alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
