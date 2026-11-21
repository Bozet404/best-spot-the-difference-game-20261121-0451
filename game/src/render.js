// Canvas rendering for Twin Tides: paints both panels from the current
// scene, then the found markers, hint ring, crosshair, miss marks,
// floating score popups and confetti on top.

import { SCENE_W, SCENE_H } from './scenes.js';
import { sceneOf } from './state.js';

const FOUND_COLOUR = '#06d6a0';
const HINT_COLOUR = '#ffd166';

// Paint one panel. `side` is 'left' or 'right'.
export function paintPanel(ctx, game, side) {
  const scene = sceneOf(game);
  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  scene.paintBase(ctx);
  for (const diff of scene.diffs) scene.paintDiff(ctx, diff, side);
  paintOverlays(ctx, game);
}

function paintOverlays(ctx, game) {
  const scene = sceneOf(game);
  const now = performance.now();
  // Markers on the differences already found: a ring plus a tick.
  for (const diff of scene.diffs) {
    if (!game.found.has(diff.id)) continue;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = FOUND_COLOUR;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(diff.x - 8, diff.y);
    ctx.lineTo(diff.x - 2, diff.y + 7);
    ctx.lineTo(diff.x + 10, diff.y - 7);
    ctx.strokeStyle = FOUND_COLOUR;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  // Hint: a pulsing ring around one unfound difference.
  if (game.hinted && now < game.hinted.until) {
    const d = game.hinted.diff;
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    const r = (d.r + 8) * pulse;
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = HINT_COLOUR;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Wrong clicks: a fading red X.
  game.wrongFlashes = game.wrongFlashes.filter((f) => now - f.at < 900);
  for (const f of game.wrongFlashes) {
    const age = (now - f.at) / 900;
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#ef476f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(f.x - 11, f.y - 11);
    ctx.lineTo(f.x + 11, f.y + 11);
    ctx.moveTo(f.x + 11, f.y - 11);
    ctx.lineTo(f.x - 11, f.y + 11);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // Floating "+100" popups.
  game.popups = game.popups.filter((p) => now - p.at < 1100);
  for (const p of game.popups) {
    const age = (now - p.at) / 1100;
    ctx.globalAlpha = 1 - age;
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(8,28,21,0.8)';
    ctx.strokeText(p.text, p.x, p.y - age * 26);
    ctx.fillStyle = '#ffd166';
    ctx.fillText(p.text, p.x, p.y - age * 26);
    ctx.globalAlpha = 1;
  }
  // Crosshair for keyboard play (mirrored on both panels).
  if (game.crosshair.visible && game.screen === 'playing') {
    const { x, y } = game.crosshair;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
    ctx.fillStyle = '#ef476f';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Confetti drifts down over the whole stage (drawn on the front canvas).
export function paintParticles(ctx, game) {
  const now = performance.now();
  game.particles = game.particles.filter((p) => now - p.at < 2600);
  for (const p of game.particles) {
    const age = (now - p.at) / 1000;
    const x = p.x + p.vx * age;
    const y = p.y + p.vy * age + 30 * age * age;
    ctx.fillStyle = p.colour;
    ctx.fillRect(x - 3, y - 3, 6, 6);
  }
}
