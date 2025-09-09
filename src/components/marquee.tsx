"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/marquee.module.css";

interface MarqueeProps {
  mainText?: string;
  subText?: string;
  speed?: number;
}

export default function Marquee({
  mainText = "Vega Studios",
  subText = "CREATIVE TECHNOLOGY STUDIO",
  speed = 100,
}: MarqueeProps) {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marquee}>
        <motion.div
          className={styles.marqueeContent}
          animate={{
            x: [0, -2000],
          }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.marqueeItem}>
              <h1 className={styles.mainText}>{mainText}</h1>
              <span className={styles.subText}>{subText}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
