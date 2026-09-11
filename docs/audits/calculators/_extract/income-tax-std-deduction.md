> Historical contemporaneous report (10 September 2026). The Section 16(ia) numbering below is the then-used Income-tax Act, 1961 citation. It is not the current Income-tax Act, 2025 provision. Current-law citation: section 19(1), Table Sl. No. 2. Numerical amounts were unchanged.

Salary standard deduction now applies in **both regimes**, limited to salary, from the centralized AY 2026-27 engine. Nothing was committed or pushed.

## 1. Exact standard-deduction handling

Centralized caps:

- **Old regime:** `OLD_STANDARD_DEDUCTION = ₹50,000` (Section 16(ia))
- **New regime:** `NEW_STANDARD_DEDUCTION = ₹75,000`

For each regime:

`applicableStandardDeduction = min(annualSalaryIncome, regimeCap)`

That amount cannot exceed salary and cannot go negative.

**Old regime**

`taxable income = max(0, salary − old salary standard deduction − visitor-entered eligible deductions)`

Entered deductions stay a **separate** step after the salary standard deduction. They are not a second standard deduction.

**New regime**

`taxable income = max(0, salary − new salary standard deduction)`

The generic old-regime deduction field is still **not** applied.

## 2. Updated comparison behavior

`compareRegimeEstimates` still uses the **same salary input** for both paths. Each path now takes its own salary standard deduction:

| Same salary | New regime | Old regime |
|---|---|---|
| ₹10,00,000 | ₹75,000 | ₹50,000 |
| ₹18,00,000 | ₹75,000 | ₹50,000 |
| ₹50,000 | ₹50,000 (capped at salary) | ₹50,000 (capped at salary) |

The selected-regime breakdown always shows **Salary standard deduction** as a currency amount, not “Not applied”.

## 3. Tests / results

| Vector | Result |
|---|---|
| Old salary ₹40,000 | SD ₹40,000, taxable ₹0 |
| Old salary ₹50,000 | SD ₹50,000, taxable ₹0 |
| Old salary ₹5,00,000 | SD ₹50,000 before other deductions, taxable ₹4,50,000 |
| Old ₹5,00,000 + entered ₹1,00,000 | SD ₹50,000 + other ₹1,00,000, taxable ₹3,50,000 (not duplicated) |
| New salary ₹50,000 | SD ₹50,000, taxable ₹0 |
| New salary ₹75,000 | SD ₹75,000, taxable ₹0 |
| New salary ₹10,00,000 | SD ₹75,000, taxable ₹9,25,000 |
| Compare ₹10,00,000 | new SD ₹75,000, old SD ₹50,000 |
| Negative / NaN / Infinity | blocked |

Approved 87A rebate, 87A marginal relief, slabs, cess, ₹50 lakh cap, and special-rate exclusion are unchanged.

| Command | Result |
|---|---|
| `validate:income-tax` | Passed **316** checks |
| `validate:calculators` | Passed |
| `validate:trust` | Passed **32** checks |
| `validate:hardening` | Passed **15** checks |
| `lint` | Passed |
| `build` | Passed |

## 4. Files changed

**Modified:** `src/components/IncomeTaxCalculator.jsx`, `src/data/calculatorExplains.js`, `src/data/calculatorInsights.js`, `src/data/calculators.js`, `scripts/validateAllCalculators.js`, `package.json`

**Untracked:** `src/utils/incomeTax/incomeTaxEngine.js`, `src/utils/incomeTax/incomeTaxRules.js`, `scripts/validateIncomeTax.js`

## 5. `git diff --stat`

```
 package.json                           |   1 +
 scripts/validateAllCalculators.js      |  56 +++++-----
 src/components/IncomeTaxCalculator.jsx | 194 +++++++++++++++++++--------------
 src/data/calculatorExplains.js         |  22 ++--
 src/data/calculatorInsights.js         |  37 ++++---
 src/data/calculators.js                |   2 +-
 6 files changed, 173 insertions(+), 139 deletions(-)
```

Untracked files are not in `git diff --stat`.

## 6. `git status`

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

no changes added to commit
```

INCOME TAX P0 SALARY STANDARD DEDUCTION:  
READY FOR FINAL COMMIT REVIEW