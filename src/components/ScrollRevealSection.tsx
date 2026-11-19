import React, { useState, useEffect, useRef } from 'react';
import { getRevealClassName } from '../utils/scrollReveal';

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  as?: React.ElementType;
}

/**
 * Hook to observe when a DOM element enters the viewport.
 */
export function useIntersectionReveal(options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Immediate visibility fallback for SSR or environments lacking IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    // Respect accessibility reduced-motion preference
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    } catch {
      // Ignore matchMedia errors in tests
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && (entry.isIntersecting || entry.intersectionRatio > 0)) {
          setIsVisible(true);
          if (options?.triggerOnce !== false) {
            observer.unobserve(entry.target);
          }
        } else if (options?.triggerOnce === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.rootMargin, options?.triggerOnce]);

  return { ref: elementRef, isVisible };
}

/**
 * Graceful scroll-reveal container component that fades in and slides up
 * content as it scrolls into the viewport.
 */
export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  children,
  className = '',
  delayMs = 0,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
  as: Component = 'div',
}) => {
  const { ref, isVisible } = useIntersectionReveal({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <Component
      ref={ref}
      style={{
        transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
      }}
      className={getRevealClassName(isVisible, className)}
    >
      {children}
    </Component>
  );
};
