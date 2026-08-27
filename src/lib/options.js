/**
 * The three dropdowns' contents, plus everything about a background that the
 * renderer needs. Keeping the presentation data next to the drawing data means
 * adding a background is a one-line change here instead of edits scattered
 * across a chain of `if` statements.
 */

/**
 * @typedef {object} Background
 * @property {string}  value        Form value / identifier.
 * @property {string}  label        Text shown in the dropdown.
 * @property {string}  [image]      Asset id painted across the whole canvas.
 * @property {string}  [color]      Flat fill used when there is no `image`.
 * @property {string}  textColor    Colour the name block is drawn in.
 * @property {string}  [somLogo]    Which SOM wordmark reads well on this background.
 * @property {boolean} [locksForm]  Backgrounds that ship their own branding and
 *                                  therefore force logo/cohort off.
 */

/** @type {Background[]} */
export const BACKGROUNDS = [
  { value: 'blue', label: 'Blue', color: '#000440', textColor: '#ffffff', somLogo: 'logo_som' },
  { value: 'blue_gradient', label: 'Blue Gradient', image: 'blue_gradient', textColor: '#000440', somLogo: 'logo_som_blue' },
  { value: 'blue_facade', label: 'Blue Facade', image: 'blue_facade', textColor: '#ffffff', somLogo: 'logo_som' },
  { value: 'evanshall_facade', label: 'Evans Hall Facade', image: 'evanshall_facade', textColor: '#000440', somLogo: 'logo_som_blue' },
  { value: 'evanshall_fisheye', label: 'Evans Hall Fisheye', image: 'evanshall_fisheye', textColor: '#000440', somLogo: 'logo_som_blue' },
  { value: 'broad_evanshall', label: 'Broad Center 1', image: 'broad_evanshall', textColor: '#000440', somLogo: 'logo_som_blue' },
  { value: 'broad_ballroom', label: 'Broad Center 2', image: 'broad_ballroom', textColor: '#000440', somLogo: 'logo_som_blue' },
  { value: 'broad_postcard', label: 'Broad Center Forum', image: 'broad_postcard', textColor: '#ffffff', somLogo: 'logo_som' },
  { value: 'emba_white', label: 'EMBA White', image: 'emba_white', textColor: '#000440', somLogo: 'logo_som', locksForm: true },
  { value: 'emba_blue', label: 'EMBA Blue', image: 'emba_blue', textColor: '#ffffff', somLogo: 'logo_som', locksForm: true },
];

export const COHORTS = [
  { value: 'none', label: '-- None --' },
  { value: '#0033AB', label: 'Blue' },
  { value: '#00824A', label: 'Green' },
  { value: '#AD940D', label: 'Gold' },
  { value: '#ADABA6', label: 'Silver' },
  { value: '#C8102E', label: 'Red' },
  { value: '#FFA500', label: 'Orange' },
  { value: '#b67aec', label: 'Purple' },
];

export const LOGOS = [
  { value: 'logo_none', label: 'No Logo' },
  { value: 'logo_som', label: 'Yale SOM' },
  { value: 'logo_gnam', label: 'GNAM' },
];

export const NO_COHORT = 'none';
export const NO_LOGO = 'logo_none';

/** @returns {Background} */
export function getBackground(value) {
  return BACKGROUNDS.find((b) => b.value === value) ?? BACKGROUNDS[0];
}
