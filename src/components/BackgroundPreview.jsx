import { forwardRef } from 'react';

/**
 * The full-resolution canvas is kept off-screen and the user is shown a scaled
 * `<img>` of it, so the preview can be right-clicked and saved like any image.
 */
export const BackgroundPreview = forwardRef(function BackgroundPreview(
  { width, height, previewUrl, alt },
  canvasRef,
) {
  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} className="render-target" />
      <div id="imgs">{previewUrl && <img src={previewUrl} alt={alt} />}</div>
    </>
  );
});
