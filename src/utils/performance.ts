/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Lazy load images with error handling
 */
export function lazyLoadImage(
  uri: string,
  onLoad?: () => void,
  onError?: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      onLoad?.();
      resolve();
    };
    img.onerror = () => {
      onError?.();
      reject(new Error('Failed to load image'));
    };
    img.src = uri;
  });
}

/**
 * Check if component should update based on props comparison
 */
export function shouldUpdate(
  prevProps: Record<string, any>,
  nextProps: Record<string, any>,
  keys: string[]
): boolean {
  return keys.some((key) => prevProps[key] !== nextProps[key]);
}

/**
 * Batch multiple state updates
 */
export function batchUpdates<T>(
  updates: Array<() => T>,
  callback?: (results: T[]) => void
): void {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      const results = updates.map((update) => update());
      callback?.(results);
    });
  } else {
    const results = updates.map((update) => update());
    callback?.(results);
  }
}

/**
 * Optimize list rendering by calculating visible items
 */
export function calculateVisibleItems(
  itemHeight: number,
  containerHeight: number,
  scrollOffset: number,
  totalItems: number,
  buffer: number = 5
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollOffset / itemHeight) - buffer);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + buffer * 2);

  return { start, end };
}

/**
 * Preload critical resources (React Native compatible)
 */
export async function preloadResources(urls: string[]): Promise<void> {
  // For React Native, we can use Image.prefetch
  const { Image } = require('react-native');
  
  const promises = urls.map((url) => {
    // Check if it's an image
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return Image.prefetch(url).catch(() => {
        // Silently fail if image can't be prefetched
        console.warn(`Failed to preload image: ${url}`);
      });
    }
    // For other resources, just resolve (could use fetch for web)
    return Promise.resolve();
  });

  await Promise.all(promises);
}

/**
 * Measure performance metrics
 */
export function measurePerformance(
  name: string,
  fn: () => void | Promise<void>
): void {
  if (__DEV__ && typeof performance !== 'undefined') {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      result.then(() => {
        const end = performance.now();
        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
      });
    } else {
      const end = performance.now();
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    }
  } else {
    fn();
  }
}

