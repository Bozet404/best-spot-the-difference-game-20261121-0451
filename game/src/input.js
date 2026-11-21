// Mouse and keyboard input for Twin Tides. Clicks on either panel check
// the same scene spot; arrow keys move a shared crosshair and Enter checks
// it. Hints, pause, mute and restart all have keys as well as buttons.

import { SCENE_W, SCENE_H } from './scenes.js';
import { checkSpot, useHint } from './state.js';
import { sounds } from './audio.js';

// Convert a pointer event on a panel canvas to scene coordinates.
export function eventToScene(ev, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * SCENE_W,
    y: ((ev.clientY - rect.top) / rect.height) * SCENE_H,
  };
}

// Wire both panel canvases. `onResult` hears every check outcome.
export function bindPanels(game, canvasA, canvasB, onResult) {
  for (const canvas of [canvasA, canvasB]) {
    canvas.addEventListener('click', (ev) => {
      if (game.screen !== 'playing') return;
      const { x, y } = eventToScene(ev, canvas);
      const result = checkSpot(game, x, y);
      if (result === 'found' || result === 'found-last') sounds.found();
      if (result === 'miss') sounds.miss();
      if (result === 'already') sounds.click();
      onResult(result);
    });
    canvas.addEventListener('mousemove', (ev) => {
      const { x, y } = eventToScene(ev, canvas);
      game.crosshair.x = x;
      game.crosshair.y = y;
      game.crosshair.visible = true;
    });
    canvas.addEventListener('mouseleave', () => {
      game.crosshair.visible = false;
    });
  }
}

// Keyboard map. `actions` is supplied by main.js so input stays UI-free.
export function bindKeys(game, actions) {
  window.addEventListener('keydown', (ev) => {
    const k = ev.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      ev.preventDefault();
      if (game.screen !== 'playing') return;
      const step = ev.shiftKey ? 4 : 14;
      game.crosshair.visible = true;
      if (k === 'ArrowLeft') game.crosshair.x = Math.max(0, game.crosshair.x - step);
      if (k === 'ArrowRight') game.crosshair.x = Math.min(SCENE_W, game.crosshair.x + step);
      if (k === 'ArrowUp') game.crosshair.y = Math.max(0, game.crosshair.y - step);
      if (k === 'ArrowDown') game.crosshair.y = Math.min(SCENE_H, game.crosshair.y + step);
      return;
    }
    if (k === 'Enter' || k === ' ') {
      ev.preventDefault();
      if (game.screen === 'playing') {
        const { x, y } = game.crosshair;
        const result = checkSpot(game, x, y);
        if (result === 'found' || result === 'found-last') sounds.found();
        if (result === 'miss') sounds.miss();
        actions.onCheck(result);
      } else if (game.screen === 'start') {
        actions.start();
      } else if (game.screen === 'levelDone') {
        actions.nextLevel();
      } else if (game.screen === 'gameOver') {
        actions.retry();
      } else if (game.screen === 'victory') {
        actions.playAgain();
      }
      return;
    }
    const lower = k.toLowerCase();
    if (lower === 'h') {
      if (game.screen === 'playing') {
        const diff = useHint(game);
        if (diff) {
          sounds.hint();
          actions.onHint(diff);
        } else {
          actions.onHint(null);
        }
      }
    } else if (lower === 'm') {
      actions.toggleSound();
    } else if (lower === 'p' || k === 'Escape') {
      if (game.screen === 'playing') actions.pause();
      else if (game.screen === 'paused') actions.resume();
    } else if (lower === 'r') {
      if (game.screen === 'playing' || game.screen === 'paused' || game.screen === 'gameOver') {
        actions.retry();
      }
    } else if (lower === 'n') {
      if (game.screen === 'levelDone') actions.nextLevel();
    }
  });
}
