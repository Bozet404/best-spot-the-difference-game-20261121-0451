// Level 3 — Moon Garden. A quiet night garden: a koi pond, an arched bridge,
// bamboo, a stone lantern and fireflies. 9 differences, 120 seconds.

import { H } from './scenes.js';

function paintSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#0d2b3e');
  sky.addColorStop(1, '#1d5c63');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 260);
  ctx.fillStyle = '#e0fbfc';
  for (const [x, y, r] of [[60, 50, 2], [150, 90, 1.5], [250, 40, 2], [350, 70, 1.5], [440, 40, 2], [610, 150, 1.5], [40, 160, 1.5]]) {
    H.circle(ctx, x, y, r, '#e0fbfc');
  }
  // Big moon (a cloud may cover it — a difference).
  H.circle(ctx, 520, 70, 36, '#fff3b0');
  H.circle(ctx, 520, 70, 28, '#fff8d6');
}

function paintGround(ctx) {
  // Grass.
  const g = ctx.createLinearGradient(0, 240, 0, 480);
  g.addColorStop(0, '#2d6a4f');
  g.addColorStop(1, '#1b4332');
  ctx.fillStyle = g;
  ctx.fillRect(0, 240, 640, 240);
  // Pond.
  H.ellipse(ctx, 320, 385, 225, 72, '#14424e');
  H.ellipse(ctx, 320, 385, 210, 62, '#1b6a7a');
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (const [x, y, rx] of [[240, 370, 40], [380, 400, 46], [300, 410, 34]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Lily pads.
  H.ellipse(ctx, 520, 420, 26, 10, '#40916c');
  H.ellipse(ctx, 180, 400, 22, 9, '#40916c');
  H.ellipse(ctx, 420, 350, 20, 8, '#52b788');
}

function paintBridge(ctx) {
  // Arched wooden bridge over the pond (its plank count is a difference).
  ctx.beginPath();
  ctx.moveTo(210, 360);
  ctx.quadraticCurveTo(320, 250, 430, 360);
  ctx.strokeStyle = '#9c6644';
  ctx.lineWidth = 16;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(210, 360);
  ctx.quadraticCurveTo(320, 250, 430, 360);
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Rail posts.
  for (const [x, y] of [[240, 322], [290, 292], [350, 292], [400, 322]]) {
    H.line(ctx, x, y, x, y - 26, '#7f4f24', 4);
  }
  ctx.beginPath();
  ctx.moveTo(232, 300);
  ctx.quadraticCurveTo(320, 252, 408, 300);
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function paintBamboo(ctx) {
  // Bamboo cluster on the left (one stalk count is a difference).
  const stalks = [[58, 90, 250], [76, 70, 250], [96, 100, 250]];
  for (const [x, top, bottom] of stalks) {
    H.line(ctx, x, bottom, x, top, '#74c69d', 7);
    for (let y = top + 24; y < bottom; y += 34) {
      H.line(ctx, x - 5, y, x + 5, y, '#52b788', 2);
    }
  }
  // Leaves.
  ctx.fillStyle = '#40916c';
  for (const [x, y, a] of [[58, 95, -0.6], [76, 78, 0.5], [96, 105, -0.4], [70, 130, 0.7]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 5, a, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintStoneLantern(ctx) {
  // Stone lantern on the right bank (its flame is a difference).
  H.rr(ctx, 438, 232, 26, 10, 2, '#6c757d');
  H.rect(ctx, 446, 208, 10, 24, '#6c757d');
  H.rr(ctx, 432, 190, 38, 18, 3, '#adb5bd');
  H.poly(ctx, [[428, 190], [474, 190], [451, 168]], '#6c757d');
  H.circle(ctx, 451, 164, 4, '#6c757d');
}

function paintFlowers(ctx) {
  // Flower tufts along the bottom edge.
  const tufts = [[120, 452], [180, 430], [560, 452], [600, 428]];
  for (const [x, y] of tufts) {
    for (const [dx, dy] of [[-12, 0], [0, -10], [12, 0], [0, 8]]) {
      H.circle(ctx, x + dx, y + dy, 5, '#b7e4c7');
    }
  }
}

function paintKoi(ctx, x, y, angle, colour) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = colour;
  ctx.fill();
  H.poly(ctx, [[-16, 0], [-26, -8], [-26, 8]], colour);
  ctx.restore();
}

export const gardenScene = {
  id: 'garden',
  name: 'Moon Garden',
  sub: 'Level 3 · 9 differences · 2:00',
  timeLimit: 120,
  diffs: [
    { id: 'cloud', x: 520, y: 70, r: 32, name: 'A cloud crosses the moon' },
    { id: 'koi', x: 300, y: 360, r: 24, name: 'A third koi in the pond' },
    { id: 'planks', x: 320, y: 300, r: 22, name: 'Planks on the bridge' },
    { id: 'bamboo', x: 112, y: 180, r: 18, name: 'A bamboo stalk' },
    { id: 'flame', x: 451, y: 199, r: 20, name: 'The lantern flame' },
    { id: 'flower', x: 180, y: 430, r: 18, name: 'A flower changes colour' },
    { id: 'frog', x: 520, y: 412, r: 20, name: 'A frog on the lily pad' },
    { id: 'firefly', x: 550, y: 120, r: 14, name: 'A firefly in the dark' },
    { id: 'stone', x: 220, y: 446, r: 20, name: 'A stepping stone' },
  ],
  paintBase(ctx) {
    paintSky(ctx);
    paintGround(ctx);
    paintBridge(ctx);
    paintBamboo(ctx);
    paintStoneLantern(ctx);
    paintFlowers(ctx);
    // Two koi that are on both panels.
    paintKoi(ctx, 250, 380, 0.3, '#f4a261');
    paintKoi(ctx, 390, 410, -0.4, '#e9c46a');
    // Grass blades.
    ctx.strokeStyle = '#40916c';
    ctx.lineWidth = 2;
    for (const [x, y] of [[40, 470], [90, 462], [150, 470], [480, 466], [530, 470], [610, 462]]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 4, y - 12);
      ctx.stroke();
    }
  },
  paintDiff(ctx, diff, side) {
    switch (diff.id) {
      case 'cloud':
        if (side === 'right') H.cloud(ctx, 492, 58, 0.9, 'rgba(220,230,240,0.95)');
        break;
      case 'koi':
        if (side === 'left') paintKoi(ctx, 300, 360, -0.2, '#ef476f');
        break;
      case 'planks': {
        // Short cross-planks on the bridge arch; left has five, right has four.
        const spots = [[250, 316], [280, 296], [320, 288], [360, 296], [390, 316]];
        const count = side === 'left' ? 5 : 4;
        for (let i = 0; i < count; i++) {
          const [x, y] = spots[i];
          H.line(ctx, x - 8, y + 4, x + 8, y - 4, '#e9c46a', 4);
        }
        break;
      }
      case 'bamboo':
        if (side === 'left') {
          H.line(ctx, 114, 250, 114, 110, '#74c69d', 7);
          for (let y = 134; y < 250; y += 34) H.line(ctx, 109, y, 119, y, '#52b788', 2);
          ctx.beginPath();
          ctx.ellipse(114, 112, 16, 5, 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#40916c';
          ctx.fill();
        }
        break;
      case 'flame':
        if (side === 'left') {
          H.ellipse(ctx, 451, 199, 6, 9, '#ffd166');
          H.ellipse(ctx, 451, 200, 3, 5, '#fff3b0');
        } else {
          H.ellipse(ctx, 451, 199, 6, 9, '#343a40');
        }
        break;
      case 'flower':
        if (side === 'right') {
          // Recolour the tuft at (180, 430) white on the right panel.
          for (const [dx, dy] of [[-12, 0], [0, -10], [12, 0], [0, 8]]) {
            H.circle(ctx, 180 + dx, 430 + dy, 5, '#f8f9fa');
          }
        }
        break;
      case 'frog':
        if (side === 'left') {
          H.ellipse(ctx, 520, 416, 13, 9, '#588157');
          H.circle(ctx, 512, 406, 6, '#588157');
          H.circle(ctx, 528, 406, 6, '#588157');
          H.circle(ctx, 510, 403, 2, '#081c15');
          H.circle(ctx, 530, 403, 2, '#081c15');
        }
        break;
      case 'firefly':
        if (side === 'left') {
          H.circle(ctx, 550, 120, 8, 'rgba(190, 242, 150, 0.35)');
          H.circle(ctx, 550, 120, 3.5, '#bef264');
        }
        break;
      case 'stone':
        if (side === 'left') {
          H.ellipse(ctx, 220, 446, 18, 8, '#adb5bd');
          H.ellipse(ctx, 220, 444, 14, 5, '#ced4da');
        }
        break;
    }
  },
};
