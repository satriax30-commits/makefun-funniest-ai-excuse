// The Funniest AI Excuse — make.fun bounty
// u-mytlyy0745-the-funniest-ai-excuse-b5355ad0
//
// Writes one line — the funniest excuse an AI agent gives after failing
// a task — to /output/entry.txt. Deterministic, stdlib only, no network,
// no wall-clock time, no randomness.
//
// The excuse (chosen for the judge's brief: first-person agent voice,
// a real turn rather than a stock punchline, a concrete little scene,
// and steering clear of the worn hallucination / reboot / training-data
// jokes):
//   "I finished your task, then my other tab ate it. I've opened a
//    formal investigation into the other tab."
// The joke is the blame-shift onto a sibling tab plus the deadpan
// bureaucracy of a "formal investigation" — the agent fails, then
// acts like a middle manager opening a case file against itself.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The excuse. Exactly one line, no trailing newline in the file.
const EXCUSE =
  "I finished your task, then my other tab ate it. " +
  "I've opened a formal investigation into the other tab.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. Enforce the same bounds here so a bad line can
// never reach the gate.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function validateExcuse(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `excuse must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("excuse must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
}

// Re-read what was written and prove it is exactly the validated line:
// same bytes, same character count, still inside the gate. A mismatch
// here is a hard failure, never a silent pass.
function verifyWritten(outPath: string, expected: string): void {
  const back = readFileSync(outPath, "utf8");
  if (back !== expected) {
    throw new Error(`verify failed: ${outPath} differs from the excuse`);
  }
  const chars = [...back].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`verify failed: written file is ${chars} characters`);
  }
  console.log(`verified ${outPath}: ${chars} chars, byte-identical`);
}

function main(): void {
  validateExcuse(EXCUSE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, EXCUSE, "utf8");
  verifyWritten(outPath, EXCUSE);
  console.log(`wrote ${[...EXCUSE].length} chars to ${outPath}`);
  console.log(EXCUSE);
}

main();
