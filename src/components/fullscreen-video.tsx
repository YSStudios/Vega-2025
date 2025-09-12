'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface VideoSlide {
  src: string;
  poster?: string;
  title?: string;
  caseStudySlug?: string;
}

interface FullscreenVideoProps {
  videos: VideoSlide[];
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function FullscreenVideo({
  videos,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = '',
  onPlay,
  onPause,
  onEnded
}: FullscreenVideoProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentVideo = videos[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsLoaded(false);
    setHasError(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsLoaded(false);
    setHasError(false);
  };

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setIsPlaying(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (videos.length <= 1) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [videos.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(() => {
          console.log('Autoplay prevented by browser');
        });
      }
    };

    const handleError = (e: Event) => {
      console.error('Video failed to load:', e);
      setHasError(true);
      setIsLoaded(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, onPlay, onPause, onEnded]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {
        console.log('Play prevented by browser');
      });
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Video clicked!', currentVideo?.caseStudySlug); // Debug log
    if (currentVideo?.caseStudySlug) {
      console.log('Navigating to:', `/case-study/${currentVideo.caseStudySlug}`); // Debug log
      router.push(`/case-study/${currentVideo.caseStudySlug}`);
    } else if (!controls) {
      togglePlayPause();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (videos.length <= 1) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (videos.length <= 1 || touchStartX.current === null || touchStartY.current === null) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // If it's a tap (small movement), treat as click
    if (absDeltaX < 10 && absDeltaY < 10) {
      handleVideoClick(e as any);
    } else if (absDeltaX > absDeltaY && absDeltaX > 50) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div 
      className={`fullscreen-video-container ${showControls || !isPlaying ? 'cursor-pointer' : 'cursor-none'} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleVideoClick}
    >
      <motion.video
        ref={videoRef}
        src={currentVideo?.src}
        poster={currentVideo?.poster}
        muted={muted}
        loop={loop}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        onClick={handleVideoClick}
        key={currentIndex}
        className="fullscreen-video"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {!isLoaded && !hasError && (
        <motion.div
          className="video-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading video...
        </motion.div>
      )}

      {hasError && (
        <motion.div
          className="video-overlay error"
          initial={{ opacity: 1 }}
        >
          <div>Failed to load video</div>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="retry-button"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Video Title Overlay */}
      <motion.div
        className="video-title-overlay"
        key={`title-${currentIndex}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="video-title-content">
          <h3 className="video-title">
            {currentVideo?.title || `Video ${currentIndex + 1} of ${videos.length}`}
          </h3>
          {currentVideo?.caseStudySlug && (
            <p className="case-study-cta">Click to view case study →</p>
          )}
        </div>
        {videos.length > 1 && (
          <div className="video-counter">
            {currentIndex + 1} / {videos.length}
          </div>
        )}
      </motion.div>

      {videos.length > 1 && (
        <>
          <motion.button
            className="nav-button nav-button-left"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls || !isPlaying ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            &#8249;
          </motion.button>

          <motion.button
            className="nav-button nav-button-right"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls || !isPlaying ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            &#8250;
          </motion.button>
        </>
      )}

      <AnimatePresence>
        {showControls && controls && (
          <motion.div
            className="video-controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="play-pause-button"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}