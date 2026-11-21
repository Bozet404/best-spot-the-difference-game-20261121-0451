// Level 2 — Night Market. A lantern-lit evening market: two stalls, string
// lights, a cat on a crate and a painted signboard. 8 differences, 150 s.

import { H } from './scenes.js';

function paintSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 240);
  sky.addColorStop(0, '#221645');
  sky.addColorStop(1, '#6b3a6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 240);
  // Stars.
  ctx.fillStyle = '#fff8d6';
  for (const [x, y, r] of [[40, 40, 2], [120, 70, 1.5], [220, 30, 2], [330, 55, 1.5], [430, 35, 2], [600, 110, 1.5], [90, 130, 1.5], [380, 120, 2]]) {
    H.circle(ctx, x, y, r, '#fff8d6');
  }
  // Moon disc (its craters are a difference).
  H.circle(ctx, 560, 60, 28, '#ffeeb0');
  H.circle(ctx, 560, 60, 21, '#fff6cf');
}

function paintStringLights(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 55);
  ctx.quadraticCurveTo(320, 110, 640, 50);
  ctx.strokeStyle = '#3a2b4f';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Bulbs along the sagging line; the bulb at (200, ~88) is a difference.
  const bulbs = [[60, 68], [140, 80], [260, 92], [330, 94], [410, 88], [490, 76], [570, 64]];
  for (const [x, y] of bulbs) {
    H.line(ctx, x, y - 8, x, y, '#3a2b4f', 2);
    H.circle(ctx, x, y, 7, '#ffd166');
    H.circle(ctx, x, y, 4, '#fff3c4');
  }
}

function paintStalls(ctx) {
  // Left stall: red-and-white awning, fruit counter.
  H.poly(ctx, [[70, 180], [290, 180], [290, 215], [70, 215]], '#e63946');
  for (let x = 70; x < 290; x += 36) {
    H.poly(ctx, [[x, 180], [x + 18, 180], [x + 18, 215], [x, 215]], '#f8f9fa');
  }
  H.rect(ctx, 80, 215, 200, 12, '#7f4f24');
  H.rect(ctx, 85, 330, 190, 90, '#9c6644');
  H.rect(ctx, 85, 330, 190, 8, '#7f4f24');
  // Right stall: teal awning, lantern counter.
  H.poly(ctx, [[360, 180], [580, 180], [580, 215], [360, 215]], '#2a9d8f');
  for (let x = 360; x < 580; x += 36) {
    H.poly(ctx, [[x, 180], [x + 18, 180], [x + 18, 215], [x, 215]], '#e0fbfc');
  }
  H.rect(ctx, 370, 215, 200, 12, '#7f4f24');
  H.rect(ctx, 375, 330, 185, 90, '#9c6644');
  H.rect(ctx, 375, 330, 185, 8, '#7f4f24');
  // Hanging paper lanterns under the right awning.
  for (const x of [400, 470, 540]) {
    H.line(ctx, x, 215, x, 232, '#3a2b4f', 2);
    H.ellipse(ctx, x, 248, 16, 20, '#ff6b6b');
    H.rect(ctx, x - 6, 226, 12, 6, '#ffd166');
  }
  // Cobblestones.
  ctx.fillStyle = '#4a3b5c';
  ctx.fillRect(0, 420, 640, 60);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let y = 435; y < 480; y += 15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(640, y);
    ctx.stroke();
  }
  for (let x = 20; x < 640; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x - 8, 480);
    ctx.stroke();
  }
}

function paintSignboard(ctx) {
  // Wooden sign hanging between the stalls (its picture is a difference).
  H.rr(ctx, 288, 128, 64, 46, 6, '#b08968');
  ctx.strokeStyle = '#7f5539';
  ctx.lineWidth = 3;
  ctx.strokeRect(288, 128, 64, 46);
  H.line(ctx, 296, 128, 296, 112, '#7f5539', 3);
  H.line(ctx, 344, 128, 344, 112, '#7f5539', 3);
}

function paintCat(ctx) {
  // A cat sitting on a crate beside the right stall (its tail is a difference).
  H.rr(ctx, 395, 398, 52, 44, 4, '#b08968');
  H.line(ctx, 395, 420, 447, 420, '#7f5539', 2);
  // Body + head.
  H.ellipse(ctx, 421, 392, 20, 24, '#343a40');
  H.circle(ctx, 421, 362, 15, '#343a40');
  H.poly(ctx, [[408, 352], [412, 338], [420, 350]], '#343a40');
  H.poly(ctx, [[424, 350], [432, 338], [434, 352]], '#343a40');
  H.circle(ctx, 416, 360, 2, '#ffd166');
  H.circle(ctx, 427, 360, 2, '#ffd166');
}

