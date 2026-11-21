// Tiny WebAudio sounds for Twin Tides — no audio files, everything is
// synthesised with oscillators. Muted until the player interacts.

let ctx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, vol) {
  const ac = ensure();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + at);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export const sounds = {
  click() {
    tone(660, 0, 0.06, 'triangle', 0.12);
  },
  found() {
    tone(523.25, 0, 0.14, 'sine', 0.2);
    tone(783.99, 0.09, 0.2, 'sine', 0.2);
    tone(1046.5, 0.18, 0.24, 'sine', 0.16);
  },
  miss() {
    tone(160, 0, 0.18, 'sawtooth', 0.1);
    tone(110, 0.08, 0.2, 'sawtooth', 0.08);
  },
  hint() {
    tone(880, 0, 0.1, 'sine', 0.12);
    tone(1174.66, 0.08, 0.16, 'sine', 0.12);
  },
  levelDone() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.18));
  },
  victory() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.13, 0.3, 'triangle', 0.18));
    tone(261.63, 0, 0.7, 'sine', 0.1);
  },
  gameOver() {
    [392, 329.63, 261.63].forEach((f, i) => tone(f, i * 0.16, 0.26, 'triangle', 0.14));
  },
};
