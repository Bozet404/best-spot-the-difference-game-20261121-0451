// Game state for Twin Tides: screens, levels, found differences, score,
// combo, hints and the per-level countdown. Pure logic — no DOM here.

import { SCENES } from './scenes.js';

export const WRONG_TIME_PENALTY = 3; // seconds lost on a wrong click
export const WRONG_SCORE_PENALTY = 15;
export const HINT_COST = 50;
export const HINTS_PER_LEVEL = 3;
export const FIND_BASE = 100;
export const COMBO_STEP = 25;
export const MAX_COMBO = 5;

export function newGame() {
  return {
    screen: 'start', // start | playing | paused | levelDone | gameOver | victory
    levelIndex: 0,
    unlocked: 1, // how many levels the player may pick on the start screen
    found: new Set(), // ids of differences found in this level
    score: 0,
    combo: 0,
    bestCombo: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hinted: null, // { diff, until } while a hint ring is showing
    timeLeft: SCENES[0].timeLimit,
    timeFrozen: false, // screenshot presets freeze the clock
    crosshair: { x: 320, y: 240, visible: false },
    wrongFlashes: [], // { x, y, at } red X marks, per panel side
    popups: [], // { x, y, text, at } floating score text
    particles: [], // confetti { x, y, vx, vy, colour, at }
    levelStats: null, // filled on level complete
    totalFound: 0,
    startedAt: 0,
    pausedAt: 0,
  };
}

export function sceneOf(game) {
  return SCENES[game.levelIndex];
}

export function remaining(game) {
  return sceneOf(game).diffs.length - game.found.size;
}

export function startLevel(game, index) {
  const scene = SCENES[index];
  game.levelIndex = index;
  game.found = new Set();
  game.combo = 0;
  game.hintsLeft = HINTS_PER_LEVEL;
  game.hinted = null;
  game.timeLeft = scene.timeLimit;
  game.wrongFlashes = [];
  game.popups = [];
  game.particles = [];
  game.levelStats = null;
  game.screen = 'playing';
  game.startedAt = performance.now();
}

export function nearestDiff(game, x, y) {
  // The closest difference whose circle holds (x, y), or null.
  let best = null;
  let bestD = Infinity;
  for (const d of sceneOf(game).diffs) {
    const dx = x - d.x;
    const dy = y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}

// Try the spot (x, y) in scene coordinates. Returns 'found' | 'already' | 'miss'.
export function checkSpot(game, x, y) {
  if (game.screen !== 'playing') return 'idle';
  const diff = nearestDiff(game, x, y);
  if (!diff) {
    game.combo = 0;
    game.score = Math.max(0, game.score - WRONG_SCORE_PENALTY);
    game.timeLeft = Math.max(0, game.timeLeft - WRONG_TIME_PENALTY);
    game.wrongFlashes.push({ x, y, at: performance.now() });
    if (game.timeLeft <= 0) {
      game.screen = 'gameOver';
    }
    return 'miss';
  }
  if (game.found.has(diff.id)) return 'already';
  game.found.add(diff.id);
  game.totalFound += 1;
  game.combo = Math.min(MAX_COMBO, game.combo + 1);
  game.bestCombo = Math.max(game.bestCombo, game.combo);
  const gained = FIND_BASE + COMBO_STEP * (game.combo - 1);
  game.score += gained;
  game.popups.push({ x: diff.x, y: diff.y - 14, text: `+${gained}`, at: performance.now() });
  spawnBurst(game, diff.x, diff.y);
  if (game.found.size === sceneOf(game).diffs.length) {
    completeLevel(game);
    return 'found-last';
  }
  return 'found';
}

export function useHint(game) {
  if (game.screen !== 'playing') return null;
  if (game.hintsLeft <= 0) return null;
  if (game.score < HINT_COST) return null;
  const unfound = sceneOf(game).diffs.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return null;
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  game.hintsLeft -= 1;
  game.score -= HINT_COST;
  game.hinted = { diff, until: performance.now() + 4000 };
  return diff;
}

export function completeLevel(game) {
  const bonus = Math.round(game.timeLeft) * 5;
  game.score += bonus;
  const scene = sceneOf(game);
  game.levelStats = {
    name: scene.name,
    timeBonus: bonus,
    timeLeft: Math.round(game.timeLeft),
    score: game.score,
  };
  game.unlocked = Math.max(game.unlocked, Math.min(SCENES.length, game.levelIndex + 2));
  if (game.levelIndex === SCENES.length - 1) {
    game.screen = 'victory';
  } else {
    game.screen = 'levelDone';
  }
  spawnConfetti(game);
}

export function tick(game, now) {
  if (game.screen !== 'playing' || game.timeFrozen) return;
  const dt = (now - game.startedAt) / 1000;
  game.startedAt = now;
  game.timeLeft -= dt;
  if (game.hinted && now > game.hinted.until) game.hinted = null;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = 'gameOver';
  }
}

function spawnBurst(game, x, y) {
  const colours = ['#ffd166', '#06d6a0', '#ef476f', '#118ab2'];
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 90;
    game.particles.push({
      x, y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 30,
      colour: colours[i % colours.length],
      at: performance.now(),
    });
  }
}

function spawnConfetti(game) {
  const colours = ['#ffd166', '#06d6a0', '#ef476f', '#118ab2', '#f8f9fa'];
  for (let i = 0; i < 90; i++) {
    game.particles.push({
      x: 60 + Math.random() * 520,
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 60,
      vy: 60 + Math.random() * 120,
      colour: colours[i % colours.length],
      at: performance.now(),
    });
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
