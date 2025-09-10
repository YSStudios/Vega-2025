'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FullscreenVideoProps {
  src: string;
  poster?: string;
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
  src,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = '',
  onPlay,
  onPause,
  onEnded
}: FullscreenVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
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

  const handleVideoClick = () => {
    if (!controls) {
      togglePlayPause();
    }
  };

  return (
    <div 
      className={`fullscreen-video-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        cursor: showControls || !isPlaying ? 'pointer' : 'none',
        marginLeft: 'calc(-50vw + 50%)'
      }}
    >
      <motion.video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        onClick={handleVideoClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />

      {!isLoaded && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '1.2rem'
          }}
        >
          Loading video...
        </motion.div>
      )}

      <AnimatePresence>
        {showControls && controls && (
          <motion.div
            className="video-controls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={togglePlayPause}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .fullscreen-video-container {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        @media (max-width: 768px) {
          .video-controls {
            bottom: 1rem !important;
            padding: 0.8rem 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .video-controls {
            bottom: 0.5rem !important;
            padding: 0.6rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}