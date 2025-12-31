import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStepsProps {
  paymentDate?: string;
  deliveryDate?: string;
  status: "ready" | "transit" | "delivered" | "ended";
}

export function PaymentSteps({ paymentDate, deliveryDate, status }: PaymentStepsProps) {
  const steps = [
    { label: "Ready For Shipping", id: "ready" },
    { label: "In Transit", id: "transit" },
    { label: "Delivered", id: "delivered" },
  ];

  const getStatusIndex = (s: string) => {
    switch (s) {
      case "ready": return 0;
      case "transit": return 1;
      case "delivered": return 2;
      default: return -1;
    }
  };

  const currentIndex = getStatusIndex(status);

  // Progress width mapping: Ready = 50%, Transit = 100%, Delivered = 100%
  // If "ended" (non-winner), we show 0% progress or hide bar
  const progressWidth = currentIndex === 0 ? "50%" : currentIndex >= 1 ? "100%" : "0%";

  return (
    <Card className="p-4 sm:p-8 mt-8 border border-gray-100 bg-white shadow-sm rounded-sm text-[#2E3D83]">
      {/* Header Info or Ended Status */}
      <div className="flex flex-col sm:flex-row justify-between mb-8 md:mb-12 px-2">
        {status === "ended" ? (
          <div className="w-full flex justify-center py-2">
            <h2 className="text-2xl md:text-3xl font-bold text-red-500 uppercase tracking-tighter">Bidding has ended</h2>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-0">
              <div className="font-bold text-lg md:text-xl">{paymentDate}</div>
              <div className="text-[#939393] text-xs md:text-sm font-medium mt-1">Payment Date</div>
            </div>
            <div className="text-left sm:text-right">
              <div className="font-bold text-lg md:text-xl">{deliveryDate}</div>
              <div className="text-[#939393] text-xs md:text-sm font-medium mt-1">
                {status === "delivered" ? "Vehicle Delivered" : "Expected Delivery Date"}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress Steps - Always Shown */}
      <div className="relative flex justify-between items-start w-full px-2 sm:px-10 pb-4">
        {/* Progress Line Track */}
        <div className="absolute top-[16px] left-[16.6%] right-[16.6%] h-[3px] bg-[#F1F2FF] z-0 rounded">
          {/* Active Progress line (Green) */}
          <div
            className="h-full bg-green-500 rounded transition-all duration-700"
            style={{ width: progressWidth }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isNext = idx === currentIndex + 1;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center w-1/3">
              {/* Step Circle Container */}
              <div className="h-8 flex items-center justify-center bg-white px-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500 fill-white" />
                ) : isNext && status !== "delivered" && status !== "ended" ? (
                  <div className="w-8 h-8 rounded-full border-[3px] border-green-500 bg-white" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#F1F2FF]" />
                )}
              </div>

              {/* Step Label */}
              <div
                className={cn(
                  "mt-3 text-[9px] md:text-[10px] font-bold text-center uppercase tracking-wider px-1 wrap-break-word max-w-[80px] sm:max-w-[120px]",
                  isCompleted || (isNext && status !== "delivered" && status !== "ended") ? "text-[#2E3D83]" : "text-[#939393]"
                )}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
