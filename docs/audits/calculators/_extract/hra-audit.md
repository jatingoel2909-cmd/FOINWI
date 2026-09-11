The working tree is clean at `0b8c461`. This is a read-only audit: no files were changed.

---

## 1. Current legal basis

For **tax year 2026-27** (1 April 2026–31 March 2027), the HRA-style exemption is no longer section 10(13A) / Rule 2A of the 1961/1962 framework as the operative law.

Verified:

- **Income-tax Act, 2025** came into force on **1 April 2026** (CBDT press release, 1 April 2026). Section 1(3) of that Act states the same commencement.
- **Income-tax Rules, 2026** were notified on **20 March 2026** and come into force on **1 April 2026**.
- Incomes enumerated in **Schedule III** are not included in total income (Act, 2025, **section 11**).
- The HRA computation is **Rule 279**, titled *Limits for the purposes of Schedule III [Table: Sl. No. 11]*.
- Under the **default tax regime (section 202(1))**, total income is computed **without** exemption under **Schedule III (Table: Sl. No. 11)** — section **202(2)(a)(i)**.
- **Section 134** (rent paid; successor of 80GG) is **not** allowed if the assessee has income falling in Schedule III Table Sl. No. 11 — section **134(4)(b)**.

The **exact cell wording** of Schedule III Table Sl. No. 11 was **not cleanly extractable** from the converted Act PDF (table layout). Identification of Sl. No. 11 as the HRA allowance is from Rule 279’s heading plus the section 202 / section 134 cross-references.

1961 **section 10(13A)** and **Rule 2A** remain useful history. They are **not** the governing instruments for tax year 2026-27.

## 2. Applicable FY / AY

| Period | Status |
|---|---|
| Tax year / FY **2026-27** | Current year under Act 2025 + Rules 2026 |
| Assessment year **2027-28** | Return for that tax year |

FOINWI’s separate income-tax calculator is still labelled **AY 2026-27 / FY 2025-26**. That is a **different year** from this HRA audit.

## 3. Exact HRA exemption formula (current rule)

**Rule 279(1)** — least of:

**(a)** actual amount of such allowance received for the **relevant period**; or  
**(b)** rent actually incurred for residential accommodation occupied by the assessee, **minus one-tenth of salary** due for the relevant period; or  
**(c)** **50% or 40% of salary** for the relevant period, by city table.

**Rule 279(2)(a):** *relevant period* = the period during which that accommodation was occupied during the **tax year**.

If (b) is negative, the least of (a), a negative number, and (c) would be negative unless a floor is applied. Official logic and the 1961 educational summaries treat no-rent / rent below 10% of salary as **nil exemption**. FOINWI already floors limb (b) at 0, which is the defensible educational guard: **max(0, least of the three)**.

## 4. Statutory salary definition

**Rule 279(2)(b)** (verified):

> “salary” includes dearness allowance, **if provided for under the terms of employment**, but excludes all other allowances and perquisites.

That is **not** “basic salary only”.

Nuances:

- The rule text is **“terms of employment”**, not “DA forming part of retirement benefits”. The retirement-benefit phrasing appears in older ITD educational summaries of 1961 Rule 2A.
- **Turnover-based commission:** older official 1961 educational material included it. **Rule 279 does not mention commission.** Whether Gestetner-style inclusion still applies is **NOT DEFINITIVELY RESTATED** in the 2026 Rules text.

## 5. Exact 50% cities

**Rule 279 table (Income-tax Rules, 2026):**

**50%:** Mumbai, Kolkata, Delhi, Chennai, **Hyderabad, Pune, Ahmedabad and Bengaluru**.

This is a **current-year change**. Under old Rule 2A the 50% list was only Bombay, Calcutta, Delhi or Madras.

## 6. 40% category

**Rule 279:** “Any other place” → **40%**.

That includes **Gurugram, Noida**, and any city not in the eight names above. “Metro” in the ordinary sense is **not** the legal test.

