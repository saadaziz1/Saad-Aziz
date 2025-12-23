import { Play } from "lucide-react";
import svgPaths from "../../imports/svg-7pvnrvwdck";

// Import hero grid images
import imgImage from "../../assets/866dc7a345cf53372ec7d06e4e2671c64ad4b14c.png";
import imgImage1 from "../../assets/717aebdf85ae7888bc0e52f172ffedeba0dc2ce7.png";
import imgImage2 from "../../assets/7a2d7c975a5dab16addcff652a11945988d43f90.png";
import imgImage3 from "../../assets/69ee4b568e62d232af3f756cc95979d784fb000f.png";
import imgImage4 from "../../assets/19ab1aeb09c2c0f5d15f4dcc327ddcfea51542b3.png";
import imgImage5 from "../../assets/1a021d8564c065d119f5a6f37a19b32b9546f337.png";
import imgImage6 from "../../assets/fd6ccc0992c301027ce44676e87103bf2e61d5a5.png";
import imgImage7 from "../../assets/c2bb13c0d559d75f572c2036b7022d88d0943ef5.png";
import imgImage8 from "../../assets/02bae5827d2d1b97c1536443b6fd0cfa6927c804.png";
import imgImage9 from "../../assets/d0360e93875b705634c5316fb7022f9da941bc89.png";
import imgImage10 from "../../assets/3526e217aee638111ac534c000da908349d7623e.png";
import imgImage11 from "../../assets/b6b8b9b14ccb1e1f3fcd0b34dfee511f0b1ca838.png";
import imgImage12 from "../../assets/a3d6a05971db4ed9f55489e94b2c4093aa301755.png";
import imgImage13 from "../../assets/8aaeb2ac03d3c644f7a5ae2dbd23fef684fa7faa.png";
import imgImage14 from "../../assets/299c79826b236b9166e6ac6daa8bc0504468ef60.png";
import imgImage15 from "../../assets/c2e6e2a7303a401faeee7195b4b23d5722c376b6.png";
import imgImage16 from "../../assets/ca0e5dec2a6f45694a654cb2ba2dc3ce3957b721.png";
import imgImage17 from "../../assets/65c7bf71f38725fef2195171d3fec5aa495906d6.png";
import imgImage18 from "../../assets/5571ad4ca93ed93289be8e0f72390bbca289eecd.png";
import imgImage19 from "../../assets/b746948131b178584a2057bbb5557c090295b765.png";
import imgImage20 from "../../assets/97f2ae02a52759c832de761477d479d7cf0c53e5.png";
import imgImage21 from "../../assets/b8e9bb9e59d0868882468f8e8d5cb8f84e45ca84.png";
import imgImage22 from "../../assets/71ddcf439ec646d2a215e550989aae84180d83ec.png";
import imgImage23 from "../../assets/a076ef9db130a4c1dfac69a015214dff78ad080f.png";
import imgImage24 from "../../assets/f348bcc720a8429c7dc211845541f0f9dfe21614.png";
import imgImage25 from "../../assets/4483b90c34f08e0b6eaa3c3297facde97ca1bf15.png";
import imgImage26 from "../../assets/b8b6e1d33a97001a96dcaaaf6a69d0dd61aa30aa.png";
import imgImage27 from "../../assets/09a3264765fbe83905d0f18bff51083c9d197263.png";
import imgImage28 from "../../assets/08d624015592361a41fd2c24607f458dc82f5fbf.png";
import imgImage29 from "../../assets/0f5216847158d76d6ee094080dc3329d3fd96f0d.png";
import imgImage30 from "../../assets/9de4f5f96f86e8f1508a97e45fa87f2958026bda.png";
import imgImage31 from "../../assets/9c7207743517e38cf61dbfe7d7428d20c8caa67a.png";
import imgImage32 from "../../assets/de8324ada57085ee417f10d5831b5343e4170b75.png";
import imgImage33 from "../../assets/823019f8bd8ab7cb4bbda831937768f5cbc7fa33.png";
import imgImage34 from "../../assets/b23d11041c40716af75a9049f06e30b1ea794303.png";
import imgImage35 from "../../assets/fbb49e99df897ec74c087e2fc49f2b861a5c4ecd.png";
import imgImage36 from "../../assets/27cc322fe3416f60e1f57de572273bda8ebd7f27.png";

const row1Images = [imgImage, imgImage1, imgImage2, imgImage3, imgImage4, imgImage5, imgImage6, imgImage7, imgImage8];
const row2Images = [imgImage9, imgImage10, imgImage11, imgImage12, imgImage13, imgImage14, imgImage15, imgImage16, imgImage17];
const row3Images = [imgImage18, imgImage19, imgImage20, imgImage21, imgImage22, imgImage23, imgImage24, imgImage25, imgImage26];
const row4Images = [imgImage27, imgImage28, imgImage29, imgImage30, imgImage31, imgImage32, imgImage33, imgImage34, imgImage35];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#141414]">
      {/* Background Image Grid */}
      <div className="absolute inset-0 flex flex-col gap-5 p-5 opacity-50">
        {[row1Images, row2Images, row3Images, row4Images].map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-5 flex-1">
            {row.map((img, idx) => (
              <div key={idx} className="flex-1 rounded-xl overflow-hidden">
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Overlay Image */}
      <div className="absolute inset-0 mix-blend-overlay opacity-50">
        <img 
          src={imgImage36} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-[#141414] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Abstract Design and Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 text-center py-12">
        {/* Abstract Design */}
        <div className="absolute size-[470px] max-w-[90vw] max-h-[90vw]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 470 470">
            <g>
              <g data-figma-bg-blur-radius="12">
                <path d={svgPaths.p1aa89500} fill="url(#paint0_linear_1_517)" fillOpacity="0.3" />
                <path d={svgPaths.p5084840} stroke="url(#paint1_linear_1_517)" strokeOpacity="0.5" />
              </g>
              <g>
                <g data-figma-bg-blur-radius="12">
                  <path clipRule="evenodd" d={svgPaths.p1252580} fill="url(#paint2_linear_1_517)" fillOpacity="0.3" fillRule="evenodd" />
                  <path d={svgPaths.p2324fe80} stroke="url(#paint3_linear_1_517)" strokeOpacity="0.5" />
                </g>
              </g>
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_517" x1="11" x2="435" y1="11" y2="435">
                <stop stopColor="#E50000" />
                <stop offset="1" stopColor="#E50000" stopOpacity="0" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_517" x1="11" x2="435" y1="11" y2="435">
                <stop stopColor="#E50000" />
                <stop offset="1" stopColor="#E50000" stopOpacity="0" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_517" x1="244.062" x2="406.875" y1="212.938" y2="375.75">
                <stop stopColor="#E50000" />
                <stop offset="1" stopColor="#E50000" stopOpacity="0" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_517" x1="244.062" x2="406.875" y1="212.938" y2="375.75">
                <stop stopColor="#E50000" />
                <stop offset="1" stopColor="#E50000" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Play Button */}
        <button className="relative mb-8 p-6 bg-[#1a1a1a] rounded-full border border-[#262626] hover:bg-[#262626] transition-all hover:scale-110">
          <Play className="size-8 md:size-10 text-white fill-white" />
        </button>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
          The Best Streaming Experience
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-[#999] mb-8 max-w-3xl px-4">
          StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own playlists, so you can watch what you want, when you want.
        </p>

        {/* CTA Button */}
        <button className="bg-[#e50000] hover:bg-[#cc0000] text-white px-8 py-4 rounded-lg transition-colors">
          Start Streaming Now
        </button>
      </div>
    </section>
  );
}