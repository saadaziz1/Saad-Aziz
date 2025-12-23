import { ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CategoryCardProps {
  title: string
  movies: Array<{
    _id?: string
    title: string
    image?: string
    thumbnailUrl?: string
    genre?: string
  }>
  className?: string
  top?: string
  sectionType?: 'movies' | 'shows'
}

export function CategoryCard({ title, movies, className, top, sectionType = 'movies' }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const genre = movies[0]?.genre || title;
    if (sectionType === 'shows') {
      router.push(`/movies?showGenre=${encodeURIComponent(genre)}`);
    } else {
      router.push(`/movies?genre=${encodeURIComponent(genre)}`);
    }
  };

  return (
    <div 
      className={cn("bg-[#1A1A1A] border border-[#262626] rounded-xl p-7.5 cursor-pointer hover:border-red-500 transition-colors", className)}
      onClick={handleClick}
    >
      <div className="grid grid-cols-2 gap-1.25 mb-1 relative">
        {movies.slice(0, 4).map((movie, index) => (
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg" key={index}>
            <Image
              src={movie.image || movie.thumbnailUrl || '/images/placeholder.jpg'}
              alt={movie.title}
              fill
              className="object-cover w-22 h-26 3xl:h-31 3xl:w-28"
            />
          </div>
        ))}
        <div className="absolute rounded-lg -bottom-1 left-0 right-0 h-full bg-linear-to-t from-[#141414] to-transparent pointer-events-none"></div>
      </div>
      
      <div className="flex items-center justify-between z-60 relative">
        <div>
          {top && <span className="bg-red-600 rounded-sm text-xs text-white p-2">{top}</span>}
          <h3 className="text-white font-semibold text-lg 3xl:text-2xl mt-2">{title}</h3>
        </div>
        <ArrowRight className="w-6 h-6 3xl:w-8 3xl:h-8 text-white" />
      </div>
    </div>
  )
}