## 7. Old / new regime availability

| Regime | HRA-style exemption |
|---|---|
| **Default / new regime — section 202(1)** | **Not available.** Section 202(2)(a)(i) computes total income without Schedule III Table Sl. No. 11. |
| **Opt-out / old regime — section 202(4)** | Available, subject to Rule 279 and occupation/rent conditions. |

Official portal FAQ (incometax.gov.in): HRA u/s 10(13A) is not available in the new regime. For 2026-27 the same policy is in **section 202**, using the new schedule numbering.

FOINWI currently has **no regime control** and does not say the estimate is old-regime only. A visitor on the default regime can read a positive “HRA Exemption” as if it reduces their tax. That is the largest trust failure.

**Design recommendation:** label it an **old-regime / section 202 opt-out estimator**, and state that under the **default section 202 regime the exemption is nil**. A regime toggle is optional; if added, new-regime result must be **₹0 exemption**, not a silent formula.

## 8. Actual-rent requirement

Verified from:

- Rule 279(1)(b): exemption limb is **expenditure actually incurred** on rent for accommodation **occupied** by the assessee.
- 1961 section 10(13A) Explanation (historical, still the clearest official “own house / no rent” bar): exemption does **not** apply if (a) the occupied accommodation is **owned by the assessee**, or (b) the assessee has **not actually incurred** rent.
- ITD educational note: fully taxable if living in own house or paying no rent.
- CBDT Circular **612 dated 13-11-1991**: HRA of an employee living in a house/flat **owned by him** is not exempt; evidence of actual rent before excluding HRA from TDS.

**Owning another house** does not, by itself, kill HRA on a rented occupied house. Section 134(4)(a) (own house at place of work) is the **80GG-style** bar, not the HRA bar.

**Rent to parents/spouse:** no official source retrieved that automatically disallows genuine rent. Rule 205 / Form 124 now requires **relationship with the landlord, if any**. That is disclosure for employer TDS estimation, not an eligibility adjudication. FOINWI should **not** decide those cases.

## 9. Documentation / PAN

**Current (tax year 2026-27):** Rule **205**, Form **No. 124** — for house rent allowance the employee furnishes:

- name and address of landlord(s);
- **PAN** of landlord(s) **where aggregate rent during the tax year exceeds ₹1,00,000**;
- **relationship with the landlord, if any**.

This is an **employer TDS / evidence** requirement under section **392(5)(b)** (successor of the old salary-TDS evidence rules), **not** a limb of the Rule 279 mathematical exemption.

**Historical:** ITD salary-treatment pages cite **Circular No. 08/2013 dated 10-10-2013** for PAN if rent > ₹1,00,000. The original circular PDF was **not retrieved in this audit**; the **₹1,00,000 PAN threshold is independently in Rule 205**, so the threshold itself is verified for 2026-27.

Safe wording: if annual rent exceeds ₹1,00,000, employer estimation typically needs landlord PAN on Form 124. Missing PAN does **not** mean FOINWI should zero the educational exemption.

## 10. Period / change of circumstance

Rule 279 is **relevant-period** based: occupation, salary due, allowance received, and rent incurred for that period.

Mid-year change in salary, HRA, rent, or city should be computed **period-wise**, then summed. An annual lump of mixed months is not the statutory method.

FOINWI has **one undated set of amounts** and **no period label** (monthly vs annual). Defaults (₹50,000 / ₹20,000 / ₹18,000) look **monthly**, but nothing says so. That can be defended only as a **single-period illustration** if labelled honestly.

## 11. Exact existing FOINWI formula

Local function in `src/components/HraCalculator.jsx` (not exported, not centralized):

```
rentMinusBasic = max(0, rentPaid − basicSalary × 0.1)
percentOfBasic = metro ? basicSalary × 0.5 : basicSalary × 0.4
exemption     = min(hraReceived, rentMinusBasic, percentOfBasic)
taxableHra    = max(0, hraReceived − exemption)
```

