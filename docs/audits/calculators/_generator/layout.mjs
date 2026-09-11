/**
 * FOINWI internal audit PDF layout.
 * Docs-only generator. Does not touch production calculator code.
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const A4 = { width: 595.28, height: 841.89 };

const COLORS = {
  bg: rgb(0.984, 0.961, 0.922),
  card: rgb(1, 0.992, 0.973),
  ink: rgb(0.165, 0.133, 0.082),
  muted: rgb(0.42, 0.365, 0.29),
  gold: rgb(0.69, 0.525, 0.22),
  goldLine: rgb(0.78, 0.64, 0.38),
  rule: rgb(0.91, 0.86, 0.76),
  p0: rgb(0.52, 0.18, 0.14),
  p1: rgb(0.5, 0.34, 0.1),
  p2: rgb(0.22, 0.36, 0.3),
  white: rgb(1, 1, 1),
};

const MARGIN = 48;
const HEADER_Y = 818;
const FOOTER_Y = 28;
const CONTENT_TOP = 792;
const CONTENT_BOTTOM = 52;
const CONTENT_WIDTH = A4.width - MARGIN * 2;

function toWinAnsi(text) {
  return String(text ?? "")
    .replaceAll("₹", "Rs ")
    .replaceAll("×", "x")
    .replaceAll("÷", "/")
    .replaceAll("→", "->")
    .replaceAll("↓", "|")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("…", "...")
    .replaceAll("≤", "<=")
    .replaceAll("≥", ">=")
    .replaceAll("−", "-")
    .replaceAll("\u00a0", " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\x80-\xFF]/g, "?");
}

function wrapText(font, text, size, maxWidth) {
  const raw = toWinAnsi(text).replace(/\r\n/g, "\n");
  const paragraphs = raw.split("\n");
  const lines = [];

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    const tokens = paragraph.split(/(\s+)/);
    let current = "";
    for (const token of tokens) {
      const trial = current + token;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        current = trial;
        continue;
      }
      if (current.trim()) lines.push(current.replace(/\s+$/g, ""));
      if (font.widthOfTextAtSize(token.trim(), size) <= maxWidth) {
        current = token.replace(/^\s+/g, "");
        continue;
      }
      let chunk = "";
      for (const ch of token.trim()) {
        const next = chunk + ch;
        if (font.widthOfTextAtSize(next, size) <= maxWidth) {
          chunk = next;
        } else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    }
    if (current !== "") lines.push(current.replace(/\s+$/g, ""));
  }

  return lines.length ? lines : [""];
}

export async function createDocument() {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  pdf.setTitle("FOINWI Internal Governance Record");
  pdf.setAuthor("FOINWI");
  pdf.setSubject("Current-rule and product accuracy record");
  pdf.setCreator("FOINWI audit archive generator");
  return { pdf, fonts: { regular, bold, italic } };
}

export function createRenderer({ pdf, fonts }, meta) {
  const pages = [];
  let page = null;
  let y = CONTENT_TOP;
  let pageNumber = 0;

  function paintBackground(target) {
    target.drawRectangle({
      x: 0,
      y: 0,
      width: A4.width,
      height: A4.height,
      color: COLORS.bg,
    });
    target.drawRectangle({
      x: 0,
      y: A4.height - 8,
      width: A4.width,
      height: 8,
      color: COLORS.gold,
    });
  }

  function drawHeaderFooter(target, number) {
    if (number > 1) {
      target.drawText("FOINWI — Grow Beyond Numbers", {
        x: MARGIN,
        y: HEADER_Y,
        size: 8,
        font: fonts.regular,
        color: COLORS.gold,
      });
      const right = `${meta.shortName} · Internal Governance Record`;
      const rightWidth = fonts.regular.widthOfTextAtSize(right, 8);
      target.drawText(right, {
        x: A4.width - MARGIN - rightWidth,
        y: HEADER_Y,
        size: 8,
        font: fonts.regular,
        color: COLORS.muted,
      });
      target.drawLine({
        start: { x: MARGIN, y: HEADER_Y - 8 },
        end: { x: A4.width - MARGIN, y: HEADER_Y - 8 },
        thickness: 0.6,
        color: COLORS.goldLine,
      });
    }
    target.drawLine({
      start: { x: MARGIN, y: 42 },
      end: { x: A4.width - MARGIN, y: 42 },
      thickness: 0.6,
      color: COLORS.goldLine,
    });
    target.drawText("FOINWI — Grow Beyond Numbers", {
      x: MARGIN,
      y: FOOTER_Y,
      size: 8,
      font: fonts.regular,
      color: COLORS.muted,
    });
    const pageLabel = `Page ${number}`;
    const pageWidth = fonts.regular.widthOfTextAtSize(pageLabel, 8);
    target.drawText(pageLabel, {
      x: A4.width - MARGIN - pageWidth,
      y: FOOTER_Y,
      size: 8,
      font: fonts.regular,
      color: COLORS.muted,
    });
  }

  function addPage({ cover = false } = {}) {
    page = pdf.addPage([A4.width, A4.height]);
    pages.push(page);
    pageNumber += 1;
    paintBackground(page);
    y = cover ? A4.height - 72 : CONTENT_TOP;
    return page;
  }

  function ensureSpace(height) {
    if (!page) addPage();
    if (y - height < CONTENT_BOTTOM) addPage();
  }

  function gap(size = 8) {
    y -= size;
  }

  function textBlock(text, { font = fonts.regular, size = 9.5, color = COLORS.ink, leading = 13, indent = 0 } = {}) {
    const width = CONTENT_WIDTH - indent;
    const lines = wrapText(font, text, size, width);
    ensureSpace(lines.length * leading + 2);
    for (const line of lines) {
      if (y - leading < CONTENT_BOTTOM) addPage();
      page.drawText(line, {
        x: MARGIN + indent,
        y: y - size,
        size,
        font,
        color,
      });
      y -= leading;
    }
  }

  function cover(record) {
    addPage({ cover: true });
    page.drawRectangle({
      x: MARGIN,
      y: A4.height - 86,
      width: 72,
      height: 3,
      color: COLORS.gold,
    });
    page.drawText("FOINWI", {
      x: MARGIN,
      y: A4.height - 128,
      size: 28,
      font: fonts.bold,
      color: COLORS.ink,
    });
    page.drawText("Grow Beyond Numbers", {
      x: MARGIN,
      y: A4.height - 150,
      size: 12,
      font: fonts.italic,
      color: COLORS.gold,
    });

    y = A4.height - 220;
    textBlock(record.name.toUpperCase(), { font: fonts.bold, size: 20, leading: 26 });
    gap(6);
    textBlock("CURRENT-RULE & PRODUCT ACCURACY RECORD", {
      font: fonts.bold,
      size: 12,
      color: COLORS.gold,
      leading: 16,
    });
    gap(10);
    textBlock("Internal Governance Record", {
      font: fonts.italic,
      size: 11,
      color: COLORS.muted,
      leading: 15,
    });

    gap(18);
    const valueWidth = CONTENT_WIDTH - 168;
    const metaRows = [
      ["Audit / Review Period", record.auditPeriod],
      ["Final Production Checkpoint", record.checkpointDate],
      ["Git Commit", `${record.commitShort}  ${record.commit}`],
      ["Commit Message", record.commitMessage],
      ["Branch", record.branch],
    ].map(([label, value]) => {
      const lines = wrapText(fonts.regular, value, 9, valueWidth);
      return { label, lines, height: Math.max(22, lines.length * 12 + 10) };
    });
    const boxHeight = metaRows.reduce((sum, row) => sum + row.height, 0) + 18;
    ensureSpace(boxHeight + 8);
    page.drawRectangle({
      x: MARGIN,
      y: y - boxHeight,
      width: CONTENT_WIDTH,
      height: boxHeight,
      color: COLORS.card,
      borderColor: COLORS.goldLine,
      borderWidth: 0.8,
    });
    y -= 12;
    for (const row of metaRows) {
      page.drawText(row.label, {
        x: MARGIN + 14,
        y: y - 9,
        size: 8,
        font: fonts.bold,
        color: COLORS.gold,
      });
      let valueY = y - 9;
      for (const line of row.lines) {
        page.drawText(line, {
          x: MARGIN + 150,
          y: valueY,
          size: 9,
          font: fonts.regular,
          color: COLORS.ink,
        });
        valueY -= 12;
      }
      y -= row.height;
    }
    y -= 16;

    const disclaimer = "This document is an internal FOINWI governance and product-accuracy record. It is not marketing material, legal advice, a filing tool, or a certification. It does not claim that the calculator is legally certified, government approved, CA certified, regulator approved, or permanently accurate.";
    const disclaimerLines = wrapText(fonts.regular, disclaimer, 8.5, CONTENT_WIDTH - 24);
    const disclaimerHeight = disclaimerLines.length * 12 + 20;
    page.drawRectangle({
      x: MARGIN,
      y: y - disclaimerHeight,
      width: CONTENT_WIDTH,
      height: disclaimerHeight,
      color: COLORS.card,
      borderColor: COLORS.rule,
      borderWidth: 0.6,
    });
    y -= 12;
    for (const line of disclaimerLines) {
      page.drawText(line, {
        x: MARGIN + 12,
        y: y - 8.5,
        size: 8.5,
        font: fonts.regular,
        color: COLORS.ink,
      });
      y -= 12;
    }
    addPage();
  }

  function h1(title) {
    ensureSpace(36);
    gap(10);
    page.drawLine({
      start: { x: MARGIN, y: y },
      end: { x: A4.width - MARGIN, y: y },
      thickness: 0.5,
      color: COLORS.goldLine,
    });
    y -= 16;
    textBlock(title, { font: fonts.bold, size: 12.5, leading: 16, color: COLORS.ink });
    gap(4);
  }

  function h2(title) {
    ensureSpace(22);
    gap(6);
    textBlock(title, { font: fonts.bold, size: 10.5, leading: 14, color: COLORS.gold });
  }

  function para(text) {
    textBlock(text, { size: 9.5, leading: 13.2 });
    gap(4);
  }

  function bullets(items) {
    for (const item of items) {
      const lines = wrapText(fonts.regular, item, 9.5, CONTENT_WIDTH - 14);
      ensureSpace(lines.length * 13.2 + 2);
      page.drawText("•", {
        x: MARGIN,
        y: y - 9.5,
        size: 9.5,
        font: fonts.regular,
        color: COLORS.gold,
      });
      for (const line of lines) {
        if (y - 13.2 < CONTENT_BOTTOM) addPage();
        page.drawText(line, {
          x: MARGIN + 14,
          y: y - 9.5,
          size: 9.5,
          font: fonts.regular,
          color: COLORS.ink,
        });
        y -= 13.2;
      }
      gap(2);
    }
    gap(2);
  }

  function callout(text) {
    const lines = wrapText(fonts.italic, text, 9, CONTENT_WIDTH - 20);
    const height = lines.length * 12.5 + 16;
    ensureSpace(height + 6);
    page.drawRectangle({
      x: MARGIN,
      y: y - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.card,
      borderColor: COLORS.goldLine,
      borderWidth: 0.7,
    });
    y -= 12;
    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN + 10,
        y: y - 9,
        size: 9,
        font: fonts.italic,
        color: COLORS.ink,
      });
      y -= 12.5;
    }
    y -= 8;
  }

  function formula(lines) {
    const wrapped = [];
    for (const line of lines) {
      wrapped.push(...wrapText(fonts.regular, line, 9.5, CONTENT_WIDTH - 24));
    }
    const height = wrapped.length * 13.5 + 18;
    ensureSpace(height + 6);
    page.drawRectangle({
      x: MARGIN,
      y: y - height,
      width: CONTENT_WIDTH,
      height,
      color: rgb(0.97, 0.94, 0.88),
      borderColor: COLORS.goldLine,
      borderWidth: 0.7,
    });
    y -= 14;
    for (const line of wrapped) {
      page.drawText(line, {
        x: MARGIN + 12,
        y: y - 9.5,
        size: 9.5,
        font: fonts.regular,
        color: COLORS.ink,
      });
      y -= 13.5;
    }
    y -= 10;
  }

  function kvTable(rows) {
    for (const [label, value] of rows) {
      const valueLines = wrapText(fonts.regular, value, 9, CONTENT_WIDTH - 150);
      const height = Math.max(16, valueLines.length * 12 + 8);
      ensureSpace(height);
      page.drawRectangle({
        x: MARGIN,
        y: y - height,
        width: CONTENT_WIDTH,
        height,
        color: COLORS.card,
        borderColor: COLORS.rule,
        borderWidth: 0.4,
      });
      page.drawText(label, {
        x: MARGIN + 8,
        y: y - 12,
        size: 8,
        font: fonts.bold,
        color: COLORS.gold,
      });
      let valueY = y - 12;
      for (const line of valueLines) {
        page.drawText(line, {
          x: MARGIN + 140,
          y: valueY,
          size: 9,
          font: fonts.regular,
          color: COLORS.ink,
        });
        valueY -= 12;
      }
      y -= height;
    }
    gap(6);
  }

  function table(headers, rows) {
    const colCount = headers.length;
    const colWidth = CONTENT_WIDTH / colCount;
    const size = 8;

    function rowHeight(cells, font) {
      let max = 1;
      for (const cell of cells) {
        max = Math.max(max, wrapText(font, cell, size, colWidth - 10).length);
      }
      return max * 11 + 10;
    }

    const headerHeight = rowHeight(headers, fonts.bold);
    ensureSpace(headerHeight);
    page.drawRectangle({
      x: MARGIN,
      y: y - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: rgb(0.93, 0.86, 0.7),
    });
    headers.forEach((header, i) => {
      const lines = wrapText(fonts.bold, header, size, colWidth - 10);
      let textY = y - 12;
      for (const line of lines) {
        page.drawText(line, {
          x: MARGIN + i * colWidth + 5,
          y: textY,
          size,
          font: fonts.bold,
          color: COLORS.ink,
        });
        textY -= 11;
      }
    });
    y -= headerHeight;

    rows.forEach((row, rowIndex) => {
      const height = rowHeight(row, fonts.regular);
      ensureSpace(height);
      if (rowIndex % 2 === 0) {
        page.drawRectangle({
          x: MARGIN,
          y: y - height,
          width: CONTENT_WIDTH,
          height,
          color: COLORS.card,
        });
      } else {
        page.drawRectangle({
          x: MARGIN,
          y: y - height,
          width: CONTENT_WIDTH,
          height,
          color: rgb(0.975, 0.95, 0.91),
        });
      }
      row.forEach((cell, i) => {
        const lines = wrapText(fonts.regular, cell, size, colWidth - 10);
        let textY = y - 12;
        for (const line of lines) {
          page.drawText(line, {
            x: MARGIN + i * colWidth + 5,
            y: textY,
            size,
            font: fonts.regular,
            color: COLORS.ink,
          });
          textY -= 11;
        }
      });
      y -= height;
    });
    gap(8);
  }

  function finding(severity, text) {
    const badge = severity;
    const color = severity === "P0" ? COLORS.p0 : severity === "P1" ? COLORS.p1 : COLORS.p2;
    const lines = wrapText(fonts.regular, text, 9.2, CONTENT_WIDTH - 46);
    const height = Math.max(22, lines.length * 12.5 + 10);
    ensureSpace(height + 3);
    page.drawRectangle({
      x: MARGIN,
      y: y - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.card,
      borderColor: COLORS.rule,
      borderWidth: 0.4,
    });
    page.drawRectangle({
      x: MARGIN + 6,
      y: y - 18,
      width: 24,
      height: 12,
      color,
    });
    page.drawText(badge, {
      x: MARGIN + 9,
      y: y - 16,
      size: 7,
      font: fonts.bold,
      color: COLORS.white,
    });
    let textY = y - 16;
    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN + 38,
        y: textY,
        size: 9.2,
        font: fonts.regular,
        color: COLORS.ink,
      });
      textY -= 12.5;
    }
    y -= height + 3;
  }

  function sourceCard(source) {
    const bits = [
      `${source.authority} — ${source.instrument}`,
      source.dates ? `Dates: ${source.dates}` : "",
      source.url ? `URL: ${source.url}` : "",
      `Supported: ${source.proposition}`,
    ].filter(Boolean);
    const lines = [];
    for (const bit of bits) {
      lines.push(...wrapText(fonts.regular, bit, 8.4, CONTENT_WIDTH - 18));
    }
    const height = lines.length * 11.5 + 12;
    ensureSpace(height + 4);
    page.drawRectangle({
      x: MARGIN,
      y: y - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.card,
      borderColor: COLORS.rule,
      borderWidth: 0.4,
    });
    y -= 10;
    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN + 8,
        y: y - 8.4,
        size: 8.4,
        font: fonts.regular,
        color: COLORS.ink,
      });
      y -= 11.5;
    }
    y -= 6;
  }

  function correction(item) {
    para(`Old: ${item.old}`);
    para(`Corrected: ${item.corrected}`);
    para(`Reason: ${item.reason}`);
    gap(4);
  }

  function finalize() {
    pages.forEach((target, index) => {
      drawHeaderFooter(target, index + 1);
    });
    return pdf;
  }

  return {
    cover,
    h1,
    h2,
    para,
    bullets,
    callout,
    formula,
    kvTable,
    table,
    finding,
    sourceCard,
    correction,
    finalize,
    pageCount: () => pages.length,
  };
}

export function renderRecord(renderer, record) {
  renderer.cover(record);

  renderer.h1("1. Purpose of Record");
  renderer.para(
    "This internal record documents the completed FOINWI current-rule and product-accuracy review for this calculator only. It records calculator scope, the regulatory/current-rule review, formula review, assumptions, discrepancies discovered, corrections implemented, validation evidence, remaining limitations, authoritative sources used, and the Git production checkpoint.",
  );
  renderer.bullets(record.purpose);
  if (record.revisionNote) {
    renderer.h2("Revision note");
    renderer.callout(record.revisionNote);
  }
  if (!record.originalAuditAvailable) {
    renderer.callout("Original audit record not available in the current workspace.");
  }

  renderer.h1("2. Product Scope");
  renderer.h2("What this calculator does");
  renderer.bullets(record.scopeDoes);
  renderer.h2("What this calculator does not do");
  renderer.bullets(record.scopeDoesNot);

  renderer.h1("3. Pre-Correction State");
  if (record.preCorrectionNote) renderer.callout(record.preCorrectionNote);
  renderer.bullets(record.preCorrection);

  renderer.h1("4. Current-Rule Audit Findings");
  if (record.findingsIntro) renderer.para(record.findingsIntro);
  for (const item of record.findings) {
    renderer.finding(item.severity, item.text);
  }
  if (record.uncertainties?.length) {
    renderer.h2("Uncertainties preserved from the review");
    renderer.bullets(record.uncertainties);
  }

  renderer.h1("5. Authoritative Basis");
  renderer.para(
    "The sources below were used during the completed review. This section is a record of that review. It is not a fresh regulatory reinterpretation.",
  );
  for (const source of record.sources) renderer.sourceCard(source);
  if (record.sourcesNote) renderer.callout(record.sourcesNote);

  renderer.h1("6. Final Production Formula");
  renderer.formula(record.formula.lines);
  renderer.h2("Variables");
  renderer.table(["Variable", "Meaning"], record.formula.variables);
  if (record.formula.timing?.length) {
    renderer.h2("Timing and method assumptions");
    renderer.bullets(record.formula.timing);
  }

  renderer.h1("7. Final Rules / Assumptions");
  renderer.para(
    "Material production assumptions are classified below. Statutory / official rule is distinguished from a FOINWI product assumption and from an illustrative user-editable assumption.",
  );
  renderer.table(
    ["Class", "Assumption"],
    record.assumptions.map((row) => [row.kind, row.text]),
  );

  renderer.h1("8. Corrections Implemented");
  record.corrections.forEach((item, index) => {
    renderer.h2(`Correction ${index + 1}`);
    renderer.correction(item);
  });

  renderer.h1("9. Deterministic Test Vectors");
  renderer.para(
    "The vectors below were executed against the production engine in the calculator validator. No unexecuted tests are listed.",
  );
  renderer.table(
    ["Inputs", "Expected", "Actual / validated", "Result"],
    record.vectors.map((row) => [row.inputs, row.expected, row.actual, row.pass ? "PASS" : row.result]),
  );

  renderer.h1("10. Validation Evidence");
  renderer.table(["Check", "Recorded result"], record.validation);
  if (record.validationLimitations?.length) {
    renderer.h2("Test limitations");
    renderer.bullets(record.validationLimitations);
  }

  renderer.h1("11. Remaining Limitations");
  renderer.para(
    "This section is mandatory. It records what this calculator deliberately does not model. It protects FOINWI from overclaiming.",
  );
  renderer.bullets(record.limitations);

  renderer.h1("12. Trust & User-Communication Standard");
  renderer.bullets(record.trust);

  renderer.h1("13. Architecture");
  renderer.formula(record.architecture.flow);
  renderer.bullets(record.architecture.notes);

  renderer.h1("14. Change Record");
  renderer.kvTable([
    ["Calculator", record.name],
    ["Audit date", record.auditPeriod],
    ["Correction date", record.checkpointDate],
    ["Final Git commit hash", record.commit],
    ["Commit message", record.commitMessage],
    ["Branch", record.branch],
    ["Relevant production files", record.changeRecord.files.join("; ")],
    ["Validator", record.changeRecord.validator],
    ["Validation command", record.changeRecord.command],
  ]);
  if (record.changeRecord.evidence) {
    renderer.para(record.changeRecord.evidence);
  }

  renderer.h1("15. Final Status");
  renderer.para("FOINWI INTERNAL PRODUCT ACCURACY STATUS");
  renderer.table(
    ["Checkpoint", "Status"],
    [
      ["Current-rule audit completed", record.status.audit],
      ["Correction completed", record.status.correction],
      ["Production engine validated", record.status.engine],
      ["Regression checks passed", record.status.regression],
      ["Known limitations documented", record.status.limitations],
    ],
  );
  renderer.callout(
    "Status reflects the rules, assumptions, sources and production checkpoint documented in this record. Regulatory and statutory requirements may change after the recorded review date.",
  );
  renderer.para(
    "This record does not state that the calculator is 100% legally accurate, permanently compliant, government certified, or error-free forever.",
  );
}
