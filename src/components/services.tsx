"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/services.module.css";

const servicesData = [
  {
    title: "Technology",
    items: [
      { category: "Spatial Computing (AR, VR, XR)", subItems: ["Web3 / Blockchain"] },
      { category: "AI Tools & Experiences", subItems: ["Game Development"] },
      { category: "Web Development", subItems: ["Rapid Prototyping"] },
      { category: "WebGL Experiences", subItems: [] }
    ],
    bgColor: "cyan",
    cubeType: "fragments"
  },
  {
    title: "Design",
    items: [
      { category: "Creative Direction", subItems: ["Brand Identity"] },
      { category: "Art Direction", subItems: ["Design Systems"] },
      { category: "User Experience Design", subItems: ["Concept Design"] },
      { category: "User Interface Design", subItems: [] }
    ],
    bgColor: "purple",
    cubeType: "modular"
  },
  {
    title: "Motion & CGI",
    items: [
      { category: "2D & 3D Animation", subItems: ["Character Design"] },
      { category: "2D & 3D Illustration", subItems: ["Motion Identity"] },
      { category: "Concept Art", subItems: [] },
      { category: "FOOH", subItems: [] }
    ],
    bgColor: "green",
    cubeType: "stacked"
  }
];

export default function Services() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Expertise & Capabilities
        </motion.h2>
        
        <div className={styles.cardsGrid}>
          {servicesData.map((service, index) => (
            <motion.div
              key={service.title}
              className={`${styles.serviceCard} ${styles[service.bgColor]}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.2) }}
            >
              <div className={styles.cardContent}>
                <div className={styles.cubeContainer}>
                  <div className={`${styles.cube} ${styles[service.cubeType]}`}>
                    {service.cubeType === 'fragments' && (
                      <>
                        <div className={styles.fragment}></div>
                        <div className={styles.fragment}></div>
                        <div className={styles.fragment}></div>
                        <div className={styles.fragment}></div>
                        <div className={styles.fragment}></div>
                      </>
                    )}
                    {service.cubeType === 'modular' && (
                      <>
                        <div className={styles.module}></div>
                        <div className={styles.module}></div>
                        <div className={styles.module}></div>
                        <div className={styles.module}></div>
                        <div className={styles.module}></div>
                        <div className={styles.module}></div>
                      </>
                    )}
                    {service.cubeType === 'stacked' && (
                      <>
                        <div className={styles.stackLayer}></div>
                        <div className={styles.stackLayer}></div>
                        <div className={styles.stackLayer}></div>
                        <div className={styles.stackLayer}></div>
                      </>
                    )}
                  </div>
                </div>
                
                <motion.div 
                  className={styles.textContent}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + (index * 0.2) }}
                >
                  <h3 className={styles.cardTitle}>
                    {service.title}
                  </h3>
                  
                  <div className={styles.itemsList}>
                    {service.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.itemGroup}>
                        <div className={styles.categoryItem}>
                          {item.category}
                        </div>
                        {item.subItems.map((subItem, subIndex) => (
                          <div key={subIndex} className={styles.subItem}>
                            {subItem}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}