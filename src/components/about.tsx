"use client";

import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import styles from "../styles/about.module.css";
import { useAccentColor } from "../contexts/accent-color-context";

const textLines = [
  "Vega Studio is a full-service, black-owned and operated agency,",
  "distinguished in conceptualizing, creating and executing",
  "digital-first creative strategies established at the intersection of",
  "cutting edge technology, cultural analysis and virality."
];

export default function About() {
  const { currentAccent } = useAccentColor();
  return (
    <motion.section 
      className={styles.aboutSection}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0 }}
    >
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div 
          className={styles.mainContent}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1 className={styles.mainText}>
            <motion.span 
              className={styles.studioLabel}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              ( The Studio )
            </motion.span>
            {textLines.map((line, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                style={{ display: 'block' }}
              >
                {line}
              </motion.span>
            ))}
            <motion.span 
              className={styles.desktopButton}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {" "}
              <motion.span 
                className={styles.learnMoreButton}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                style={{ transition: 'none' }}
              >
                Learn more
              </motion.span> 
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                style={{ display: 'inline-block' }}
              >
                <FaArrowLeftLong className={styles.arrow} />
              </motion.span>
            </motion.span>
          </h1>
          <motion.div 
            className={styles.mobileButton}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.span 
              className={styles.learnMoreButton}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{ transition: 'none' }}
            >
              Learn more
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              style={{ display: 'inline-block' }}
            >
              <FaArrowLeftLong className={styles.arrow} />
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
