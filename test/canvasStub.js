import { vi } from 'vitest';
import { createRecordingContext } from './recorder.js';

/**
 * jsdom has no 2D canvas backend, so stub the handful of canvas APIs the app
 * touches and expose the recorded drawing operations to the test.
 */
export function stubCanvas() {
  const recordings = [];

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function getContext() {
    const { ctx, ops } = createRecordingContext();
    recordings.push({ canvas: this, ops });
    return ctx;
  });

  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,STUB');

  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback, type) => {
    callback(new Blob(['stub'], { type }));
  });

  return {
    /** Every op drawn so far, across repaints. */
    ops: () => recordings.flatMap((r) => r.ops),
    /** Ops from the most recent repaint only. */
    lastOps: () => recordings.at(-1)?.ops ?? [],
  };
}
