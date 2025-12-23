"use client";

interface FreeTrialSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onStartTrial?: () => void;
}

export function FreeTrialSection({
  title = "Start your free trial today!",
  subtitle = "This is a clear and concise call-to-action that encourages users to sign up for a free trial of StreamVibe.",
  buttonText = "Start a Free Trial",
  onStartTrial
}: FreeTrialSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-350 3xl:max-w-400 mx-auto">
        <div 
          className="relative px-12 lg:px-[60px] py-15 lg:py-[80px] h-[355px] lg:h-[250px] bg-gradient-to-r from-black to-red-600/20 rounded-lg   overflow-hidden"
          style={{
            backgroundImage: `url('/images/hero-img.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-red-600/30 "></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="flex-1">
              <h2 className="text-white text-2xl lg:text-4xl 3xl:text-5xl font-bold mb-4">
                {title}
              </h2>
              <p className="text-gray-300 text-sm lg:text-base 3xl:text-lg max-w-4xl">
                {subtitle}
              </p>
            </div>
            
            <button
              onClick={onStartTrial}
              className="bg-red-600 hover:bg-red-700 text-sm lg:text-base 3xl:text-lg text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}