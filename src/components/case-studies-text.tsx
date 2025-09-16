"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "../styles/scroll-video.module.css";

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  clientName: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "mac-cosmetics",
    title: "DTLR x McDonald's HBCU Tour",
    subtitle: "AI-generated advertisement & creative production",
    clientName: "DTLR x McDonald's",
  },
  {
    id: "soho-installation",
    title: "Drake Warehouse Release",
    subtitle: "AI-powered 3D animation & launch assets",
    clientName: "Amazon Music x Drake",
  },
  {
    id: "lipstick-campaign",
    title: "Nike Air Max Day",
    subtitle: "AI-generated visuals & brand amplification",
    clientName: "Nike x MCA Chicago",
  },
  {
    id: "creative-campaign",
    title: "MAC Cosmetics Giant Receipt #lipstickday",
    subtitle: "AI video installation & experiential design",
    clientName: "MAC Cosmetics",
  },
];

interface CaseStudiesTextProps {
  onVideoChange: (index: number) => void;
  onShouldPlay?: (shouldPlay: boolean) => void;
}

export default function CaseStudiesText({
  onVideoChange,
  onShouldPlay,
}: CaseStudiesTextProps) {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const router = useRouter();

  // Global scroll progress for different parallax speeds
  const { scrollY } = useScroll();

  // Track scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrollDirection(latest > previous ? 'down' : 'up');
  });

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;

      // Track which sections are visible
      const newVisibleSections = new Set<number>();
      sectionsRef.current.forEach((section, index) => {
        if (section && index < caseStudies.length) {
          const rect = section.getBoundingClientRect();
          // Consider section visible if it's within the viewport with some buffer
          if (rect.top < viewportHeight && rect.bottom > 0) {
            newVisibleSections.add(index);
          }
        }
      });
      setVisibleSections(newVisibleSections);

      // Find the parent section to get scroll bounds
      const firstSection = sectionsRef.current[0];
      if (!firstSection) return;

      const parentSection = firstSection.closest("[data-scroll-video-section]");
      if (!parentSection) return;

      const parentRect = parentSection.getBoundingClientRect();

      // Check if videos should play - slightly more responsive on mobile
      const firstSectionRect = firstSection.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const videoPlayThreshold = isMobile ? viewportHeight * 1.8 : viewportHeight * 2;

      const shouldPlayVideo = firstSectionRect.bottom <= videoPlayThreshold;
      onShouldPlay?.(shouldPlayVideo);

      // Only update video when scrolling within this section
      if (parentRect.top > viewportHeight || parentRect.bottom < 0) {
        return; // Section is not in view
      }

      // Check which case study text is closest to the center of the viewport
      const centerPoint = viewportHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      sectionsRef.current.forEach((section, index) => {
        if (section && index < caseStudies.length) {
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - centerPoint);

          // On mobile, be more aggressive about switching when text is near center
          const threshold = isMobile ? viewportHeight * 0.3 : viewportHeight * 0.4;

          if (distance < closestDistance && rect.top < threshold && rect.bottom > -threshold) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      // On mobile, be more responsive to last case study transitions but don't cut off too early
      if (isMobile) {
        const lastSection = sectionsRef.current[caseStudies.length - 1];
        if (lastSection) {
          const lastRect = lastSection.getBoundingClientRect();
          // Only stop updating if we're well past the last section
          if (lastRect.bottom < -viewportHeight * 0.2) {
            return;
          }
        }
      }

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
        onVideoChange(closestIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, onVideoChange, onShouldPlay]);

  const handleCaseStudyClick = (caseStudyId: string) => {
    router.push(`/case-study/${caseStudyId}`);
  };

  return (
    <div ref={containerRef} className={styles.caseStudiesTextContainer}>
      <div className={styles.caseStudiesContent}>
        {caseStudies.map((caseStudy, index) => (
          <div
            key={caseStudy.id}
            ref={(el) => {
              sectionsRef.current[index] = el;
            }}
            className={`${styles.caseStudySection} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => handleCaseStudyClick(caseStudy.id)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.caseStudyHeader}>
              <motion.div
                className={styles.caseStudyNumber}
                animate={
                  visibleSections.has(index)
                    ? { x: 0, opacity: 1 }
                    : scrollDirection === 'down'
                    ? { x: -50, opacity: 0 }
                    : { x: 50, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                CASE — {String(index + 1).padStart(3, "0")}
              </motion.div>

              <motion.h2
                className={styles.caseStudyTitle}
                animate={
                  visibleSections.has(index)
                    ? { x: 0, opacity: 1 }
                    : scrollDirection === 'down'
                    ? { x: -100, opacity: 0 }
                    : { x: 100, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.1 + (index * 0.05) }}
              >
                {caseStudy.clientName}
              </motion.h2>

              <div className={styles.caseStudySubtitleContainer}>
                <motion.p
                  className={styles.caseStudySubtitle}
                  animate={
                    visibleSections.has(index)
                      ? { x: 0, opacity: 1 }
                      : scrollDirection === 'down'
                      ? { x: 100, opacity: 0 }
                      : { x: -100, opacity: 0 }
                  }
                  transition={{ duration: 0.8, delay: 0.2 + (index * 0.05) }}
                >
                  {caseStudy.subtitle} ⟵
                </motion.p>
              </div>
            </div>
          </div>
        ))}

        {/* Empty section to allow scrolling away the last slide */}
        <div
          ref={(el) => {
            sectionsRef.current[caseStudies.length] = el;
          }}
          className={styles.emptySectionForScroll}
        />
      </div>
    </div>
  );
}
