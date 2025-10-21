"use client";

import React, { useEffect, useRef } from "react";
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
  },
  {
    title: "Strategy",
    items: [
      { category: "Business Strategy", subItems: ["Market Research"] },
      { category: "Digital Transformation", subItems: ["Innovation Consulting"] },
      { category: "Product Strategy", subItems: ["Go-to-Market"] },
      { category: "User Research", subItems: [] }
    ],
    bgColor: "orange",
    cubeType: "spiral"
  },
  {
    title: "Production",
    items: [
      { category: "Project Management", subItems: ["Agile Methodology"] },
      { category: "Quality Assurance", subItems: ["Testing & Validation"] },
      { category: "Content Production", subItems: ["Asset Creation"] },
      { category: "Launch & Support", subItems: [] }
    ],
    bgColor: "red",
    cubeType: "grid"
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cubes = entry.target.querySelectorAll(`.${styles.cube}`);
          cubes.forEach((cube) => {
            if (entry.isIntersecting) {
              (cube as HTMLElement).style.animationPlayState = 'running';
            } else {
              (cube as HTMLElement).style.animationPlayState = 'paused';
            }
          });
        });
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.servicesSection}>
      <h2 className={styles.sectionTitle}>
        Expertise & Capabilities
      </h2>
      
      <div className={styles.cardsGrid}>
          {servicesData.map((service) => (
            <div
              key={service.title}
              className={`${styles.serviceCard} ${styles[service.bgColor]}`}
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
                    {service.cubeType === 'spiral' && (
                      <>
                        <div className={styles.spiralElement}></div>
                        <div className={styles.spiralElement}></div>
                        <div className={styles.spiralElement}></div>
                        <div className={styles.spiralElement}></div>
                        <div className={styles.spiralElement}></div>
                      </>
                    )}
                    {service.cubeType === 'grid' && (
                      <>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                        <div className={styles.gridCell}></div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={styles.textContent}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}