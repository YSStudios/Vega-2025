"use client";

import React, { useState } from "react";
import styles from "../styles/navigation-header.module.css";
import { useAccentColor } from "../contexts/accent-color-context";

interface NavigationHeaderProps {
  onNavigate?: (href: string) => void;
}

export default function NavigationHeader({}: NavigationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // const { currentAccent } = useAccentColor();

  const handleButtonClick = () => {
    console.log("Button clicked");
    // Add your button action here
  };

  const handleMenuToggle = () => {
    console.log("Menu toggle clicked, current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.menuToggle} onClick={handleMenuToggle}>
            <div className={styles.logo}>Vega Studios</div>
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
        <a href="#about">About</a>
        <a href="#Team">Team</a>
        <a href="#work">Work</a>
        <a href="#ideas">Services</a>
        <a href="#careers">Contact</a>
        <button className={styles.closeButton} onClick={handleMenuToggle}>
          ✕
        </button>
      </div>
    </>
  );
}
