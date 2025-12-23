import { FAQItem } from "../../ui/faq-item";

interface FAQData {
  id: string;
  question: string;
  answer: string;
  number: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  faqs: FAQData[];
  onButtonClick?: () => void;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.",
  buttonText = "Ask a Question",
  faqs,
  onButtonClick
}: FAQSectionProps) {
  return (
    <section className=" py-16 px-4">
      <div className="max-w-350 3xl:max-w-400 mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
          <div className="flex-1">
            <h2 className="text-white text-3xl 3xl:text-5xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-gray-400 text-sm 3xl:text-lg max-w-4xl">
              {subtitle}
            </p>
          </div>
          
          {buttonText && (
            <button
              onClick={onButtonClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors self-start lg:self-auto"
            >
              {buttonText}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-0">
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                number={faq.number}
              />
            ))}
          </div>
          
          <div className="space-y-0">
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                number={faq.number}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}