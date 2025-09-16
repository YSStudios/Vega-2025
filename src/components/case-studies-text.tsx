"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
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
  currentVideoIndex: number;
  onShouldPlay?: (shouldPlay: boolean) => void;
}

export default function CaseStudiesText({
  onVideoChange,
  currentVideoIndex,
  onShouldPlay,
}: CaseStudiesTextProps) {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Global scroll progress for different parallax speeds
  const { scrollY } = useScroll();
  const subtitleY = useTransform(scrollY, [0, 2000], [0, -100]); // Slowest
  const titleY = useTransform(scrollY, [0, 2000], [0, -300]); // Fastest
  const ctaY = useTransform(scrollY, [0, 2000], [0, -200]); // Medium

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;

      // Find the parent section to get scroll bounds
      const firstSection = sectionsRef.current[0];
      if (!firstSection) return;

      const parentSection = firstSection.closest("[data-scroll-video-section]");
      if (!parentSection) return;

      const parentRect = parentSection.getBoundingClientRect();
      const parentHeight = parentRect.height;

      // Check if the first text section is entering from bottom of viewport
      const firstSectionRect = firstSection.getBoundingClientRect();
      const shouldPlayVideo = firstSectionRect.bottom <= viewportHeight * 2;
      onShouldPlay?.(shouldPlayVideo);

      // Only update video when scrolling within this section
      if (parentRect.top > viewportHeight || parentRect.bottom < 0) {
        return; // Section is not in view
      }

      // Calculate progress through the section (0 to 1)
      const sectionProgress = Math.max(
        0,
        Math.min(1, -parentRect.top / (parentHeight - viewportHeight))
      );

      // Calculate which video should be active based on progress
      // Cap at the number of actual case studies (excluding empty section)
      const videoIndex = Math.floor(
        sectionProgress * (caseStudies.length - 0.1)
      );
      const clampedIndex = Math.max(
        0,
        Math.min(caseStudies.length - 1, videoIndex)
      );

      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex);
        onVideoChange(clampedIndex);
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
              <div className={styles.caseStudyNumber}>
                CASE — {String(index + 1).padStart(3, "0")}
              </div>

              <h2 className={styles.caseStudyTitle}>{caseStudy.clientName}</h2>

              <div className={styles.caseStudySubtitleContainer}>
                <p className={styles.caseStudySubtitle}>
                  {caseStudy.subtitle} ⟵
                </p>
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
