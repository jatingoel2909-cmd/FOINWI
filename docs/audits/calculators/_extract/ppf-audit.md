FOINWI’s PPF tool is an **educational annuity-due projection**, not a statutory PPF engine. Under a constant rate and a deposit **on or before the 5th of April each financial year**, that formula matches official monthly lowest-balance interest with **annual crediting**. It does **not** match monthly or late-year deposits, the statutory FY-end maturity clock, or a 15-year lock on today’s rate.

No code was modified. Nothing was committed or pushed.

---

## 1. Current legal basis

**Governing scheme (retrieved as NSI’s official compiled text, not as an e-Gazette PDF):**

| Item | Finding |
|---|---|
| Title | **Public Provident Fund Scheme, 2019** |
| Notification | **G.S.R. 915(E), 12 December 2019** |
| Power | Section **3A** of the **Government Savings Promotion Act, 1873** |
| Commencement | Para 1(2): comes into force on **publication in the Official Gazette** |
| “Year” | Para 2(1)(f): **financial year** |
| General rules | Para 2(1)(e) / 16: **Government Savings Promotion General Rules, 2018** apply where the Scheme is silent |

**Amendment retrieved in the same NSI compilation:**

- **G.S.R. 290(E), 5 May 2020** — amends para 7(1) and **inserts para 7(1A)** (7.1% from 1 April 2020; same 5th-day lowest-balance rule).

**Parent framework (retrieved earlier this audit as DEA PDF):**

- **Government Savings Promotion General Rules, 2018** — **G.S.R. 1003(E), 5 October 2018**. Repeals the **Public Provident Fund Scheme, 1968** among other old rules, with savings.

**e-Gazette PDFs of G.S.R. 915(E) and G.S.R. 290(E): NOT DEFINITIVELY VERIFIED** (not opened as Gazette files this session). Provisions below are from NSI’s compiled scheme page, which NSI labels as those two notifications.

No later scheme-amending Gazette after G.S.R. 290(E) was retrieved. Do not infer unread later amendments.

Relevant calculator provisions in the retrieved 2019 Scheme: **paras 3–7, 8–10, 11–12, 13**.

---

## 2. Latest verified interest rate (as of 10 September 2026)

**Numeric rate for July–September 2026: 7.1% per annum.**

Verified from official sources retrieved this session:

1. **DEA / Budget Division OM F.No.1/4/2019-NS dated 30.06.2026** (`Q2ROI.pdf`)  
   Q2 FY 2026-27 (**1 July 2026 – 30 September 2026**) rates **remain unchanged** from Q1 FY 2026-27. The OM **does not reprint a PPF line**.
2. **Same series, dated 30.03.2026** (`RoI_Q1_2627.pdf`)  
   Q1 FY 2026-27 (**1 April – 30 June 2026**) **unchanged** from Q4 FY 2025-26.
3. **Same series, dated 31.12.2025**  
   Q4 FY 2025-26 (**1 January – 31 March 2026**) **unchanged** from Q3 FY 2025-26. Again **no PPF line**.
4. **NSI scheme-wise table** (InternalPage `Id_Pk=132`), heading “w.e.f. 1st April 2025 onwards”:  
   **Public Provident Fund = 7.1** for FY 2025-26 (all four quarters) and FY 2026-27 **April–June and July–Sep**. Oct–Dec and Jan–Mar of FY 2026-27 are **blank** on that table (not yet filled).
5. **NSI “PPF interest rate since inception”** (`Id_Pk=178`):  
   **01.04.2020 TO 30.09.2026 → 7.1**.
6. Scheme para **7(1A)** still states **7.1%** from 1 April 2020 (G.S.R. 290(E)).

**Quarterly revision:** Yes, operationally. India Post’s production scheme page states interest is **notified by the Ministry of Finance on a quarterly basis**. DEA publishes quarterly small-savings OMs. The 2019 Scheme also refers to “the rate applicable to the Scheme from time to time” (e.g. para 6(2), 11(2)). Do not treat 7.1% as a 15-year lock.

**Honest limit:** the July–September 2026 **number** is from **NSI’s official tables**, consistent with DEA “unchanged” OMs. The Q2 OM itself never prints “7.1”. A standalone Q3 FY 2025-26 table OM was **not** sitting as a numeric PDF on the DEA Interest Rates list (gap after the 08.03.2024 “unchanged” Q1 FY 2024-25 OM). **Do not invent** an unread table.

