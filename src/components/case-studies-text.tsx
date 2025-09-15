'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from '../styles/scroll-video.module.css';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  clientName: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'mac-cosmetics',
    title: 'MAC Cosmetics',
    subtitle: 'Experiential design & brand activation',
    clientName: 'MAC Cosmetics'
  },
  {
    id: 'soho-installation',
    title: 'SoHo Creative Installation',
    subtitle: 'Experiential design & brand activation',
    clientName: 'Creative Studio'
  },
  {
    id: 'lipstick-campaign',
    title: 'Lipstick Day Campaign',
    subtitle: 'Digital campaign & social strategy',
    clientName: 'Beauty Brand'
  },
  {
    id: 'creative-campaign',
    title: 'Creative Campaign Project',
    subtitle: 'Brand strategy & creative direction',
    clientName: 'Global Brand'
  }
];

interface CaseStudiesTextProps {
  onVideoChange: (index: number) => void;
  currentVideoIndex: number;
}

export default function CaseStudiesText({ onVideoChange }: CaseStudiesTextProps) {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Global scroll progress for different parallax speeds
  const { scrollY } = useScroll();
  const subtitleY = useTransform(scrollY, [0, 2000], [0, -100]);  // Slowest
  const titleY = useTransform(scrollY, [0, 2000], [0, -300]);     // Fastest
  const ctaY = useTransform(scrollY, [0, 2000], [0, -200]);       // Medium

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      // Find which text section is closest to viewport center
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(sectionCenter - viewportCenter);

        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          closestIndex = index;
        }
      });

      // Special handling for last video: end it sooner when scrolling past
      const isCurrentlyLastVideo = activeIndex === sectionsRef.current.length - 1;
      if (isCurrentlyLastVideo) {
        const lastSection = sectionsRef.current[activeIndex];
        if (lastSection) {
          const rect = lastSection.getBoundingClientRect();
          // End last video when its text reaches upper portion of viewport
          if (rect.bottom < viewportHeight * 0.7) {
            // Don't change to any specific video, just end the video section
            return;
          }
        }
      }

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
        onVideoChange(closestIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex, onVideoChange]);

  const handleCaseStudyClick = (caseStudyId: string) => {
    router.push(`/case-study/${caseStudyId}`);
  };

  return (
    <div ref={containerRef} className={styles.caseStudiesTextContainer}>
      <div className={styles.caseStudiesContent}>
        {caseStudies.map((caseStudy, index) => {
          return (
            <div
              key={caseStudy.id}
              ref={el => { sectionsRef.current[index] = el; }}
              className={`${styles.caseStudySection} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => handleCaseStudyClick(caseStudy.id)}
              style={{
                cursor: 'pointer'
              }}
            >
              <div className={styles.caseStudyHeader}>
                <motion.p
                  className={styles.caseStudySubtitle}
                  style={{ y: subtitleY }}
                >
                  {caseStudy.subtitle} —
                </motion.p>

                <motion.h2
                  className={styles.caseStudyTitle}
                  style={{ y: titleY }}
                >
                  {caseStudy.title} —
                </motion.h2>

                <motion.p
                  className={styles.caseStudyClickCta}
                  style={{ y: ctaY }}
                >
                  Click to view case study →
                </motion.p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}