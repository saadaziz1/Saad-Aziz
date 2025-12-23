import imgImage42 from "../../assets/28a6e1fa15ceb98f30ec40a18cc0c62e11f3c404.png";
import imgImage43 from "../../assets/9c7005363bfabd9a9e5caf02283cd49a3b489039.png";
import imgImage44 from "../../assets/bc1b5bc32def46b923a7170f094fdefa7712dd78.png";
import imgImage45 from "../../assets/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png";
import imgImage46 from "../../assets/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png";

const images = [imgImage42, imgImage43, imgImage44, imgImage45, imgImage46];

export function TrialCtaSection() {
  return (
    <section className="py-20 bg-[#141414]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-xl overflow-hidden">
          {/* Background Images */}
          <div className="absolute inset-0 flex gap-4 opacity-20">
            {images.map((img, idx) => (
              <div key={idx} className="flex-1">
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/70 to-[#141414]/90" />

          {/* Content */}
          <div className="relative z-10 text-center py-20 px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Start your free trial today!
            </h2>
            <p className="text-[#999] text-lg mb-8 max-w-2xl mx-auto">
              This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.
            </p>
            <button className="bg-[#e50000] hover:bg-[#cc0000] text-white px-8 py-4 rounded-lg transition-colors text-lg">
              Start a Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
