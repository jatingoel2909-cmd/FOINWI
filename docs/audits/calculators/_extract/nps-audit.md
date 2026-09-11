NPS P1 CURRENT-RULE AUDIT:  
READY FOR CTO REVIEW

Read-only. No files were modified. No commit. No push.

---

## 1. Pre-work Git status / HEAD

```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
HEAD: 6463cb3 Correct HRA calculator for FY 2026-27 rules
```

---

## 2. Current governing NPS framework (September 2026)

| Layer | Current instrument | Date / effect |
|---|---|---|
| Parent statute | PFRDA Act, 2013 (23 of 2013) | Still in force |
| Exit / withdrawal | PFRDA (Exits and Withdrawals under the National Pension System) Regulations, 2015, last amended **20 July 2026** | Parent notification 11 May 2015 |
| Material rule change | **(Amendment) Regulations, 2025** | **w.e.f. 16 December 2025** — this is the amendment that changed non-Government normal-exit from 40% annuity / 60% lump sum to **at least 20% annuity / up to 80% lump sum**, raised small-corpus thresholds, removed the All Citizen 5-year lock-in, and allowed normal exit after **15 years or age 60** (whichever is earlier) |
| Later operational amendment | **(Amendment) Regulations, 2026** | PFRDA page published **20 July 2026**; notification dated **13 July 2026**. Official 2026 text amends Regulation 4A (specific-purpose / third-party operations). It does **not** reverse the 16.12.2025 annuity percentages |
| Subscriber models | Common Schemes and Multiple Scheme Framework (MSF) | MSF for non-Government from **1 October 2025** (PFRDA All Citizen page) |
| Tax year 2026-27 | Income-tax Act, 2025, as amended by Finance Act, 2026 | Default individual computation under **section 202(1)** unless the person opts out under **section 202(4)** |

Do not treat the historical “60% lump sum + 40% annuity for everyone” rule as current universal law.

---

## 3. Current subscriber categories relevant to this calculator

Exit Regulation Ch. II (consolidated 20 July 2026) now classifies subscribers as:

1. **Government sector**
2. **Non-Government sector** (includes All Citizen Model and Corporate)
3. **NPS-Lite / Swavalamban**

FOINWI’s calculator names none of these. It silently behaves like a generic retail “retirement at 60” model: monthly self-contribution, no employer, no existing PRAN balance, one constant return, one annuity split.

That is closest to **non-Government / All Citizen / Common Scheme / Tier-I**, but it is never stated.

---

## 4. Current normal-exit rules

**Non-Government** — Regulation 4(1)(a), Schedule I Table 2 (20 July 2026 consolidation); PFRDA press release 19 December 2025:

Normal exit if the subscriber:

- has subscribed **at least 15 years** (or any higher scheme-stipulated period), **or**
- attains **age 60**, **or**
- superannuates / retires under employment terms

Then, subject to the corpus bands below:

- **at least 20%** of accumulated pension wealth **must** be used to buy an annuity
- the balance may be taken as lump sum, systematic lump-sum withdrawal (SLW), systematic unit redemption (SUR), or other Authority-approved options

A subscriber may remain in the system until **age 85** unless exit is chosen. Deferment of lump sum / annuity is allowed until 85.

**Government** — Regulation 3(1)(a):

- normal exit still requires **at least 40%** annuity
- balance up to 60% as lump sum / SLW / SUR
- automatic continuation until 85 until exit is exercised

**Corporate of a Central/State-owned or Government company:** on superannuation, exit follows Government Regulation 3(1)(a), not the 20% All Citizen rule.

**MSF** (PFRDA All Citizen page): 15-year scheme lock-in; after 15 years, exit follows normal NPS rules. FOINWI does not distinguish MSF from Common Scheme.

---

## 5. Current annuity requirements

Annuity purchase is mandatory on normal exit **except** where a 100% cash / SLW / SUR option applies (section 6).

