const plans = [
  {
    name: "Basic Plan",
    description: "Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.",
    price: "9.99",
    period: "/month"
  },
  {
    name: "Standard Plan",
    description: "Access to a wider selection of movies and shows, including most new releases and exclusive content",
    price: "12.99",
    period: "/month"
  },
  {
    name: "Premium Plan",
    description: "Access to a widest selection of movies and shows, including all new releases and Offline Viewing",
    price: "14.99",
    period: "/month"
  }
];

export function PricingSection() {
  return (
    <section className="py-20 bg-[#141414]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose the plan that's right for you
          </h2>
          <p className="text-[#999] text-lg max-w-3xl mx-auto">
            Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ 
  name, 
  description, 
  price, 
  period 
}: { 
  name: string; 
  description: string; 
  price: string; 
  period: string;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#262626] p-8 hover:border-[#e50000] transition-colors">
      <div className="flex flex-col h-full">
        {/* Plan Info */}
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
          <p className="text-[#999] text-base mb-8 leading-relaxed">{description}</p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1 mb-8">
          <span className="text-5xl font-semibold text-white">${price}</span>
          <span className="text-lg text-[#999] pb-2">{period}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-[#141414] hover:bg-[#0a0a0a] border border-[#262626] text-white px-6 py-3 rounded-lg transition-colors">
            Start Free Trial
          </button>
          <button className="flex-1 bg-[#e50000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg transition-colors">
            Choose Plan
          </button>
        </div>
      </div>
    </div>
  );
}
