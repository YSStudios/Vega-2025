"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles/footer.module.css";

const footerData = {
  menu: [
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
    { label: "Work", href: "/work" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Behance", href: "https://behance.com" },
  ],
  business: {
    title: "Business enquiries",
    email: "info@vega.earth",
    career: {
      title: "Join our team",
      email: "apply@vega.earth",
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const columnVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const svgLayer1Variants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const svgLayer2Variants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const svgLayer3Variants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Footer() {
  return (
    <>
      <motion.footer
        id="contact"
        className={styles.footer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Menu Column */}
            <motion.div
              className={styles.footerColumn}
              variants={columnVariants}
            >
              <motion.h3 className={styles.columnTitle} variants={itemVariants}>
                Menu
              </motion.h3>
              <motion.ul
                className={styles.linkList}
                variants={containerVariants}
              >
                {footerData.menu.map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a href={item.href} className={styles.footerLink}>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Social Column */}
            <motion.div
              className={styles.footerColumn}
              variants={columnVariants}
            >
              <motion.h3 className={styles.columnTitle} variants={itemVariants}>
                Social
              </motion.h3>
              <motion.ul
                className={styles.linkList}
                variants={containerVariants}
              >
                {footerData.social.map((item, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a
                      href={item.href}
                      className={styles.footerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Business Enquiries Column */}
            <motion.div
              className={styles.footerColumn}
              variants={columnVariants}
            >
              <motion.h3 className={styles.columnTitle} variants={itemVariants}>
                {footerData.business.title}
              </motion.h3>
              <motion.div
                className={styles.contactInfo}
                variants={containerVariants}
              >
                <motion.a
                  href={`mailto:${footerData.business.email}`}
                  className={styles.footerLink}
                  variants={itemVariants}
                >
                  {footerData.business.email}
                </motion.a>

                <motion.div
                  className={styles.careerSection}
                  variants={itemVariants}
                >
                  <p className={styles.careerTitle}>
                    {footerData.business.career.title}
                  </p>
                  <motion.a
                    href={`mailto:${footerData.business.career.email}`}
                    className={styles.footerLink}
                    variants={itemVariants}
                  >
                    {footerData.business.career.email}
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Large Logo SVG - Stacked Animation */}
      <motion.div 
        className={styles.logoSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "100px" }}
      >
        <div className={styles.svgContainer}>
           <div className={`${styles.svgLayer} ${styles.svgLayer1}`}>
             <motion.svg 
               className={styles.vegaSvg}
               width="100%" 
               height="100%" 
               viewBox="0 0 8000 859" 
               version="1.1" 
               xmlns="http://www.w3.org/2000/svg" 
               style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round", strokeMiterlimit:2}}
               variants={svgLayer1Variants}
             >
              <text 
                x="18.363px" 
                y="817.953px" 
                 style={{
                   fontFamily:"var(--font-object-sans), sans-serif",
                   fontWeight:700,
                   fontSize:"1080.37px",
                   fill:"#333333",
                   stroke:"none"
                 }}
              >
                VEGA.STUDIO
               </text>
             </motion.svg>
          </div>
          <div className={`${styles.svgLayer} ${styles.svgLayer2}`}>
             <motion.svg
              className={styles.vegaSvg}
              width="100%" 
              height="100%" 
              viewBox="0 0 8000 859" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round", strokeMiterlimit:2}}
              variants={svgLayer2Variants}
            >
              <text 
                x="18.363px" 
                y="817.953px" 
                style={{
                  fontFamily:"var(--font-object-sans), sans-serif",
                  fontWeight:700,
                  fontSize:"1080.37px",
                  fill:"#999999",
                  stroke:"none"
                }}
              >
                VEGA.STUDIO
               </text>
             </motion.svg>
          </div>
          <div className={`${styles.svgLayer} ${styles.svgLayer3}`}>
             <motion.svg
              className={styles.vegaSvg}
              width="100%" 
              height="100%" 
              viewBox="0 0 8000 859" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round", strokeMiterlimit:2}}
              variants={svgLayer3Variants}
            >
              <text 
                x="18.363px" 
                y="817.953px" 
                style={{
                  fontFamily:"var(--font-object-sans), sans-serif",
                  fontWeight:700,
                  fontSize:"1080.37px",
                  fill:"#ffffff",
                  stroke:"none"
                }}
              >
                VEGA.STUDIO
               </text>
             </motion.svg>
          </div>
        </div>
      </motion.div>
    </>
  );
}
