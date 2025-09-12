'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { use } from 'react';

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
    title: 'MAC Cosmetics',
    subtitle: 'Experiential design & brand activation',
    clientName: 'MAC Cosmetics',
    heroImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop',
    backgroundColor: '#FFD700',
    services: [
      'Experiential design',
      'Brand activation', 
      'Installation art'
    ],
    overview: [
      'We created a groundbreaking installation experience in SoHo that transformed the way people interact with MAC Cosmetics, creating viral moments and lasting brand connections.',
      'The giant receipt installation drove massive social engagement and foot traffic, establishing a new benchmark for experiential marketing in the beauty industry.'
    ],
    description: 'Giant Receipt Project - transforming cosmetics retail through immersive brand experiences.'
  },
  'soho-installation': {
    id: 'soho-installation',
    title: 'SoHo Creative Installation',
    subtitle: 'Experiential design & brand activation',
    clientName: 'Creative Studio',
    heroImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
    backgroundColor: '#FF6B6B',
    services: [
      'Experiential design',
      'Brand activation',
      'Installation art'
    ],
    overview: [
      'An immersive brand experience in the heart of SoHo, creating a memorable connection between brands and their audiences through interactive installations.',
      'The installation drove significant foot traffic and social media engagement, amplifying brand awareness in a key market while setting new standards for experiential marketing.'
    ],
    description: 'Behind the scenes of our groundbreaking SoHo installation project.'
  },
  'lipstick-campaign': {
    id: 'lipstick-campaign',
    title: 'Lipstick Day Campaign',
    subtitle: 'Digital campaign & social strategy',
    clientName: 'Beauty Brand',
    heroImage: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=600&fit=crop',
    backgroundColor: '#E91E63',
    services: [
      'Digital campaign',
      'Social media strategy',
      'Content creation'
    ],
    overview: [
      'A comprehensive digital campaign celebrating National Lipstick Day, engaging millions across social platforms with innovative content and interactive experiences.',
      'The campaign achieved record-breaking engagement rates and drove significant sales during the promotional period, establishing new benchmarks for beauty marketing.'
    ],
    description: 'Final cut of our award-winning Lipstick Day campaign.'
  }
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const caseStudy = caseStudiesData[slug];

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  const handleClose = () => {
    router.back();
  };

  return (
    <motion.div
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
          style={{ backgroundColor: caseStudy.backgroundColor }}
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
            />
          </div>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div 
          className="case-study-details"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Client Logo & Subtitle */}
          <div className="case-study-header">
            {caseStudy.clientLogo && (
              <div className="client-logo">
                <Image
                  src={caseStudy.clientLogo}
                  alt={caseStudy.clientName}
                  width={120}
                  height={40}
                />
              </div>
            )}
            <p className="case-study-subtitle">{caseStudy.subtitle} —</p>
          </div>

          {/* Title */}
          <h1 className="case-study-title">{caseStudy.title} —</h1>
          
          {/* Description */}
          <p className="case-study-description">{caseStudy.description}</p>

          {/* Services & Overview Grid */}
          <div className="case-study-grid">
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}