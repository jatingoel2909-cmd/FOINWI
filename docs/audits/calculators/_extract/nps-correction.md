NPS P1 CORRECTION:  
READY FOR CTO REVIEW

No commit. No push.

---

**1. Pre-work Git status**

Clean `main` at `6463cb3 Correct HRA calculator for FY 2026-27 rules`.

**2. Files changed**

New:
- `src/utils/nps/npsRules.js`
- `src/utils/nps/npsEngine.js`
- `scripts/validateNps.js`

Updated:
- `src/components/NpsCalculator.jsx`
- `scripts/validateAllCalculators.js`
- `package.json` (`validate:nps`)
- Direct NPS copy in `calculators.js`, `calculatorExplains.js`, `calculatorInsights.js`, `journeys.js`, `learnAcademy.js`, `financialConcepts.js`, `guideIntents.js`, `guideResources.js`, `dailyInsights.js`, `recommendationRules.js`

**3. Locked subscriber / exit scope**

Educational **non-Government / All Citizen Model / Common Scheme / Tier-I / normal-exit** illustration. Illustrated exit age **≥ 60**. The 20%/80% split is applied **only when projected corpus > ₹12 lakh**.

Out of scope, and disclosed as such: Government-sector, Government-company corporate exit, NPS-Lite / Swavalamban, Vatsalya, MSF, premature exit, death, corpus ≤ ₹12 lakh bands, deferment to 85, existing PRAN balance, employer contributions, tax computation, ASP quotes.

**4. Accumulation formula**

Unchanged beginning-of-month identity:

- `months = years × 12`
- `monthlyRate = annualReturnPercent / 12 / 100`
- if rate = 0: `monthlyContribution × months`
- else: `monthlyContribution × [((1 + monthlyRate)^months − 1) / monthlyRate] × (1 + monthlyRate)`

**5. Contribution timing**

Level **beginning-of-month** monthly contributions. Zero opening balance. Not NAV-path performance.

**6. Market-linked return treatment**

Removed **Expected Return (%)**.  
Label is **Illustrative market-linked return assumption (%)**, default **10%** as an editable illustration only. Helper states NPS returns are market-linked and the figure is not guaranteed.

**7. Age validation**

Removed `years = max(exitAge − currentAge, 1)`.

Engine requires `currentAge < exitAge` and `exitAge ≥ 60`. Invalid combinations return `valid: false` and **no financial projection**. Product UI window is 18–59 / 60–70 and is labelled as illustration limits, not the statutory 18–85 window.

**8. Corpus > ₹12 lakh guard**

If projected corpus **≤ ₹12 lakh**, accumulation still shows. Exit split and annuity income are suppressed, with:

> Current NPS exit options differ for corpus up to ₹12 lakh. This simplified exit illustration models only projected corpus above ₹12 lakh.

₹8 lakh / ₹8–12 lakh bands are not implemented.

**9. 20% minimum-annuity treatment**

For the locked scope and corpus > ₹12 lakh, **20% is the statutory minimum**, not a recommended personal choice. Helper and results say that explicitly. Default allocation is 20%. Inputs below 20% clamp to 20%; above 100% clamp to 100%.

**10. Annuity-allocation input**

New **Illustrative annuity allocation (%)**, range **20–100**.

- Annuity amount = corpus × allocation%
- Non-annuity portion = corpus − annuity amount  
Not labelled tax-free.

**11. Annuity-rate assumption**

Silent 6% removed. New **Illustrative annuity-rate assumption (%)**, default **6%** only as a starting illustration. Helper states it is not a statutory NPS rate and not an ASP quote.

**12. Result structure**

Separated:
1. Estimated projected NPS corpus  
2. Total illustrated contributions  
3. Illustrative non-annuity portion  
4. Illustrative amount allocated to annuity  
5. Illustrative monthly annuity income  

**Est. Monthly Pension** and **Corpus at Retirement** are gone.

**13. Tax treatment**

No tax engine. Copy: *This calculator does not compute tax. NPS contribution deductions and exit treatment depend on the applicable tax year and tax regime.* No 60%/80% tax-free, EEE, or ₹50,000 benefit claims. Removed “Not claiming additional tax deduction where eligible.”

**14. Special-case disclosures**

On-page: Government-sector, premature exit, death, smaller corpus bands, MSF, and other NPS cases are outside this illustration. Also: fees/NAV/employer/opening balance not modelled.

**15. Deterministic vectors** (`npsEngine` imported)

| Case | Result |
|---|---|
| ₹5,000 / 10% / 30 years | corpus **₹1,13,96,626.62**; contributed **₹18,00,000**; 20% annuity **₹22,79,325.32** |
| Zero contribution | corpus 0; split suppressed |
| Zero return | **₹18,00,000** |
| One year | **₹63,351.41** (unrounded identity; audit’s ≈ ₹63,351.55 was the rounded figure) |
| Inverted ages | invalid; **not** forced to 1 year |
| Exit age < 60 | invalid |
| Corpus ≤ ₹12 lakh | accumulation only; no 20%/80% split |
| 20% / 100% allocation | corpus × 0.20 / whole corpus |
| Allocation 10% | clamped to 20% |
| 0% annuity rate | monthly annuity 0 |
| 6% annuity rate | allocation × 0.06 / 12 |
| NaN / Infinity / negative money | finite 0 normalisation |

**16. `validate:nps`**

**125 checks passed.**

**17. Regression**

- `validate:calculators` — all passed (NPS now calls `calculateNpsEstimate`)
- `validate:trust` — 32 checks passed
- `validate:hardening` — 15 checks passed
- `lint` — passed
- `build` — passed

Live browser check of `http://localhost:5173/nps-calculator` could not reach localhost from this environment (same as the earlier PPF pass). Behaviour was verified through the production engine tests and source wiring.

**18. Remaining limitations**

No existing balance, employer contribution, charges, NAV path, Government/MSF/premature/death paths, or ₹8 lakh / ₹8–12 lakh bands. Annuity income is not an ASP quote. Tax is not computed. Product age/contribution caps are illustration limits.

**19. `git diff --stat`**

13 modified files, **216 insertions / 95 deletions**, plus untracked `scripts/validateNps.js` and `src/utils/nps/`.

**20. Final git status**

On `main`, still at `6463cb3`. Changes are **unstaged / untracked**. Nothing committed. Nothing pushed.