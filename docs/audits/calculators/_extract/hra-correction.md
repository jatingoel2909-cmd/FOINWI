HRA P1 is implemented against Rule 279 / section 202 for FY 2026-27. Nothing was committed or pushed.

## 1. Pre-work git status

Clean at `0b8c461` (`Correct PPF calculator assumptions and trust wording`), branch `main`, in sync with `origin/main`. Implementation proceeded.

## 2. Files changed

**Modified:** `package.json`, `scripts/validateAllCalculators.js`, `src/components/HraCalculator.jsx`, `src/data/calculatorExplains.js`, `src/data/calculatorInsights.js`, `src/data/calculators.js`, `src/data/journeys.js`, `src/data/learnAcademy.js`, `src/intelligence/guide/guideIntents.js`, `src/intelligence/guide/guideResources.js`, `src/intelligence/insight/dailyInsights.js`, `src/intelligence/knowledge/financialConcepts.js`, `src/intelligence/recommendation/recommendationRules.js`, `src/utils/missionHelpers.js`

**Untracked:** `scripts/validateHra.js`, `src/utils/hra/hraRules.js`, `src/utils/hra/hraEngine.js`

Income-tax calculator was not changed.

## 3. Exact product scope

Educational monthly estimate of House Rent Allowance exemption for FY 2026-27 for a person who has opted out of the default tax regime under section 202.

Not tax advice, tax payable, tax saved, employer TDS, or an eligibility adjudicator.

## 4. Current legal basis represented

Income-tax Act, 2025; Income-tax Rules, 2026, Rule 279; section 202 regime treatment; FY / tax year 2026-27 (AY 2027-28). Section 10(13A) / Rule 2A are not presented as the current basis.

## 5. Centralized formula

UI and validators call `calculateHraEstimate` in `src/utils/hra/hraEngine.js`.

```
rule279Salary = basic + qualifyingDA
rentLimb = max(0, rentPaid − 10% × rule279Salary)
cityLimb = 50% or 40% of rule279Salary
exemption = max(0, min(hraReceived, rentLimb, cityLimb))
taxableHra = max(0, hraReceived − exemption)
```

Non-finite / negative amounts normalize to 0.

## 6. Salary definition

Rule 279 salary = monthly basic + monthly qualifying DA. Other allowances and perquisites are excluded. Commission is not collected.

## 7. DA treatment

Default ₹0. Helper: include DA only where it is provided for under the terms of employment for Rule 279 salary.

## 8. City treatment

Generic Metro / Non-Metro removed.

- **50% cities:** Mumbai, Kolkata, Delhi, Chennai, Hyderabad, Pune, Ahmedabad and Bengaluru  
- **Any other place (40%):** including Gurugram and Noida  

Bengaluru → 50%. Gurugram → 40%. Generic `"metro"` does not map to 50%.

## 9. Regime treatment

No regime selector. The calculator is labelled **HRA exemption — opt-out regime estimate**. Copy states the exemption is **not available under the default tax regime under section 202**.

## 10. Monthly / relevant-period treatment

All money inputs and both results are labelled monthly. No silent annualisation. Rule 279 relevant-period note: if salary, HRA, rent or residence changes during the year, calculate those periods separately.

## 11. Occupancy / rent disclosure

Assumes actual rent for occupied accommodation. If no rent is paid, or the visitor lives in accommodation owned and occupied by them, exemption is not available under this estimate. Parent/spouse rent and other-property ownership are not adjudicated.

## 12. PAN / Form 124 treatment

Not in the formula. Information note only: Form 124 landlord PAN where aggregate rent in the tax year exceeds ₹1,00,000, plus landlord details and relationship, if any. Documentation/evidence, not a fourth Rule 279 limb.

## 13. Result terminology

Primary: **Estimated monthly HRA exemption**  
Secondary: **Monthly taxable HRA** (HRA received minus estimated exempt HRA for the scoped month; not total taxable income)

No tax saved / guaranteed tax saving / exact exemption.

## 14. Deterministic vectors

| Case | Result |
|---|---|
| HRA limiting (8,000 / 18,000 / 50% city) | exemption **₹8,000** |
| Rent limb (20,000 / 18,000 / 50% city) | exemption **₹13,000**, taxable **₹7,000** |
| 50% city limb | exemption **₹25,000** |
| 40% place limb | exemption **₹20,000** |
| Rent below 10% | exemption **₹0** |
| Zero rent / zero HRA | exemption **₹0** |
| Bengaluru | 50% category |
| Gurugram | 40% category |
| DA ₹10,000 | Rule 279 salary **₹60,000**, rent limb **₹12,000**, exemption **₹12,000** |
| NaN / Infinity / negative | normalize to 0 |

## 15. `validate:hra`

Passed: **187 checks**.

## 16. All regressions

| Command | Result |
|---|---|
| `npm run validate:hra` | passed (187) |
| `npm run validate:calculators` | passed (HRA uses the same engine) |
| `npm run validate:trust` | passed (32) |
| `npm run validate:hardening` | passed (15) |
| `npm run lint` | passed |
| `npm run build` | passed (existing >500 kB chunk warning) |

## 17. Remaining limitations

- One labelled month only; mid-year splits are not calculated  
- Commission is not in Rule 279 salary  
- No parent/spouse/other-property adjudication  
- Form 124 PAN does not change the number  
- Not tax payable, not employer TDS  
- Income-tax calculator remains FY 2025-26 (unchanged, as required)

## 18. `git diff --stat`

```
 package.json                                       |   1 +
 scripts/validateAllCalculators.js                  |  29 +++-
 src/components/HraCalculator.jsx                   | 173 ++++++++++++++-------
 src/data/calculatorExplains.js                     |  22 +--
 src/data/calculatorInsights.js                     |  41 +++--
 src/data/calculators.js                            |   2 +-
 src/data/journeys.js                               |   6 +-
 src/data/learnAcademy.js                           |  10 +-
 src/intelligence/guide/guideIntents.js             |   2 +-
 src/intelligence/guide/guideResources.js           |   2 +-
 src/intelligence/insight/dailyInsights.js          |   6 +-
 src/intelligence/knowledge/financialConcepts.js    |   2 +-
 src/intelligence/recommendation/recommendationRules.js |   2 +-
 src/utils/missionHelpers.js                        |   4 +-
 14 files changed, 191 insertions(+), 111 deletions(-)
```

Plus untracked: `scripts/validateHra.js`, `src/utils/hra/`.

## 19. Final git status

On `main`, up to date with `origin/main`. Fourteen modified files and the untracked HRA engine/validator files remain **unstaged**. Nothing committed or pushed.

---

HRA P1 CORRECTION:  
READY FOR CTO REVIEW