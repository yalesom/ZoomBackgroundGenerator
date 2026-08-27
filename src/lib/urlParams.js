import { BACKGROUNDS, COHORTS, LOGOS, NO_COHORT, NO_LOGO } from './options.js';

export const DEFAULT_STATE = {
  first: '',
  last: '',
  pronouns: '',
  background: BACKGROUNDS[0].value,
  cohort: NO_COHORT,
  logo: NO_LOGO,
};

const isKnown = (list, value) => list.some((item) => item.value === value);

/**
 * Build the initial form state from a query string, so a link like
 * `?first=Ada&last=Lovelace&pronouns=she/her` opens pre-filled.
 *
 * Unknown dropdown values are ignored rather than applied, which keeps a
 * hand-edited URL from putting the form into a state the UI cannot represent.
 */
export function stateFromQueryString(search) {
  const params = new URLSearchParams(search);
  const state = { ...DEFAULT_STATE };

  for (const key of ['first', 'last', 'pronouns']) {
    const value = params.get(key);
    if (value) state[key] = value;
  }

  const cohort = params.get('cohort');
  if (cohort && isKnown(COHORTS, cohort)) state.cohort = cohort;

  const background = params.get('background');
  if (background && isKnown(BACKGROUNDS, background)) state.background = background;

  const logo = params.get('logo');
  if (logo && isKnown(LOGOS, logo)) state.logo = logo;

  return state;
}
