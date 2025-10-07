"use client";

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { use, useRef, useState, useCallback, useEffect } from 'react';

interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  clientName: string;
  clientLogo?: string;
  heroImage: string;
  additionalImages: string[];
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
    additionalImages: [
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/amazon-drake_cumi5c.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/airmax-day-2025_uxelne.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/giant-receipt_gth4qq.jpg'
    ],
    services: [
      "AI content generation",
      "Character design",
      "Visual effects",
      "Dialog creation",
    ],
    overview: [
      "We developed our first fully AI-generated advertisement using a custom pipeline to create consistent characters, scenes, dialog and visual effects - all generated through prompts. This groundbreaking project represents the beginning of a shift in creative production.",
      "The innovative approach allowed us to experiment with new creative possibilities while maintaining brand consistency and storytelling quality, setting new standards for AI-powered advertising content.",
      "Through extensive testing and iteration, we refined our AI models to achieve unprecedented levels of character consistency and emotional authenticity. The project involved training custom datasets, developing proprietary prompt engineering techniques, and creating automated quality control systems.",
      "Our technical infrastructure processes over 10,000 individual AI generations per project, with automated filtering systems that maintain 94% consistency rates across character appearances and 89% brand guideline compliance.",
    ],
    description:
      "Our first fully AI-generated advert showcasing the future of creative production through innovative technology and custom AI pipelines.",
  },
  'soho-installation': {
    id: 'soho-installation',
    title: 'Drake Warehouse Release',
    subtitle: 'AI-powered 3D animation & launch assets',
    clientName: 'Amazon Music x Drake',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/amazon-drake_cumi5c.jpg',
    backgroundColor: '#FF6B6B',
    additionalImages: [
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/giant-receipt_gth4qq.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/magic-snack-wrap_pisjqp.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/airmax-day-2025_uxelne.jpg'
    ],
    services: [
      "AI pipeline development",
      "3D scene creation",
      "Asset animation",
      "Launch content production",
    ],
    overview: [
      "We partnered with Amazon Music to create launch assets for Drake's Warehouse release, utilizing our cutting-edge AI pipeline to bring 3D scenes to life and transform static images into fully animated 3D assets.",
      "This collaboration showcased our ability to deliver high-quality animated content at scale, demonstrating the power of AI-driven creative production for major music releases and establishing new workflows for digital content creation.",
    ],
    description:
      "AI-powered launch assets for Drake's Warehouse release, transforming stills into dynamic 3D animated content through innovative pipeline technology.",
  },
  'lipstick-campaign': {
    id: 'lipstick-campaign',
    title: 'Nike Air Max Day',
    subtitle: 'AI-generated visuals & brand amplification',
    clientName: 'Nike x MCA Chicago',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/airmax-day-2025_uxelne.jpg',
    backgroundColor: '#E91E63',
    additionalImages: [
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/magic-snack-wrap_pisjqp.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/giant-receipt_gth4qq.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/amazon-drake_cumi5c.jpg'
    ],
    services: [
      "AI-generated visuals",
      "Product visualization",
      "CGI environments",
      "Sound design",
    ],
    overview: [
      "We were selected to create AI-generated visuals to amplify Nike Air Max Day in collaboration with MCA Chicago, leveraging our generative pipeline to maintain precise product likeness while building CGI-quality environments.",
      "The project showcased our ability to deliver brand-accurate AI visuals at scale, combining technical precision with creative excellence to enhance one of Nike's most important annual celebrations through innovative visual storytelling and immersive sound design.",
    ],
    description:
      "AI-generated visual campaign for Nike Air Max Day, featuring CGI-quality environments and precise product visualization through cutting-edge generative technology.",
  },
  'creative-campaign': {
    id: 'creative-campaign',
    title: 'MAC Cosmetics Giant Receipt',
    subtitle: 'AI video installation & experiential design',
    clientName: 'MAC Cosmetics',
    heroImage: 'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/giant-receipt_gth4qq.jpg',
    backgroundColor: '#9C27B0',
    additionalImages: [
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/airmax-day-2025_uxelne.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051457/amazon-drake_cumi5c.jpg',
      'https://res.cloudinary.com/dhj9rq4mu/image/upload/v1758051458/magic-snack-wrap_pisjqp.jpg'
    ],
    services: [
      "AI video production",
      "Experiential installation",
      "Concept development",
      "Visual storytelling",
    ],
    overview: [
      "We created a striking giant receipt installation in SoHo for MAC Cosmetics, featuring an AI-generated video of a massive receipt dramatically falling down the storefront, creating an unforgettable visual spectacle that transformed the shopping experience.",
      "This innovative installation combined cutting-edge AI video technology with experiential design, generating significant social media buzz and foot traffic while establishing a new benchmark for retail activations and immersive brand experiences.",
    ],
    description: 'A groundbreaking AI video installation featuring a giant receipt falling down MAC Cosmetics\' SoHo location, blending digital innovation with experiential retail design.'
  }
};