| Subscriber / event | Minimum annuity | Source |
|---|---|---|
| Non-Government normal exit, corpus **> ₹12 lakh** | **At least 20%** | Reg. 4(1)(a); Table 2 |
| Government normal exit, corpus **> ₹12 lakh** | **At least 40%** | Reg. 3(1)(a) |
| Non-Government premature (before 15 years **and** before 60 / superannuation) | **At least 80%** | Reg. 4(1)(b) |
| Government premature | **At least 80%** | Reg. 3 (premature limb) |
| Death — Non-Government | Annuity **not** mandatory; 100% to nominee / heir; annuity optional | Reg. 4(1)(c) |
| Death — Government | Still a mandatory annuity limb except small-corpus exception | Reg. 3 death limb / Table 1 |
| Joined at/after 60, Non-Government | At least **20%**, unless corpus ≤ ₹12 lakh | Reg. 4(1)(e) |

The subscriber may annuitise **more** than the minimum. The minimum is not a personal retirement decision.

There is **no** statutory annuity *rate*. Annuity income is bought from an IRDAI-regulated, PFRDA-empaneled Annuity Service Provider. Price depends on ASP, age, option (life / joint life / return of purchase price, etc.) and prevailing pricing. PFRDA’s corporate-sector FAQ states that variants and pricing differ by ASP.

---

## 6. Current 100%-withdrawal exceptions / thresholds

**Non-Government normal exit** (Reg. 4(1)(a); Table 2; PFRDA 19.12.2025 press release):

| Accumulated pension wealth | Option |
|---|---|
| **≤ ₹8 lakh** | 100% lump sum or SLW / SUR / other approved options **or** up to 80% + at least 20% annuity |
| **> ₹8 lakh and ≤ ₹12 lakh** | Up to **₹6 lakh** lump sum and the balance as SUR for at least 6 years or annuity **or** up to 80% + at least 20% annuity |
| **> ₹12 lakh** | Up to 80% lump sum; **at least 20%** annuity |

**Non-Government premature:** 100% only if corpus **≤ ₹5 lakh**; otherwise at least 80% annuity.

**Joined at/after 60:** 100% if corpus **≤ ₹12 lakh**.

**Government normal exit:** 100% if corpus **≤ ₹8 lakh**; ₹8–12 lakh band uses the ₹6 lakh + SUR structure; above ₹12 lakh remains 40% annuity minimum.

**NPS-Lite / Swavalamban:** different bands (press release: 100% if ≤ ₹2 lakh on normal exit). Out of FOINWI scope.

**Historical ₹2 lakh / ₹2.5 lakh / ₹5 lakh “full withdrawal” figures are outdated** for All Citizen / Corporate Common Scheme normal exit.

---

## 7. Current tax treatment relevant to FOINWI (tax year 2026-27)

FOINWI does **not** compute tax. That is the correct product instinct. Do not add a tax engine in P1.

Verified from the official Income-tax Act, 2025 (Income Tax Department PDF, as amended by Finance Act, 2026):

**Contributions**

- **Section 124(1):** employer contribution deductible to the employee up to **14%** of salary (Central/State Government employer) or **10%** (other employer).
- **Section 124(2):** if total income is charged under **section 202(1)** (default / “new” regime), the 10% cap in 124(1)(b) is read as **14%**.
- **Section 124(3):** additional individual deduction, **not exceeding ₹50,000**, for the individual’s own deposit in a notified pension scheme.
- **Section 124(4):** parent/guardian deposit for a minor is included, aggregate still ₹50,000.
- **Section 124(5) / (10):** no double claim with **section 123**.
- **Section 123:** ₹1,50,000 basket (Schedule XV). Section 124 itself refers to **Schedule XV paragraph 1(y)** as the overlapping pension-scheme item.

**Default regime vs opt-out**

- **Section 202(2)(xii):** under the default section 202(1) computation, Chapter VIII deductions are **not** allowed **other than section 124(1) and 124(2)** (and 125(2) / 146).
- Therefore **section 124(3) ₹50,000 and section 123 ₹1,50,000 are not available in the default regime**. They belong to the opt-out / old-style computation under section 202(4).

**Exit / annuity**

- **Section 124(6):** amount received on closure / opting out, and pension from the annuity bought on that closure, is **deemed income** of that tax year (subject to the exemptions below).
- **Section 124(7):** amount received by the nominee on the assessee’s death under 124(6)(a) is **not** deemed income of the nominee.
- **Section 124(9):** amount used to **purchase an annuity in the same tax year** is **not** deemed received.

