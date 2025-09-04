'use client';

import React from 'react';
import { GooeyNavMenu } from './gooey-nav-menu';

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
    <header style={{ background: 'black', minHeight: '120px', padding: '20px 0' }}>
      <GooeyNavMenu items={navigationItems} onItemClick={handleItemClick} />
    </header>
  );
}
