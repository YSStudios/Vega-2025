'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './gooey-nav-menu.module.css';

interface MenuItem {
  label: string;
  href: string;
}

interface GooeyNavMenuProps {
  items: MenuItem[];
  onItemClick?: (item: MenuItem, index: number) => void;
}

export function GooeyNavMenu({ items, onItemClick }: GooeyNavMenuProps) {
  const dotsRef = useRef<HTMLUListElement>(null);
  const selectRef = useRef<HTMLLIElement>(null);
  const textItemsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const dotElementsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Remove the problematic animation loop for now - it was interfering with hover positioning

  const handleHover = useCallback((index: number) => {
    if (!selectRef.current || !dotElementsRef.current[index]) return;

    const dotElement = dotElementsRef.current[index];
    if (!dotElement) return;

    // Calculate position based on dot spacing
    const dotMargin = 5; // margin-left + margin-right = 10px total between dots
    const dotWidth = 80; // width from CSS
    const spaceBetweenDots = dotWidth + (dotMargin * 2); // 90px total space per dot
    
    // Calculate destination relative to initial position (which is at first dot)
    const dest = index * spaceBetweenDots;
    const t = 0.6;

    // Create timeline for smooth scale + position animation
    const tl = gsap.timeline();
    
    // First: Scale down slightly while moving
    tl.to(selectRef.current, {
      duration: t * 0.3,
      scaleY: 0.8,
      scaleX: 1.3,
      ease: "power2.out"
    })
    // Then: Move to position while maintaining scale
    .to(selectRef.current, {
      duration: t * 0.7,
      x: dest,
      ease: "back.out(1.7)"
    }, "-=0.1")
    // Finally: Scale back to normal
    .to(selectRef.current, {
      duration: t * 0.4,
      scaleY: 1,
      scaleX: 1,
      ease: "power2.out"
    }, "-=0.2");
  }, []);

  const handleItemClick = (item: MenuItem, index: number) => {
    handleHover(index);
    onItemClick?.(item, index);
  };

  useEffect(() => {
    // Trigger initial hover on first item after component mounts
    setTimeout(() => {
      if (dotElementsRef.current[0]) {
        handleHover(0);
      }
    }, 100);
  }, [handleHover]);

  return (
    <div className={styles.menuContainer}>
      <ul className={styles.dots} ref={dotsRef}>
        <li className={styles.select} ref={selectRef}></li>
        {items.map((_, index) => (
          <li
            key={index}
            className={styles.dot}
            ref={(el) => {
              dotElementsRef.current[index] = el;
            }}
            onMouseEnter={() => handleHover(index)}
          ></li>
        ))}
      </ul>
      <div className={styles.menuText}>
        {items.map((item, index) => (
          <span
            key={index}
            className={styles.textItem}
            ref={(el) => {
              textItemsRef.current[index] = el;
            }}
            onMouseEnter={() => handleHover(index)}
            onClick={() => handleItemClick(item, index)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
