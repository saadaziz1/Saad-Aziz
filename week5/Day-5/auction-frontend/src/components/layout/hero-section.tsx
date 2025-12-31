import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface HeroSectionProps {
  title: string
  description: string
  breadcrumbs: { label: string; href?: string }[]
}

export function HeroSection({ title, description, breadcrumbs }: HeroSectionProps) {
  return (
    <div className="bg-[#C6D8F9] pt-16 px-4">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-between gap-7.5">
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#2E3D83] mb-4">{title}</h1>
        <div className="w-20 h-1 bg-[#2E3D83] mx-auto mb-6"></div>
        <p className="text-[#545677] text-lg mb-8 max-w-2xl mx-auto">{description}</p>

        <div className="flex items-center justify-center gap-2 text-sm bg-[#BBD0F6] mx-auto w-fit p-2.5">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="text-[#2E3D83] hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-[#545677]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
