'use client'

import { CategoryCard } from "@/components/ui/category-card"
import { CarouselNavigation } from "@/components/ui/carousel-navigation"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import '../../../styles/swiper.css'



export function CategoriesSection({title,description,categoriesData,sectionType}:{title:string, description?:string, categoriesData: any[], sectionType?: 'movies' | 'shows'}) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = categoriesData.length

  const handlePrevious = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    swiperRef.current?.slideNext()
  }

  return (
    <section className="py-16 px-4 ">
      <div className="max-w-350 3xl:max-w-400 mx-auto overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-white text-3xl 3xl:text-5xl font-bold ">
              {title}
            </h2>
           { description && <p className="text-gray-400 text-sm 3xl:text-lg mt-2 3xl:mt-5">
              {description}
            </p>}
          </div>
          
          <CarouselNavigation
            currentSlide={currentSlide}
            totalSlides={categoriesData.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex % categoriesData.length)
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
        >
          {categoriesData.map((category, index) => (
            <SwiperSlide key={index}>
              <CategoryCard
                title={category.title}
                movies={category.movies}
                sectionType={sectionType}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}