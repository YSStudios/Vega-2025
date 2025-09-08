"use client";

import React from "react";
import { GooeyNavMenu } from "./gooey-nav-menu";
import styles from "../styles/navigation-header.module.css";
import Image from "next/image";

const navigationItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "CONTACT", href: "/contact" },
];

interface NavigationHeaderProps {
  onNavigate?: (href: string) => void;
}

export default function NavigationHeader({
  onNavigate,
}: NavigationHeaderProps) {
  const handleItemClick = (item: { label: string; href: string }) => {
    console.log(`Navigating to: ${item.href}`);
    onNavigate?.(item.href);
    // Here you could use Next.js router for navigation
    // const router = useRouter();
    // router.push(item.href);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <Image
            src="/vega-logo.svg"
            alt="Vega Logo"
            width={48}
            height={48}
            className={styles.logo}
          />
        </div>

        <div className={styles.studioTitle}>
          <h1>Creative Technology Studio</h1>
        </div>

        <nav className={styles.navContainer}>
          <div className={styles.navMenu}>
            <GooeyNavMenu
              items={navigationItems}
              onItemClick={handleItemClick}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