**Do not confuse** DEA “Rate of Interest on General Provident Fund … Q-2 of FY 2026-27” (13.07.2026) with **PPF**. That is **GPF**.

---

## 3. Minimum annual deposit

**₹500 per account per financial year** (Scheme para 4(1); India Post; NSI account page).

Opening: minimum initial deposit **₹500** (para 5(1)).

---

## 4. Maximum annual deposit

**₹1,50,000 per financial year**, in **multiples of ₹50** (para 4(1)).

**Guardian / minor aggregation (must be worded honestly):** para 4(2) — the ₹1.50 lakh cap for an individual **includes** deposits in **that person’s own account and** any account opened **on behalf of a minor**. FOINWI currently models a single account only and does not disclose this.

---

## 5. Deposit frequency rules

Scheme para 5(2): deposits may be **one lump sum or in instalments**, within para 4 limits. **No 12-instalment cap** appears in the retrieved 2019 text.

India Post production page (retrieved this session): **any number of instalments** in a FY, **multiples of ₹50**, up to ₹1.50 lakh.

**Default / discontinued account (para 6):** if the minimum is not deposited in a following year, the account is **discontinued**. Revival during maturity: **₹50 fee + ₹500 arrears per defaulted year**. Discontinued accounts: **no loan / no partial withdrawal**; unreived balances **continue to earn the applicable scheme rate**. Revival deposits count toward the annual cap, **excluding** the default fee.

FOINWI assumes uninterrupted deposits and does not model default.

---

## 6. Exact maturity rule

**Not** “15 years from the opening date.”

Scheme para **11(1):**

> Any time **after the expiry of fifteen years from the end of the year in which the account was opened**, the account holder may apply in Form-3 for closure.

NSI account page: matures on completion of **fifteen complete financial years from the end of the year in which the account was opened**.

India Post: maturity after **15 FYs excluding the FY of account opening**.

**Worked illustration (educational, not a personal determination):** account opened 10 September 2026 (FY 2026-27) → end of opening year **31 March 2027** → closure eligible after **31 March 2042**. That is longer than a simple 15 calendar years from opening.

On closure, interest is allowed **up to the last day of the month preceding the month of closure** (para 11(1)).

FOINWI’s `n` is a plain integer of contribution years (default 15). That is a **simplification**, not the statutory clock.

---

## 7. Extension rules

**Without further deposits (para 11(2)–(3)):** after maturity the account may be retained; balance earns the **applicable scheme rate**; **one withdrawal per year**. If continued without deposits for **more than a year**, the holder **cannot** later continue **with** deposits.

**With deposits (para 12):** after the same 15-year-from-end-of-opening-FY point, extend in **5-year blocks** via **Form-4**, **before expiry of one year from maturity**. Failed option: further deposits are **irregular and refunded without interest**; the maturity balance still earns interest until closure. During an extended block, partial withdrawal is capped at **60% of the balance at the start of that block**. Blocks may be repeated. Discontinued accounts **cannot** be extended (India Post).

FOINWI years **16–50** treat extra years as continuous contributions with no Form-4 / 5-year-block / one-year-window mechanics.

---

## 8. Official interest calculation method

From Scheme para **7** (and India Post, matching):

- Eligible balance for a calendar month = **lowest balance between close of the 5th day and the end of that month**.
- Interest for that month is on that eligible balance at the **notified annual rate** (operationally \( \text{eligible} \times r / 12 \)).
- Interest is **credited at the end of each year** (para 7(2); India Post: end of each **financial year**).
- This is **not** statutory intra-year monthly compounding of credited interest. Calling it “monthly compounding” is **incorrect**.

**FOINWI’s annuity-due formula is not the statutory engine.** It **coincides** with the official method only when the rate is constant and the **entire** annual deposit is in by the **5th of April**, so all 12 months share the same eligible balance, and year-end credit equals \( \text{eligible} \times r \).

---

## 9. Significance of the 5th day

A deposit **on or before the close of the 5th** can sit in that month’s eligible (lowest) balance. A deposit **after the 5th** does **not** help **that** month’s interest; the lowest balance in the 5th-to-month-end window typically **excludes** it.

