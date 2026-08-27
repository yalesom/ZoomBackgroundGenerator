import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundForm } from './components/BackgroundForm.jsx';
import { BackgroundPreview } from './components/BackgroundPreview.jsx';
import { downloadCanvas, toPreviewUrl } from './lib/canvasExport.js';
import { draw } from './lib/draw.js';
import { applyBackground, isFormLocked } from './lib/formRules.js';
import { stateFromQueryString } from './lib/urlParams.js';
import { useFontsReady } from './hooks/useFontsReady.js';
import { useImages } from './hooks/useImages.js';

/** Zoom's two supported virtual-background aspect ratios. */
const RATIOS = {
  HD: { width: 1920, height: 1080 },
  43: { width: 1600, height: 1200 },
};

const DOWNLOAD_FILENAME = 'zoombackground.jpg';

export default function App() {
  const [state, setState] = useState(() => stateFromQueryString(window.location.search));
  const [ratio, setRatio] = useState('HD');
  const [previewUrl, setPreviewUrl] = useState(null);

  const canvasRef = useRef(null);
  const images = useImages();
  const fontsReady = useFontsReady();

  const { width, height } = RATIOS[ratio];
  const locked = isFormLocked(state.background);

  const update = useCallback((changes) => {
    setState((current) =>
      'background' in changes
        ? applyBackground(current, changes.background)
        : { ...current, ...changes },
    );
  }, []);

  // Repaint whenever anything that affects the output changes. `fontsReady` is
  // a dependency so the name is redrawn once the real webfont is available.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw(canvas.getContext('2d'), width, height, state, images);
    setPreviewUrl(toPreviewUrl(canvas));
  }, [state, width, height, images, fontsReady]);

  const handleSave = useCallback(() => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, DOWNLOAD_FILENAME);
  }, []);

  const previewAlt = useMemo(
    () => `Zoom virtual background preview for ${[state.first, state.last].join(' ').trim() || 'your name'}`,
    [state.first, state.last],
  );

  return (
    <div className="doc">
      <h1>SOM Zoom Virtual Background Generator</h1>

      <p>
        Use this tool to generate a personalized virtual background for use in classroom Zoom
        sessions. The backgrounds are designed to make your name visible even in Zoom&rsquo;s grid
        view.
      </p>
      <p>
        After filling out the form below, use the &ldquo;Save&rdquo; button to save an image to your
        computer. Then set it as your virtual background in your Zoom preferences.{' '}
        (<a href="https://support.zoom.us/hc/en-us/articles/210707503-Virtual-Background">
          How do I set a virtual background in Zoom?
        </a>){' '}
        Check your video preview and adjust your position to avoid obscuring your name. Note that
        the text in the preview may be reversed, depending on your settings, but it will appear
        correctly to other users.
      </p>

      <BackgroundForm
        state={state}
        locked={locked}
        ratio={ratio}
        onChange={update}
        onRatioChange={setRatio}
        onSave={handleSave}
      />

      <BackgroundPreview
        ref={canvasRef}
        width={width}
        height={height}
        previewUrl={previewUrl}
        alt={previewAlt}
      />
    </div>
  );
}
