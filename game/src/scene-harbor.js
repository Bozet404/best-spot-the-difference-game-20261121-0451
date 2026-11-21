// Level 1 — Harbor Morning. A sunny fishing harbour: lighthouse, sailboat,
// pier, gulls and a jumping fish. 7 differences, 180 seconds.

import { H } from './scenes.js';

function paintSkyAndSea(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 205);
  sky.addColorStop(0, '#8fd0f2');
  sky.addColorStop(1, '#dff4ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 205);
  // Distant green hills.
  ctx.fillStyle = '#7fb069';
  ctx.beginPath();
  ctx.moveTo(0, 205);
  ctx.quadraticCurveTo(120, 150, 260, 198);
  ctx.quadraticCurveTo(420, 160, 640, 200);
  ctx.lineTo(640, 205);
  ctx.lineTo(0, 205);
  ctx.fill();
  // Sea.
  const sea = ctx.createLinearGradient(0, 205, 0, 480);
  sea.addColorStop(0, '#2a9d8f');
  sea.addColorStop(1, '#177a72');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 205, 640, 275);
  // Wave strokes.
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  for (const [x, y, w] of [[60, 250, 90], [300, 235, 110], [470, 265, 100], [150, 330, 120], [420, 350, 110], [80, 420, 100], [330, 440, 130]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 8, x + w, y);
    ctx.stroke();
  }
  // Clouds.
  H.cloud(ctx, 60, 60, 1, 'rgba(255,255,255,0.95)');
  H.cloud(ctx, 300, 45, 0.8, 'rgba(255,255,255,0.9)');
  H.cloud(ctx, 430, 120, 0.6, 'rgba(255,255,255,0.8)');
  // Sun disc (its face is a difference).
  H.circle(ctx, 520, 70, 34, '#ffd166');
  H.circle(ctx, 520, 70, 26, '#ffe08a');
}

function paintLighthouse(ctx) {
  // Rocky base.
  H.poly(ctx, [[40, 260], [70, 215], [120, 215], [150, 260]], '#8d99ae');
  // Tower: white with two coral bands.
  H.rect(ctx, 72, 80, 38, 140, '#f8f9fa');
  H.rect(ctx, 72, 110, 38, 16, '#ef476f');
  H.rect(ctx, 72, 160, 38, 16, '#ef476f');
  ctx.strokeStyle = '#5c677d';
  ctx.lineWidth = 2;
  ctx.strokeRect(72, 80, 38, 140);
  // Gallery + lamp room.
  H.rect(ctx, 66, 66, 50, 14, '#343a40');
  H.rr(ctx, 76, 46, 30, 22, 4, '#ffd166');
  H.poly(ctx, [[70, 46], [112, 46], [91, 30]], '#ef476f');
  // Flag pole (the flag itself is a difference).
  H.line(ctx, 91, 30, 91, 12, '#343a40', 2);
}

function paintBoats(ctx) {
  // Sailboat: hull + mast (the sail cloth is a difference).
  H.poly(ctx, [[400, 320], [470, 320], [455, 338], [415, 338]], '#8d5524');
  H.line(ctx, 435, 322, 435, 235, '#5c3d24', 4);
  // Rowboat with a fisherman's bucket.
  H.ellipse(ctx, 250, 372, 42, 12, '#e07a5f');
  H.ellipse(ctx, 250, 368, 42, 9, '#f4a261');
  H.rr(ctx, 238, 352, 22, 12, 3, '#6d6875');
  // Buoy body (its stripes are a difference).
  H.poly(ctx, [[318, 392], [342, 392], [338, 360], [322, 360]], '#e63946');
  H.circle(ctx, 330, 356, 6, '#ffd166');
}

function paintPier(ctx) {
  // Wooden pier along the bottom right.
  H.rect(ctx, 380, 420, 260, 16, '#9c6644');
  H.rect(ctx, 380, 436, 260, 8, '#7f4f24');
  for (const x of [400, 460, 520, 580]) {
    H.rect(ctx, x, 436, 10, 30, '#6d4c2f');
  }
  // Rope coil on the pier.
  ctx.strokeStyle = '#e9c46a';
  ctx.lineWidth = 4;
  for (const r of [14, 9, 4]) {
    ctx.beginPath();
    ctx.arc(420, 414, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export const harborScene = {
  id: 'harbor',
  name: 'Harbor Morning',
  sub: 'Level 1 · 7 differences · 3:00',
  timeLimit: 180,
  diffs: [
    { id: 'sun-face', x: 520, y: 70, r: 30, name: 'The sun is smiling' },
    { id: 'gull', x: 185, y: 92, r: 22, name: 'A third gull' },
    { id: 'flag', x: 104, y: 22, r: 20, name: 'Lighthouse flag colour' },
    { id: 'sail', x: 448, y: 278, r: 30, name: 'Sailboat sail stripes' },
    { id: 'buoy', x: 330, y: 376, r: 22, name: 'Buoy stripes' },
    { id: 'fish', x: 255, y: 258, r: 22, name: 'A jumping fish' },
    { id: 'crate', x: 545, y: 408, r: 24, name: 'An extra crate on the pier' },
  ],
  paintBase(ctx) {
    paintSkyAndSea(ctx);
    paintLighthouse(ctx);
    paintBoats(ctx);
    paintPier(ctx);
    // Two gulls that are on both panels.
    H.gull(ctx, 140, 78, 1, '#343a40');
    H.gull(ctx, 235, 112, 0.9, '#343a40');
    // Lighthouse window frame (the glow is a difference).
    H.rr(ctx, 82, 128, 18, 22, 3, '#343a40');
  },
  paintDiff(ctx, diff, side) {
    switch (diff.id) {
      case 'sun-face':
        if (side === 'left') {
          H.circle(ctx, 512, 66, 3, '#5c3d24');
          H.circle(ctx, 528, 66, 3, '#5c3d24');
          ctx.beginPath();
          ctx.arc(520, 74, 9, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.strokeStyle = '#5c3d24';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        break;
      case 'gull':
        if (side === 'left') H.gull(ctx, 185, 92, 1, '#343a40');
        break;
      case 'flag':
        H.poly(ctx, [[91, 12], [122, 19], [91, 27]], side === 'left' ? '#e63946' : '#ffd166');
        break;
      case 'sail':
        if (side === 'left') {
          H.poly(ctx, [[437, 240], [437, 318], [492, 318]], '#ffffff');
          H.poly(ctx, [[437, 240], [437, 282], [468, 282]], '#ef476f');
        } else {
          H.poly(ctx, [[437, 240], [437, 318], [492, 318]], '#ffffff');
        }
        break;
      case 'buoy':
        if (side === 'left') {
          H.rect(ctx, 321, 368, 18, 6, '#f8f9fa');
          H.rect(ctx, 319, 382, 22, 6, '#f8f9fa');
        } else {
          H.rect(ctx, 320, 375, 20, 6, '#f8f9fa');
        }
        break;
      case 'fish':
        if (side === 'left') {
          ctx.beginPath();
          ctx.ellipse(255, 252, 16, 7, -0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#f4a261';
          ctx.fill();
          H.poly(ctx, [[268, 244], [278, 240], [272, 252]], '#f4a261');
          H.circle(ctx, 258, 249, 2, '#343a40');
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(255, 268, 12, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(255, 262, 18, 5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      case 'crate':
        if (side === 'right') {
          H.rr(ctx, 525, 388, 40, 32, 3, '#b08968');
          H.line(ctx, 525, 404, 565, 404, '#7f5539', 3);
          H.line(ctx, 545, 388, 545, 420, '#7f5539', 3);
        }
        break;
    }
  },
};
