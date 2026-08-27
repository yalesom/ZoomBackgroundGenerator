import { getBackground, NO_COHORT, NO_LOGO } from './options.js';

const FONT_FAMILY = "'NeueHaasUnicaPro',Arial";
const FIRST_NAME_FONT = `bold 120px ${FONT_FAMILY}`;
const LAST_NAME_FONT = `bold 70px ${FONT_FAMILY}`;
const PRONOUNS_FONT = `50px ${FONT_FAMILY}`;

/** Width of the coloured cohort stripe down the left edge. */
const COHORT_STRIPE_WIDTH = 60;

/** Distance from the canvas edge to the name block. */
const MARGIN_WITHOUT_LOGO = 100;
const MARGIN_WITH_LOGO = 330;
const EMBA_RIGHT_MARGIN = 100;

/** Baselines for the three lines of text, with and without a wordmark above them. */
const BASELINES_COMPACT = { first: 160, last: 250, pronouns: 320 };
const BASELINES_BELOW_LOGO = { first: 270, last: 360, pronouns: 430 };

const LOGO_TOP = 50;
const LOGO_LEFT = 70;
/** The GNAM roundel is scaled to a fixed width; the SOM wordmark is drawn at natural size. */
const GNAM_LOGO_WIDTH = 200;

/**
 * @typedef {object} FormState
 * @property {string} first
 * @property {string} last
 * @property {string} pronouns
 * @property {string} background
 * @property {string} cohort
 * @property {string} logo
 */

/**
 * Where the name block and stripe sit for a given form state.
 *
 * The SOM wordmark is wide and sits above the name, so selecting it pushes the
 * text down and to the right; the EMBA backgrounds instead right-align the name
 * because their own artwork occupies the left of the frame.
 */
export function computeLayout(state) {
  const background = getBackground(state.background);

  if (background.locksForm) {
    return {
      align: 'right',
      margin: EMBA_RIGHT_MARGIN,
      stripeWidth: 0,
      baselines: BASELINES_COMPACT,
    };
  }

  const hasWideLogo = state.logo === 'logo_som';
  return {
    align: 'left',
    margin: state.logo === NO_LOGO ? MARGIN_WITHOUT_LOGO : MARGIN_WITH_LOGO,
    stripeWidth: state.cohort === NO_COHORT ? 0 : COHORT_STRIPE_WIDTH,
    baselines: hasWideLogo ? BASELINES_BELOW_LOGO : BASELINES_COMPACT,
  };
}

/**
 * Paint one virtual background.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w  Canvas width in pixels.
 * @param {number} h  Canvas height in pixels.
 * @param {FormState} state
 * @param {Record<string, CanvasImageSource & {width: number, height: number}>} images
 *        Loaded images keyed by asset id. Entries may be missing while assets
 *        are still loading, in which case that layer is skipped.
 */
export function draw(ctx, w, h, state, images) {
  const background = getBackground(state.background);
  const layout = computeLayout(state);

  drawBackdrop(ctx, w, h, background, images);

  ctx.fillStyle = background.textColor;
  drawNameBlock(ctx, w, state, layout);

  if (layout.stripeWidth > 0) {
    ctx.fillStyle = state.cohort;
    ctx.fillRect(0, 0, layout.stripeWidth, h);
  }

  drawLogo(ctx, state, background, layout, images);
}

function drawBackdrop(ctx, w, h, background, images) {
  if (background.image) {
    const image = images[background.image];
    if (image) ctx.drawImage(image, 0, 0, w, h);
  } else {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawNameBlock(ctx, w, state, layout) {
  const lines = [
    { text: state.first, font: FIRST_NAME_FONT, baseline: layout.baselines.first },
    { text: state.last, font: LAST_NAME_FONT, baseline: layout.baselines.last },
    { text: state.pronouns, font: PRONOUNS_FONT, baseline: layout.baselines.pronouns },
  ];

  for (const line of lines) {
    ctx.font = line.font;
    const x =
      layout.align === 'right'
        ? w - layout.margin - ctx.measureText(line.text).width
        : layout.margin + layout.stripeWidth;
    ctx.fillText(line.text, x, line.baseline);
  }
}

function drawLogo(ctx, state, background, layout, images) {
  if (state.logo === NO_LOGO) return;

  const x = LOGO_LEFT + layout.stripeWidth;

  if (state.logo === 'logo_som') {
    // Drawn at its natural size: the wordmark is authored at canvas scale.
    const logo = images[background.somLogo];
    if (logo) ctx.drawImage(logo, x, LOGO_TOP, logo.width, logo.height);
    return;
  }

  if (state.logo === 'logo_gnam') {
    const logo = images.logo_gnam;
    if (logo) {
      const height = (GNAM_LOGO_WIDTH * logo.height) / logo.width;
      ctx.drawImage(logo, x, LOGO_TOP, GNAM_LOGO_WIDTH, height);
    }
  }
}
