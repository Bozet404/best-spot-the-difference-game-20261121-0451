// Shared drawing helpers and the scene registry for Twin Tides.
// A scene paints its base picture identically on both panels, then paints
// each difference twice: once as it looks on the left, once on the right.
// Coordinates live in a 640 x 480 scene space shared by both panels.

import { harborScene } from './scene-harbor.js';
import { marketScene } from './scene-market.js';
import { gardenScene } from './scene-garden.js';

export const SCENES = [harborScene, marketScene, gardenScene];

export const SCENE_W = 640;
export const SCENE_H = 480;

// Small canvas helpers every scene painter uses.
export const H = {
  circle(ctx, x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  },
  ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  },
  rect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  },
  rr(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  },
  poly(ctx, points, fill) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  },
  line(ctx, x1, y1, x2, y2, stroke, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  },
  // Five-point star centred at (x, y).
  star(ctx, x, y, r, fill) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  },
  // A soft three-puff cloud.
  cloud(ctx, x, y, s, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
    ctx.arc(x + 18 * s, y - 6 * s, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 38 * s, y, 15 * s, 0, Math.PI * 2);
    ctx.arc(x + 18 * s, y + 6 * s, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  },
  // A gull in flight: two curved wings.
  gull(ctx, x, y, s, stroke) {
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y);
    ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
    ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.5 * s;
    ctx.lineCap = 'round';
    ctx.stroke();
  },
};
