"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/brands-slider.module.css";

const brandImages = [
  // Row 1
  { name: "Atlantic", src: "/brands/atlantic.png", alt: "Atlantic Records" },
  { name: "Awal", src: "/brands/awal.webp", alt: "AWAL" },
  { name: "Ciroc", src: "/brands/ciroc.webp", alt: "Ciroc" },
  { name: "Coachella", src: "/brands/coachella.webp", alt: "Coachella" },
  { name: "Color of Change", src: "/brands/color-of-change.webp", alt: "Color of Change" },
  { name: "Culture Con", src: "/brands/culture-con.webp", alt: "Culture Con" },
  
  // Row 2 
  { name: "Diageo", src: "/brands/diageo.webp", alt: "Diageo" },
  { name: "DistroKid", src: "/brands/distrokid.webp", alt: "DistroKid" },
  { name: "DTLR", src: "/brands/dtlr.webp", alt: "DTLR" },
  { name: "Foot Locker", src: "/brands/foot-locker.png", alt: "Foot Locker" },
  { name: "Google", src: "/brands/google.webp", alt: "Google" },
  { name: "H Lorenzo", src: "/brands/h-lorenzo.webp", alt: "H Lorenzo" },
  
  // Row 3
  { name: "Heir Wave", src: "/brands/heir-wave-music-group.webp", alt: "Heir Wave Music Group" },
  { name: "Intel", src: "/brands/intel.webp", alt: "Intel" },
  { name: "Meta", src: "/brands/meta.webp", alt: "Meta" },
  { name: "NBA", src: "/brands/nba.webp", alt: "NBA" },
  { name: "Netflix", src: "/brands/netflix.webp", alt: "Netflix" },
  { name: "Nike", src: "/brands/nike.webp", alt: "Nike" },
  
  // Row 4
  { name: "Roc Nation", src: "/brands/rocnation.webp", alt: "Roc Nation" },
  { name: "Seed Brooklyn", src: "/brands/seed-brooklyn.webp", alt: "Seed Brooklyn" },
  { name: "Soho House", src: "/brands/soho-house.webp", alt: "Soho House" },
  { name: "Sony Music", src: "/brands/sony-music.webp", alt: "Sony Music" },
  { name: "UMG", src: "/brands/umg.webp", alt: "Universal Music Group" },
  { name: "WMG", src: "/brands/wmg.webp", alt: "Warner Music Group" },
  
  // Row 5
  { name: "Xbox", src: "/brands/xbox.webp", alt: "Xbox" },
  { name: "YouTube", src: "/brands/youtube.webp", alt: "YouTube" },
];

// Create rows for the grid layout
const createRows = () => {
  const rows = [];
  const itemsPerRow = Math.ceil(brandImages.length / 3); // Distribute brands across 3 rows
  
  for (let i = 0; i < 3; i++) {
    const startIndex = i * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, brandImages.length);
    if (startIndex < brandImages.length) {
      rows.push(brandImages.slice(startIndex, endIndex));
    }
  }
  
  return rows;
};

const brandRows = createRows();

// Duplicate rows for seamless scrolling
const duplicatedRows = brandRows.map(row => [...row, ...row]);

export default function BrandsSlider() {
  return (
    <motion.section 
      className={styles.brandsSection}
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
        BRANDS
      </motion.h2>
      
      <div className={styles.brandsContainer}>
        {duplicatedRows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.brandRow}>
            <motion.div
              className={styles.brandTrack}
              animate={{
                x: rowIndex % 2 === 0 ? [0, -50 + "%"] : [-50 + "%", 0]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 60 + (rowIndex * 5), // Vary speed for each row
                ease: "linear",
              }}
            >
              {row.map((brand, index) => (
                <div 
                  key={`${rowIndex}-${index}`}
                  className={styles.brandItem}
                >
                  <div className={styles.brandImageContainer}>
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={200}
                      height={100}
                      className={styles.brandImage}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
