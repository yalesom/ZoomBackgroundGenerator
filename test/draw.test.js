import { describe, expect, it } from 'vitest';
import { legacyDraw } from './legacy/legacyDraw.js';
import { createRecordingContext, fakeImage } from './recorder.js';
import { draw, computeLayout } from '../src/lib/draw.js';
import { BACKGROUNDS, COHORTS, LOGOS } from '../src/lib/options.js';

// Natural sizes of the extracted assets; the SOM wordmark in particular is
// drawn at natural size, so these numbers are part of the rendered output.
const IMAGES = {
  logo_som: fakeImage('logo_som', 1360, 170),
  logo_som_blue: fakeImage('logo_som_blue', 1360, 170),
  logo_gnam: fakeImage('logo_gnam', 180, 175),
  blue_gradient: fakeImage('blue_gradient', 1920, 1080),
  blue_facade: fakeImage('blue_facade', 1920, 1080),
  evanshall_facade: fakeImage('evanshall_facade', 1920, 1080),
  evanshall_fisheye: fakeImage('evanshall_fisheye', 1920, 1080),
  broad_evanshall: fakeImage('broad_evanshall', 1920, 1080),
  broad_ballroom: fakeImage('broad_ballroom', 1920, 1080),
  broad_postcard: fakeImage('broad_postcard', 1920, 1080),
  emba_white: fakeImage('emba_white', 1920, 1080),
  emba_blue: fakeImage('emba_blue', 1920, 1080),
};

/** Adapt a plain state object to the `$el.value` globals the legacy code reads. */
function legacyGlobals(state) {
  const asInput = (value) => ({ value });
  return {
    $first: asInput(state.first),
    $last: asInput(state.last),
    $pronouns: asInput(state.pronouns),
    $background: asInput(state.background),
    $cohort: asInput(state.cohort),
    $logo: asInput(state.logo),
    $blue_gradient: IMAGES.blue_gradient,
    $blue_facade: IMAGES.blue_facade,
    $evanshall_facade: IMAGES.evanshall_facade,
    $evanshall_fisheye: IMAGES.evanshall_fisheye,
    $broad_evanshall: IMAGES.broad_evanshall,
    $broad_ballroom: IMAGES.broad_ballroom,
    $broad_postcard: IMAGES.broad_postcard,
    $emba_white: IMAGES.emba_white,
    $emba_blue: IMAGES.emba_blue,
    $logo_som: IMAGES.logo_som,
    $logo_som_blue: IMAGES.logo_som_blue,
    $logo_gnam: IMAGES.logo_gnam,
  };
}

function recordLegacy(state, w, h) {
  const { ctx, ops } = createRecordingContext();
  legacyDraw(ctx, w, h, legacyGlobals(state));
  return ops;
}

function recordNew(state, w, h) {
  const { ctx, ops } = createRecordingContext();
  draw(ctx, w, h, state, IMAGES);
  return ops;
}

const NAMES = { first: 'Ada', last: 'Lovelace', pronouns: 'she/her' };
const SIZES = [
  { label: 'HD 1920x1080', w: 1920, h: 1080 },
  { label: '4:3 1600x1200', w: 1600, h: 1200 },
];

describe('draw() matches the original implementation', () => {
  const combinations = BACKGROUNDS.flatMap((background) =>
    COHORTS.flatMap((cohort) =>
      LOGOS.map((logo) => ({
        ...NAMES,
        background: background.value,
        cohort: cohort.value,
        logo: logo.value,
      })),
    ),
  );

  it('covers every background / cohort / logo combination', () => {
    expect(combinations).toHaveLength(BACKGROUNDS.length * COHORTS.length * LOGOS.length);
  });

  for (const size of SIZES) {
    for (const state of combinations) {
      it(`${size.label} — ${state.background} / ${state.cohort} / ${state.logo}`, () => {
        const expected = recordLegacy(state, size.w, size.h);
        expect(expected.length).toBeGreaterThan(0);
        expect(recordNew(state, size.w, size.h)).toEqual(expected);
      });
    }
  }
});

describe('draw() matches the original for edge-case text', () => {
  const texts = [
    { first: '', last: '', pronouns: '' },
    { first: 'A', last: 'B', pronouns: 'C' },
    { first: 'Bartholomew', last: 'Featherstonehaugh-Smythe', pronouns: 'they/them/theirs' },
    { first: 'Zoë', last: "O'Brien-Núñez", pronouns: 'ze/hir' },
  ];

  // One left-aligned and one right-aligned background: the right-aligned
  // (EMBA) layout is the only one where text length changes the geometry.
  for (const background of ['blue', 'broad_evanshall', 'emba_white', 'emba_blue']) {
    for (const text of texts) {
      it(`${background} — "${text.first || '(empty)'}"`, () => {
        const state = { ...text, background, cohort: '#C8102E', logo: 'logo_som' };
        expect(recordNew(state, 1920, 1080)).toEqual(recordLegacy(state, 1920, 1080));
      });
    }
  }
});

describe('computeLayout', () => {
  const base = { ...NAMES, background: 'blue', cohort: 'none', logo: 'logo_none' };

  it('reserves no stripe when no cohort is selected', () => {
    expect(computeLayout(base).stripeWidth).toBe(0);
  });

  it('reserves a 60px stripe for a cohort colour', () => {
    expect(computeLayout({ ...base, cohort: '#0033AB' }).stripeWidth).toBe(60);
  });

  it('pushes the name block down when the SOM wordmark is shown', () => {
    expect(computeLayout({ ...base, logo: 'logo_som' }).baselines).toEqual({
      first: 270,
      last: 360,
      pronouns: 430,
    });
  });

  it('keeps the compact baselines for GNAM and for no logo', () => {
    const compact = { first: 160, last: 250, pronouns: 320 };
    expect(computeLayout({ ...base, logo: 'logo_gnam' }).baselines).toEqual(compact);
    expect(computeLayout(base).baselines).toEqual(compact);
  });

  it('indents the name block when any logo is shown', () => {
    expect(computeLayout(base).margin).toBe(100);
    expect(computeLayout({ ...base, logo: 'logo_som' }).margin).toBe(330);
    expect(computeLayout({ ...base, logo: 'logo_gnam' }).margin).toBe(330);
  });

  it('right-aligns the name block on EMBA backgrounds', () => {
    expect(computeLayout({ ...base, background: 'emba_blue' })).toMatchObject({
      align: 'right',
      margin: 100,
      stripeWidth: 0,
    });
  });
});

describe('draw() tolerates images that have not loaded yet', () => {
  it('skips the backdrop and logo layers rather than throwing', () => {
    const { ctx, ops } = createRecordingContext();
    const state = { ...NAMES, background: 'broad_ballroom', cohort: 'none', logo: 'logo_som' };
    expect(() => draw(ctx, 1920, 1080, state, {})).not.toThrow();
    expect(ops.filter((o) => o.op === 'drawImage')).toHaveLength(0);
    expect(ops.filter((o) => o.op === 'fillText')).toHaveLength(3);
  });
});