**60% lump-sum exclusion (successor to 10(12A))**

The official PDF’s Schedule tables did not extract cleanly here. A third-party Act compilation transcribes **Schedule II, Table Sl. No. 6** as: payment from the National Pension System Trust on closure / opting out of the section 124 scheme, excluded only to the extent it **does not exceed 60% of the total amount payable**.

Treat the **exact schedule/serial citation as not definitively verified** until someone opens the official PDF tables. The policy substance (a 60% *tax-exemption ceiling*, not an NPS withdrawal ceiling) is the 10(12A) successor and must not be written as “60% tax-free NPS”.

**Critical mismatch for copy:** PFRDA can now allow a non-Government subscriber to take **up to 80%** as lump sum. A 60% tax-exemption ceiling, if confirmed, would **not** automatically make an 80% withdrawal tax-free.

**Partial withdrawal:** Schedule III compilations show a 25%-of-own-contribution exclusion (old 10(12B)). Same verification caveat.

**Annuity income:** taxable when received (section 124(6)(b); Income Tax Department pensioner guide also states NPS/annuity pension is taxable).

Do **not** use 80CCD / 80CCD(1B) / 10(12A) as current FY 2026-27 section numbers. The Department’s own “treatment of income” page still cites those 1961 numbers and is **not** a safe current-year source.

---

## 8. Current contribution requirements / limits

Distinguish **NPS account rules** from **tax deduction ceilings**.

**Official current minimum (All Citizen, including Vatsalya and NPS-Lite)**  
PFRDA Circular **PFRDA/2026/16/REG-POP/01 dated 10 March 2026** (supersedes PFRDA/2025/24/REG-POP/05 dated 31.12.2025):

- Minimum **₹250** at onboarding
- Minimum **₹10** for subsequent contributions
- No NPS statutory **maximum** contribution (PFRDA All Citizen page: unlimited contributions, no upper limit)

The 31.12.2025 circular had said there was *no* mandatory minimum except ₹250 where a PoP took a ₹200 first-year charge. The **10 March 2026** circular restored a uniform ₹250 / ₹10 floor and is the later instrument.

**PFRDA FAQ / older Offer Document still listing ₹500 per contribution and ₹1,000 or ₹6,000 a year** look stale against the March 2026 circular. Do not use those FAQ figures as current law without a later circular that restates them.

**Tax ceilings are not NPS investment ceilings.** ₹50,000 (124(3)) and ₹1,50,000 (123) only limit *deduction*, and only in the opt-out regime.

**FOINWI UI**

| Input | Min | Max | Default |
|---|---|---|---|
| Monthly contribution | ₹500 | ₹2,00,000 | ₹5,000 |
| “Expected Return” | 5% | 14% | 10% |
| Current age | 18 | 58 | 30 |
| Retirement age | 40 | 70 | 60 |

₹500/month is a **product floor**, not the current NPS subsequent minimum (₹10). ₹2,00,000/month is a **product cap**, not an NPS statutory maximum. Age 18 is consistent with entry; **58 / 70 are narrower than the current 18–85 entry/continuation window**.

---

## 9. Exact existing FOINWI production formula

All math lives inline in `src/components/NpsCalculator.jsx`. There is no `npsEngine`.

```15:43:src/components/NpsCalculator.jsx
function calculateSipCorpus(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) return monthly * months;

  return (
    monthly *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  );
}
// ...
  const years = Math.max(retirementAge - currentAge, 1);
  const corpus = calculateSipCorpus(monthly, rate, years);
  const totalInvested = monthly * years * 12;
  const estimatedPension = (corpus * 0.4 * 0.06) / 12;
```

In symbols:

- `years = max(retirementAge − currentAge, 1)`
- `n = years × 12`
- `r = annualRate / 12 / 100`
- if `r = 0`: `corpus = monthly × n`
- else: `corpus = monthly × [((1+r)^n − 1) / r] × (1+r)`
- `totalInvested = monthly × years × 12`
- `estimatedPension = corpus × 0.40 × 0.06 / 12`  
  equivalently `estimatedPension = 0.002 × corpus`

