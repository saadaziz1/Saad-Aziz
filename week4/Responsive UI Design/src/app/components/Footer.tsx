import imgFrame221 from "../../assets/e00ee2d0aac5ae9d87705b009959a513860aeef8.png";

export function Footer() {
  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 pt-[80px] pb-[40px]">
      {/* Separator line */}
      <div className="w-full h-px bg-white opacity-10 mb-[80px]" />

      <div className="grid grid-cols-5 gap-8 px-[calc(12.5%)]">
        {/* Resources Column */}
        <div className="flex flex-col gap-1 text-[#e7e7e7] text-[14px] font-['Poppins']">
          <p>Resources</p>
          <p>Support-A-Creator</p>
          <p>Distribute on Epic Games</p>
        </div>

        {/* Made By Epic Games Column */}
        <div className="flex flex-col gap-1 text-[#e7e7e7] text-[14px] font-['Poppins']">
          <p>Made By Epic Games</p>
          <p>Battle Breakers</p>
          <p>Fortnite</p>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-1 text-[#e7e7e7] text-[14px] font-['Poppins']">
          <p>Robo Recall</p>
          <p>Shadow Complex</p>
          <p>Unreal Tournament</p>
        </div>

        {/* Column 4 - Empty in design */}
        <div />

        {/* Social Media */}
        <div className="flex gap-4">
          <img src={imgFrame221} alt="Social" className="w-[30px] h-[30px]" />
        </div>
      </div>

      {/* Bottom Links */}
      <div className="flex gap-6 px-[calc(12.5%)] mt-12 text-[#666] text-[12px] font-['Poppins']">
        <a href="#" className="hover:text-white">© 2023, Epic Games, Inc.</a>
        <a href="#" className="hover:text-white">Terms of Service</a>
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Store Refund Policy</a>
      </div>
    </div>
  );
}