Primary UI label: **“HRA Exemption”**. Also shows **Taxable HRA**. Does **not** compute income-tax saving.

## 12. Current FOINWI input assumptions

| Item | Current behaviour |
|---|---|
| Period | Unlabelled; defaults look monthly |
| Salary | **Basic only** (₹10,000–₹5,00,000, step ₹1,000) |
| DA / commission | Not collected |
| HRA received | ₹0–₹2,00,000 |
| Rent paid | ₹0–₹2,00,000 |
| City | **“Metro” / “Non-Metro”** — cities not named |
| Tax regime | **Silent** (defaults as if exemption exists) |
| Own house / occupation | Not asked |
| Defaults | Basic ₹50,000, HRA ₹20,000, rent ₹18,000, **metro** |
| Hidden | 50% for any “Metro”; formula uses basic as salary |

Copy: *“under common Indian tax rules”*; title *“Estimate your HRA tax exemption”*.

## 13. All discrepancies

1. **Regime omitted** — exemption shown as if available under the default section 202 regime.  
2. **“Metro” undefined** — 50% now applies only to **eight named cities**; Gurugram/Noida/etc. are 40%.  
3. **Salary = Basic** — Rule 279 includes qualifying DA.  
4. **No relevant-period model** and no monthly/annual label.  
5. **No occupation / actual-rent / own-occupied-house disclosure.**  
6. **Card/journey:** “Calculate HRA exemption” without regime qualification.  
7. **Explains** tell users not to use gross instead of basic — still incomplete vs Rule 279.  
8. Insights treat metro/non-metro as if that were the legal vocabulary.  
9. Validator **re-implements** the UI formula; does not import production code.  
10. **2026 8-city expansion is absent** from product copy.  
11. Income-tax calculator year (**FY 2025-26**) ≠ HRA current-year frame (**FY 2026-27**).

The three-way “least of” **structure** matches Rule 279 **if** salary, cities, period, and regime are right. They are not.

## 14. Deterministic comparison examples

Using FOINWI’s local formula vs Rule 279 with **salary = basic only**, same period, **old regime**. (If new regime, rule result is **₹0** in every row.)

| Case | Inputs | FOINWI | Rule-based (old regime, salary=basic) | Diff | Reason |
|---|---|---|---|---|---|
| Default / rent−10% limits | B 50,000; HRA 20,000; rent 18,000; metro | Ex 13,000; tax 7,000 | Same | 0 | Least is 18,000−5,000 |
| HRA limits | B 50,000; HRA 8,000; rent 18,000; metro | Ex 8,000 | Same | 0 | HRA is least |
| 50% limits | B 50,000; HRA 40,000; rent 40,000; metro | Ex 25,000 | Same **if** city is in the 8 | 0 only if city qualifies | FOINWI “metro” ≠ legal city list |
| 40% limits | B 50,000; HRA 40,000; rent 40,000; non-metro | Ex 20,000 | Same if not in the 8 | 0 | |
| Rent &lt; 10% salary | B 50,000; HRA 20,000; rent 4,000 | Ex 0; tax 20,000 | Same | 0 | Floor on limb (b) |
| Zero rent | rent 0 | Ex 0 | Same | 0 | |
| Zero HRA | HRA 0 | Ex 0 | Same | 0 | |
| Bengaluru as Metro | same as 50% case | 25,000 | **25,000 under Rule 279** | 0 | **Correct for FY 2026-27** if labelled Bengaluru |
| Gurugram as Metro | same as 50% case | 25,000 | **20,000 (40%)** | **FOINWI +5,000** | Gurugram is not in Rule 279’s 50% list |
| Qualifying DA omitted | B 50,000 + DA 10,000; HRA 20,000; rent 18,000; 50% city | Ex 13,000 | Salary 60,000 → rent−10% = 12,000 → Ex **12,000** | **FOINWI +1,000** | Basic-only salary |
| New regime | any | positive exemption | **₹0** | **FOINWI overstates** | Section 202(2)(a)(i) |
| Partial year | no input | treats one lump as the whole | should use relevant period only | not modelled | |

