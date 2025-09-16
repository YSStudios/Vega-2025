'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { use, useRef } from 'react';

interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  clientName: string;
  clientLogo?: string;
  heroImage: string;
  backgroundColor: string;
  services: string[];
  overview: string[];
  description: string;
}

const caseStudiesData: Record<string, CaseStudyData> = {
  'mac-cosmetics': {
    id: 'mac-cosmetics',
    title: 'DTLR x McDonald\'s HBCU Tour',
    subtitle: 'AI-generated advertisement & creative production',
    clientName: 'DTLR x McDonald\'s',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/magic-snack-wrap_pisjqp.jpg',
    backgroundColor: '#FFD700',
    services: [
      'AI content generation',
      'Character design', 
      'Visual effects',
      'Dialog creation'
    ],
    overview: [
      'We developed our first fully AI-generated advertisement using a custom pipeline to create consistent characters, scenes, dialog and visual effects - all generated through prompts. This groundbreaking project represents the beginning of a shift in creative production.',
      'The innovative approach allowed us to experiment with new creative possibilities while maintaining brand consistency and storytelling quality, setting new standards for AI-powered advertising content.'
    ],
    description: 'Our first fully AI-generated advert showcasing the future of creative production through innovative technology and custom AI pipelines.'
  },
  'soho-installation': {
    id: 'soho-installation',
    title: 'Drake Warehouse Release',
    subtitle: 'AI-powered 3D animation & launch assets',
    clientName: 'Amazon Music x Drake',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/amazon-drake_cumi5c.jpg',
    backgroundColor: '#FF6B6B',
    services: [
      'AI pipeline development',
      '3D scene creation',
      'Asset animation',
      'Launch content production'
    ],
    overview: [
      'We partnered with Amazon Music to create launch assets for Drake\'s Warehouse release, utilizing our cutting-edge AI pipeline to bring 3D scenes to life and transform static images into fully animated 3D assets.',
      'This collaboration showcased our ability to deliver high-quality animated content at scale, demonstrating the power of AI-driven creative production for major music releases and establishing new workflows for digital content creation.'
    ],
    description: 'AI-powered launch assets for Drake\'s Warehouse release, transforming stills into dynamic 3D animated content through innovative pipeline technology.'
  },
  'lipstick-campaign': {
    id: 'lipstick-campaign',
    title: 'Nike Air Max Day',
    subtitle: 'AI-generated visuals & brand amplification',
    clientName: 'Nike x MCA Chicago',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/airmax-day-2025_uxelne.jpg',
    backgroundColor: '#E91E63',
    services: [
      'AI-generated visuals',
      'Product visualization',
      'CGI environments',
      'Sound design'
    ],
    overview: [
      'We were selected to create AI-generated visuals to amplify Nike Air Max Day in collaboration with MCA Chicago, leveraging our generative pipeline to maintain precise product likeness while building CGI-quality environments.',
      'The project showcased our ability to deliver brand-accurate AI visuals at scale, combining technical precision with creative excellence to enhance one of Nike\'s most important annual celebrations through innovative visual storytelling and immersive sound design.'
    ],
    description: 'AI-generated visual campaign for Nike Air Max Day, featuring CGI-quality environments and precise product visualization through cutting-edge generative technology.'
  },
  'creative-campaign': {
    id: 'creative-campaign',
    title: 'MAC Cosmetics Giant Receipt',
    subtitle: 'AI video installation & experiential design',
    clientName: 'MAC Cosmetics',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/giant-receipt_gth4qq.jpg',
    backgroundColor: '#9C27B0',
    services: [
      'AI video production',
      'Experiential installation',
      'Concept development',
      'Visual storytelling'
    ],
    overview: [
      'We created a striking giant receipt installation in SoHo for MAC Cosmetics, featuring an AI-generated video of a massive receipt dramatically falling down the storefront, creating an unforgettable visual spectacle that transformed the shopping experience.',
      'This innovative installation combined cutting-edge AI video technology with experiential design, generating significant social media buzz and foot traffic while establishing a new benchmark for retail activations and immersive brand experiences.'
    ],
    description: 'A groundbreaking AI video installation featuring a giant receipt falling down MAC Cosmetics\' SoHo location, blending digital innovation with experiential retail design.'
  }
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const caseStudy = caseStudiesData[slug];
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const descriptionY = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  const handleClose = () => {
    router.back();
  };

  return (
    <motion.div
      ref={containerRef}
      className="case-study-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close Button */}
      <button className="case-study-close" onClick={handleClose}>
        <span>Close</span>
        <span className="close-x">✕</span>
      </button>

      <div className="case-study-content">
        {/* Left Side - Hero Image */}
        <motion.div
          className="case-study-hero"
          style={{
            backgroundColor: caseStudy.backgroundColor,
            y: heroY
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="hero-image-container">
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="hero-image"
              style={{ objectFit: "cover" }}
            />
          </div>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          className="case-study-details"
          style={{ y: textY }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Client Logo & Subtitle */}
          <motion.div
            className="case-study-header"
            style={{ y: headerY }}
          >
            {caseStudy.clientLogo && (
              <div className="client-logo">
                <Image
                  src={caseStudy.clientLogo}
                  alt={caseStudy.clientName}
                  width={120}
                  height={40}
                  sizes="120px"
                />
              </div>
            )}
            <p className="case-study-subtitle">{caseStudy.subtitle} —</p>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="case-study-title"
            style={{ y: titleY }}
          >
            {caseStudy.title} —
          </motion.h1>

          {/* Description */}
          <motion.p
            className="case-study-description"
            style={{ y: descriptionY }}
          >
            {caseStudy.description}
          </motion.p>

          {/* Services & Overview Grid */}
          <motion.div
            className="case-study-grid"
            style={{ y: gridY }}
          >
            {/* Services */}
            <div className="services-section">
              <h3>Services —</h3>
              <ul className="services-list">
                {caseStudy.services.map((service, index) => (
                  <li key={index}>
                    <span className="service-arrow">→</span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Overview */}
            <div className="overview-section">
              <h3>Overview —</h3>
              <div className="overview-content">
                {caseStudy.overview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}