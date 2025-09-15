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
  onShouldPlay?: (shouldPlay: boolean) => void;
}

export default function CaseStudiesText({ onVideoChange, currentVideoIndex, onShouldPlay }: CaseStudiesTextProps) {
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
      
      // Find the parent section to get scroll bounds
      const firstSection = sectionsRef.current[0];
      if (!firstSection) return;
      
      const parentSection = firstSection.closest('[data-scroll-video-section]');
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
      const sectionProgress = Math.max(0, Math.min(1, -parentRect.top / (parentHeight - viewportHeight)));
      
      // Calculate which video should be active based on progress
      // Cap at the number of actual case studies (excluding empty section)
      const videoIndex = Math.floor(sectionProgress * (caseStudies.length - 0.1));
      const clampedIndex = Math.max(0, Math.min(caseStudies.length - 1, videoIndex));

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
  }, [activeIndex, onVideoChange, onShouldPlay]);

  const handleCaseStudyClick = (caseStudyId: string) => {
    router.push(`/case-study/${caseStudyId}`);
  };

  return (
    <div ref={containerRef} className={styles.caseStudiesTextContainer}>
      <div className={styles.caseStudiesContent}>
        {caseStudies.map((caseStudy, index) => (
          <motion.div
            key={caseStudy.id}
            ref={el => { sectionsRef.current[index] = el; }}
            className={`${styles.caseStudySection} ${index === activeIndex ? styles.active : ''}`}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: index === activeIndex ? 1 : 0.3,
              scale: index === activeIndex ? 1 : 0.95
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => handleCaseStudyClick(caseStudy.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.caseStudyHeader}>
              <motion.p 
                className={styles.caseStudySubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {caseStudy.subtitle} —
              </motion.p>
              
              <motion.h2 
                className={styles.caseStudyTitle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {caseStudy.title} —
              </motion.h2>
              
              <motion.p 
                className={styles.caseStudyClickCta}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Click to view case study →
              </motion.p>
            </div>
          </motion.div>
        ))}
        
        {/* Empty section to allow scrolling away the last slide */}
        <div 
          ref={el => { sectionsRef.current[caseStudies.length] = el; }}
          className={styles.emptySectionForScroll}
        />
      </div>
    </div>
  );
}