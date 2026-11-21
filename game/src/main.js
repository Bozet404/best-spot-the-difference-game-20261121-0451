// Twin Tides — bootstrap, HUD, overlays and the frame loop. This file wires
// the state machine, the renderer and the input together; it holds no scene
// art and no game rules of its own.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import {
  newGame, sceneOf, remaining, startLevel, formatTime, tick, useHint,
} from './state.js';
import { paintPanel, paintParticles } from './render.js';
import { bindPanels, bindKeys } from './input.js';
import { sounds, isMuted, toggleMute } from './audio.js';
import { applyShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const game = newGame();
const canvasA = $('canvasA');
const canvasB = $('canvasB');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');

let overlayTimer = 0;

function showOverlay(id) {
  for (const el of document.querySelectorAll('.overlay')) el.classList.add('hidden');
  if (id) $(id).classList.remove('hidden');
}

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove('show'), 2200);
}

function refreshHud() {
  const scene = sceneOf(game);
  $('levelLabel').textContent = `Level ${game.levelIndex + 1} / ${SCENES.length} — ${scene.name}`;
  $('levelName').textContent = scene.name;
  $('levelSub').textContent = scene.sub;
  $('timerText').textContent = formatTime(game.timeLeft);
  const frac = Math.max(0, game.timeLeft / scene.timeLimit);
  const bar = $('timerFill');
  bar.style.width = `${frac * 100}%`;
  bar.classList.toggle('low', frac < 0.2);
  $('scoreText').textContent = String(game.score);
  $('comboText').textContent = game.combo > 1 ? `Combo x${game.combo}` : '';
  const left = remaining(game);
  $('remainText').textContent = `${left} left`;
  $('remainText').classList.toggle('done', left === 0);
  // Rebuild the progress dots only when the found count changed.
  if (refreshHud._dots !== game.found.size || refreshHud._total !== scene.diffs.length) {
    refreshHud._dots = game.found.size;
    refreshHud._total = scene.diffs.length;
    const dots = $('remainDots');
    dots.innerHTML = '';
    for (let i = 0; i < scene.diffs.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i < game.found.size ? ' found' : '');
      dots.appendChild(dot);
    }
  }
  $('hintCount').textContent = `Hints: ${game.hintsLeft}`;
  $('btnHint').disabled = game.screen !== 'playing' || game.hintsLeft <= 0;
  $('btnPause').disabled = game.screen !== 'playing' && game.screen !== 'paused';
  $('btnSound').textContent = isMuted() ? 'Sound: Off (M)' : 'Sound: On (M)';
}

function refreshLevelButtons() {
  const wrap = $('levelPick');
  wrap.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const b = document.createElement('button');
    b.className = 'lvl-btn';
    b.textContent = `${i + 1} · ${scene.name}`;
    b.disabled = i >= game.unlocked;
    b.addEventListener('click', () => {
      sounds.click();
      startLevel(game, i);
      showOverlay(null);
      toast(`${scene.name} — find ${scene.diffs.length} differences!`);
    });
    wrap.appendChild(b);
  });
}

function showEndOverlay() {
  if (game.screen === 'levelDone' && game.levelStats) {
    const s = game.levelStats;
    $('levelStats').innerHTML =
      `<strong>${s.name} cleared!</strong><br>` +
      `Time bonus +${s.timeBonus} (${s.timeLeft}s left)<br>` +
      `Score: ${s.score} · Best combo x${game.bestCombo}`;
    $('btnNext').textContent = `Next: ${SCENES[game.levelIndex + 1].name} (N)`;
    showOverlay('overlayLevel');
  } else if (game.screen === 'victory') {
    $('winStats').innerHTML =
      `You found all <strong>${game.totalFound}</strong> differences across ` +
      `${SCENES.length} scenes.<br>Final score: <strong>${game.score}</strong> · ` +
      `Best combo x${game.bestCombo}`;
    showOverlay('overlayWin');
  } else if (game.screen === 'gameOver') {
    const scene = sceneOf(game);
    $('overStats').innerHTML =
      `Time ran out on <strong>${scene.name}</strong> with ` +
      `${remaining(game)} difference${remaining(game) === 1 ? '' : 's'} still hiding.<br>` +
      `Score: ${game.score} — try again, the hunt resets.`;
    showOverlay('overlayOver');
  }
}

