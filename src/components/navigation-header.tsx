'use client';

import React from 'react';
import { GooeyNavMenu } from './gooey-nav-menu';
import styles from './navigation-header.module.css';

const navigationItems = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'WORK', href: '/work' },
  { label: 'BLOG', href: '/blog' },
  { label: 'CONTACT', href: '/contact' },
];

interface NavigationHeaderProps {
  onNavigate?: (href: string) => void;
}

export default function NavigationHeader({ onNavigate }: NavigationHeaderProps) {
  const handleItemClick = (item: { label: string; href: string }) => {
    console.log(`Navigating to: ${item.href}`);
    onNavigate?.(item.href);
    // Here you could use Next.js router for navigation
    // const router = useRouter();
    // router.push(item.href);
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navMenu}>
        <GooeyNavMenu items={navigationItems} onItemClick={handleItemClick} />
      </div>
    </nav>
  );
}