FOINWI neither models nor discloses this cut-off.

---

## 10. Interest-credit timing

**Credited at the end of each year / financial year** (para 7(2)–(3); India Post). Transfer of the account during the year does not skip that year-end credit (para 7(3)).

---

## 11. Tax wording findings

The **calculator UI does not compute tax**. Surrounding copy does.

| Location | Claim | Assessment |
|---|---|---|
| `calculatorExplains.js` | “tax-efficient structure of the account” | **Incomplete / potentially misleading.** Efficiency depends on facts and **tax regime**. |
| `journeys.js` | “Plan **80C-linked** long-term tax-efficient savings.” | **Regime-dependent.** Budget 2025 FAQ on incometaxindia.gov.in: new regime allows **no deductions other than specified ones** (examples: 80JJAA, 80M, standard deduction) — **80C is not in that list**. |
| `financialConcepts.js` | “tax benefits and a 15-year lock-in” | **Incomplete** (benefits + lock-in wording). |
| Calculator body | No 80C / EEE sentence | Safer than the journey/explain copy. |

**Official tax sources retrieved (do not turn the calculator into tax advice):**

- Income Tax India tutorial *Tax-free incomes* (as amended by **Finance Act, 2025**): **PPF interest credited is exempt**; lump-sum received at “termination” is exempt; framed under **section 10(11)/(12)**.
- NSI / India Post still say deposit “qualifies” under **80C** and interest is tax-free under **section 10**. That is **old-regime / eligible-deduction** language if repeated without a regime caveat.
- incometaxindia.gov.in resident-benefits chart still names **“Public Provident Fund Scheme, 1968”** — **stale naming** versus the 2019 Scheme.

**Recommendation:** strip tax conclusions from the PPF calculator. Point to official IT materials. Do not say EEE / “tax-free maturity” as a universal fact.

---

## 12. Withdrawal / loan assumptions relevant to the calculator

High-level official rules (do **not** need to be calculated):

- **Loan:** after 1 year from end of opening FY, before 5 years from that end; up to **25%** of balance at end of the **second year immediately preceding** the loan year; one loan a year; prior loan must be cleared (paras 8–9).
- **Partial withdrawal:** after **5 years from the end of the opening year**; up to **50%** of the **lower** of 4th-preceding-year-end and preceding-year-end balances; **once a year**; not from discontinued accounts (para 10).
- **Premature closure:** only on specified grounds after 5 years from end of opening year, with interest **1 percentage point lower** than credited rates (para 13).

If FOINWI assumes **no loans, no withdrawals, uninterrupted deposits**, that must be **visible**. Those events change eligible monthly balances and the projection.

---

## 13. Exact existing FOINWI formula

All math lives in `src/components/PpfCalculator.jsx`. **No** `src/utils/ppf/` engine. Page wrapper is `src/pages/PpfCalculatorPage.jsx`.

```14:22:src/components/PpfCalculator.jsx
function calculatePpfMaturity(yearlyInvestment, annualRate, years) {
  const rate = annualRate / 100;

  if (rate === 0) {
    return yearlyInvestment * years;
  }

  const factor = Math.pow(1 + rate, years);
  return yearlyInvestment * ((factor - 1) / rate) * (1 + rate);
}
```

This is the **future value of an ordinary annuity-due** (deposit at the **start** of each year, **annual** compounding):

\[
\text{FV} = P \times \frac{(1+r)^n - 1}{r} \times (1+r)
\]

| Item | Current value |
|---|---|
| Default yearly | ₹1,50,000 |
| Limits | min **₹500**, max **₹1,50,000**, step **₹500** |
| Default rate | **7.1%** (slider 5–10%, step 0.1) |
| Default years | **15** (min 15, max 50) |
| Primary label | **“Maturity Value”** (not “estimated”) |
| Title | **“Build long-term wealth with PPF”** |
| Story | “PPF growth is modelled with **annual compounding** and a long lock-in. Rate assumptions may change over the full tenure.” |
| Insights formula | Same expression; `r` = “**Illustrative** annual interest rate” (better than the UI label “Interest Rate (%)”) |
| Insights summary | still says “**expected** interest rate” |
| Card | “Estimate long-term PPF growth.” |
| Hidden | start-of-year lump sum; constant rate; no 5th-day rule; no FY maturity clock; no loans/withdrawals; no extension mechanics; no minor-account aggregation |

