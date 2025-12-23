import { Monitor, Smartphone, Tablet, Tv, Gamepad2, Headphones } from "lucide-react";

const devices = [
  {
    icon: Smartphone,
    title: "Smartphones",
    description: "StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store"
  },
  {
    icon: Tablet,
    title: "Tablet",
    description: "StreamVibe is optimized for both Android and iOS tablets. Download our app from the Google Play Store or the Apple App Store"
  },
  {
    icon: Tv,
    title: "Smart TV",
    description: "StreamVibe is available on major smart TV platforms, including Samsung, LG, Sony, and more. Simply download our app from your TV's app store"
  },
  {
    icon: Monitor,
    title: "Laptops",
    description: "StreamVibe is optimized for both Windows and MacOS laptops. Simply download our app from the Microsoft Store or the Mac App Store"
  },
  {
    icon: Gamepad2,
    title: "Gaming Consoles",
    description: "StreamVibe is available on major gaming consoles, including Xbox and PlayStation. Simply download our app from the console's app store"
  },
  {
    icon: Headphones,
    title: "VR Headsets",
    description: "StreamVibe is available on major VR headsets, including Oculus and HTC Vive. Simply download our app from the headset's app store"
  }
];

export function DevicesSection() {
  return (
    <section className="py-20 bg-[#141414]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We Provide you streaming experience across various devices.
          </h2>
          <p className="text-[#999] text-lg max-w-4xl">
            With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.
          </p>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, idx) => (
            <DeviceCard key={idx} {...device} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0f0f0f] rounded-xl border border-[#262626] p-12 hover:border-[#e50000] transition-colors group relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(229,0,0,0.5)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* Icon */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] group-hover:bg-[#262626] transition-colors">
            <Icon className="size-8 text-[#e50000]" />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-[#999] text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
