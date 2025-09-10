"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/work-marquee.module.css";

const workItems = [
  "GEN-AI",
  "AR", 
  "VIRTUAL",
  "PRODUCTION",
  "BRANDING",
  "WEB DESIGN",
  "PRODUCT DESIGN",
  "CREATIVE DEVELOPMENT", 
  "FRONTEND",
  "BACKEND",
  "MOBILE",
  "TECHNICAL STRATEGY",
  "STRATEGY",
  "BRAND IDENTITY",
  "CONTENT",
  "MARKETING"
];

// Duplicate array for seamless loop
const duplicatedWorkItems = [...workItems, ...workItems];

export default function WorkMarquee() {
  return (
    <motion.section 
      className={styles.workMarqueeSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        WORK
      </motion.h2>
      
      <div className={styles.marqueeContainer}>
        <motion.div
          className={styles.marqueeTrack}
          animate={{
            x: [0, -50 + "%"]
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 90,
            ease: "linear",
          }}
        >
          {duplicatedWorkItems.map((workItem, index) => (
            <span 
              key={index} 
              className={styles.marqueeItem}
            >
              {workItem}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
