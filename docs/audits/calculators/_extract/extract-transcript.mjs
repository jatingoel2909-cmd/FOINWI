import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const transcript =
  "C:/Users/jatin/.cursor/projects/d-FOINWI/agent-transcripts/79292c43-eb61-4e57-a156-925cf18a3a05/79292c43-eb61-4e57-a156-925cf18a3a05.jsonl";
const lines = readFileSync(transcript, "utf8").split(/\n/).filter(Boolean);
const keys = [
  ["income-tax-correction", "INCOME TAX P0 CORRECTION: READY FOR CTO REVIEW"],
  ["income-tax-87a", "Section 87A **marginal relief is now estimated"],
  ["income-tax-std-deduction", "Salary standard deduction now applies"],
  ["gratuity-correction", "The gratuity calculator is now a scoped"],
  ["epf-audit", "# EPF P1 CURRENT-RULE AUDIT"],
  ["epf-correction", "The EPF calculator is now a scoped educational estimator"],
  ["ppf-audit", "FOINWI’s PPF tool is an **educational annuity-due projection**"],
  ["ppf-correction", "PPF P1 is implemented"],
  ["hra-audit", "The working tree is clean at `0b8c461`"],
  ["hra-correction", "HRA P1 CORRECTION"],
  ["nps-audit", "NPS P1 CURRENT-RULE AUDIT:"],
  ["nps-correction", "NPS P1 CORRECTION:"],
  ["gst-audit", "GST P1 current-rule audit — September 2026"],
  ["gst-correction", "GST P1 CORRECTION:"],
];

mkdirSync("docs/audits/calculators/_extract", { recursive: true });
for (const line of lines) {
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  if (obj.role !== "assistant") continue;
  const text = (obj.message?.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
  if (!text || text.length < 400) continue;
  for (const [name, needle] of keys) {
    if (text.includes(needle)) {
      writeFileSync(`docs/audits/calculators/_extract/${name}.md`, text);
      console.log(name, text.length);
    }
  }
}