## 15. Negative-value handling

Limb (b) is `max(0, rent − 10% basic)`. Taxable HRA is `max(0, HRA − exemption)`. Final exemption is **not** wrapped in `max(0, min(...))`, but with UI minima ≥ 0 this is equivalent.

UI blocks negative HRA (min 0). Validator does not test NaN/Infinity/negatives on a shared engine.

## 16. Exemption vs taxable HRA vs tax saving

| Concept | FOINWI |
|---|---|
| HRA exemption | Primary result — **yes** |
| Taxable HRA | Metric — **yes** |
| Income-tax saving | **Not calculated** — correct |

Wording risk: “Estimate **your** HRA tax exemption”, card “Calculate HRA exemption”, recommendation “salary tax planning”. None say “tax saved” as a rupee result. Still implies a personal, generally available benefit.

## 17. Recommended calculator scope

Supported by this audit:

**Educational estimate of House Rent Allowance exemption for a person who has opted out of the default tax regime under section 202 of the Income-tax Act, 2025, for tax year 2026-27, using visitor-entered Rule 279 salary, HRA received, rent paid, and residence city category, for a single labelled period, assuming the visitor occupies rented accommodation and actually incurs that rent.**

Keep **one consistent period** (monthly *or* annual, labelled). Do **not** build a full month-by-month engine in P1 unless product wants mid-year city/salary changes. Disclose that Rule 279 is relevant-period based and mid-year changes are not modelled.

Do **not** adjudicate parent/spouse rent, own-other-house, or PAN completeness.

## 18. Required changes ranked P0 / P1 / P2

**P0 — must fix before claiming current-rule accuracy**

1. Old-regime / section 202 opt-out only; default-regime exemption is nil.  
2. Replace “Metro/Non-Metro” with Rule 279’s **eight 50% cities** vs any other place.  
3. Stop implying the benefit is generally available.  
4. Label the input period (monthly or annual).  
5. Do not treat salary as basic unless DA is disclosed as assumed zero.

**P1 — trust and engine**

6. Centralize `hraRules.js` + `hraEngine.js`; UI and `validateHra.js` must call the same engine.  
7. Collect or explicitly assume qualifying DA (Rule 279: terms of employment).  
8. Occupation / actual rent / not living in own occupied house — disclosure, not a full adjudicator.  
9. Form 124 PAN/relationship as **documentation**, not a formula condition.  
10. Fix calculator card, insights, explains, save-tax journey HRA lines, learn “HRA Exemption Basics”.

**P2**

11. Optional commission field only if you can cite a 2026 restatement (currently not in Rule 279).  
12. Period-split engine for mid-year city/rent/salary.  
13. Align HRA tax-year label with the income-tax calculator or state they differ.  
14. Soft caution on related-party rent without deciding it.

## 19. Recommended visitor-facing disclosures

- This estimate applies only if you **opt out of the default tax regime under section 202**. Under that default regime, this exemption is **not available**.  
- Least of: HRA received; rent minus 10% of Rule 279 salary; 50%/40% of that salary for the **relevant period**.  
- **50% cities:** Mumbai, Kolkata, Delhi, Chennai, Hyderabad, Pune, Ahmedabad, Bengaluru. **Any other place: 40%.**  
- Salary here is **not** CTC. It includes DA if provided under the terms of employment, and excludes other allowances and perquisites.  
- Assumes rented accommodation **occupied** by you and rent **actually incurred**. Living in your **own occupied** house, or paying no rent, means exemption is nil.  
- Not a passbook, not TDS computation, not tax payable / tax saved.  
- If rent in the tax year exceeds ₹1,00,000, Form 124 typically needs landlord PAN and relationship, if any. That is evidence for employer estimation, not this arithmetic.  
- Mid-year changes of city, salary, HRA or rent are not modelled.

