import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HeroSectionProps {
  onStartWatching: () => void;
}

const HeroSection = ({ onStartWatching }: HeroSectionProps) => {
  return (
    <section className="relative w-full h-155 md:h-225.75 3xl:h-255 mb-30 ">
      
      <div className="absolute inset-0 bg-[url('/images/hero-img.jpg')] bg-cover bg-center h-125 md:h-198 3xl:h-220 flex items-center justify-center">
        <img
          src="/images/Abstract Design.png"
          alt="main icon"
          className="z-50 absolute w-50 h-50 lg:w-fit lg:h-fit 3xl:w-117 3xl:h-117 "
        />
      </div>

      <div className="absolute  top-0 left-0 right-0 h-full bg-linear-to-b from-[#141414] to-transparent pointer-events-none"></div>

      <div className="absolute  bottom-26.25 left-0 right-0 h-full bg-linear-to-t from-[#141414] to-transparent pointer-events-none"></div>
<div className="lg:max-w-7xl  mx-auto">
      <div className=" absolute  -bottom-11 max-w-275 text-center z-10 mx-4 md:mx-34   text-white">
      <h1 className="font-bold text-3xl lg:text-5xl 3xl:text-6xl mb-2.5 3xl:mb-3.5 ">The Best Streaming Experience</h1>
        <p className="hidden lg:block text-sm 3xl:text-lg font-normal leading-5 3xl:leading-8 tracking-none text-gray-400">
          StreamVibe is the best streaming experience for watching your favorite
          movies and shows on demand, anytime, anywhere. With StreamVibe, you
          can enjoy a wide variety of content, including the latest
          blockbusters, classic movies, popular TV shows, and more. You can also
          create your own watchlists, so you can easily find the content you
          want to watch.
        </p>
        <p className="lg:hidden block text-sm  font-normal leading-5 tracking-none text-gray-400">
StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere.
        </p>
        <Button onClick={onStartWatching} className="bg-[#E50000]  mt-10 text-sm 3xl:text-lg py-6" size={"lg"}>
          <Play className=""/>
          Start Watching Now
        </Button>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