UI rounding: `formatCurrency` uses `Intl.NumberFormat("en-IN")` with **0 fraction digits**. The engine itself does not round.

---

## 10. Contribution timing / compounding

The corpus formula is a **level monthly SIP, beginning-of-month (annuity-due)**, with **monthly compounding** of a constant annual rate / 12.

It is **not**:

- annual contributions
- end-of-month SIP (that would omit the final `× (1+r)`)
- NPS unit-allotment timing
- PF/NAV path
- fee-adjusted

Hidden: contributions start from a **zero** corpus; no employer contribution; no PoP / CRA / PF charges (current All Citizen PoP annual charge is **0.20% of AUM** under PFRDA/2026/16).

---

## 11. Current return assumption

- Label: **“Expected Return (%)”**
- Default **10%**
- Slider **5%–14%**
- Applied as a constant annual rate, compounded monthly

This is an **investment-return assumption**, not an NPS interest rate. NPS is market-linked (equity / corporate bonds / G-secs, Active or Auto/lifecycle, or MSF). PFRDA’s own All Citizen page says “market-linked returns based on investment decisions”.

The UI never says “illustrative” or “market-linked” on the return field. `calculatorInsights` calls it “Expected annual return”.

---

## 12. Current annuity allocation assumption

**Hard-coded 40%.** Not an input. Not labelled on the results card.

`calculatorInsights` calls 40% an “illustrative annuity purchase portion”. The live UI does not. The pension number is computed as if 40% were *the* conversion.

For the subscriber type FOINWI actually resembles (non-Government All Citizen):

- current **statutory minimum is 20%**, not 40%, when corpus > ₹12 lakh
- 40% remains the **Government** minimum
- 40% can be a *user* choice above the 20% floor, but FOINWI never offers that choice

FOINWI is silently converting a **former universal statutory minimum** into a **personal retirement decision**.

---

## 13. Current annuity-rate assumption

**Hard-coded 6% a year**, converted monthly as `annuityCorpus × 6% / 12`.

**No statutory basis.** Not in the Exit Regulations, not in the PFRDA Act, not in the Income-tax Act. It is a commercial ASP pricing input that FOINWI treats as a constant.

---

## 14. Current pension formula

```
estimatedPension = (corpus × 0.4 × 0.06) / 12
```

Displayed as **“Est. Monthly Pension”**.

The story line only says: *“The indicative pension uses a simplified annuity assumption on part of the corpus. Actual annuity rates and withdrawal rules can differ.”*

It does not disclose 40%, 6%, subscriber type, corpus thresholds, or that the rate is not an ASP quote.

---

## 15. Current age / period assumptions

- Investment years = `retirementAge − currentAge`, floored at **1**
- Default 30 → 60 = 30 years
- Current age cannot exceed 58; retirement age cannot go below 40
- **Impossible combinations are accepted:** current 58 and retirement 40 still runs as **1 year**
- Age 60 is treated as *the* retirement point
- Current rules: All Citizen normal exit can be **15 years or 60, whichever is earlier**; continuation to **85**; entry **18–85**
- A 30-year-old choosing retirement age 40 (allowed) is a **10-year** horizon. That is **premature** for All Citizen (needs 15 years or age 60), so the legal split is **80% annuity**, not 40%/20%. FOINWI still applies the 40% × 6% pension formula.

Age 60 is **not** universally the only exit point.

---

## 16. Discrepancies

