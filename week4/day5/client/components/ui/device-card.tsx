import { cn } from "@/lib/utils"

interface DeviceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}

export function DeviceCard({ title, description, icon, className }: DeviceCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-[#262626] bg-[#0F0F0F] p-8", className)}>
      <div
    className="pointer-events-none absolute -top-50 -right-30 h-64 w-64 
           bg-gradient-to-tr from-[#E50000]/20 to-transparent blur-3xl"
  ></div>
      <div className="relative z-10 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 3xl:w-16 3xl:h-16 bg-[#141414] border border-[#1F1F1F] rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white text-xl 3xl:text-3xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm 3xl:text-lg leading-relaxed">{description}</p>
    </div>
  )
}