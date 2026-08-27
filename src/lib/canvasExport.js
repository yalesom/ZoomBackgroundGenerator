/**
 * Canvas export helpers.
 *
 * This replaces the vendored `canvas2image.js`, which carried a hand-rolled
 * BMP encoder and PNG/GIF/BMP entry points that this app never called. Only the
 * two JPEG paths it actually used are kept.
 */

const MIME_JPEG = 'image/jpeg';

/** A data URL for the canvas, suitable for an `<img src>` preview. */
export function toPreviewUrl(canvas, type = MIME_JPEG) {
  return canvas.toDataURL(type);
}

/**
 * Prompt the browser to save the canvas as a file.
 *
 * Uses a blob URL rather than a data URL so a multi-megabyte background is not
 * base64-inflated into an `href` attribute.
 */
export function downloadCanvas(canvas, filename, type = MIME_JPEG) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke on the next tick; revoking synchronously can cancel the
      // download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 0);
      resolve();
    }, type);
  });
}
