'use client';

import { useState, useRef, useEffect } from 'react';
import FullscreenVideo from './fullscreen-video';
import CaseStudiesText from './case-studies-text';
import styles from '../styles/scroll-video.module.css';

const videos = [
  {
    playbackId: "Kn017g6ax7ZC14b01VCbyozkWsWJCrHcej8qsMkNiYBIU",
    title: "Giant Receipt Project - MAC Cosmetics",
    caseStudySlug: "mac-cosmetics"
  },
  {
    playbackId: "saKMQupIrVioY7mdPtRAIdCdrUWZX7ZzhRrYB00H007UI",
    title: "SoHo Installation - Behind the Scenes",
    caseStudySlug: "soho-installation"
  },
  {
    playbackId: "qLH6CPgJy00HIJxh8B67oLjT87Ly2VF00zEzvYaQk1qvA",
    title: "Lipstick Day Campaign - Final Cut",
    caseStudySlug: "lipstick-campaign"
  },
  {
    playbackId: "GO9pmH6uyGB00x024YZ2Jv1c7XJvatGx02qDGJCTZMLtDY",
    title: "Creative Campaign Project",
    caseStudySlug: "creative-campaign"
  }
];

export default function ScrollVideoSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleShouldPlay = (play: boolean) => {
    setShouldPlay(play);
  };

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      
      if (!section || !video) return;

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;

      // Calculate if section is in view and how much
      if (sectionTop <= 0 && sectionBottom > windowHeight) {
        // Section is taking full viewport, video should be sticky
        video.style.position = 'fixed';
        video.style.top = '0';
      } else if (sectionTop > 0) {
        // Section is below viewport, video should be at top of section
        video.style.position = 'absolute';
        video.style.top = '0';
      } else if (sectionBottom <= windowHeight) {
        // Section is above viewport, video should be at bottom of section  
        video.style.position = 'absolute';
        video.style.top = `${sectionRect.height - windowHeight}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.scrollVideoSection} data-scroll-video-section>
      {/* Sticky Video Background */}
      <div ref={videoRef} className={styles.videoBackground}>
        <FullscreenVideo
          videos={videos}
          currentIndex={currentVideoIndex}
          autoPlay={shouldPlay}
          opacity={shouldPlay ? 1 : 0}
          muted={true}
          loop={true}
        />
      </div>
      
      {/* Scrollable Text Content Overlay */}
      <div className={styles.textContent}>
        <CaseStudiesText 
          onVideoChange={handleVideoChange}
          currentVideoIndex={currentVideoIndex}
          onShouldPlay={handleShouldPlay}
        />
      </div>
    </section>
  );
}