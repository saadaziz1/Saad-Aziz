import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    number: "01",
    question: "What is StreamVibe?",
    answer: "StreamVibe is a streaming service that allows you to watch movies and shows on demand."
  },
  {
    number: "02",
    question: "How much does StreamVibe cost?",
    answer: "StreamVibe offers different subscription plans to suit your needs. Our Basic plan starts at $9.99/month, Standard at $12.99/month, and Premium at $14.99/month."
  },
  {
    number: "03",
    question: "What content is available on StreamVibe?",
    answer: "StreamVibe offers a wide variety of content including the latest blockbusters, classic movies, popular TV shows, documentaries, and exclusive originals."
  },
  {
    number: "04",
    question: "How can I watch StreamVibe?",
    answer: "You can watch StreamVibe on various devices including smartphones, tablets, smart TVs, laptops, gaming consoles, and VR headsets."
  },
  {
    number: "05",
    question: "How do I sign up for StreamVibe?",
    answer: "Simply click on the 'Start Free Trial' button and follow the registration process. You'll need to provide your email and payment information."
  },
  {
    number: "06",
    question: "What is the StreamVibe free trial?",
    answer: "New users can enjoy a 7-day free trial of our Premium plan. You can cancel anytime during the trial period without being charged."
  },
  {
    number: "07",
    question: "How do I contact StreamVibe customer support?",
    answer: "You can reach our customer support team 24/7 through email at support@streamvibe.com or through our live chat feature."
  },
  {
    number: "08",
    question: "What are the StreamVibe payment methods?",
    answer: "We accept all major credit cards, debit cards, PayPal, and various digital payment methods depending on your region."
  }
];

export function FaqSection() {
  return (
    <section className="py-20 bg-[#141414]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Header */}
          <div className="lg:w-2/5">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#999] text-lg mb-8">
              Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.
            </p>
            <button className="bg-[#e50000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg transition-colors">
              Ask a Question
            </button>
          </div>

          {/* Right Side - Accordion */}
          <div className="lg:w-3/5">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.number} 
                  value={faq.number}
                  className="bg-[#1a1a1a] border border-[#262626] rounded-xl px-8 py-6 data-[state=open]:border-[#e50000]"
                >
                  <AccordionTrigger className="text-white hover:no-underline text-left">
                    <div className="flex items-center gap-6 w-full">
                      <span className="text-white/50 text-lg">{faq.number}</span>
                      <span className="text-lg font-semibold">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#999] text-base pl-14 pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
