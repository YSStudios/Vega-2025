"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/navigation-header.module.css";
import ContactForm from "./contact-form";

interface NavigationHeaderProps {
  onNavigate?: (href: string) => void;
}

export default function NavigationHeader({}: NavigationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const handleButtonClick = () => {
    // Check if we're in a case study page
    if (window.location.pathname.includes('/case-study/')) {
      // Dispatch custom event to scroll to contact form in case study
      window.dispatchEvent(new CustomEvent('scroll-to-contact'));
    } else {
      // Open modal contact form on other pages
      setContactFormOpen(true);
    }
  };

  const handleMenuToggle = () => {
    console.log("Menu toggle clicked, current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.menuToggle} onClick={handleMenuToggle}>
            <div className={styles.logo}>
              <span className={styles.logoText}>Vega Studios</span>
              <div className={styles.logoSvg}>
                <Image
                  src="/vega-logo-white.svg"
                  alt="Vega Studios"
                  width={24}
                  height={24}
                  priority
                />
              </div>
            </div>
            <div className={styles.menuText}>Menu</div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.flipButton} onClick={handleButtonClick}>
              <span className={styles.buttonText}>Let&apos;s talk</span>
              <span className={styles.buttonIcon}>↗</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : ""}`}
      >
        <button onClick={() => handleNavClick('about')}>About</button>
		<button onClick={() => handleNavClick('case-studies')}>Work</button>
        <button onClick={() => handleNavClick('services')}>Services</button>
		<button onClick={() => handleNavClick('brands')}>Brands</button>
        <button onClick={() => handleNavClick('contact')}>Contact</button>
        <button className={styles.closeButton} onClick={handleMenuToggle}>
          ✕
        </button>
      </div>

      <ContactForm
        isOpen={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
      />
    </>
  );
}
