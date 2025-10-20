"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/marquee.module.css";

interface MarqueeProps {
  mainText?: string;
  subText?: string;
  speed?: number;
  variant?: "light" | "dark";
}

export default function Marquee({
  mainText = "Vega Studios",
  subText = "CREATIVE TECHNOLOGY STUDIO",
  speed = 100,
  variant = "light",
}: MarqueeProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.scrollWidth / 2; // Divide by 2 because we duplicate the content
      setContentWidth(width);
    }
  }, [mainText, subText]);

  // Calculate duration based on content width and desired speed
  // Speed represents pixels per second
  const duration = contentWidth ? contentWidth / (speed / 10) : 100;

  return (
    <div className={`${styles.marqueeContainer} ${variant === "dark" ? styles.dark : ""}`}>
      <div className={styles.marquee}>
        <motion.div
          ref={contentRef}
          className={styles.marqueeContent}
          animate={{
            x: contentWidth ? [0, -contentWidth] : [0, -2000],
          }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={styles.marqueeItem}>
              <h1 className={styles.mainText}>{mainText}</h1>
              {subText && <span className={styles.subText}>{subText}</span>}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
