"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import FullscreenVideo from "./fullscreen-video";
import CaseStudiesText from "./case-studies-text";
import styles from "../styles/scroll-video.module.css";

gsap.registerPlugin(ScrollTrigger);

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
  const [isMobile, setIsMobile] = useState(false);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleShouldPlay = (play: boolean) => {
    setShouldPlay(play);
  };

  useEffect(() => {
    const detectMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      setIsMobile(isMobileDevice);

      // On mobile, force video to be visible and playing
      if (isMobileDevice) {
        setShouldPlay(true);
      }
    };

    detectMobile();
  }, []);

  // Removed JavaScript position manipulation in favor of CSS sticky positioning
  // This prevents layout jumps on mobile devices

  // Mobile-specific intersection observer to force video playing
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Force videos to play when section is visible on mobile
            setShouldPlay(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // GSAP animation for title and subtitle
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    // Set initial states
    gsap.set(titleRef.current, { opacity: 0, x: -100 });
    gsap.set(subtitleRef.current, { opacity: 0, x: 100 });

    // Create ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%", // Animation starts when element is 80% down the viewport
        end: "top 20%",
        toggleActions: "play none none reverse", // Play on enter, reverse on leave
        onEnter: () => {
          // Animate title from left
          gsap.to(titleRef.current, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
          });
          // Animate subtitle from right with stagger
          gsap.to(subtitleRef.current, {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          // Reset when scrolling back up
          gsap.to(titleRef.current, {
            opacity: 0,
            x: -100,
            duration: 0.5,
          });
          gsap.to(subtitleRef.current, {
            opacity: 0,
            x: 100,
            duration: 0.5,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Marquee width calculation
  useEffect(() => {
    if (marqueeRef.current) {
      const width = marqueeRef.current.scrollWidth / 2;
      setMarqueeWidth(width);
    }
  }, []);

  return (
    <>
      {/* Marquee Section Above */}
      {/* <div className={styles.marqueeWrapper}>
        <motion.div
          ref={marqueeRef}
          className={styles.marqueeContent}
          animate={{
            x: marqueeWidth ? [0, -marqueeWidth] : [0, -1000],
          }}
          transition={{
            duration: marqueeWidth ? marqueeWidth / 50 : 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className={styles.marqueeItem}>
              <span className={styles.marqueeText}>Case Studies</span>
            </div>
          ))}
        </motion.div>
      </div> */}

      <div className={styles.sectionTitle}>
        <div className={styles.sectionTitleContainer}>
          <h2 ref={titleRef}>Case Studies —</h2>
          <p ref={subtitleRef} className={styles.sectionSubtitle}>
            (Some of our most recent work)
          </p>
        </div>
      </div>

      {/* Marquee Section Below */}
      <div className={styles.marqueeWrapper}>
        <motion.div
          className={styles.marqueeContent}
          animate={{
            x: marqueeWidth ? [0, -marqueeWidth] : [0, -1000],
          }}
          transition={{
            duration: marqueeWidth ? marqueeWidth / 50 : 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className={styles.marqueeItem}>
              <span className={styles.marqueeText}>Case Studies</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section
        id="case-studies"
        ref={sectionRef}
        className={styles.scrollVideoSection}
        data-scroll-video-section
      >
        {/* Sticky Video Background */}
        <div ref={videoRef} className={styles.videoBackground}>
          <FullscreenVideo
            videos={videos}
            currentIndex={currentVideoIndex}
            autoPlay={shouldPlay || isMobile}
            opacity={shouldPlay || isMobile ? 1 : 0}
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
