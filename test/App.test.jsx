import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { stubCanvas } from './canvasStub.js';

// Assets are fetched by `new Image()`, which jsdom never loads. Resolve the
// asset loader to an empty map so the app renders its text-only layers.
vi.mock('../src/lib/images.js', () => ({
  ASSET_IDS: [],
  assetUrl: (id) => `/assets/${id}`,
  loadImages: () => Promise.resolve({}),
}));

let canvas;

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  canvas = stubCanvas();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const lastText = () => canvas.lastOps().filter((op) => op.op === 'fillText');

describe('form', () => {
  it('renders every control the original page had', () => {
    render(<App />);
    expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Pronouns:')).toBeInTheDocument();
    expect(screen.getByLabelText('Background:')).toBeInTheDocument();
    expect(screen.getByLabelText('Cohort:')).toBeInTheDocument();
    expect(screen.getByLabelText('Logo:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Image' })).toBeInTheDocument();
    expect(screen.getByLabelText('HD')).toBeChecked();
    expect(screen.getByLabelText('4:3')).not.toBeChecked();
  });

  it('redraws as the name is typed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('First Name:'), 'Ada');
    await waitFor(() => expect(lastText()[0].text).toBe('Ada'));
  });

  it('draws the last name and pronouns too', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Last Name:'), 'Lovelace');
    await user.type(screen.getByLabelText('Pronouns:'), 'she/her');
    await waitFor(() => {
      expect(lastText().map((op) => op.text)).toEqual(['', 'Lovelace', 'she/her']);
    });
  });
});

describe('cohort stripe', () => {
  it('paints a stripe in the selected cohort colour', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Cohort:'), '#C8102E');
    await waitFor(() => {
      const stripe = canvas.lastOps().find((op) => op.op === 'fillRect' && op.w === 60);
      expect(stripe).toMatchObject({ fillStyle: '#C8102E', x: 0, y: 0, h: 1080 });
    });
  });
});

describe('EMBA backgrounds', () => {
  it('disables and resets the logo and cohort controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Cohort:'), '#0033AB');
    await user.selectOptions(screen.getByLabelText('Logo:'), 'logo_som');
    await user.selectOptions(screen.getByLabelText('Background:'), 'emba_white');

    expect(screen.getByLabelText('Cohort:')).toBeDisabled();
    expect(screen.getByLabelText('Logo:')).toBeDisabled();
    expect(screen.getByLabelText('Cohort:')).toHaveValue('none');
    expect(screen.getByLabelText('Logo:')).toHaveValue('logo_none');
  });

  it('re-enables them when another background is chosen', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Background:'), 'emba_blue');
    await user.selectOptions(screen.getByLabelText('Background:'), 'blue');
    expect(screen.getByLabelText('Cohort:')).toBeEnabled();
    expect(screen.getByLabelText('Logo:')).toBeEnabled();
  });
});

describe('aspect ratio', () => {
  it('renders 1920x1080 for HD', () => {
    render(<App />);
    const el = document.querySelector('canvas');
    expect([el.width, el.height]).toEqual([1920, 1080]);
  });

  it('switches the canvas to 1600x1200 for 4:3', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText('4:3'));
    await waitFor(() => {
      const el = document.querySelector('canvas');
      expect([el.width, el.height]).toEqual([1600, 1200]);
    });
  });
});

describe('query string pre-fill', () => {
  it('populates the fields from the URL, as the original page did', async () => {
    window.history.replaceState({}, '', '/?first=Ada&last=Lovelace&pronouns=she%2Fher&cohort=%2300824A');
    render(<App />);
    expect(screen.getByLabelText('First Name:')).toHaveValue('Ada');
    expect(screen.getByLabelText('Last Name:')).toHaveValue('Lovelace');
    expect(screen.getByLabelText('Pronouns:')).toHaveValue('she/her');
    expect(screen.getByLabelText('Cohort:')).toHaveValue('#00824A');
    await waitFor(() => expect(lastText().map((op) => op.text)).toEqual(['Ada', 'Lovelace', 'she/her']));
  });
});

describe('preview', () => {
  it('shows the rendered background as an image', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', 'data:image/jpeg;base64,STUB');
    });
  });
});

describe('saving', () => {
  it('downloads the canvas as zoombackground.jpg', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => 'blob:stub');
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      expect(this.download).toBe('zoombackground.jpg');
      expect(this.href).toContain('blob:stub');
    });

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Save Image' }));

    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    vi.unstubAllGlobals();
  });
});