| Topic | Current rule | FOINWI | Severity |
|---|---|---|---|
| Subscriber type | Gov / Non-Gov / Lite differ | Unstated, one formula | P0/P1 |
| Normal-exit annuity | Non-Gov **20%** min; Gov **40%** min | Silent **40%** | **P0** |
| 100% withdrawal | ≤ ₹8 lakh (normal Non-Gov / Gov) | Not modelled; pension still computed | P1 |
| ₹8–12 lakh band | ₹6 lakh + SUR / annuity | Not modelled | P1 |
| Premature exit | 80% annuity | Same 40% formula if years < 15 and exit age < 60 | **P0** |
| Return language | Market-linked | “Expected Return” | P1 |
| 6% annuity | No statutory rate | Silent 6% inside “Est. Monthly Pension” | **P0** |
| Corpus label | Projected accumulation | “Corpus at Retirement” (no “Estimated”) | P2 |
| Entire corpus vs withdrawable | Must split corpus / lump sum / annuity | Only corpus + pension | P1 |
| Tax tip | 124(3) only in opt-out regime | “Not claiming additional tax deduction where eligible” | P1 |
| Journey / health-score | ITA 2025 ss. 123/124 | Still “80C / 80D / NPS” | P2 |
| Learn blurb | Annuity not always mandatory; % depends on category and corpus | “A portion … must be used to purchase an annuity at retirement under current rules” | P1 |
| Contribution min | ₹250 / ₹10 | UI min ₹500 | Acceptable product floor if disclosed |
| Contribution max | None | ₹2,00,000/month | Acceptable product cap if disclosed |
| Age window | 18–85 | 18–58 / 40–70 | P1 |
| Fees | PoP 0.20% AUM + other charges | Ignored | P1 |
| Existing balance / employer | Common in real PRANs | Ignored | P1 |
| Validator | Should import production | Duplicates SIP helper; no exact vectors | P1 |

The corpus **math is internally consistent** with a beginning-of-month SIP. The **legal mapping of that corpus into “monthly pension” is not**.

---

## 17. Deterministic comparison vectors

Independent evaluation of the **production formula** (same identity as `futureValueOfMonthlyDeposits` in `validateAllCalculators.js`). Engine is unrounded; UI rupee-rounds.

| Case | Inputs | Independent corpus | Independent pension (40% × 6% / 12) | Notes |
|---|---|---|---|---|
| Default UI | 5,000 / 10% / 30y | `5000 × [((1+0.10/12)^360−1)/(0.10/12)] × (1+0.10/12)` ≈ **1,13,96,626.62** | ≈ **22,793.25** | Invested = 18,00,000 |
| Zero contribution | 0 / 10% / 30y | **0** | **0** | UI cannot enter 0 (min 500) |
| Zero return | 5,000 / 0% / 30y | **18,00,000** | **3,600** | UI cannot enter 0% (min 5%) |
| One year | 5,000 / 10% / 1y | ≈ **63,351.55** | ≈ **126.70** | 12 beginning-of-month deposits |
| Two years | 5,000 / 10% / 2y | same formula, n=24 | × 0.002 | Confirms multi-period compounding |
| End-of-month counterpart | same as default, omit `×(1+r)` | ≈ **1,13,02,789** | — | Production is **higher** by about one month of growth. FOINWI is beginning-of-month |
| 0% annuity allocation | corpus × 0 × 6% / 12 | same corpus | **0** | Not offered; product *can* permit 0% only in exception bands |
| Scoped Non-Gov statutory min 20% | default corpus × 0.20 × 0.06 / 12 | same | ≈ **11,396.63** | Half of FOINWI’s pension |
| 100% annuity | corpus × 1.00 × 0.06 / 12 | same | ≈ **56,983.13** | Permitted as a *choice* above the minimum |
| 0% illustrative annuity rate | corpus × 0.40 × 0 / 12 | same | **0** | Not offered |
| Zero investment years | years=0 | **0** if formula used raw | **0** | UI forces `years = 1` |
| Inverted ages (58 → 40) | years floored to 1 | ≈ 63,351.55 | ≈ 126.70 | Invalid life event; still paints a “retirement” pension |
| NaN / Infinity | NaN or ∞ monthly or rate | NaN / Infinity | NaN / Infinity | No engine guard; UI `clamp` keeps sliders finite |
| Negative monthly | −5,000 / 10% / 30y | negative corpus | negative pension | UI clamp blocks this |

Rounding rule: **none in the engine**; **nearest rupee in the UI**.

The current NPS validator does **not** assert any of these exact values.

---

## 18. Market-linked-return wording findings

