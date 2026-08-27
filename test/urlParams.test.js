import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, stateFromQueryString } from '../src/lib/urlParams.js';

describe('stateFromQueryString', () => {
  it('returns the defaults for an empty query string', () => {
    expect(stateFromQueryString('')).toEqual(DEFAULT_STATE);
  });

  it('pre-fills the name fields, as the original page did', () => {
    expect(stateFromQueryString('?first=Ada&last=Lovelace&pronouns=she%2Fher')).toMatchObject({
      first: 'Ada', last: 'Lovelace', pronouns: 'she/her',
    });
  });

  it('pre-selects a cohort colour', () => {
    expect(stateFromQueryString('?cohort=%230033AB').cohort).toBe('#0033AB');
  });

  it('ignores a cohort colour that is not on the list', () => {
    expect(stateFromQueryString('?cohort=%23123456').cohort).toBe('none');
  });

  it('also accepts background and logo, which the original ignored', () => {
    expect(stateFromQueryString('?background=emba_blue&logo=logo_gnam')).toMatchObject({
      background: 'emba_blue', logo: 'logo_gnam',
    });
  });

  it('ignores unknown backgrounds and logos', () => {
    expect(stateFromQueryString('?background=nope&logo=nope')).toMatchObject({
      background: DEFAULT_STATE.background, logo: DEFAULT_STATE.logo,
    });
  });
});
