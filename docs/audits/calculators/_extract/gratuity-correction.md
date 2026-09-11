The gratuity calculator is now a scoped, educational Act-based estimate for a monthly-rated employee. Nothing was committed or pushed.

## 1. Files changed

**Modified**
- `src/components/GratuityCalculator.jsx`
- `src/data/calculatorExplains.js`
- `src/data/calculatorInsights.js`
- `src/data/calculators.js`
- `scripts/validateAllCalculators.js`
- `package.json`

**Untracked**
- `src/utils/gratuity/gratuityRules.js`
- `src/utils/gratuity/gratuityEngine.js`
- `scripts/validateGratuity.js`

## 2. Exact formula

For a monthly-rated employee:

`qualifyingYears = completedYears + (additionalMonths > 6 ? 1 : 0)`

`uncappedGratuity = (lastDrawnBasicPlusDA × 15 × qualifyingYears) / 26`

`statutoryGratuity = min(uncappedGratuity, ₹20,00,000)`

## 3. Wage basis

**Last drawn Basic + DA** for a monthly-rated employee. The UI states this is not full salary or gross salary.

## 4. Service-year / month handling

Service is captured as:

- completed years (whole years, 0–40)
- additional months (0–11)

Exactly 6 additional months does **not** add a year. More than 6 months adds one qualifying year. Decimal years are not used or rounded.

## 5. Five-year eligibility

Ordinary retirement / resignation / superannuation:

- completed years **< 5** → no payable amount is shown
- completed years **= 5** → eligible under the general rule

Eligibility uses **completed years**, not formula qualifying years. Example: 4 years 7 months becomes 5 qualifying years for the 15/26 math, but is still not shown as normally eligible.

## 6. Death / disablement disclaimer

Shown when the general five-year rule is not met:

“Under the general rule, five years of continuous service is required. The five-year condition does not apply in certain cases such as death or disablement.”

Those exceptions are **not** calculated.

## 7. ₹20 lakh ceiling

If uncapped gratuity is above ₹20,00,000, the statutory estimate is capped at ₹20,00,000 and the UI states that cap. The ceiling is shown even when the estimate is below it.

## 8. Better-terms disclaimer

Always shown:

“Better gratuity terms may apply under an award, agreement or employment contract.”

₹20 lakh is not described as an absolute private maximum.

## 9. Test vectors / results

| Vector | Result |
|---|---|
| ₹50,000, 5y 0m | Qualifying 5, estimated ₹1,44,230.77 |
| 10y 6m | Qualifying **10** |
| 10y 7m | Qualifying **11** |
| 10y 11m | Qualifying **11** |
| 4y ordinary exit | Not eligible, estimated `null` |
| 5y exactly | Eligible under the general rule |
| ₹50,000 × 10y | Below ceiling, unchanged |
| Constructed exact ₹20L | ₹20,00,000 |
| ₹5,00,000 × 40y | Uncapped ~₹1.15 cr, statutory **₹20,00,000** |
| Zero / invalid wages | ₹0, no NaN / Infinity |
| Negative inputs | Collapsed to 0 |

The old tautological `assert(0 === 0)` below-five-year check is gone.

## 10. Validation results

| Command | Result |
|---|---|
| `validate:gratuity` | Passed **211** checks |
| `validate:calculators` | Passed |
| `validate:trust` | Passed **32** checks |
| `validate:hardening` | Passed **15** checks |
| `lint` | Passed |
| `build` | Passed |

## 11. Remaining limitations

- Monthly-rated employee only
- Ordinary retirement / resignation / superannuation only
- Seasonal, piece-rated, forfeiture, nomination, and contract-enhanced formulas are not modelled
- Death / disablement is a disclaimer, not a separate calculation path
- Continuous-service adjudication (for example 240-day questions) is not modelled
- Display currency still rounds to whole rupees

## 12. `git diff --stat`

```
 package.json                          |   1 +
 scripts/validateAllCalculators.js     |  44 ++++++++++++--
 src/components/GratuityCalculator.jsx | 111 +++++++++++++++++++++++++---------
 src/data/calculatorExplains.js        |  21 ++++---
 src/data/calculatorInsights.js        |  44 ++++++++++----
 src/data/calculators.js               |   2 +-
 6 files changed, 170 insertions(+), 53 deletions(-)
```

Untracked files are not in `git diff --stat`.

## 13. `git status`

```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
	modified:   package.json
	modified:   scripts/validateAllCalculators.js
	modified:   src/components/GratuityCalculator.jsx
	modified:   src/data/calculatorExplains.js
	modified:   src/data/calculatorInsights.js
	modified:   src/data/calculators.js

Untracked files:
	scripts/validateGratuity.js
	src/utils/gratuity/

no changes added to commit
```

GRATUITY P1 CORRECTION:  
READY FOR CTO REVIEW