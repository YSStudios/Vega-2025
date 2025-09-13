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

export default function CaseStudiesText({ onVideoChange, currentVideoIndex }: CaseStudiesTextProps) {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Find the parent section to get scroll bounds
      const firstSection = sectionsRef.current[0];
      if (!firstSection) return;
      
      const parentSection = firstSection.closest('[data-scroll-video-section]');
      if (!parentSection) return;
      
      const parentRect = parentSection.getBoundingClientRect();
      const parentTop = scrollPosition + parentRect.top;
      const parentHeight = parentRect.height;
      
      // Only update video when scrolling within this section
      if (parentRect.top > viewportHeight || parentRect.bottom < 0) {
        return; // Section is not in view
      }
      
      // Calculate progress through the section (0 to 1)
      const sectionProgress = Math.max(0, Math.min(1, -parentRect.top / (parentHeight - viewportHeight)));

      // Calculate which video should be active based on progress - faster transitions
      const videoIndex = Math.floor(sectionProgress * sectionsRef.current.length);
      const clampedIndex = Math.max(0, Math.min(sectionsRef.current.length - 1, videoIndex));

      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex);
        onVideoChange(clampedIndex);
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
          // Vary parallax speed for each section
          const parallaxY = index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3;

          return (
            <motion.div
              key={caseStudy.id}
              ref={el => sectionsRef.current[index] = el}
              className={`${styles.caseStudySection} ${index === activeIndex ? styles.active : ''}`}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: index === activeIndex ? 1 : 0.3,
                scale: index === activeIndex ? 1 : 0.95
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={() => handleCaseStudyClick(caseStudy.id)}
              style={{
                cursor: 'pointer',
                y: parallaxY
              }}
            >
              <div className={styles.caseStudyHeader}>
                <motion.p
                  className={styles.caseStudySubtitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
                >
                  {caseStudy.subtitle} —
                </motion.p>

                <motion.h2
                  className={styles.caseStudyTitle}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
                >
                  {caseStudy.title} —
                </motion.h2>

                <motion.p
                  className={styles.caseStudyClickCta}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
                >
                  Click to view case study →
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}