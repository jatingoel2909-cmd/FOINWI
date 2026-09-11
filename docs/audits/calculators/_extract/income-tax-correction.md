**INCOME TAX P0 CORRECTION: READY FOR CTO REVIEW**

The Income Tax Calculator is now a scoped educational estimator for **FY 2025-26 / AY 2026-27**. Other calculators were not changed. Not committed. Not pushed.

## 1. Files changed

**Added**
- `src/utils/incomeTax/incomeTaxRules.js` — AY/FY, slabs, 87A, cess, ₹50 lakh cap
- `src/utils/incomeTax/incomeTaxEngine.js` — pure estimate + regime compare
- `scripts/validateIncomeTax.js`

**Updated**
- `src/components/IncomeTaxCalculator.jsx`
- `src/data/calculatorInsights.js`
- `src/data/calculatorExplains.js`
- `src/data/calculators.js` (card description only)
- `scripts/validateAllCalculators.js` (uses the engine; no duplicated slabs)
- `package.json` (`validate:income-tax`)

## 2. Calculator scope after correction

Educational salary-income estimate only.

- New regime: supported salary standard deduction only
- Old regime: individual **below 60 years**
- Section 87A: educational estimate for an **eligible resident individual**
- Income cap: **₹50 lakh** (surcharge not modelled)
- Not a filing tool, not every income type, not senior-citizen / non-resident slabs

## 3. AY / FY

**AY 2026-27 · FY 2025-26** (`INCOME_TAX_PERIOD`)

## 4. New-regime slabs implemented

| Taxable income | Rate |
|---|---|
| Up to ₹4,00,000 | Nil |
| ₹4,00,001 – ₹8,00,000 | 5% |
| ₹8,00,001 – ₹12,00,000 | 10% |
| ₹12,00,001 – ₹16,00,000 | 15% |
| ₹16,00,001 – ₹20,00,000 | 20% |
| ₹20,00,001 – ₹24,00,000 | 25% |
| Above ₹24,00,000 | 30% |

## 5. Old-regime scope

Individual below 60:

| Taxable income | Rate |
|---|---|
| Up to ₹2,50,000 | Nil |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

No age input was added. UI states this scope.

## 6. Standard deduction

The old field was generic “Annual Income”. It is now **Annual Salary Income**.

- New regime: **₹75,000** applied automatically as eligible employee salary standard deduction
- Old regime: **not** applied
- Copy states this is salary-scoped, not total income from any source

## 7. 87A behavior

Applied **after slab tax, before cess**. Rebate never exceeds tax before rebate. **No 87A marginal relief.**

- New: taxable income ≤ ₹12,00,000 → rebate up to ₹60,000
- Old: taxable income ≤ ₹5,00,000 → rebate up to ₹12,500
- ₹12,00,001 does **not** get the ₹12 lakh rebate
- UI: educational estimate for an eligible resident individual; not checked for every income type

## 8. Surcharge / product boundary

Surcharge is **not implemented**. Input max is **₹50,00,000**. Output line: “Surcharge — Not modelled”.

## 9. Cess

**4% × tax after rebate** (surcharge = 0). Cess is not applied before rebate.

## 10. UI / trust copy

- Title: **Educational tax estimate**
- Period: **FY 2025-26 · AY 2026-27**
- Required disclaimer in the page description
- Old-regime deductions default **₹0**, labelled “Eligible deductions considered for this simplified estimate”
- No “exact tax”, “final liability”, “filing-ready”, “guaranteed”, “best/recommended regime”
- Compare line: **“Lower estimated tax in this simplified scenario”**
- Breakdown: income, standard deduction, other deductions, taxable income, slab tax, 87A, tax after rebate, cess, surcharge, total

## 11. Test vectors

`npm run validate:income-tax` — **78 checks passed**, including:

- New-regime slab points and every band boundary
- 87A at ₹12,00,000 → ₹0; ₹12,00,001 → no rebate
- Old-regime ₹2.5L / ₹5L / ₹10L / 30% band
- Old 87A limited to tax payable
- Rebate ≤ slab tax; cess = 4% of post-rebate tax
- Deductions cannot go negative; new regime ignores old deduction input
- ₹75,000 salary standard deduction
- Regime switch is deterministic; no NaN / Infinity / negative tax

`validate:calculators` Income Tax block now calls the same engine.

## 12. Validator / lint / build

| Command | Result |
|---|---|
| `validate:income-tax` | passed (78) |
| `validate:calculators` | passed |
| `validate:trust` | passed (32) |
| `validate:hardening` | passed (15) |
| `lint` | passed |
| `build` | passed (`index-heCQFO_F.js`) |

## 13. Remaining limitations

- No surcharge, marginal relief, or 87A marginal relief
- No senior-citizen / super-senior old-regime slabs
- No 80C/80D/80CCD engine; old-regime deductions are visitor-entered
- New regime does not model other allowed deductions
- No special-rate income, house property, capital gains, or ITR schedules
- 87A eligibility is assumed for the educational resident-individual case, not verified
- Display still rounds to whole rupees

## 14. Stale tax references elsewhere (not changed)

| Location | Issue |
|---|---|
| `src/data/learnAcademy.js` | “the **better choice** depends on your deductions”; 80C “up to ₹1.5 lakh”; no AY 2026-27 slabs |
| `src/data/journeys.js` | “choosing the **right regime**”; “**File with confidence**” |
| `src/intelligence/insight/dailyInsights.js` | Generic Old vs New; no AY/slab update |
| `src/intelligence/guide/guideIntents.js` | Generic tax estimate copy (hedged; no stale rupee slabs) |

No leftover **₹3L / 7L / 12–15L** new-regime bands were found outside the old calculator (those lived only in the previous implementation).

## 15. git diff --stat

```
 package.json                           |   1 +
 scripts/validateAllCalculators.js      |  47 ++++-----
 src/components/IncomeTaxCalculator.jsx | 178 ++++++++++++++++++---------------
 src/data/calculatorExplains.js         |  22 ++--
 src/data/calculatorInsights.js         |  31 +++---
 src/data/calculators.js                |   2 +-
 6 files changed, 143 insertions(+), 138 deletions(-)
```

Untracked (not in `--stat`): `scripts/validateIncomeTax.js`, `src/utils/incomeTax/`

## 16. git status

```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
	modified:   package.json
	modified:   scripts/validateAllCalculators.js
	modified:   src/components/IncomeTaxCalculator.jsx
	modified:   src/data/calculatorExplains.js
	modified:   src/data/calculatorInsights.js
	modified:   src/data/calculators.js

Untracked files:
	scripts/validateIncomeTax.js
	src/utils/incomeTax/
```

**INCOME TAX P0 CORRECTION: READY FOR CTO REVIEW**