**0% rate:** supported locally (`P * n`).

---

## 14. All discrepancies

1. **Method:** annuity-due ≠ statutory 5th-day lowest-balance engine, except in the April-on-or-before-5th special case.
2. **Tenure:** integer `n` years ≠ 15 complete FYs from **end of opening FY**.
3. **Rate trust:** default 7.1% is shown as a user rate, not “last notified for Jul–Sep 2026 / illustrative if held constant”.
4. **“Maturity Value”** and title **“Build long-term wealth”** over-claim certainty / promotion.
5. **“Annual compounding”** in the story is closer than “monthly compounding”, but still hides the 5th-day rule.
6. **Step ₹500** vs statutory **multiples of ₹50**.
7. **Years 16–50** ignore 5-year extension blocks / Form-4 window.
8. **No disclosure** of no-loan / no-withdrawal / uninterrupted-deposit assumptions.
9. **Tax copy** outside the widget is incomplete / regime-dependent.
10. **Guardian aggregation** not disclosed.
11. Validator **reimplements** the formula; does not call the UI function (which is not exported).
12. Insights “**expected** interest rate” vs trust standard (**illustrative**).

---

## 15. Deterministic comparison examples

**No official source retrieved in this audit publishes a maturity table for these exact assumptions.** Figures below are **reconstructions**: FOINWI = the code formula; “official-method estimate” = Scheme para 7 (monthly eligible balance × \(r/12\), **credit at year-end**), **constant 7.1%**, **15 contribution years**, no loans/withdrawals. Rounded to the nearest rupee.

**A. FOINWI (annuity-due) — also official-method if the year’s deposit is on/before 5 April**

| Annual deposit | Rate | Years | FOINWI / official (Apr ≤ 5th) | Invested |
|---|---|---|---|---|
| ₹500 | 7.1% | 15 | **₹13,561** | ₹7,500 |
| ₹1,00,000 | 7.1% | 15 | **₹27,12,143** | ₹15,00,000 |
| ₹1,50,000 | 7.1% | 15 | **₹40,68,215** | ₹22,50,000 |
| ₹1,50,000 | **0%** | 15 | **₹22,50,000** | ₹22,50,000 |

**B. Same ₹1,50,000 / 7.1% / 15 contribution years, different timing**

| Timing | Official-method estimate | vs FOINWI | Why |
|---|---|---|---|
| **A.** Annual, on/before **5 April** | ₹40,68,215 | **₹0** | Eligible balance constant all 12 months; year-end credit = \(B \times r\). Same as annuity-due. |
| Annual, **after 5 April** | ≈ ₹40,45,733 | FOINWI **higher ~₹22,500 (~0.55%)** | Deposit year earns **11/12** of \(r\) on new money. |
| **C.** Annual, **after 5 March** (end of FY) | ≈ ₹37,98,514 | FOINWI **higher ~₹2,69,700 (~7.1%)** | That FY’s deposit earns **no** interest until the next FY. Ordinary (end-of-year) annuity. |
| **B.** Monthly, **before** the 5th (₹12,500/month) | ≈ ₹39,44,606 | FOINWI **higher ~₹1,23,600 (~3.1%)** | Eligible balance ramps inside the year. Factor \((1 + 13r/24)\) vs \((1+r)\). |
| Monthly, **after** the 5th | ≈ ₹39,22,133 | FOINWI **higher ~₹1,46,100 (~3.7%)** | Each month’s deposit misses that month. Factor \((1 + 11r/24)\). |
| **D.** FOINWI simplified annual-annuity | ₹40,68,215 | — | Current product. Timing **not** visible on the form. |

**0% sanity:** FOINWI and official-method both return **contributions only**. Supported.

These are **not** “the Government’s published maturity value.”

---

## 16. Recommended calculator scope

**Choose A**, with honest labelling:

> Educational PPF accumulation estimate using a **stated deposit-timing assumption** and the **currently selected illustrative interest rate**.

**A is the safest useful default:** annual contribution assumed **deposited on or before the 5th of April each financial year**. That is the only simple model that **matches** both the current formula and para 7.

