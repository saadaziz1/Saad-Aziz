"use client";

import { FreeTrialSection } from "@/components/sections/Homepage/FreeTrialSection";

import { Card } from "@/components/ui/card";
import { CarouselNavigation } from "@/components/ui/carousel-navigation";
import { Plus, Volume2, VolumeX, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { useMovies } from "../../../hooks/useMovies";
import { useAuthStore } from "../../../lib/authStore";



const page = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { getMovie } = useMovies();
  const [isMuted, setIsMuted] = useState(true);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  const castSwiperRef = useRef<SwiperType>(null);
  const reviewsSwiperRef = useRef<SwiperType>(null);
  
  const movieId = params.id as string;
  const { data: movieData, isLoading } = getMovie(movieId);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading...
        </div>
      </div>
    );
  }
  
  if (!movieData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }
  
  const movie = movieData;
  
  // Dummy reviews data
  const reviews = [
    { name: "Aniket Roy", location: "From India", rating: 5, review: "This movie was recommended to me by a very dear friend who went for this movie by himself. I went to the cinemas to watch but had a houseful board so couldn't watch it." },
    { name: "Swaraj", location: "From India", rating: 5, review: "A restless king promises his heroes to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace in a piece of mind." },
    { name: "Rahul Sharma", location: "From India", rating: 4, review: "Great cinematography and storytelling. The cultural elements are beautifully portrayed throughout the film." },
    { name: "Priya Nair", location: "From India", rating: 5, review: "Absolutely stunning visuals and powerful performances. The folklore elements are woven beautifully into the narrative." },
    { name: "Arjun Kumar", location: "From India", rating: 4, review: "A masterpiece that showcases the rich cultural heritage. The action sequences are well choreographed." },
    { name: "Meera Patel", location: "From India", rating: 5, review: "This film is a perfect blend of tradition and modernity. The spiritual themes are handled with great sensitivity." },
    { name: "Vikram Singh", location: "From India", rating: 4, review: "Excellent direction and cinematography. The forest scenes are particularly captivating and immersive." },
    { name: "Kavya Reddy", location: "From India", rating: 5, review: "A cinematic gem that celebrates our roots. The performances are outstanding and the story is deeply moving." }
  ];

  const onPlay = (movieId: string) => {
    if (isAuthenticated) {
      router.push(`/watch/${movieId}`);
    } else {
      router.push("/auth/login");
    }
  };

  const onWatchlist = (movieId: string) => {
    if (isAuthenticated) {
      console.log("Adding to watchlist:", movieId);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div >
      <main className="max-w-350 3xl:max-w-400 mx-auto px-4 py-8 mt-20 3xl:mt-30">
        <div className="relative h-[709px] mb-12 rounded-xl overflow-hidden">
        <div className="relative h-full rounded-xl">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t  from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full px-8 text-center max-w-4xl">
            <h1 className="text-white text-5xl 3xl:text-7xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-300 text-lg 3xl:text-xl mb-8 leading-relaxed line-clamp-3 hidden lg:block">
              {movie.description}
            </p>
            
            <div className="flex flex-col lg:flex-row  items-center justify-center gap-4 mb-8">
              <button
                onClick={() => onPlay(movie._id)}
                className="bg-red-600 hover:bg-red-700 w-full lg:w-fit justify-center text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Now
              </button>
              <div className="flex gap-2">
              <button
                onClick={() => onWatchlist(movie._id)}
                className="bg-[#262626]/80 hover:bg-[#333]/80 text-white p-4 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-[#262626]/80 hover:bg-[#333]/80 text-white p-4 rounded-lg transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              </div>
            </div>
          </div>
        </div>
        </div>


        <section className="flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-2/3 ">
                <Card className="text-base 3xl:text-lg font-normal bg-[#1A1A1A] p-10 mb-5 border border-[#262626]" >
                <h3 className="text-gray-400">Description</h3>
                <p className="text-white">{movie.description}</p>
            </Card>

            <Card className="text-base 3xl:text-lg font-normal bg-[#1A1A1A] p-10 mb-5 border border-[#262626]" >
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Cast</h3>
                  <div>
                    <button 
                      onClick={() => castSwiperRef.current?.slidePrev()}
                      className="text-white p-2 bg-[#1A1A1A] rounded-full border border-[#262626] hover:bg-[#262626] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => castSwiperRef.current?.slideNext()}
                      className="text-white p-2 ml-2 bg-[#1A1A1A] rounded-full border border-[#262626] hover:bg-[#262626] transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <Swiper
                    onBeforeInit={(swiper) => {
                      castSwiperRef.current = swiper;
                    }}
                    slidesPerView={6}
                    spaceBetween={8}
                    breakpoints={{
                      320: { slidesPerView: 3 },
                      640: { slidesPerView: 4 },
                      768: { slidesPerView: 5 },
                      1024: { slidesPerView: 6 }
                    }}
                  >
                    {(movie.cast || []).map((castMember, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-24 h-24 bg-[#262626] rounded-md flex items-center justify-center border border-[#404040]">
                          <span className="text-white text-xs text-center px-2">{castMember.name}</span>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>                
            </Card>

            <Card className="text-base 3xl:text-lg font-normal bg-[#1A1A1A] p-10 mb-5 border border-[#262626] overflow-hidden" >
                <h3 className="text-gray-400 mb-4">Reviews</h3>
                
                <div className="mb-4">  
                  <Swiper
                    onBeforeInit={(swiper) => {
                      reviewsSwiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => setCurrentReviewSlide(swiper.activeIndex)}
                    slidesPerView={2}
                    spaceBetween={16}
                    loop={true}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      768: { slidesPerView: 2 }
                    }}
                  >
                    {reviews.map((review, index) => (
                      <SwiperSlide key={index} >
                        <div className="bg-[#141414] p-4 rounded-lg border border-[#262626] h-40 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="text-white font-medium">{review.name}</h4>
                            <span className="text-gray-400 text-sm">{review.location}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[1,2,3,4,5].map((star) => (
                              <span key={star} className={`text-sm 3xl:text-base ${star <= review.rating ? 'text-red-500' : 'text-gray-400'}`}>★</span>
                            ))}
                            <span className="text-white text-sm 3xl:text-base ml-1">{review.rating}</span>
                          </div>
                          <p className="text-gray-300 text-sm 3xl:text-base leading-relaxed flex-1 overflow-hidden">
                            {review.review}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                
                <div className="flex items-center justify-center">
                  <CarouselNavigation 
                  currentSlide={currentReviewSlide}
                  totalSlides={reviews.length}
                  onPrevious={() => reviewsSwiperRef.current?.slidePrev()}
                  onNext={() => reviewsSwiperRef.current?.slideNext()}
                />
                </div>
            </Card>
            </div>


            <div className="w-full lg:w-1/3">
            <Card className="text-base 3xl:text-lg font-normal bg-[#1A1A1A] p-10 border-[#262626]" >
              <div className="mb-6">
                  <h3 className="text-gray-400">Release Year</h3>
                <p className="text-white">{movie.releaseYear}</p>
              </div>
               <div className="mb-6">
                  <h3 className="text-gray-400">Available Languages</h3>
               <div className="flex gap-3 flex-wrap mt-2">
                 {(movie.languages || []).map((item,index)=><p key={index} className="text-white bg-[#141414] rounded-md border p-2 border-[#262626]">{item}</p>)}
               </div>
              </div>
              
             
               <div className="mb-6">
                  <h3 className="text-gray-400">Genres</h3>
               <div className="flex gap-3 flex-wrap mt-2">
                 {[movie.genre].filter(Boolean).map((item,index)=><p key={index} className="text-white bg-[#141414] rounded-md border p-2 border-[#262626]">{item}</p>)}
               </div>
              </div>
               <div className="mb-6">
                  <h3 className="text-gray-400">Director</h3>
                <div  className="flex text-white bg-[#141414] rounded-md border p-2 py-3 items-center gap-2 border-[#262626]">
                  <div 
                    className="w-12 h-12 bg-cover bg-center rounded-md" 
                    style={{
                      backgroundImage: `url('${movie.director?.image || '/images/movies/director.png'}')`
                    }}
                  />

<div>
  <p className="text-base">{movie.director?.name}</p>
  <span className="text-gray-400 text-sm">From {movie.director?.country}</span>
</div>
                </div>
              </div>
              
            </Card>
            </div>
        </section>

        <FreeTrialSection />
      </main>
    </div>
  );
};

export default page;