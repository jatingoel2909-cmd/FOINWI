PPF P1 is implemented, uncommitted, and the required validators all pass.

## 1. Pre-work git status

Clean at `9134e6e` (`Correct EPF calculator for current statutory assumptions`), branch `main`, in sync with `origin/main`. Implementation proceeded.

## 2. Files changed

**Modified**
- `package.json`
- `scripts/validateAllCalculators.js`
- `src/components/PpfCalculator.jsx`
- `src/data/calculatorExplains.js`
- `src/data/calculatorInsights.js`
- `src/data/calculators.js`
- `src/data/journeys.js`
- `src/intelligence/knowledge/financialConcepts.js`

**Untracked**
- `scripts/validatePpf.js`
- `src/utils/ppf/ppfRules.js`
- `src/utils/ppf/ppfEngine.js`

Not committed. Not pushed.

## 3. Exact PPF product scope

Educational PPF accumulation estimate using an annual contribution assumed deposited on or before 5 April of each financial year and a constant illustrative interest-rate assumption.

Not an official passbook, not an exact statutory maturity calculation, not a promise of future returns, not tax advice. Default path: one account, uninterrupted annual contributions, no loans, no withdrawals, no premature closure, no missed years, no extension-block adjudication.

## 4. Centralized formula / engine

UI and `validatePpf.js` both call `calculatePpfEstimate` in `src/utils/ppf/ppfEngine.js`. The formula is not duplicated in the validator.

Year-by-year (preferred method):

```
balance = 0
for each contribution year:
  balance += annualContribution
  if rate > 0: balance += balance × illustrativeAnnualRate
```

At 0%: `annualContribution × contributionYears`.

## 5. Deposit limits

- Min ₹500, max ₹1,50,000, step **₹50** (UI step changed from ₹500)
- ₹500 / ₹1,50,000 / ₹550 accepted
- ₹501 → ₹500 (nearest ₹50)
- below ₹500 → ₹500
- above ₹1,50,000 → ₹1,50,000
- NaN / Infinity / negative → 0
- Aggregation disclosure shown; **no** family/account aggregation math

## 6. Rate wording

Default **7.1%**, labelled **Illustrative interest rate assumption**. Helper names **1 July–30 September 2026** and quarterly change. Rate stays editable. No guaranteed / fixed / expected / 15-year rate claim.

## 7. Deposit-timing assumption

Stated on the calculator: full yearly contribution on or before 5 April. Interest method: lowest balance between close of 5th day and month-end, credited annually; later deposits can reduce interest. Not described as monthly compounding. Arbitrary deposit dates are not modelled.

## 8. Maturity / tenure treatment

Input is **Contribution years**, locked to **15**. Primary result is **Estimated PPF balance**. Statutory FY-end maturity disclosure is shown. No personal maturity date.

## 9. Extension treatment

16–50 year slider removed. Extension is **not modelled**. Copy states continuation after maturity operates in 5-year blocks, subject to applicable rules, and this calculator does not determine eligibility.

## 10. Tax wording changes

Calculator / card / explains / insights / PPF journey cards / PPF concept description: no “tax-efficient” / “80C-linked” universal claim. Preferred: *Tax treatment can depend on the applicable income-tax rules and tax regime. This calculator does not estimate tax benefits.* Unrelated site-wide tax content was not modified.

## 11. Loans / withdrawals disclosure

Shown: *This estimate assumes no loans, withdrawals, premature closure or missed annual contributions.* Not calculated.

## 12. Deterministic vectors

Constant 7.1%, 15 contribution years, on/before-5-April model (`Math.round`; ₹10 tolerance vs audit targets):

| Input | Engine | Audit target |
|---|---|---|
| ₹500 | **₹13,561** | ₹13,561 |
| ₹1,00,000 | **₹27,12,139** | ₹27,12,143 (₹4) |
| ₹1,50,000 | **₹40,68,209** | ₹40,68,215 (₹6) |
| ₹1,50,000 @ 0% | **₹22,50,000** | ₹22,50,000 |

The ₹4 / ₹6 gaps are IEEE float rounding, not a different model.

## 13. `validate:ppf` result

Passed: **163 checks**.

## 14. All regression results

| Command | Result |
|---|---|
| `npm run validate:ppf` | passed (163) |
| `npm run validate:calculators` | passed (includes PPF via the same engine) |
| `npm run validate:trust` | passed (32) |
| `npm run validate:hardening` | passed (15) |
| `npm run lint` | passed |
| `npm run build` | passed (existing >500 kB chunk warning) |

Live browser click-through was not possible here: the IDE browser and a local HTTP fetch could not reach `localhost:5173`. Copy, labels, and engine behaviour were verified through the validators and source.

## 15. Remaining limitations

- Not a passbook / 5th-day monthly engine for arbitrary deposit dates
- No personal maturity date (no opening-date input)
- No 5-year extension-block modelling
- No loans, withdrawals, defaults, or aggregation math
- No tax estimate
- Constant illustrative rate, not a path of future notified rates
- Display uses rupee rounding (`formatCurrency`)

## 16. `git diff --stat`

```
 package.json                                    |   1 +
 scripts/validateAllCalculators.js               |  30 ++++--
 src/components/PpfCalculator.jsx                | 129 +++++++++++++++---------
 src/data/calculatorExplains.js                  |  24 ++---
 src/data/calculatorInsights.js                  |  30 +++---
 src/data/calculators.js                         |   2 +-
 src/data/journeys.js                            |   4 +-
 src/intelligence/knowledge/financialConcepts.js |   2 +-
 8 files changed, 138 insertions(+), 84 deletions(-)
```

Plus untracked: `scripts/validatePpf.js`, `src/utils/ppf/ppfEngine.js`, `src/utils/ppf/ppfRules.js`.

## 17. Final git status

On `main`, up to date with `origin/main`. The eight modified files and three untracked files above are **unstaged**. Nothing committed or pushed.

---

PPF P1 CORRECTION:  
READY FOR CTO REVIEW