- **B (monthly)** is more realistic for many users but needs extra UI and still is not a full passbook engine.  
- **C (frequency/timing controls)** is useful later (P2), not required for a trustworthy v1.  
- **D (full 5th-day monthly engine + FY maturity + extensions)** is too much for ordinary users unless kept behind an “advanced” toggle.

Do **not** model loans, withdrawals, premature closure, or extension blocks in the main path. Disclose them as **out of scope**.

---

## 17. Required changes ranked P0 / P1 / P2

**P0 — trust / wording (ship before any precision work)**  
- Relabel primary result **Estimated balance** (or equivalent), not implied-certain **Maturity Value**.  
- Replace title **“Build long-term wealth with PPF”**.  
- Label the rate **Illustrative rate assumption**; state that **Government-notified PPF rates can change**, including **quarterly**.  
- Disclose: annual deposit **on/before 5 April**; **no** loans/withdrawals; **uninterrupted** deposits; tenure is **contribution years**, not the statutory FY-end maturity rule.  
- Remove or heavily hedge **tax-efficient / 80C-linked** journey and explain copy.  
- Stop “**expected** interest rate” in insights.

**P1 — accuracy architecture**  
- Dedicated `ppfRules.js` + `ppfEngine.js`; export the real function.  
- Validator **imports the engine** (see EPF/gratuity pattern).  
- Align step with **₹50** multiples, or disclose the ₹500 UI step as a product choice.  
- Surface last **verified notified** default (Jul–Sep 2026, 7.1%) as a dated assumption, not a future lock.  
- State extension years are **not** an adjudication of Form-4 5-year blocks.

**P2 — product depth**  
- Optional monthly vs annual timing.  
- Optional FY-end maturity explainer (not a legal determination).  
- Minor-account aggregation note.  
- Defaulted-account note.

---

## 18. Recommended visitor-facing assumptions / disclosures

Suggested pack (educational, not advice):

- This is an **illustrative accumulation estimate**, not an official passbook or a promise of what will be paid.  
- **Illustrative rate assumption:** the selected % is applied **unchanged** for every year of the projection. **Actual PPF interest is notified by the Government and can change**, including **quarter by quarter**.  
- **Last retrieved notified rate (for defaulting the slider):** 7.1% for **1 July 2026 – 30 September 2026**, from DEA’s Q2 FY 2026-27 “unchanged” OM plus NSI’s official tables.  
- **Deposit-timing assumption:** the yearly amount is treated as deposited **on or before 5 April** each financial year. Deposits after the 5th, or monthly deposits, typically produce a **lower** estimate.  
- **Interest method (plain language):** official PPF interest uses the **lowest balance between the 5th and month-end**, and is **credited once a year**. This calculator uses a **matching annual shortcut** under the April assumption — **not** “monthly compounding.”  
- **Tenure:** statutory maturity is **15 complete financial years from the end of the opening financial year**, which is **not** the same as “15 years from today.” The years input is **contribution years**.  
- **Scope:** no loans, no withdrawals, no missed years, one account, no extension-block adjudication.  
- **Tax:** the tool does **not** advise on 80C, interest exemption, or regime choice. Check current **Income-tax** rules.  
- Caps: **₹500–₹1,50,000** per FY; own + minor accounts **share** the cap.

---

## 19. Validator weaknesses

`scripts/validateAllCalculators.js` defines a **local** `futureValueOfAnnualDeposits` that **duplicates** `calculatePpfMaturity`. The component function is **not exported** and is **not imported**.

Current checks only: nonnegative default, finite high-value (₹1.5 lakh / 10% / 50 years), zero contribution → 0.

**Missing:** 0% rate, min ₹500, max ₹1,50,000, step ₹50 vs ₹500, known 15-year vector, timing/5th-day tests, FY maturity tests, rate-label/trust-copy tests, engine identity tests.

**Recommend** a dedicated `validatePpf.js` that calls a real `ppfEngine`, same pattern as EPF/gratuity.

---

## 14 / 20. Trust / terminology audit (flagged phrases)

| Phrase | Defensible now? |
|---|---|
| Guaranteed maturity amount | **No** |
| Fixed return / guaranteed 7.1% for 15 years | **No** — rate is notified and can change |
| Monthly compounding | **No** — not the statutory method |
| Exact maturity | **No** |
| Risk-free | **No** (sovereign scheme ≠ this slogan in a calculator) |
| “Maturity Value” as primary UI | **Over-precise**; use **estimated** |
| “Build long-term wealth with PPF” | **Promotional**; conflicts with FOINWI trust rule |
| “Annual compounding” without the 5th-day caveat | **Incomplete** |
| “Expected interest rate” | Prefer **illustrative** |
| Current Government-notified rate vs future assumption | **Must stay distinct** |

