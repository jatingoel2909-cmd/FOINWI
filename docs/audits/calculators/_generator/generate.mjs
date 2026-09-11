/**
 * Generate FOINWI calculator audit PDFs.
 * Docs-only. Does not modify production calculator logic.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";
import { createDocument, createRenderer, renderRecord } from "./layout.mjs";
import { records } from "./records/index.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");
const repoRoot = join(here, "..", "..", "..", "..");

function verifyCommit(record) {
  const log = execFileSync(
    "git",
    ["log", "-1", "--format=%H%n%s%n%ci", record.commit],
    { encoding: "utf8", cwd: repoRoot },
  ).trim().split("\n");
  const [hash, subject] = log;
  if (hash !== record.commit) {
    throw new Error(`Commit mismatch for ${record.shortName}: expected ${record.commit}, git returned ${hash}`);
  }
  if (subject !== record.commitMessage) {
    throw new Error(`Commit message mismatch for ${record.shortName}: ${subject}`);
  }
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const pageCounts = [];

  for (const record of records) {
    verifyCommit(record);
    const { pdf, fonts } = await createDocument();
    pdf.setTitle(`FOINWI - ${record.name} Current-Rule & Product Accuracy Record`);
    const renderer = createRenderer({ pdf, fonts }, record);
    renderRecord(renderer, record);
    const doc = renderer.finalize();
    const bytes = await doc.save();
    const dest = join(outDir, record.filename);
    writeFileSync(dest, bytes);
    const reopened = await PDFDocument.load(bytes);
    const pages = reopened.getPageCount();
    if (pages < 6) throw new Error(`${record.filename} has only ${pages} pages`);
    pageCounts.push({ name: record.shortName, file: record.filename, pages, bytes: bytes.length });
    process.stdout.write(`Wrote ${record.filename} (${pages} pages, ${bytes.length} bytes)\n`);
  }

  writeFileSync(join(here, "page-counts.json"), `${JSON.stringify(pageCounts, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