## 20. Validator weaknesses

`scripts/validateAllCalculators.js` “HRA” block:

- Duplicates `Math.min(hra, max(0, rent−10% basic), 50% basic)`.  
- **Does not import** `HraCalculator.jsx`.  
- Asserts the default metro vector only by reconstructing it.  
- `assert(Math.min(0,0,0)===0)` is not a real zero-input test of production code.  
- Missing: 40% vector, HRA-limiting, 50%-limiting, rent&lt;10%, zero rent/HRA, Bengaluru vs Gurugram, DA, regime, invalid inputs, copy/regime wording.

Dedicated `src/utils/hra/hraRules.js`, `hraEngine.js`, and `scripts/validateHra.js` are appropriate, same pattern as EPF/PPF.

## 21. Authoritative official sources

| Source | What it supports | Date / provision |
|---|---|---|
| [CBDT press release — Act 2025 in force](https://www.incometaxindia.gov.in/documents/d/guest/press-release-income-tax-act-2025-comes-into-force-from-01-april-2026-pdf) | Act 2025 from 1 April 2026 | 1 April 2026 |
| [Income-tax Act, 2025 as amended by Finance Act 2026](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf) | ss. 1(3), 11, 202(1)–(4), 202(2)(a)(i), 134(4)(b); Schedule III Sl. No. 11 (cross-ref) | In force 1-4-2026; FA 2026 w.e.f. 1-4-2026 |
| [Income-tax Rules, 2026](https://www.incometaxindia.gov.in/documents/d/guest/en-notified-it-rules-2026-20-03-2026-pdf) | **Rule 279** formula, 8 cities, salary, relevant period; **Rule 205** Form 124 PAN ₹1,00,000 + relationship | Notified 20-3-2026; in force 1-4-2026 |
| [ITD new vs old regime FAQs](https://www.incometax.gov.in/iec/foportal/help/new-tax-vs-old-tax-regime-faqs) | HRA not available in new regime (1961 numbering) | Portal FAQ; policy continued in s. 202 |
| [ITD old vs new calculator notes](https://incometaxindia.gov.in/Pages/tools/old-regime-vis-a-vis-new-regime.aspx) | HRA exemption u/s 10(13A) not allowed in new regime | Department tool copy |
| [Section 10(13A) historical text](https://www.incometaxindia.gov.in/w/section-10-62) | Own occupied house / no actual rent bar | 1961 Act (not operative 2026-27) |
| [Circular 612, 13-11-1991](https://www.incometaxindia.gov.in/w/612-circular-no.-612-dated-13-11-1991) | Rule 2A least-of; Bombay/Calcutta/Delhi/Madras 50%; own house not exempt; relevant period; salary includes DA if terms of employment so provide | 13-11-1991 (TDS; historical city list) |
| [ITD “Treatment of income from different sources”](https://incometaxindia.gov.in/Documents/Left%20Menu/Income-from-salary.htm) | Educational least-of; 4-city 50% list; Circular 08/2013 PAN note | Still uses **1961 numbering and 4 cities** — **stale vs Rules 2026** |

**NOT DEFINITIVELY VERIFIED**

- Full verbatim Schedule III Table Sl. No. 11 cell (own-house explanation restated or not).  
- Original PDF of Circular 08/2013 (threshold independently in Rule 205).  
- Commission as part of Rule 279 salary.  
- Any official 2026 list adding Gurugram/Noida to 50%.

Blogs and payroll articles were **not** used as authority. City expansion is taken from the **Rules 2026 PDF** on incometaxindia.gov.in.

## 22. Git status

```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
HEAD: 0b8c461 Correct PPF calculator assumptions and trust wording
```

No files modified. No commit. No push.

---

HRA P1 CURRENT-RULE AUDIT:  
READY FOR CTO REVIEW