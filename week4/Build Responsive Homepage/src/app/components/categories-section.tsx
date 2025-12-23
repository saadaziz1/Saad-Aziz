import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import imgImage37 from "../../assets/ed78314428f854e65ac0dd7822393d1e79f81274.png";
import imgImage38 from "../../assets/aeeb7a124d9536cca7e7bd93b1be47ac930de0fe.png";
import imgImage39 from "../../assets/10f2357035e5b7f836006fbb218c46c938fd8eff.png";
import imgImage40 from "../../assets/80b5d5c9724ee31a57bb49f721b164f6bc4f707f.png";
import imgImage41 from "../../assets/9dafcd774733b09ee4369ef4ba94ea77d4109669.png";
import imgImage47 from "../../assets/b71000f47f01a265a7d7e2147310e546a54865c3.png";
import imgImage48 from "../../assets/a393eadf78b9def23f7b2041c8595c83d4ecd76e.png";
import imgImage49 from "../../assets/d6a49d94782313850a1e5750ce4773eb6cc46170.png";
import imgImage50 from "../../assets/a46096544dfa2ce87b93c11b72980e42641eb4d8.png";

const categories = [
  { name: "Action", images: [imgImage37, imgImage38, imgImage39, imgImage40] },
  { name: "Adventure", images: [imgImage38, imgImage39, imgImage40, imgImage41] },
  { name: "Comedy", images: [imgImage39, imgImage40, imgImage41, imgImage47] },
  { name: "Drama", images: [imgImage40, imgImage41, imgImage47, imgImage48] },
  { name: "Horror", images: [imgImage41, imgImage47, imgImage48, imgImage49] },
];

export function CategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 5 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= categories.length - 5 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#141414]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Explore our wide variety of categories
            </h2>
            <p className="text-[#999] text-lg">
              Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new
            </p>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:bg-[#262626] transition-colors"
            >
              <ChevronLeft className="size-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:bg-[#262626] transition-colors"
            >
              <ChevronRight className="size-6 text-white" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, idx) => (
            <CategoryCard key={idx} {...category} />
          ))}
        </div>

        {/* Navigation Buttons - Mobile */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrevious}
            className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:bg-[#262626] transition-colors"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626] hover:bg-[#262626] transition-colors"
          >
            <ChevronRight className="size-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ name, images }: { name: string; images: string[] }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#262626] p-6 hover:border-[#e50000] transition-colors group">
      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {images.map((img, idx) => (
          <div key={idx} className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={img} 
              alt="" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Category Name */}
      <div className="flex items-center justify-between">
        <span className="text-white text-xl font-semibold">{name}</span>
        <ChevronRight className="size-5 text-white group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}