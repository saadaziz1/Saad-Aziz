"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MovieCard } from "./movie-card";
import 'swiper/css';
import 'swiper/css/navigation';
import { CarouselNavigation } from "./carousel-navigation";

interface Movie {
  id: string;
  title: string;
  image: string;
  year?: string;
  rating?: number;
  genre?: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onPlay?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
  onClick?: (movieId: string) => void;
}

export function MovieCarousel({ title, movies, onPlay, onWatchlist, onClick }: MovieCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = movies.length;

  const handlePrevious = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-white text-2xl 3xl:text-5xl font-bold">{title}</h2>
       <CarouselNavigation
                   currentSlide={currentSlide}
                   totalSlides={movies.length}
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
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex % movies.length);
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
        className="movie-carousel"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard
              movie={movie}
              onPlay={onPlay}
              onWatchlist={onWatchlist}
              onClick={onClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}