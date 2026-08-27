import { describe, expect, it } from 'vitest';
import { applyBackground, isFormLocked } from '../src/lib/formRules.js';

const state = {
  first: 'Ada', last: 'Lovelace', pronouns: 'she/her',
  background: 'blue', cohort: '#C8102E', logo: 'logo_som',
};

describe('applyBackground', () => {
  it('clears the logo and cohort when an EMBA background is chosen', () => {
    expect(applyBackground(state, 'emba_white')).toMatchObject({
      background: 'emba_white', logo: 'logo_none', cohort: 'none',
    });
  });

  it('leaves the logo and cohort alone for every other background', () => {
    expect(applyBackground(state, 'broad_ballroom')).toMatchObject({
      background: 'broad_ballroom', logo: 'logo_som', cohort: '#C8102E',
    });
  });

  it('keeps the typed name fields', () => {
    expect(applyBackground(state, 'emba_blue')).toMatchObject({
      first: 'Ada', last: 'Lovelace', pronouns: 'she/her',
    });
  });
});

describe('isFormLocked', () => {
  it('locks logo and cohort only for EMBA backgrounds', () => {
    expect(isFormLocked('emba_white')).toBe(true);
    expect(isFormLocked('emba_blue')).toBe(true);
    expect(isFormLocked('blue')).toBe(false);
    expect(isFormLocked('broad_postcard')).toBe(false);
  });
});