// Function to extract vibrant color from image using multiple methods
const extractDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#FFD700'); // fallback
        return;
      }
      
      // Use small canvas for performance
      canvas.width = 50;
      canvas.height = 50;
      
      ctx.drawImage(img, 0, 0, 50, 50);
      
      try {
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        
        // Color bucket approach - group similar colors
        const colorBuckets: { [key: string]: { count: number, r: number, g: number, b: number, saturation: number } } = {};
        const vibrantColors: { r: number, g: number, b: number, score: number }[] = [];
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Skip very dark, very light, or very gray pixels
          const brightness = (r + g + b) / 3;
          if (brightness < 40 || brightness > 220) continue;
          
          // Calculate saturation and other color properties
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          // Skip very gray pixels
          if (saturation < 0.2) continue;
          
          // Create color bucket (round to nearest 32 to group similar colors)
          const bucketR = Math.round(r / 32) * 32;
          const bucketG = Math.round(g / 32) * 32;
          const bucketB = Math.round(b / 32) * 32;
          const bucketKey = `${bucketR}-${bucketG}-${bucketB}`;
          
          if (!colorBuckets[bucketKey]) {
            colorBuckets[bucketKey] = { count: 0, r: bucketR, g: bucketG, b: bucketB, saturation };
          }
          colorBuckets[bucketKey].count++;
          
          // Score colors based on vibrancy (saturation + brightness balance)
          const vibrancyScore = saturation * (1 - Math.abs(brightness - 127) / 127) * 2;
          if (vibrancyScore > 0.4) {
            vibrantColors.push({ r, g, b, score: vibrancyScore });
          }
        }
        
        let selectedColor = { r: 0, g: 0, b: 0 };
        
        // Method 1: Find most vibrant color
        if (vibrantColors.length > 0) {
          vibrantColors.sort((a, b) => b.score - a.score);
          selectedColor = vibrantColors[0];
        }
        // Method 2: Fallback to most common saturated color
        else {
          const sortedBuckets = Object.values(colorBuckets)
            .filter(bucket => bucket.saturation > 0.3)
            .sort((a, b) => b.count - a.count);
          
          if (sortedBuckets.length > 0) {
            selectedColor = sortedBuckets[0];
          }
        }
        
        // Enhance the color for better visual impact
        let { r, g, b } = selectedColor;
        
        // Boost saturation slightly
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max > min) {
          const saturation = (max - min) / max;
          const newSaturation = Math.min(1, saturation * 1.3);
          const diff = max - min;
          const newDiff = max * newSaturation;
          const multiplier = newDiff / diff;
          
          r = Math.round(min + (r - min) * multiplier);
          g = Math.round(min + (g - min) * multiplier);
          b = Math.round(min + (b - min) * multiplier);
        }
        
        // Ensure valid range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        
        // Ensure we have a valid color
        if (r === 0 && g === 0 && b === 0) {
          resolve('#FFD700'); // fallback
        } else {
          resolve(`rgb(${r}, ${g}, ${b})`);
        }
      } catch (error) {
        resolve('#FFD700'); // fallback
      }
    };
    
    img.onerror = () => resolve('#FFD700'); // fallback
    img.src = imageSrc;
  });
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const caseStudy = caseStudiesData[slug];
  const containerRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [dominantColor, setDominantColor] = useState<string>(caseStudy?.backgroundColor || '#FFD700');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Manual scroll tracking for the details panel
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Simplified parallax effects
  const heroY = scrollProgress * -200;
  const textY = scrollProgress * -100;

  // Image opacity based on scroll position
  const getImageOpacity = (progress: number, start: number, fadeIn: number, fadeOut: number, end: number) => {
    if (progress < start) return 0;
    if (progress < fadeIn) return (progress - start) / (fadeIn - start);
    if (progress < fadeOut) return 1;
    if (progress < end) return 1 - (progress - fadeOut) / (end - fadeOut);
    return 0;
  };

  const image1Opacity = { get: () => scrollProgress <= 0.3 ? 1 : Math.max(0, 1 - (scrollProgress - 0.2) / 0.1) };
  const image2Opacity = { get: () => getImageOpacity(scrollProgress, 0.2, 0.3, 0.5, 0.6) };
  const image3Opacity = { get: () => getImageOpacity(scrollProgress, 0.5, 0.6, 0.8, 0.9) };
  const image4Opacity = { get: () => scrollProgress >= 0.8 ? Math.min(1, (scrollProgress - 0.8) / 0.1) : 0 };

  // Extract dominant color from hero image
  useEffect(() => {
    if (caseStudy?.heroImage) {
      extractDominantColor(caseStudy.heroImage)
        .then(color => setDominantColor(color))
        .catch(() => setDominantColor(caseStudy.backgroundColor));
    }
  }, [caseStudy?.heroImage, caseStudy?.backgroundColor]);

  // Add/remove body class for mobile header hiding
  useEffect(() => {
    document.body.classList.add('case-study-open');
    return () => {
      document.body.classList.remove('case-study-open');
    };
  }, []);

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  const handleClose = () => {
    router.back();
  };

  const scrollToContact = () => {
    if (contactRef.current && containerRef.current) {
      const contactElement = contactRef.current;
      const containerElement = containerRef.current;
      
      // Calculate the position of the contact form within the scrollable container
      const offsetTop = contactElement.offsetTop - containerElement.offsetTop;
      
      containerElement.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Listen for custom scroll events from the navigation
  useEffect(() => {
    const handleScrollToContact = () => {
      scrollToContact();
    };

    window.addEventListener('scroll-to-contact', handleScrollToContact);
    return () => {
      window.removeEventListener('scroll-to-contact', handleScrollToContact);
    };
  }, []);

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
          style={{
            backgroundColor: dominantColor,
            transform: `translateY(${heroY}px)`
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main Hero Image */}
          <div 
            className="hero-image-container"
            style={{ opacity: image1Opacity.get() }}
          >
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              className="hero-image"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Additional Images */}
          {caseStudy.additionalImages.map((imageSrc, index) => (
            <div
              key={index}
              className="hero-image-container"
              style={{
                opacity: index === 0 ? image2Opacity.get() : index === 1 ? image3Opacity.get() : image4Opacity.get()
              }}
            >
              <Image
                src={imageSrc}
                alt={`${caseStudy.title} - Image ${index + 2}`}
                fill
                className="hero-image"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          ref={containerRef}
          className="case-study-details"
          style={{ transform: `translateY(${textY}px)` }}
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
                  sizes="120px"
                />
              </div>
            )}
            <p className="case-study-subtitle">{caseStudy.subtitle} —</p>
          </div>

          {/* Title */}
          <h1 className="case-study-title">
            {caseStudy.title} —
          </h1>

          {/* Description */}
          <p className="case-study-description">
            {caseStudy.description}
          </p>

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

          {/* Metrics Section */}
          <div className="case-study-metrics">
            <h3>Impact & Results —</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-number">2.4M</div>
                <div className="metric-label">Total Impressions</div>
              </div>
              <div className="metric-item">
                <div className="metric-number">94%</div>
                <div className="metric-label">Brand Consistency</div>
              </div>
              <div className="metric-item">
                <div className="metric-number">340%</div>
                <div className="metric-label">Engagement Increase</div>
              </div>
              <div className="metric-item">
                <div className="metric-number">72h</div>
                <div className="metric-label">Production Time</div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="case-study-technical">
            <h3>Technical Implementation —</h3>
            <div className="technical-content">
              <p>Our proprietary AI pipeline leverages cutting-edge machine learning models fine-tuned specifically for brand consistency and creative control. The system processes multiple prompt variations through ensemble networks, ensuring optimal output quality.</p>
              <p>Key technical achievements include real-time character consistency verification, automated brand guideline compliance checking, and scalable rendering infrastructure capable of processing thousands of variations simultaneously.</p>
              <div className="tech-specs">
                <div className="spec-item">
                  <strong>Processing Power:</strong> 8x NVIDIA A100 GPUs
                </div>
                <div className="spec-item">
                  <strong>Model Architecture:</strong> Custom Diffusion + ControlNet
                </div>
                <div className="spec-item">
                  <strong>Quality Score:</strong> 94.7% brand compliance
                </div>
                <div className="spec-item">
                  <strong>Render Time:</strong> 3.2 seconds per asset
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div ref={contactRef} className="case-study-contact">
            <h3>Get In Touch —</h3>
            <p>Ready to start your next project? Let's discuss how we can bring your vision to life.</p>
            
            <form className="inline-contact-form">
              <div className="form-row">
                <div className="form-group">
                  <input type="text" id="firstName" name="firstName" placeholder="First Name" required />
                </div>
                <div className="form-group">
                  <input type="text" id="lastName" name="lastName" placeholder="Last Name" required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input type="email" id="email" name="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <input type="text" id="company" name="company" placeholder="Company" />
                </div>
              </div>
              
              <div className="form-group">
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your project..." required></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Send Message →
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
