"use client";

import { useParams } from "next/navigation";
import { useMovies } from "../../../hooks/useMovies";
import { useSubscription } from "../../../hooks/useSubscription";
import { useProtectedRoute } from "../../../hooks/useProtectedRoute";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Maximize, Minimize, Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const WatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const { canAccess } = useProtectedRoute({ requireAuth: true });
  const { user } = useAuthStore();
  const { getMovie, getStreamUrl } = useMovies();
  const { subscription } = useSubscription();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const movieId = params.id as string;
  const { data: movie, isLoading: movieLoading } = getMovie(movieId);
  const { data: streamUrl, isLoading: streamLoading } = getStreamUrl(movieId);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);

      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      if (header) header.style.display = isFs ? 'none' : 'block';
      if (footer) footer.style.display = isFs ? 'none' : 'block';
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      if (header) header.style.display = 'block';
      if (footer) footer.style.display = 'block';
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen?.();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!canAccess) {
    return null;
  }

  if (movieLoading || streamLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Movie not found</div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const hasAccess = isSuperAdmin || (subscription && (subscription.status?.toLowerCase() === 'active' || subscription.status?.toLowerCase() === 'trial'));

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-[#1A1A1A] border-[#262626] p-8 text-center max-w-md">
          <h2 className="text-white text-2xl font-bold mb-4">Subscription Required</h2>
          <p className="text-gray-300 mb-6">
            You need an active subscription to watch this content.
            Start your free trial or choose a plan to continue.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                View Subscription Plans
              </Button>
            </Link>
            <Button
              onClick={() => router.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`bg-black ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen py-25'}`}
      onMouseMove={handleMouseMove}
      onClick={togglePlayPause}
    >
      <div className="relative h-full">
        <div className={`transition-opacity duration-300 ${showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isFullscreen) {
                document.exitFullscreen?.();
              } else {
                router.back();
              }
            }}
            className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
        </div>

        <div className={isFullscreen ? "w-full h-full" : "w-full h-[calc(100vh-4rem)]"}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-white flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                Loading video...
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-contain"
            poster={movie.thumbnailUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onVolumeChange={(e) => {
              setVolume(e.currentTarget.volume);
              setIsMuted(e.currentTarget.muted);
            }}
          >
            <source src={streamUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-4">
            <div className="relative mb-4">
              <div className="w-full h-1 bg-gray-600 rounded-lg">
                <div
                  className="h-1 bg-red-600 rounded-lg transition-all duration-150"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <div className="relative w-20">
                    <div className="w-full h-1 bg-gray-600 rounded-lg">
                      <div
                        className="h-1 bg-red-600 rounded-lg transition-all duration-150"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <span className="text-white text-xs lg:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="text-right">
                <h1 className="text-white text-sm lg:text-xl font-bold">{movie.title}</h1>
                <div className="flex justify-end lg:justify-start items-center gap-2 text-right text-gray-400 text-xs lg:text-sm ">
                  <span>{movie.releaseYear}</span>
                  <span>{Math.floor(movie.duration / 60)}m</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">{movie.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute top-1/2 left-8 transform -translate-y-1/2 max-w-md transition-opacity duration-300 ${!isPlaying && showControls ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-white text-xl lg:text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 text-sm lg:text-lg leading-relaxed">{movie.description}</p>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #e50914;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #e50914;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default WatchPage;