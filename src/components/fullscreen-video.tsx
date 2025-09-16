'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';

interface VideoSlide {
  playbackId: string;
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
  currentIndex?: number;
  opacity?: number;
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
  currentIndex: externalIndex,
  opacity = 1,
  onPlay,
  onPause,
  onEnded
}: FullscreenVideoProps) {
  const router = useRouter();
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const muxPlayerRefs = useRef<(any | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    if (externalIndex === undefined) {
      setInternalIndex((prev) => (prev + 1) % videos.length);
    }
    setHasError(false);
  }, [externalIndex, videos.length]);

  const goToPrevious = useCallback(() => {
    if (externalIndex === undefined) {
      setInternalIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
    setHasError(false);
  }, [externalIndex, videos.length]);

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);

    // Pause all other videos and play the current one
    muxPlayerRefs.current.forEach((player, index) => {
      if (player) {
        if (index === currentIndex) {
          if (autoPlay) {
            // On mobile, try to play immediately and handle loading state
            const attemptPlay = () => {
              if (player.readyState >= 3 || loadedVideos.has(index)) {
                // Only attempt autoplay if user has interacted or it's not a mobile device
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (!isMobile || hasUserInteracted) {
                  player.play().catch(() => {
                    console.log('Autoplay prevented by browser');
                  });
                }
              } else {
                // If not ready, wait for loadeddata event
                const onLoadedData = () => {
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                  if (!isMobile || hasUserInteracted) {
                    player.play().catch(() => {
                      console.log('Autoplay prevented by browser');
                    });
                  }
                  player.removeEventListener('loadeddata', onLoadedData);
                };
                player.addEventListener('loadeddata', onLoadedData);
              }
            };
            attemptPlay();
          }
        } else {
          player.pause();
        }
      }
    });
  }, [currentIndex, autoPlay, loadedVideos, hasUserInteracted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (videos.length <= 1) return;

      setHasUserInteracted(true);

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

    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      // Try to play current video after first interaction
      const currentPlayer = muxPlayerRefs.current[currentIndex];
      if (currentPlayer && autoPlay && loadedVideos.has(currentIndex)) {
        currentPlayer.play().catch(() => {
          console.log('Autoplay prevented by browser');
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [videos.length, goToNext, goToPrevious, currentIndex, autoPlay, loadedVideos]);

  const handleLoadedData = (index: number) => {
    setLoadedVideos(prev => new Set([...prev, index]));
    if (autoPlay && index === currentIndex && muxPlayerRefs.current[index]) {
      // Force play attempt on mobile after load
      const player = muxPlayerRefs.current[index];
      if (player) {
        // Use a small delay to ensure the video is truly ready
        setTimeout(() => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (!isMobile || hasUserInteracted) {
            player.play().catch(() => {
              console.log('Autoplay prevented by browser');
            });
          }
        }, 100);
      }
    }
  };

  const handleError = (index: number) => {
    console.error(`Video ${index} failed to load`);
    setHasError(true);
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
    const video = muxPlayerRefs.current[currentIndex];
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
    setHasUserInteracted(true);
    const currentVideo = videos[currentIndex];
    console.log('Video clicked!', currentVideo?.caseStudySlug); // Debug log
    if (currentVideo?.caseStudySlug) {
      console.log('Navigating to:', `/case-study/${currentVideo.caseStudySlug}`); // Debug log
      router.push(`/case-study/${currentVideo.caseStudySlug}`);
    } else if (!controls) {
      togglePlayPause();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setHasUserInteracted(true);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      style={{ 
        opacity,
        transition: 'opacity 0.8s ease-in-out'
      }}
    >
      {videos.map((video, index) => (
        <motion.div
          key={`video-${index}`}
          className="fullscreen-video-wrapper"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentIndex && loadedVideos.has(index) ? 1 : 0,
            zIndex: index === currentIndex ? 2 : 1
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          onClick={handleVideoClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <MuxPlayer
            ref={el => { muxPlayerRefs.current[index] = el; }}
            playbackId={video.playbackId}
            poster={video.poster}
            muted={muted}
            loop={loop}
            playsInline
            preload="auto"
            disableTracking
            onLoadedData={() => handleLoadedData(index)}
            onError={() => handleError(index)}
            onPlay={index === currentIndex ? handlePlay : undefined}
            onPause={index === currentIndex ? handlePause : undefined}
            onEnded={index === currentIndex ? handleEnded : undefined}
            className="fullscreen-video"
            style={{ 
              width: '100%', 
              height: '100%',
              '--controls': 'none',
              '--media-object-fit': 'cover'
            } as React.CSSProperties}
          />
        </motion.div>
      ))}

      {!loadedVideos.has(currentIndex) && !hasError && (
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
              if (muxPlayerRefs.current[currentIndex]) {
                muxPlayerRefs.current[currentIndex]?.load();
              }
            }}
            className="retry-button"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Video Title Overlay - Hidden for scroll-based text overlay */}

      {/* Navigation hidden for scroll-based control */}

      {/* Video controls hidden for clean overlay experience */}

    </div>
  );
}