---

## 20. Authoritative official sources

| Source | Instrument / page | Provisions / period | URL |
|---|---|---|---|
| NSI compiled Scheme | Public Provident Fund Scheme, 2019, **G.S.R. 915(E) 12/12/2019**, as amended **G.S.R. 290(E) 05/05/2020** | Paras 1–17 as retrieved | https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=169 |
| NSI scheme PDF | Same compilation | **HTTP 500 this session — NOT DEFINITIVELY VERIFIED as PDF** | https://www.nsiindia.gov.in/writereaddata/SchemeRules/PublicProvidentFundSchemeRule.pdf |
| e-Gazette G.S.R. 915(E) / 290(E) | Original Gazette files | **NOT DEFINITIVELY VERIFIED** (PDFs not opened) | — |
| NSI PPF account summary | Operational summary | Min/max, FY maturity sentence, 80C/s.10 wording | https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=55 |
| NSI rates table | Scheme-wise rates w.e.f. 1 Apr 2025 | PPF **7.1** through **Jul–Sep 2026**; later FY 2026-27 quarters blank | https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=132 |
| NSI PPF history | Since inception | **01.04.2020 TO 30.09.2026 → 7.1** | https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=178 |
| DEA | F.No.1/4/2019-NS, **30.06.2026** | Q2 FY 2026-27 **unchanged** from Q1 | https://dea.gov.in/files/budget_division_documents/Q2ROI.pdf |
| DEA | F.No.1/4/2019-NS, **30.03.2026** | Q1 FY 2026-27 **unchanged** from Q4 FY 2025-26 | https://dea.gov.in/files/budget_division_documents/RoI_Q1_2627.pdf |
| DEA | F.No.1/4/2019-NS, **31.12.2025** | Q4 FY 2025-26 **unchanged** from Q3 FY 2025-26 | https://dea.gov.in/files/budget_division_documents/Revision%20of%20interest%20rates%20for%20Small%20Savings%20Schemes%20for%20Q4%20of%20FY%202025-26.pdf |
| DEA | Small Savings index | Hosts the quarterly OMs | https://dea.gov.in/budget-division/475 |
| DEA | GSPR 2018 **G.S.R. 1003(E), 05.10.2018** | General rules; 1968 PPF scheme repealed with savings | http://dea.gov.in/files/budget_division_documents/GSPR.pdf |
| India Post | Post Office Saving Schemes (PPF block) | Deposits, 5th-day interest, FY maturity, extension, 80C wording | https://indiapost.gov.in/Financial/pages/content/post-office-saving-schemes.aspx |
| India Post scheme PDF | Linked as “Public Provident Fund Rules 2019” | **404 this session — NOT DEFINITIVELY VERIFIED as PDF** | — |
| Income Tax India | Tax-free incomes tutorial, as amended **FA 2025** | PPF interest / payout under **s.10(11)/(12)** | https://incometaxindia.gov.in/Tutorials/11.Tax%20free%20incomes%20final.pdf |
| Income Tax India | Budget 2025 FAQs | New regime: deductions generally **not** allowed except specified | https://incometaxindia.gov.in/Documents/Budget/budget-2025/faqs-budget-2025.pdf |

Blogs, bank sites, and portals were **not** used as regulatory authority.

---

## 21. Git status

This audit **did not modify, commit, or push** anything.

A live `git status` from this continuation **did not return output** (local shell did not complete). Treat the **live** tree as **NOT DEFINITIVELY VERIFIED** in this turn.

From the **start-of-conversation** snapshot the working tree already had other (non-PPF) dirty files, including `package.json`, calculator data files, and gratuity/validator paths. There is **no** `src/utils/ppf/` tree. PPF logic remains inside `PpfCalculator.jsx`. Dedicated EPF engine/validator files exist; PPF has no equivalent.

**Do not mix this audit with committing unrelated EPF/gratuity work.**

---

**PPF P1 CURRENT-RULE AUDIT:**  
**READY FOR CTO REVIEW**