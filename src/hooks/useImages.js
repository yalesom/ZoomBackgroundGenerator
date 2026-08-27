import { useEffect, useState } from 'react';
import { loadImages } from '../lib/images.js';

/**
 * Loads the background and logo assets once, on mount.
 * Returns `{}` until they are ready; `draw()` renders text-only in the meantime.
 */
export function useImages() {
  const [images, setImages] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadImages().then((loaded) => {
      if (!cancelled) setImages(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}
