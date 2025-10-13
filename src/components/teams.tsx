"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import styles from "../styles/teams.module.css";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  services: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "CHARLES JOHNSON",
    role: "Creative Director",
    image: "/team/ceej.jpg",
    description: "from first concept to final build, we handle the details ────────→ design, development, and everything (in between). Whether it's a brand-new product or a smarter evolution of what's already working, we craft digital experiences that are as seamless as they are intentional.",
    services: ["BRANDING", "WEB DESIGN", "PRODUCT DESIGN", "CREATIVE DEVELOPMENT"]
  },
  {
    id: 2,
    name: "RASHI",
    role: "Lead Developer",
    image: "/team/rashi.jpg",
    description: "bringing technical vision to life through innovative solutions and cutting-edge technology. We transform complex ideas into elegant, user-centered experiences that push the boundaries of what's possible in digital spaces.",
    services: ["FRONTEND", "BACKEND", "MOBILE", "TECHNICAL STRATEGY"]
  },
  {
    id: 3,
    name: "BRANDON NIXON",
    role: "Brand Strategist",
    image: "/team/brandon.jpg",
    description: "crafting compelling narratives that resonate with audiences and drive meaningful connections. We develop brand strategies that not only look beautiful but create lasting impact in today's competitive landscape.",
    services: ["STRATEGY", "BRAND IDENTITY", "CONTENT", "MARKETING"]
  }
];

export default function Teams() {
  const [currentMember, setCurrentMember] = useState(0);

  const nextMember = () => {
    setCurrentMember((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const handleSwipe = (_event: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevMember();
    } else if (info.offset.x < -threshold) {
      nextMember();
    }
  };

  const currentTeamMember = teamMembers[currentMember];

  return (
    <motion.section 
      id="team"
      className={styles.teamsSection}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0 }}
    >
      <div className={styles.container}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our Team
        </motion.h2>
        
        <motion.div 
          className={styles.contentContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
        <div className={styles.contentWrapper}>
          {/* Left side - Image with controls */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentMember}
                  src={currentTeamMember.image}
                  alt={currentTeamMember.name}
                  className={styles.memberImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  onPanEnd={handleSwipe}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  whileDrag={{ cursor: "grabbing" }}
                />
              </AnimatePresence>
              
              {/* Navigation Controls */}
              <div className={styles.navigationControls}>
                <button 
                  className={styles.navButton}
                  onClick={prevMember}
                  aria-label="Previous team member"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className={styles.navButton}
                  onClick={nextMember}
                  aria-label="Next team member"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Dots indicator */}
              <div className={styles.dotsIndicator}>
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentMember ? styles.activeDot : ''}`}
                    onClick={() => setCurrentMember(index)}
                    aria-label={`Go to team member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className={styles.contentSection}>
            <motion.div 
              className={styles.content}
              key={currentMember}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >

              {/* Name and Services */}
              <div className={styles.header}>
                <h2 className={styles.memberName}>{currentTeamMember.name}</h2>
                <div className={styles.services}>
                  {currentTeamMember.services.map((service, index) => (
                    <span key={index} className={styles.serviceTag}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className={styles.description}>
                {currentTeamMember.description}
              </p>
            </motion.div>
          </div>
        </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
