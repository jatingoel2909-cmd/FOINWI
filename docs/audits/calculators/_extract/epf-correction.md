The EPF calculator is now a scoped educational estimator: statutory-ceiling contributions, EPS kept out of the corpus, and 8.25% labelled as the last verified FY 2024-25 assumption.

## 1. Files changed

**New**
- `src/utils/epf/epfRules.js`
- `src/utils/epf/epfEngine.js`
- `scripts/validateEpf.js`

**Updated**
- `src/components/EpfCalculator.jsx`
- `src/data/calculators.js`
- `src/data/calculatorInsights.js`
- `src/data/calculatorExplains.js`
- `scripts/validateAllCalculators.js`
- `package.json` (`validate:epf`)
- `src/utils/calculatorFormat.js` (percent display now keeps 2 decimals so **8.25%** does not render as 8.3%)

## 2. Exact scope

Educational estimate for a **standard already-enrolled EPF/EPS member** in a **general 12% establishment**.

Outside scope, stated in the UI: 10% classes, new joiner above ₹15,000 with no EPS, higher-wage option, VPF, higher-pension joint option, age-exit EPS, EDLI, admin charges, payroll reconstruction, tax, withdrawals.

## 3. Contribution formula

```text
contributionWage = min(monthlyPFWages, 15000)
employeeEPF     = roundContribution(contributionWage × 12%)
employerTotal   = roundContribution(contributionWage × 12%)
employerEPS     = roundContribution(contributionWage × 8.33%)
employerEPF     = employerTotal − employerEPS
monthlyEpf      = employeeEPF + employerEPF   // EPS excluded
```

12% is described as **current EPFO operational treatment**, not as a freshly notified Scheme 2026 rate.

## 4. Rounding

Nearest rupee; ₹0.50 or more rounds up. Implemented with integer-fraction rates (`12/100`, `833/10000`) plus a half-up rule with a small float tolerance. Not `Math.round` on the rupee amount.

## 5. ₹15,000 ceiling

Default statutory mode always uses `min(PF wages, 15000)`. UI shows PF wages entered, contribution wage used, and the statutory ceiling (S.O. 2702(E), 29 May 2026). ₹30,000 input still contributes as ₹15,000.

## 6. EPS treatment

Shown as **Employer EPS diversion**. It is **not** added to the projected EPF balance. Only residual employer EPF enters the corpus.

## 7. Interest-rate wording

Default **8.25%**, labelled **Illustrative EPF interest assumption**. Helper: last Government-approved/notified rate verified for **FY 2024-25**. Not called guaranteed, future, or FY 2025-26 notified. Still editable.

## 8. Projection methodology

Month-by-month: add `employeeEPF + employerEPF`, then apply `rate/12` to the running balance. Labelled as a **simplified monthly running-balance approximation** with a constant illustrative annual rate. Not presented as an EPFO passbook.

## 9. Legal / framework wording

Positioned under the **Code on Social Security, 2020** and current EPFO operational treatment. Scheme 2026 is mentioned as issued; unread G.S.R. 525(E) clauses are not quoted.

## 10. Test vectors / results

| Vector | Result |
|---|---|
| PF wages ₹10,000 | wage 10,000; employee 1,200; employer 1,200; EPS 833; employer EPF 367 |
| PF wages ₹15,000 | wage 15,000; employee 1,800; employer 1,800; EPS 1,250; employer EPF 550 |
| PF wages ₹30,000 | contribution wage stays 15,000; same as ₹15,000 row |
| ₹0 / negative / NaN / Infinity | normalized; finite, nonnegative |
| Zero remaining years | existing balance preserved |
| Rounding | 1.49→1, 1.50→2, 1249.50→1250 |

Browser check: default ₹30,000 showed 1,800 / 1,800 / 1,250 / 550 / 2,350. Changing wages to ₹10,000 showed 1,200 / 1,200 / 833 / 367 / 1,567.

## 11. Validator results

- `validate:epf` — **260 checks passed**
- `validate:calculators` — passed (EPF now calls the real engine)
- `validate:trust` — passed
- `validate:hardening` — passed
- `lint` — passed
- `build` — passed

## 12. Remaining limitations

- 12% is operational, not re-read from Scheme 2026
- FY 2025-26 interest still not treated as notified
- No VPF / higher-wage / 10% / no-EPS joiner modes
- Projection is an educational approximation, not EPFO year-end crediting
- PF wages are visitor-supplied; no payroll add-back

## 13. `git diff --stat`

```
 package.json                      |   1 +
 scripts/validateAllCalculators.js |  25 ++++--
 src/components/EpfCalculator.jsx  | 156 ++++++++++++++++++++++++--------------
 src/data/calculatorExplains.js    |  25 +++---
 src/data/calculatorInsights.js    |  40 +++++-----
 src/data/calculators.js           |   2 +-
 src/utils/calculatorFormat.js     |   2 +-
 7 files changed, 155 insertions(+), 96 deletions(-)
```

Untracked (not in that stat): `scripts/validateEpf.js`, `src/utils/epf/`

## 14. `git status`

On `main`, up to date with `origin/main`. Changes unstaged; new EPF engine/rules/validator untracked. **Nothing committed or pushed.**

EPF P1 CORRECTION:  
READY FOR CTO REVIEW