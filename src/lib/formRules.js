import { getBackground, NO_COHORT, NO_LOGO } from './options.js';

/**
 * The EMBA backgrounds already carry their own branding, so the logo and cohort
 * controls are disabled and reset while one of them is selected.
 */
export function applyBackground(state, background) {
  if (getBackground(background).locksForm) {
    return { ...state, background, logo: NO_LOGO, cohort: NO_COHORT };
  }
  return { ...state, background };
}

export function isFormLocked(background) {
  return Boolean(getBackground(background).locksForm);
}
