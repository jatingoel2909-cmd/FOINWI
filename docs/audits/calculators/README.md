# FOINWI calculator audit archive

Internal governance / product-accuracy records for the completed statutory and current-rule calculator reviews.

These PDFs are **not** marketing material. They do not claim legal certification, government approval, CA certification, regulator approval, or permanent accuracy.

One calculator = one PDF. Production calculator code was not changed to produce this archive.

## Index

| Calculator | Audit period | Final commit | PDF filename | Status |
|---|---|---|---|---|
| Income Tax | 10 September 2026; citation revision September 2026 | `5a35f3b` | `FOINWI-Income-Tax-Calculator-Audit-2026.pdf` | Correction completed. Standalone current-rule audit not in workspace. September 2026 revision: current-law standard deduction cited as Act 2025 s.19(1) Table Sl. No. 2. Original issued PDF preserved in `_archive/`. |
| Gratuity | 10 September 2026 | `6e70e58` | `FOINWI-Gratuity-Calculator-Audit-2026.pdf` | Correction completed. Standalone current-rule audit not in workspace. Ceiling **NOT DEFINITIVELY VERIFIED** as a fresh s.53(3) notification. |
| EPF | 10 September 2026 | `9134e6e` | `FOINWI-EPF-Calculator-Audit-2026.pdf` | Current-rule audit and correction completed. |
| PPF | 10 September 2026 | `0b8c461` | `FOINWI-PPF-Calculator-Audit-2026.pdf` | Current-rule audit and correction completed. e-Gazette PDFs **NOT DEFINITIVELY VERIFIED**. |
| HRA | 10 September 2026 | `6463cb3` | `FOINWI-HRA-Calculator-Audit-2026.pdf` | Current-rule audit and correction completed. Commission under Rule 279 **NOT DEFINITIVELY RESTATED**. |
| NPS | 10 September 2026 | `5352acc` | `FOINWI-NPS-Calculator-Audit-2026.pdf` | Current-rule audit and correction completed. |
| GST | 10 September 2026 | `3a43a2e` | `FOINWI-GST-Calculator-Audit-2026.pdf` | Current-rule audit and correction completed. HEAD of `main` at archive time. |

Branch for all checkpoints: `main`.

Full hashes:

- Income Tax: `5a35f3b9d6e45b61a0693c8324ac68093ba75771` — *Correct AY 2026-27 income tax calculator*
- Gratuity: `6e70e58f5c7725c3412edbc5e0d6d1d30407984e` — *Correct gratuity calculator for current labour code*
- EPF: `9134e6ef67e5c48de7553755cd9b1d845dc3ae41` — *Correct EPF calculator for current statutory assumptions*
- PPF: `0b8c4618e1d785659b047d783c4f3468c402713a` — *Correct PPF calculator assumptions and trust wording*
- HRA: `6463cb35d6bb3337fa030f7dc273a9d93e5fecbc` — *Correct HRA calculator for FY 2026-27 rules*
- NPS: `5352accc1a586b67a423964f20691b84ee89d2bd` — *Correct NPS calculator for current exit rules*
- GST: `3a43a2e13ec9a5bc1071ebe19134124ccb1460db` — *Correct GST calculator for current rate framework*

## How to read a record

Each PDF follows the same 15-section structure: purpose, scope, pre-correction state, findings, sources, final formula, assumptions, corrections, test vectors, validation evidence, remaining limitations, trust standard, architecture, change record, and final status.

Where an original standalone audit was not in the workspace, the PDF says so and does not invent historical findings.

## Regenerating

From the repository root, with `pdf-lib` available:

```bash
node docs/audits/calculators/_generator/generate.mjs
```

The generator verifies each recorded Git hash against `git log` before writing the PDF. It does not modify production calculator files.

Working notes used while reconstructing the records live in `_extract/` and `_generator/`. They are not visitor-facing.
