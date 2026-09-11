Section 87A **marginal relief is now estimated in the centralized engine**. The temporary “Not estimated in this range” workaround around ₹12 lakh is gone. Nothing was committed or pushed.

## 1. Exact marginal-relief formula

For **eligible normal-rate income** under the **new regime** (this calculator’s salary / slab-rate model only):

If `taxableIncome > ₹12,00,000`:

1. Compute normal **slab tax**.
2. `excessIncome = taxableIncome − 12,00,000`
3. If `slabTax > excessIncome`:  
   `marginalRelief = slabTax − excessIncome`  
   else `marginalRelief = 0`
4. **Tax before cess** = `slabTax − ordinary 87A rebate − marginalRelief`  
   Ordinary rebate is **₹0** above ₹12,00,000, so tax before cess is `min(slabTax, excessIncome)`.
5. **4% Health & Education Cess** is applied **after** rebate / marginal relief.

Ordinary **Section 87A rebate** still applies at or below ₹12,00,000 (capped at slab tax, new-regime max ₹60,000). Rebate and marginal relief do not both apply.

Special-rate income (for example capital gains) remains **outside calculator scope**.

## 2. Boundary where it ceases

Relief applies while **slab tax > excess income**.

In the 15% band: `slabTax = 60,000 + 0.15 × (taxableIncome − 12,00,000)`.  
That stops exceeding excess income at:

**`taxableIncome = ₹12,70,589`** (first integer rupee)

| Taxable income | Marginal relief |
|---|---|
| ₹12,70,588 | Applies (~₹0.20) |
| **₹12,70,589** | **Does not apply** |
| ₹12,70,590 and above | Does not apply |

₹16,00,000: slab tax ₹1,20,000 is already below excess ₹4,00,000, so no relief.

## 3. Test vectors (central engine)

| Taxable income | Ordinary 87A rebate | Marginal relief | Tax before cess | Cess | Estimated total |
|---|---|---|---|---|---|
| ₹12,00,000 | ₹60,000 | ₹0 | ₹0 | ₹0 | ₹0 |
| ₹12,00,001 | ₹0 | ₹59,999.15 | ₹1 | ₹0.04 | ₹1.04 |
| ₹12,10,000 | ₹0 | ₹51,500 | ₹10,000 | ₹400 | ₹10,400 |
| ₹12,50,000 | ₹0 | ₹17,500 | ₹50,000 | ₹2,000 | ₹52,000 |
| ₹12,70,588 | ₹0 | ~₹0.20 | ₹70,588 | after relief | complete |
| ₹12,70,589 | ₹0 | ₹0 | ₹70,588.35 | 4% of that | complete |
| ₹12,70,590 | ₹0 | ₹0 | ₹70,588.50 | 4% of that | complete |
| ₹16,00,000 | ₹0 | ₹0 | ₹1,20,000 | ₹4,800 | ₹1,24,800 |

Also asserted: `marginalRelief >= 0`, `marginalRelief <= slabTax`, no relief at or below ₹12L, cess after rebate/relief, special-rate income not modelled. Validators call the engine; they do not re-implement the relief formula.

## 4. Files changed

**Modified**
- `src/components/IncomeTaxCalculator.jsx`
- `src/data/calculatorExplains.js`
- `src/data/calculatorInsights.js`
- `src/data/calculators.js` *(AY 2026-27 card copy from earlier P0)*
- `scripts/validateAllCalculators.js`
- `package.json` *(validate:income-tax from earlier P0)*

**Untracked**
- `src/utils/incomeTax/incomeTaxEngine.js`
- `src/utils/incomeTax/incomeTaxRules.js`
- `scripts/validateIncomeTax.js`

UI now always shows: slab tax, Section 87A rebate, Section 87A marginal relief, tax after rebate/relief, cess, estimated total tax.

## 5. Validator results

| Command | Result |
|---|---|
| `validate:income-tax` | Passed **218** checks |
| `validate:calculators` | Passed (all 20, including Income Tax) |
| `validate:trust` | Passed **32** checks |
| `validate:hardening` | Passed **15** checks |
| `lint` | Passed |
| `build` | Passed |

## 6. `git diff --stat`

```
 package.json                           |   1 +
 scripts/validateAllCalculators.js      |  55 +++++-----
 src/components/IncomeTaxCalculator.jsx | 191 +++++++++++++++++++--------------
 src/data/calculatorExplains.js         |  22 ++--
 src/data/calculatorInsights.js         |  35 +++---
 src/data/calculators.js                |   2 +-
 6 files changed, 168 insertions(+), 138 deletions(-)
```

Untracked files are not in `git diff --stat`.

## 7. `git status`

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

INCOME TAX 87A MARGINAL RELIEF: READY FOR CTO REVIEW