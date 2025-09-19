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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
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

  // Detect mobile devices and setup
  useEffect(() => {
    const detectMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };

    detectMobile();

    // Suppress common HLS console errors that don't affect functionality
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      // Suppress HLS stall and buffering errors
      if (message.includes('getErrorFromHlsErrorData') ||
          message.includes('bufferStalledError') ||
          message.includes('fragBufferTimeOut')) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const attemptPlay = useCallback(async (player: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!player) return false;

    try {
      await player.play();
      setAutoplayBlocked(false);
      return true;
    } catch {
      console.log('Autoplay prevented by browser, attempting fallback');
      setAutoplayBlocked(true);

      // For mobile, try to load and prepare the video without playing
      if (isMobile) {
        try {
          // MuxPlayer specific methods
          if (player.load) {
            player.load();
          }
          if (player.currentTime !== undefined) {
            player.currentTime = 0;
          }
          // Force show first frame
          return true;
        } catch (loadError) {
          console.error('Failed to load video on mobile:', loadError);
          return false;
        }
      }
      return false;
    }
  }, [isMobile]);

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);

    // Pause all other videos and handle the current one
    muxPlayerRefs.current.forEach(async (player, index) => {
      if (player) {
        if (index === currentIndex) {
          if (loadedVideos.has(index)) {
            if (autoPlay) {
              await attemptPlay(player);
            } else if (isMobile) {
              // Even if autoPlay is false, prepare the video on mobile
              try {
                player.load();
                player.currentTime = 0;
              } catch (error) {
                console.log('Failed to prepare video on mobile:', error);
              }
            }
          }
        } else {
          player.pause();
        }
      }
    });
  }, [currentIndex, autoPlay, loadedVideos, isMobile, attemptPlay]);

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
  }, [videos.length, goToNext, goToPrevious]);

  const handleLoadedData = async (index: number) => {
    setLoadedVideos(prev => new Set([...prev, index]));

    if (index === currentIndex && muxPlayerRefs.current[index]) {
      const player = muxPlayerRefs.current[index];

      if (autoPlay) {
        await attemptPlay(player);
      } else if (isMobile) {
        // Prepare video for mobile even without autoplay
        try {
          player.currentTime = 0;
        } catch (error) {
          console.log('Failed to prepare mobile video:', error);
        }
      }
    }
  };

  const handleError = (index: number, error?: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Suppress HLS stall errors which are common on mobile
    if (error && error.type === 'hlsError' && error.details === 'bufferStalledError') {
      return;
    }
    console.error(`Video ${index} failed to load`, error);
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

  const togglePlayPause = async () => {
    const video = muxPlayerRefs.current[currentIndex];
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      await attemptPlay(video);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    // Mark user interaction for mobile autoplay
    if (isMobile && !userInteracted) {
      setUserInteracted(true);
      // Try to play current video after user interaction
      const currentPlayer = muxPlayerRefs.current[currentIndex];
      if (currentPlayer && autoplayBlocked) {
        currentPlayer.play().catch(() => {
          console.log('Still unable to play after user interaction');
        });
      }
    }

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
            autoPlay="muted"
            preload="auto"
            disableTracking
            onLoadedData={() => handleLoadedData(index)}
            onError={(error) => handleError(index, error)}
            onPlay={index === currentIndex ? handlePlay : undefined}
            onPause={index === currentIndex ? handlePause : undefined}
            onEnded={index === currentIndex ? handleEnded : undefined}
            onCanPlay={() => {
              if (isMobile && index === currentIndex && autoPlay) {
                const player = muxPlayerRefs.current[index];
                if (player) {
                  player.play().catch(() => {
                    console.log('Mobile autoplay failed');
                    setAutoplayBlocked(true);
                  });
                }
              }
            }}
            className="fullscreen-video"
            style={{
              width: '100%',
              height: '100%',
              '--controls': 'none',
              '--media-object-fit': 'cover',
              ...(isMobile && {
                '--media-webkit-playsinline': '',
                '--media-x5-playsinline': '',
                '--media-x5-video-player-type': 'h5',
                '--media-x5-video-player-fullscreen': 'true'
              })
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

      {/* Mobile autoplay blocked overlay */}
      {isMobile && autoplayBlocked && loadedVideos.has(currentIndex) && !isPlaying && (
        <motion.div
          className="video-overlay play-prompt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={togglePlayPause}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>▶</div>
          <div style={{ fontSize: '1rem', textAlign: 'center' }}>Tap to play video</div>
        </motion.div>
      )}

      {/* Video Title Overlay - Hidden for scroll-based text overlay */}

      {/* Navigation hidden for scroll-based control */}

      {/* Video controls hidden for clean overlay experience */}

    </div>
  );
}