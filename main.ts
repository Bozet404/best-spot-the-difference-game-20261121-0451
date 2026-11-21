// Twin Tides — the entry program (Node 22, standard library only).
//
// It hands the game in: the static game/ folder and the screenshots/ the
// maker took are copied to the output directory, and dossier.json — the
// summary the judge reads — is written with the kit's buildDossier helper.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer caps the whole output at 1,000 entries and 64 MiB; game/ takes
// at most 993 entries / 48 MiB and screenshots/ at most 4 files of 256 KiB.
// buildDossier enforces the text cap and refuses anything over the limits.
const dossierLimits = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

function fail(msg) {
  console.error(`main.ts: ${msg}`);
  process.exit(1);
}

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(gameDir)) fail('game/ is missing');
if (!existsSync(join(gameDir, 'index.html'))) fail('game/index.html is missing');
if (!existsSync(shotsDir) || readdirSync(shotsDir).length === 0) {
  fail('screenshots/ is missing or empty — take 3 or 4 screenshots first');
}

mkdirSync(outDir, { recursive: true });
copyTree(gameDir, join(outDir, 'game'));
copyTree(shotsDir, join(outDir, 'screenshots'));
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, dossierLimits));
console.log(`Twin Tides handed in: ${readdirSync(join(outDir, 'game')).length} game entries, ${readdirSync(join(outDir, 'screenshots')).length} screenshots.`);
