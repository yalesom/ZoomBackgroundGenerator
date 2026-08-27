import { BACKGROUNDS, COHORTS, LOGOS } from '../lib/options.js';

function TextField({ id, label, value, onChange, tabIndex }) {
  return (
    <tr>
      <th><label htmlFor={id}>{label}:</label></th>
      <td>
        <input
          type="text"
          id={id}
          placeholder={id}
          tabIndex={tabIndex}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </td>
    </tr>
  );
}

function SelectField({ id, label, value, options, onChange, disabled }) {
  return (
    <tr>
      <th><label htmlFor={id}>{label}:</label></th>
      <td>
        <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

export function BackgroundForm({ state, locked, ratio, onChange, onRatioChange, onSave }) {
  return (
    <table>
      <tbody>
        <tr>
          <th><label htmlFor="first">First Name:</label></th>
          <td>
            <input
              type="text"
              id="first"
              placeholder="firstname"
              tabIndex={1}
              value={state.first}
              onChange={(e) => onChange({ first: e.target.value })}
            />
          </td>
          <td rowSpan={2} align="center">
            <button id="createimage" type="button" tabIndex={4} onClick={onSave}>
              Save Image
            </button>

            <div id="ratioOptions">
              <input
                type="radio"
                id="optionHD"
                name="imageStyle"
                value="HD"
                checked={ratio === 'HD'}
                onChange={() => onRatioChange('HD')}
              />{' '}
              <label htmlFor="optionHD">HD</label>{' '}
              <input
                type="radio"
                id="option43"
                name="imageStyle"
                value="43"
                checked={ratio === '43'}
                onChange={() => onRatioChange('43')}
              />{' '}
              <label htmlFor="option43">4:3</label>
              <div id="ratioTooltip">
                Leave the ratio as HD by default. ONLY choose 4:3 if you are using the lower ratio
                video in Zoom and your name is being cut off.
              </div>
            </div>
          </td>
        </tr>

        <TextField
          id="last"
          label="Last Name"
          tabIndex={2}
          value={state.last}
          onChange={(last) => onChange({ last })}
        />
        <TextField
          id="pronouns"
          label="Pronouns"
          tabIndex={3}
          value={state.pronouns}
          onChange={(pronouns) => onChange({ pronouns })}
        />

        <SelectField
          id="background"
          label="Background"
          value={state.background}
          options={BACKGROUNDS}
          onChange={(background) => onChange({ background })}
        />
        <SelectField
          id="cohort"
          label="Cohort"
          value={state.cohort}
          options={COHORTS}
          disabled={locked}
          onChange={(cohort) => onChange({ cohort })}
        />
        <SelectField
          id="logo"
          label="Logo"
          value={state.logo}
          options={LOGOS}
          disabled={locked}
          onChange={(logo) => onChange({ logo })}
        />
      </tbody>
    </table>
  );
}
