"use client";

import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import styles from "../styles/about.module.css";

export default function About() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <h1 className={styles.mainText}>
            <span className={styles.studioLabel}>( The Studio )</span>
            Vega Studio is a full-service, black-owned and operated agency,
            distinguished in conceptualizing, creating and executing
            digital-first creative strategies established at the intersection of
            cutting edge technology, cultural analysis and virality.<span className={styles.desktopButton}> <span className={styles.learnMoreButton}>Learn more</span> 
            <FaArrowLeftLong className={styles.arrow} /></span>
          </h1>
          <div className={styles.mobileButton}>
            <span className={styles.learnMoreButton}>Learn more</span>
            <FaArrowLeftLong className={styles.arrow} />
          </div>
        </div>
      </div>
    </section>
  );
}