| Surface | Finding |
|---|---|
| Field label “Expected Return (%)” | States expectation as fact. Prefer “Illustrative market-linked return assumption” |
| Page title “Plan your National Pension System corpus” | Planning tone is acceptable; not a guarantee |
| Primary result “Corpus at Retirement” | Reads like a maturity figure. Prefer “Estimated projected NPS corpus” |
| No on-screen market-linked sentence | Missing. Needed: *“NPS returns are market-linked. The return used here is an illustrative assumption for projection only.”* |
| Learn / concepts | Already say “market-linked”. Stronger than the calculator itself |
| “interest rate” | Not used on the NPS calculator. Do not introduce it |
| “guaranteed” / “assured” / “EEE” / “tax-free” | Not used on the calculator UI. Keep it that way |

Stronger wording than the preferred principle is justified because the pension line currently looks like a quoted monthly income.

---

## 19. Tax wording findings

Calculator UI: **no tax figure, no “tax-free”, no “EEE”, no “save ₹50,000”.** Good. Do not add those claims.

Direct NPS-adjacent copy that needs tightening:

- `calculatorExplains.js` beginner mistake: **“Not claiming additional tax deduction where eligible”** — regime-blind. 124(3) is not available under default section 202.
- `journeys.js` save-tax: “Review HRA, **80C, 80D**, and NPS contributions.”
- `healthScoreQuestions.js`: “80C, 80D, and NPS benefits” / “80C + 80D + NPS deductions used”.
- PFRDA’s own All Citizen marketing line still says “Income Tax Act, 1961”. Do not copy it.

Recommended calculator-only caveat, if any:

> “This calculator does not compute tax. NPS contribution deductions and exit treatment depend on the tax year, and on whether income is computed under the default section 202 regime or the opt-out regime.”

---

## 20. Recommended product scope

Narrowest useful current-rule product:

**Educational Tier-I accumulation and normal-exit illustration for a non-Government All Citizen subscriber under Common Scheme (not MSF, not Government, not NPS-Lite, not Vatsalya), who joined before age 60 and is illustrated as exiting at a chosen age of 60 or later, with projected corpus treated as above ₹12 lakh unless a separate exception band is shown.**

Then model only:

**A. Accumulation**  
Monthly contribution, years, illustrative market-linked return. State beginning-of-month monthly compounding. State zero opening balance. State charges are ignored.

**B. Normal-exit illustration (that one category only)**  
- Statutory **minimum** annuity = **20%**  
- User-or-illustrative allocation may be **20% to 100%**  
- Do not treat 20% as the subscriber’s chosen split  
- Explicitly exclude: Government, corporate-of-government-entity, premature exit, death, corpus ≤ ₹12 lakh special bands, MSF lock-in, continuation past the illustrated exit age

**C. Annuity illustration**  
- Separate line: “Amount allocated to annuity (illustration)”  
- Separate line: “Illustrative annuity-rate assumption — not an ASP quote”  
- Separate line: “Illustrative monthly annuity income”  
- Never label the whole corpus as pension, maturity, or tax-free

Do not build tax, premature, death, or Government calculators in P1.

---

## 21. P0 / P1 / P2 changes

### P0

1. **Outdated silent 40% annuity** applied as *the* pension conversion for an unscoped NPS calculator. Current non-Government normal-exit minimum is **20%**. 40% is still the Government minimum. Using 40% without scope **overstates a 20%-minimum pension by 2×** and understates a 100% annuity choice.
2. **Silent 6% annuity rate** inside “Est. Monthly Pension”. No statutory basis. Looks like a quoted NPS pension.
3. **Premature-exit combinations** (retirement age 40–59 with fewer than 15 contribution years) still use the normal-exit 40% formula. Current premature rule is **80% annuity** (unless corpus ≤ ₹5 lakh).
4. Primary result presents **corpus** as if it were a retirement payout, and **pension** as if it were the monthly income from that corpus, without the statutory split.

### P1

1. Declare **one subscriber / exit category** on the page.
2. Disclose market-linked return; rename “Expected Return”.
3. Separate projected corpus / illustrative lump sum / annuity allocation / illustrative annuity income.
4. Age rules: require `retirementAge > currentAge`; for this scope require illustrated exit age **≥ 60** (or separately, contribution years ≥ 15 if you later model that All Citizen path).
5. Centralize engine/rules; stop duplicating the SIP helper in the validator.
6. Disclose ignored items: fees, employer, opening balance, ASP pricing, tax.
7. Fix Learn “must buy an annuity at retirement” so exceptions and the 20%/40% split are not hidden.
8. Regime-qualify the “additional tax deduction” tip, or delete it.
9. Contribution min/max labelled as product limits, not NPS law.

