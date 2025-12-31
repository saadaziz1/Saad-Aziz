import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  active: "personal" | "cars" | "bids" | "wishlist";
  setActive: (v: "personal" | "cars" | "bids" | "wishlist") => void;
};

export function ProfileSidebar({ active, setActive }: Props) {
  const [isOpen, setIsOpen] = useState(false); // mobile collapse toggle

  const buttonClass = (isActive: boolean) =>
    `w-full text-left py-3 px-4 text-base rounded-md font-semibold text-[#2E3D83] 
     ${isActive ? "bg-[#F1F2FF] relative" : "hover:bg-gray-50 bg-white border border-[#EAECF3]"}`;

  const sections = [
    { key: "personal", label: "Personal Information" },
    { key: "cars", label: "My Cars" },
    { key: "bids", label: "My Bids" },
    { key: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="bg-white">
      {/* Hamburger toggle visible only on mobile */}
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200">
        <span className="font-semibold text-[#2E3D83]">Profile Menu</span>
        <button
          className="text-[#2E3D83] focus:outline-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <Minus /> : <Plus />}
        </button>
      </div>

      {/* Sidebar links */}
      <div
        className={`space-y-4 transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-[500px] p-4" : "max-h-0 overflow-hidden lg:max-h-full lg:p-4"}`}
      >
        {sections.map((section) => {
          const isActive = active === section.key;
          return (
            <button
              key={section.key}
              onClick={() => setActive(section.key as Props["active"])}
              className={buttonClass(isActive)}
            >
              {isActive && (
                <span className="absolute right-0 top-[4px] bottom-[4px] w-[5px] bg-[#F9C146] rounded-md"></span>
              )}
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
