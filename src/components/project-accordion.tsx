"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/project-accordion.module.css";
import Image from "next/image";

interface AccordionItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  number: string;
  image: string;
  description: string;
  accentColor: string;
}

const accordionData: AccordionItem[] = [
  {
    id: "1",
    category: "TECHNOLOGY",
    title: "Apple:",
    subtitle: "Think Different",
    number: "01",
    image: "/images/apple-campaign.jpg",
    description:
      "A revolutionary campaign celebrating innovation and creativity, showcasing Apple's commitment to pushing boundaries and empowering visionaries.",
    accentColor: "#007AFF",
  },
  {
    id: "2",
    category: "Design",
    title: "Toyota:",
    subtitle: "Window to the Wild",
    number: "02",
    image: "/images/toyota-window.jpg",
    description:
      "An immersive campaign showcasing Toyota's adventure-ready vehicles through stunning wilderness cinematography and AI-enhanced storytelling.",
    accentColor: "#CC0000",
  },
  {
    id: "3",
    category: "Motion & CGI",
    title: "Tide:",
    subtitle: "Gonna Need More Tide",
    number: "03",
    image: "/images/tide-campaign.jpg",
    description:
      "A bold social media campaign highlighting Tide's cleaning power through relatable everyday moments and viral-worthy content.",
    accentColor: "#FF6600",
  },
  {
    id: "4",
    category: "Strategy",
    title: "Toyota:",
    subtitle: "Dareful Handle",
    number: "04",
    image: "/images/toyota-dareful.jpg",
    description:
      "A daring approach to showcasing Toyota's precision engineering and handling capabilities through dynamic visual storytelling.",
    accentColor: "#E91E63",
  },
  {
    id: "5",
    category: "Product Design",
    title: "Nike:",
    subtitle: "Just Do It",
    number: "05",
    image: "/images/nike-campaign.jpg",
    description:
      "An inspiring campaign that captures the spirit of athleticism and determination, featuring cutting-edge product showcases and athlete stories.",
    accentColor: "#00A651",
  },
];

export default function ProjectAccordion() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.accordionContainer}>
      <h2 className={styles.sectionTitle}>Expertise & Capabilities</h2>
      {accordionData.map((item, index) => {
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className={styles.accordionItem}>
            <div className={styles.accordionItemInner}>
              <button
                className={`${styles.accordionHeader} ${
                  isExpanded ? styles.expanded : ""
                }`}
                onClick={() => toggleAccordion(item.id)}
                aria-expanded={isExpanded}
              >
                <div className={styles.headerLeft}>
                  <span className={styles.category}>{item.category}</span>
                </div>

                <div className={styles.headerCenter}>
                  <h2
                    className={styles.title}
                    style={{
                      color: isExpanded ? item.accentColor : "inherit",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    className={styles.subtitle}
                    style={{
                      color: isExpanded ? item.accentColor : "inherit",
                    }}
                  >
                    {item.subtitle}
                  </p>
                </div>

                <div className={styles.headerRight}>
                  <span
                    className={styles.number}
                    style={{
                      color: isExpanded ? item.accentColor : "inherit",
                    }}
                  >
                    {item.number}
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    className={styles.accordionContent}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.3 },
                    }}
                  >
                    <div className={styles.contentWrapper}>
                      <div className={styles.imageContainer}>
                        <Image
                          src={item.image}
                          alt={`${item.title} ${item.subtitle}`}
                          fill
                          className={styles.image}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className={styles.textContainer}>
                        <p className={styles.description}>{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {index < accordionData.length - 1 && (
              <div className={styles.divider} />
            )}
          </div>
        );
      })}
    </div>
  );
}