export const marketScene = {
  id: 'market',
  name: 'Night Market',
  sub: 'Level 2 · 8 differences · 2:30',
  timeLimit: 150,
  diffs: [
    { id: 'moon', x: 560, y: 60, r: 26, name: 'Craters on the moon' },
    { id: 'lantern', x: 150, y: 122, r: 20, name: 'A paper lantern changes colour' },
    { id: 'bulb', x: 200, y: 88, r: 16, name: 'A string-light bulb is out' },
    { id: 'sign', x: 320, y: 151, r: 24, name: 'The signboard picture' },
    { id: 'fruit', x: 300, y: 330, r: 24, name: 'Apples on the fruit stall' },
    { id: 'flag', x: 500, y: 168, r: 20, name: 'A little flag on the stall' },
    { id: 'cat-tail', x: 448, y: 396, r: 22, name: 'The cat’s tail' },
    { id: 'firefly', x: 90, y: 300, r: 16, name: 'A firefly by the crates' },
  ],
  paintBase(ctx) {
    paintSky(ctx);
    paintStringLights(ctx);
    paintStalls(ctx);
    paintSignboard(ctx);
    paintCat(ctx);
    // Crates stacked at the left edge.
    H.rr(ctx, 20, 380, 54, 40, 3, '#b08968');
    H.rr(ctx, 28, 342, 40, 38, 3, '#9c6644');
    // Fruit on the left stall counter (the count is a difference).
    H.ellipse(ctx, 180, 322, 95, 12, '#7f4f24');
  },
  paintDiff(ctx, diff, side) {
    switch (diff.id) {
      case 'moon':
        if (side === 'left') {
          H.circle(ctx, 550, 52, 4, '#e8d28a');
          H.circle(ctx, 568, 66, 5, '#e8d28a');
          H.circle(ctx, 566, 48, 3, '#e8d28a');
        }
        break;
      case 'lantern': {
        // The leftmost hanging lantern under the right awning.
        const fill = side === 'left' ? '#ff6b6b' : '#80ed99';
        H.ellipse(ctx, 400, 248, 16, 20, fill);
        H.rect(ctx, 394, 226, 12, 6, '#ffd166');
        break;
      }
      case 'bulb':
        if (side === 'left') {
          H.line(ctx, 200, 80, 200, 88, '#3a2b4f', 2);
          H.circle(ctx, 200, 88, 7, '#ffd166');
          H.circle(ctx, 200, 88, 4, '#fff3c4');
        }
        break;
      case 'sign':
        if (side === 'left') {
          // A fish.
          H.ellipse(ctx, 320, 151, 16, 8, '#ffd166');
          H.poly(ctx, [[334, 151], [344, 143], [344, 159]], '#ffd166');
          H.circle(ctx, 308, 148, 2, '#343a40');
        } else {
          // A dumpling.
          ctx.beginPath();
          ctx.arc(320, 156, 15, Math.PI, 0);
          ctx.closePath();
          ctx.fillStyle = '#ffe8d6';
          ctx.fill();
          for (const x of [310, 320, 330]) {
            H.line(ctx, x, 142, x, 150, '#ddb892', 2);
          }
        }
        break;
      case 'fruit': {
        // Apples in a row on the counter; left has five, right has four.
        const spots = [[120, 312], [150, 306], [180, 312], [210, 306], [240, 312]];
        const count = side === 'left' ? 5 : 4;
        for (let i = 0; i < count; i++) {
          const [x, y] = spots[i];
          H.circle(ctx, x, y, 11, '#e63946');
          H.line(ctx, x, y - 11, x + 3, y - 16, '#588157', 2);
        }
        break;
      }
      case 'flag':
        if (side === 'left') {
          H.line(ctx, 500, 180, 500, 150, '#343a40', 2);
          H.poly(ctx, [[500, 150], [522, 156], [500, 163]], '#ffd166');
        }
        break;
      case 'cat-tail':
        ctx.strokeStyle = '#343a40';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (side === 'left') {
          ctx.moveTo(440, 400);
          ctx.quadraticCurveTo(458, 392, 454, 372);
        } else {
          ctx.moveTo(440, 402);
          ctx.quadraticCurveTo(456, 412, 452, 424);
        }
        ctx.stroke();
        break;
      case 'firefly':
        if (side === 'left') {
          H.circle(ctx, 90, 300, 8, 'rgba(255, 238, 130, 0.35)');
          H.circle(ctx, 90, 300, 3.5, '#ffee82');
        }
        break;
    }
  },
};