function afterCheck(result) {
  if (result === 'found') {
    toast('Found it! Nice eyes.');
  } else if (result === 'found-last') {
    sounds.levelDone();
    if (game.screen === 'victory') sounds.victory();
    window.clearTimeout(overlayTimer);
    overlayTimer = window.setTimeout(showEndOverlay, 800);
  } else if (result === 'miss') {
    toast('Not there — −15 points, −3 seconds. Look closer!');
  } else if (result === 'already') {
    toast('You already found that one.');
  }
  refreshHud();
}

const actions = {
  start() {
    sounds.click();
    startLevel(game, 0);
    showOverlay(null);
    toast('Find all 7 differences — click either picture!');
  },
  nextLevel() {
    sounds.click();
    startLevel(game, game.levelIndex + 1);
    showOverlay(null);
    const scene = sceneOf(game);
    toast(`${scene.name} — find ${scene.diffs.length} differences!`);
  },
  retry() {
    sounds.click();
    startLevel(game, game.levelIndex);
    showOverlay(null);
    toast('Same scene, fresh eyes. Go!');
  },
  playAgain() {
    sounds.click();
    game.score = 0;
    game.totalFound = 0;
    game.bestCombo = 0;
    game.unlocked = 1;
    startLevel(game, 0);
    showOverlay(null);
    toast('Back to Harbor Morning — find all 7 differences!');
  },
  pause() {
    if (game.screen !== 'playing') return;
    game.screen = 'paused';
    showOverlay('overlayPause');
    refreshHud();
  },
  resume() {
    if (game.screen !== 'paused') return;
    game.screen = 'playing';
    game.startedAt = performance.now();
    showOverlay(null);
    refreshHud();
  },
  toggleSound() {
    const off = toggleMute();
    toast(off ? 'Sound off.' : 'Sound on.');
    refreshHud();
  },
  onCheck: afterCheck,
  onHint(diff) {
    if (diff) toast(`Hint: something hides near the ${diff.name.toLowerCase()}… (−50)`);
    else toast('No hints left, or not enough points (50).');
    refreshHud();
  },
};

bindPanels(game, canvasA, canvasB, afterCheck);
bindKeys(game, actions);

$('btnStart').addEventListener('click', actions.start);
$('btnNext').addEventListener('click', actions.nextLevel);
$('btnRetry').addEventListener('click', actions.retry);
$('btnAgain').addEventListener('click', actions.playAgain);
$('btnResume').addEventListener('click', actions.resume);
$('btnQuit').addEventListener('click', () => {
  game.screen = 'start';
  game.score = 0;
  game.totalFound = 0;
  game.bestCombo = 0;
  refreshLevelButtons();
  showOverlay('overlayStart');
  refreshHud();
});
$('btnHint').addEventListener('click', () => {
  if (game.screen !== 'playing') return;
  const diff = useHint(game);
  if (diff) {
    sounds.hint();
    actions.onHint(diff);
  } else {
    actions.onHint(null);
  }
});
$('btnPause').addEventListener('click', () => {
  if (game.screen === 'playing') actions.pause();
  else if (game.screen === 'paused') actions.resume();
});
$('btnRestart').addEventListener('click', () => {
  if (game.screen === 'playing' || game.screen === 'paused') actions.retry();
});
$('btnSound').addEventListener('click', actions.toggleSound);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.screen === 'playing') actions.pause();
});

// Frame loop: advance the clock, paint both panels, refresh the HUD.
let lastScreen = game.screen;
function frame(now) {
  tick(game, now);
  // The timer can end the level on its own: surface the game-over overlay.
  if (game.screen !== lastScreen) {
    if (game.screen === 'gameOver') {
      sounds.gameOver();
      showEndOverlay();
    }
    lastScreen = game.screen;
  }
  paintPanel(ctxA, game, 'left');
  paintPanel(ctxB, game, 'right');
  paintParticles(ctxA, game);
  paintParticles(ctxB, game);
  refreshHud();
  requestAnimationFrame(frame);
}

// Screenshot presets (?shot=start|play|play2|end) drive the real state.
const shot = new URLSearchParams(window.location.search).get('shot');
if (shot) {
  if (applyShot(game, shot)) {
    showOverlay(null);
    if (game.screen === 'start') showOverlay('overlayStart');
    // A preset can land on an end screen: surface its overlay at once.
    if (game.screen === 'victory' || game.screen === 'levelDone' || game.screen === 'gameOver') {
      showEndOverlay();
    }
  }
}
refreshLevelButtons();
refreshHud();
if (game.screen === 'start') showOverlay('overlayStart');
requestAnimationFrame(frame);

// Test hook: the local CDP probe drives the game through this handle.
window.__twinTides = { game, SCENES, SCENE_W, SCENE_H };
