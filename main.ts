// Entry for post-x-promote-make-your-own-bounty-01 (Node 22, standard library only).
//
// The entry is the X post itself: a quote of make.fun's make-your-own-bounty post
// (https://x.com/makefunai/status/2124915864336236646) with a photo of its own,
// make.fun / @makefunai and a play code in its text. This program only hands the
// post's address to the gate: it copies POST.json from this repository's root
// into the output directory, where the house reads it and then reads the post
// from X. Nothing this program writes about the post is scored.
//
// POST.json holds a placeholder address until the post is up on X; replace it
// with the post's real address (https://x.com/<handle>/status/<id>) before
// submitting. The output directory comes from MAKEFUN_OUTPUT_DIR: an absolute
// value is used as it is, a relative one is resolved under this repository's
// root, so the file always lands where the grader expects it.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { isAbsolute, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? 'out';
const destinationDir = isAbsolute(outputDir) ? outputDir : join(repoRoot, outputDir);
const source = join(repoRoot, 'POST.json');
const destination = join(destinationDir, 'POST.json');

// The gate refuses a POST.json it cannot read, so fail loudly here instead
// of handing it a file that does not name a post.
const parsed = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
if (typeof parsed.url !== 'string' || !parsed.url.startsWith('https://')) {
  console.error(`POST.json does not hold a post url: ${parsed.url}`);
  process.exit(1);
}

try {
  mkdirSync(destinationDir, { recursive: true });
  copyFileSync(source, destination);
  console.log(`POST.json copied to ${destination}`);
} catch (err) {
  console.error(`POST.json could not be copied from ${source}: ${(err as Error).message}`);
  process.exit(1);
}
