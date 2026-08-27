import { describe, expect, it } from 'vitest';
import { BACKGROUNDS, COHORTS, LOGOS, getBackground } from '../src/lib/options.js';

// The pre-React page hard-coded these lists in the markup. Locking them down
// here guarantees the refactor did not silently drop or reorder a choice.
describe('dropdown options match the original markup', () => {
  it('offers the same backgrounds in the same order', () => {
    expect(BACKGROUNDS.map((b) => [b.value, b.label])).toEqual([
      ['blue', 'Blue'],
      ['blue_gradient', 'Blue Gradient'],
      ['blue_facade', 'Blue Facade'],
      ['evanshall_facade', 'Evans Hall Facade'],
      ['evanshall_fisheye', 'Evans Hall Fisheye'],
      ['broad_evanshall', 'Broad Center 1'],
      ['broad_ballroom', 'Broad Center 2'],
      ['broad_postcard', 'Broad Center Forum'],
      ['emba_white', 'EMBA White'],
      ['emba_blue', 'EMBA Blue'],
    ]);
  });

  it('offers the same cohort colours in the same order', () => {
    expect(COHORTS.map((c) => [c.value, c.label])).toEqual([
      ['none', '-- None --'],
      ['#0033AB', 'Blue'],
      ['#00824A', 'Green'],
      ['#AD940D', 'Gold'],
      ['#ADABA6', 'Silver'],
      ['#C8102E', 'Red'],
      ['#FFA500', 'Orange'],
      ['#b67aec', 'Purple'],
    ]);
  });

  it('offers the same logos in the same order', () => {
    expect(LOGOS.map((l) => [l.value, l.label])).toEqual([
      ['logo_none', 'No Logo'],
      ['logo_som', 'Yale SOM'],
      ['logo_gnam', 'GNAM'],
    ]);
  });
});

describe('getBackground', () => {
  it('looks a background up by value', () => {
    expect(getBackground('broad_postcard').label).toBe('Broad Center Forum');
  });

  it('falls back to the first background for an unknown value', () => {
    expect(getBackground('nope')).toBe(BACKGROUNDS[0]);
  });
});
