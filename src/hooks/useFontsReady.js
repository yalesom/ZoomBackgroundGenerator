import { useEffect, useState } from 'react';

/**
 * Tracks whether webfonts have finished loading.
 *
 * The name is drawn into a canvas in NeueHaasUnicaPro. Canvas text does not
 * re-render when a webfont arrives later, so the original page could bake the
 * Arial fallback into whatever it drew first. Waiting on `document.fonts`
 * triggers one more render once the real face is available.
 */
export function useFontsReady() {
  const [ready, setReady] = useState(() => !document.fonts);

  useEffect(() => {
    if (!document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
