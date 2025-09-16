"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import FullscreenVideo from "./fullscreen-video";
import CaseStudiesText from "./case-studies-text";
import styles from "../styles/scroll-video.module.css";

const videos = [
  {
    playbackId: "Kn017g6ax7ZC14b01VCbyozkWsWJCrHcej8qsMkNiYBIU",
    title: "Giant Receipt Project - MAC Cosmetics",
    caseStudySlug: "mac-cosmetics #Lipstick",
  },
  {
    playbackId: "saKMQupIrVioY7mdPtRAIdCdrUWZX7ZzhRrYB00H007UI",
    title: "SoHo Installation - Behind the Scenes",
    caseStudySlug: "soho-installation",
  },
  {
    playbackId: "qLH6CPgJy00HIJxh8B67oLjT87Ly2VF00zEzvYaQk1qvA",
    title: "Lipstick Day Campaign - Final Cut",
    caseStudySlug: "lipstick-campaign",
  },
  {
    playbackId: "GO9pmH6uyGB00x024YZ2Jv1c7XJvatGx02qDGJCTZMLtDY",
    title: "Creative Campaign Project",
    caseStudySlug: "creative-campaign",
  },
];

export default function ScrollVideoSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Track scroll direction
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrollDirection(latest > previous ? 'down' : 'up');
  });

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
      const title = titleRef.current;

      if (!section || !video) return;

      // Track title visibility
      if (title) {
        const titleRect = title.getBoundingClientRect();
        const isVisible = titleRect.top < window.innerHeight && titleRect.bottom > 0;
        setIsTitleVisible(isVisible);
      }

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      // Calculate if section is in view and how much
      if (sectionTop <= 0 && sectionBottom > windowHeight) {
        // Section is taking full viewport, video should be sticky
        video.style.position = "fixed";
        video.style.top = "0";
      } else if (sectionTop > 0) {
        // Section is below viewport, video should be at top of section
        video.style.position = "absolute";
        video.style.top = "0";
      } else if (sectionBottom <= windowHeight) {
        // Section is above viewport, video should be at bottom of section
        video.style.position = "absolute";
        video.style.top = `${sectionRect.height - windowHeight}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentVideoIndex]);

  return (
    <>
      <div ref={titleRef} className={styles.sectionTitle}>
        <div className={styles.sectionTitleContainer}>
          <motion.h2
            animate={
              isTitleVisible
                ? { x: 0, opacity: 1 }
                : scrollDirection === 'down'
                ? { x: -100, opacity: 0 }
                : { x: 100, opacity: 0 }
            }
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Case Studies —
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            animate={
              isTitleVisible
                ? { x: 0, opacity: 1 }
                : scrollDirection === 'down'
                ? { x: 100, opacity: 0 }
                : { x: -100, opacity: 0 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Some of our most recent work
          </motion.p>
        </div>
      </div>

      <section
        ref={sectionRef}
        className={styles.scrollVideoSection}
        data-scroll-video-section
      >
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
            onShouldPlay={handleShouldPlay}
          />
        </div>
      </section>
    </>
  );
}
