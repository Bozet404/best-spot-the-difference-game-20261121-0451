// Deterministic screenshot presets for Twin Tides. `?shot=start` shows the
// title screen, `?shot=play` a mid-hunt Harbor Morning (3 of 7 found, 4
// left), `?shot=play2` a mid-hunt Night Market (2 of 8 found, 6 left) and
// `?shot=end` the victory screen. Each preset drives the real game state —
// the same paths a player reaches by clicking — and freezes the clock so
// the render is stable.

import { SCENES } from './scenes.js';
import { startLevel, completeLevel, sceneOf } from './state.js';
import { sounds } from './audio.js';

function markFound(game, count) {
  const scene = sceneOf(game);
  for (let i = 0; i < count; i++) {
    game.found.add(scene.diffs[i].id);
    game.totalFound += 1;
  }
  game.score = count * 100;
}

function freeze(game, secondsLeft) {
  game.timeLeft = secondsLeft;
  game.timeFrozen = true;
}

export function applyShot(game, shot) {
  if (!shot) return false;
  if (shot === 'start') {
    game.screen = 'start';
    return true;
  }
  if (shot === 'play') {
    startLevel(game, 0);
    markFound(game, 3);
    game.crosshair = { x: 330, y: 376, visible: true };
    freeze(game, 143);
    return true;
  }
  if (shot === 'play2') {
    startLevel(game, 1);
    markFound(game, 2);
    game.crosshair = { x: 200, y: 88, visible: true };
    freeze(game, 121);
    return true;
  }
  if (shot === 'end') {
    // Play every level through in state only, then show the victory screen.
    for (let level = 0; level < SCENES.length; level++) {
      startLevel(game, level);
      for (const d of sceneOf(game).diffs) {
        game.found.add(d.id);
        game.totalFound += 1;
      }
      game.timeLeft = 42 + level * 7;
      completeLevel(game);
      game.score += 700;
    }
    game.screen = 'victory';
    game.bestCombo = 5;
    game.timeFrozen = true;
    return true;
  }
  return false;
}

// Silence the shot presets: screenshots must not depend on audio.
export function silenceShots() {
  sounds.click = () => {};
}