### P2

1. “Corpus at Retirement” → “Estimated projected NPS corpus”.
2. Refresh 80C/80D journey and health-score labels to section 123/124 only if those surfaces are in the same edit pass.
3. Optional later: ₹8 lakh / ₹12 lakh bands, Government toggle, deferment to 85, MSF lock-in, existing corpus.

**Do not implement in this audit.**

---

## 22. Validator weaknesses

`scripts/validateAllCalculators.js` NPS block:

- **Duplicates** `futureValueOfMonthlyDeposits` instead of importing production
- Asserts only: fields exist, values ≥ 0, one high-value case is finite
- **No exact corpus or pension vector**
- **Does not assert 0.4 or 0.06**
- **Does not test** 0 contribution, 0 return, 1 period, inverted ages, 20% vs 40%, NaN
- Tautological: it re-implements the formula, then checks that the re-implementation is a number

`validateLearn` / `validateGuide` / `validateRecommendations` only check that NPS *exists* as a lesson/intent/card.

---

## 23. Recommended centralized architecture (no implementation)

```
src/utils/nps/npsRules.js
src/utils/nps/npsEngine.js
scripts/validateNps.js
```

`npsRules.js` should hold, as data plus visitor-facing sentences:

- scoped subscriber: non-Government / All Citizen / Common Scheme / Tier-I
- scoped exit: normal exit at illustrated age ≥ 60
- statutory minimum annuity **0.20** for that scope when corpus > ₹12 lakh
- 100% / ₹8 lakh / ₹12 lakh bands listed as **out of scope**, not applied silently
- contribution product limits vs PFRDA ₹250 / ₹10
- disclosures: market-linked return, illustrative annuity rate, no ASP quote, no tax computation
- age window notes (18–85 statutory vs product 18–70)

`npsEngine.js` should expose something like `calculateNpsEstimate({ monthlyContribution, annualReturnPercent, currentAge, exitAge, annuityAllocationPercent, illustrativeAnnuityRatePercent })` with normalisation, `valid` flags, and named outputs: `projectedCorpus`, `totalContributed`, `illustrativeLumpSum`, `annuityAllocation`, `illustrativeMonthlyAnnuity`.

`validateNps.js` must **import** that engine and assert the exact vectors in section 17, plus copy/trust checks on `npsRules` (no “guaranteed”, no “interest rate”, 20% described as minimum not as the user’s decision).

---

## 24. Authoritative primary sources

