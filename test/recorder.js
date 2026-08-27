/**
 * A fake CanvasRenderingContext2D that records every drawing operation along
 * with the graphics state (fillStyle / font) in effect when it happened.
 *
 * Recording the *effective* state at each operation — rather than the raw
 * sequence of property assignments — means the recording captures what ends up
 * on the canvas, not incidental assignments that are overwritten before they
 * are ever used. That is exactly the equivalence the refactor needs to hold.
 */
export function createRecordingContext() {
  const ops = [];
  const ctx = {
    fillStyle: '#000000',
    font: '10px sans-serif',

    fillRect(x, y, w, h) {
      ops.push({ op: 'fillRect', x, y, w, h, fillStyle: ctx.fillStyle });
    },

    fillText(text, x, y) {
      ops.push({ op: 'fillText', text, x, y, fillStyle: ctx.fillStyle, font: ctx.font });
    },

    drawImage(image, x, y, w, h) {
      ops.push({ op: 'drawImage', image: image.id, x, y, w, h });
    },

    // Deterministic stand-in for real text metrics: proportional to the font
    // size parsed out of `ctx.font` so the right-aligned (EMBA) layout is
    // exercised with realistic, reproducible numbers.
    measureText(text) {
      const size = Number(/(\d+)px/.exec(ctx.font)?.[1] ?? 10);
      return { width: String(text).length * size * 0.55 };
    },
  };
  return { ctx, ops };
}

/** Stand-in for a loaded HTMLImageElement. */
export function fakeImage(id, width, height) {
  return { id, width, height };
}
