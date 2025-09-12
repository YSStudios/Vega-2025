'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, Variants, AnimatePresence } from 'framer-motion';
import MuxPlayer from '@mux/mux-player-react';
import styles from '@/styles/fullscreen-sticky.module.css';

interface FullscreenStickyProps {
  title: string;
  description: string;
  videoNumber?: string;
  imageSrc?: string;
  videoSrc?: string;
  muxPlaybackId?: string;
  alt?: string;
  disableScrollSnap?: boolean;
  relativeTextPosition?: boolean;
}

export function FullscreenSticky({ 
  title,
  description,
  videoNumber,
  imageSrc, 
  videoSrc, 
  muxPlaybackId,
  alt = '',
  disableScrollSnap = false,
  relativeTextPosition = false
}: FullscreenStickyProps) {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    amount: 0.5, // Increased threshold - text appears later
    once: false
  });

  // Text is now truly fixed in position, no need for scroll transforms

  const titleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2, // Delay before title appears
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.2, // Faster fade out
        ease: "easeIn"
      }
    }
  };

  const descriptionVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3, // Delay before description appears
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 30,
      scale: 0.95,
      transition: {
        duration: 0.15, // Faster fade out
        ease: "easeIn"
      }
    }
  };

  const numberVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: -20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.15, // Delay before number appears
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.1, // Faster fade out
        ease: "easeIn"
      }
    }
  };

  return (
    <article 
      className={`${styles.article} ${disableScrollSnap ? styles.noScrollSnap : ''}`} 
      ref={ref}
    >
      <div className={styles.fullScreenSticky}>
        {muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            autoPlay
            muted
            loop
            playsInline
            className={styles.media}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : videoSrc ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className={styles.media}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <img 
            src={imageSrc} 
            alt={alt}
            className={styles.media}
          />
        ) : null}
      </div>
      
      {/* Text overlay - fixed for most slides, relative for last slide */}
      <AnimatePresence mode="wait">
        {(isInView || relativeTextPosition) && (
          <motion.div 
            ref={textRef} 
            className={`${styles.parallaxText} ${relativeTextPosition ? styles.relativeText : ''}`}
            key={`text-${title}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              exit: { opacity: 0 }
            }}
            transition={{ 
              duration: 0.4, // Slightly longer overall transition
              delay: 0.1 // Small delay before fade in
            }}
          >
            <motion.div 
              className={styles.titleSection}
              variants={titleVariants}
            >
              <h1 className={styles.mainTitle}>{title}</h1>
            </motion.div>
            
            <motion.div 
              className={styles.descriptionSection}
              variants={descriptionVariants}
            >
              {videoNumber && (
                <motion.div 
                  className={styles.videoNumber}
                  variants={numberVariants}
                >
                  {videoNumber}
                </motion.div>
              )}
              <p className={styles.description}>{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