| Source | What it establishes | URL / locator | Date |
|---|---|---|---|
| PFRDA Exit Regulations 2015, last amended 20 July 2026 | Current consolidated exit/annuity/threshold text, Regs. 3–4, Schedule I Tables 1–3 | https://pfrda.org.in/documents/33652/184762/PFRDA%2BExits%2Band%2BWithdrawals%2Bunder%2Bthe%2BNPS%2BRegulations%2B2015%2B_Last%2Bamended%2Bon%2B20%2BJuly%2B2026_%2B%281%29.pdf | Last amended **20 July 2026** |
| PFRDA (Exits…) (Amendment) Regulations, 2025 | Effective date of the 20%/80% and threshold rewrite | https://www.pfrda.org.in/w/regulatory-framework/regulations/pension-fund-regulatory-and-development-authority-exits-and-withdrawals-under-the-national-pension-system-amendment-regulations-2025 | Published **16 December 2025**; w.e.f. **16.12.2025** |
| PFRDA press release “Key amendments in Exit Regulations” | Official comparison table: Non-Gov 80/20; Gov 60/40; ₹8 lakh / ₹12 lakh; 15-year vesting; entry/exit 85 | https://www.pfrda.org.in/documents/33652/86710/Press+Release+-+Key+changes+-+Exit+Regulations+.pdf | **19 December 2025** |
| PFRDA (Exits…) (Amendment) Regulations, 2026 | Later amendment; PFRDA publication | https://pfrda.org.in/w/pension-fund-regulatory-and-development-authority-exits-and-withdrawals-under-the-national-pension-system-amendment-regulations-2026 | Published **20 July 2026** |
| PFRDA All Citizen Model page | Eligibility 18–85; unlimited contributions; Common Scheme vs MSF; current exit summary 80/20 | https://pfrda.org.in/schemes/national-pension-system/nps-for-all-citizen-models | Live PFRDA page (retrieved this audit) |
| PFRDA Circular PFRDA/2026/16/REG-POP/01 | Min contribution ₹250 / ₹10; PoP 0.20% AUM; supersedes 31.12.2025 charges circular | https://pfrda.org.in/documents/33652/154928/Circular%2B-%2BCharge%2Bstructure%2Bof%2BPoint%2Bof%2BPresence%2B%28PoP%29%2Bunder%2BNPS%2B%28All%2BCitizen%29%2Bincluding%2BNPS%2BVatsalya%2Band%2BNPS%2BLite.pdf | **10 March 2026**; charges from **01.01.2026** |
| PFRDA Circular PFRDA/2025/24/REG-POP/05 | Earlier “no mandatory minimum” language — **superseded** | https://pfrda.org.in/documents/33652/154928/POP+charges+circular.pdf | **31 December 2025** |
| PFRDA Act, 2013 | Parent statute | Act 23 of 2013 | In force |
| Income-tax Act, 2025 as amended by Finance Act, 2026 | ss. 123, 124, 202 | https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf | Department PDF; FA 2026 w.e.f. **1-4-2026** |
| Income Tax Department, Pensioner Tax Guide | “Pension received out of NPS, or annuity, is fully taxable” | https://www.incometaxindia.gov.in/income-from-pension | Department page |
| PFRDA corporate exit FAQ | Annuity variants/pricing differ by ASP; annuity mandatory except stated exceptions | https://www.pfrda.org.in/documents/33652/676426/Exits+and+Withdrawals+under+NPS+for+Corporate+Sector.pdf | PFRDA FAQ PDF |

Not used as regulatory authority: bank pages, aggregator calculators, insurer blogs.

---

## 25. NOT DEFINITIVELY VERIFIED

1. **Exact Income-tax Act, 2025 schedule table serial** for the 60% NPS Trust closure exclusion (likely Schedule II Sl. No. 6 in third-party transcriptions). Confirm against the official PDF tables before any user-facing “60%” tax sentence.
2. Whether a **later-than-10-March-2026** PFRDA contribution circular is already in force as of 10 September 2026. This audit used PFRDA/2026/16 as the latest official circular retrieved.
3. **Stale PFRDA FAQ / Offer Document** figures (₹500 / ₹1,000 / ₹6,000 yearly). Treat as not current unless a later official circular restates them.
4. **Exact Gazette Extraordinary number** for the 13 July 2026 notification (PFRDA page + unofficial gazette mirrors; official PDF of Amendment 2026 was listed on PFRDA but not fully extracted here). The 20 July 2026 consolidated regulations are sufficient for the annuity percentages, which come from the 16.12.2025 amendment.
5. **ASP-wise current annuity quotations.** There is no official single 6% rate to verify.
6. Whether FOINWI should ever treat **MSF** (15-year scheme lock-in) as in-scope. Not verified as necessary for P1; recommend exclude.
7. Department web pages that still cite **80CCD / 10(12A)** — not reliable as FY 2026-27 numbering.

---

## 26. Final Git status

Read-only audit. Working tree should remain:

```
On branch main
nothing to commit, working tree clean
HEAD: 6463cb3 Correct HRA calculator for FY 2026-27 rules
```

---

**Bottom line for implementation (when you ask for it):** keep the SIP accumulation math; stop calling the return an expected NPS rate; stop silently using 40% × 6% as “the” monthly pension; scope the page to **non-Government All Citizen Common Scheme normal exit at age ≥ 60, corpus assumed above ₹12 lakh**; use **20% as the disclosed statutory minimum**, not as the user’s assumed choice; keep tax out of the engine.