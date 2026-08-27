/**
 * Asset loading.
 *
 * The backgrounds and logos used to be base64 data URIs inlined into a 2.9 MB
 * `index.html`, which every visitor downloaded in full before seeing anything.
 * They now live as ordinary files under `public/assets/` so the browser can
 * cache them and fetch them in parallel.
 */

const ASSETS = {
  logo_som: 'logo_som.png',
  logo_som_blue: 'logo_som_blue.png',
  logo_gnam: 'logo_gnam.png',
  blue_gradient: 'blue_gradient.jpg',
  blue_facade: 'blue_facade.jpg',
  evanshall_facade: 'evanshall_facade.jpg',
  evanshall_fisheye: 'evanshall_fisheye.jpg',
  broad_evanshall: 'broad_evanshall.jpg',
  broad_ballroom: 'broad_ballroom.jpg',
  broad_postcard: 'broad_postcard.png',
  emba_white: 'emba_white.png',
  emba_blue: 'emba_blue.png',
};

export const ASSET_IDS = Object.keys(ASSETS);

export function assetUrl(id) {
  return `${import.meta.env.BASE_URL}assets/${ASSETS[id]}`;
}

/** Resolves once the image is decoded, or to `null` if it fails to load. */
function loadImage(id) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve([id, image]);
    image.onerror = () => resolve([id, null]);
    image.src = assetUrl(id);
  });
}

/**
 * Load every asset, resolving to a map of id -> HTMLImageElement.
 * Assets that fail to load are omitted; `draw()` simply skips those layers.
 */
export async function loadImages(ids = ASSET_IDS) {
  const entries = await Promise.all(ids.map(loadImage));
  return Object.fromEntries(entries.filter(([, image]) => image !== null));
}
