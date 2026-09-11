Read-only audit complete. No code was changed.

# EPF P1 CURRENT-RULE AUDIT

## 1. Current official contribution structure

**Current legal frame (2026)**

- Chapter III of the **Code on Social Security, 2020** is the governing statute. EPF & MP Act, 1952 is repealed by Code s.164(1).
- Code s.16 is the contribution section: employer **10%** of wages; employee equal; employee may pay more; employer need not match the excess; Central Government may notify **12%** for specified establishments.
- Pension diversion from the employer share is **not exceeding 8.33%** of wages, or such percent as notified (Code s.16(1)(b)(i)).
- **S.O. 2702(E), 29 May 2026** notifies **₹15,000 per month** as the Chapter III wage ceiling.
- **G.S.R. 525(E), 29 June 2026** notified the **Employees’ Provident Fund Scheme, 2026**, in supersession of the 1952 Scheme (PIB cites this Gazette number). CBT had approved new EPF / EPS / EDLI schemes on **2 March 2026**.
- Code s.164(2)(b) had kept the 1952/1995/1976 schemes in force for **one year** from Code commencement (21.11.2025), unless inconsistent or replaced. Scheme 2026 is that replacement for EPF.

**Limitation:** the e-Gazette PDF for G.S.R. 525(E) could not be retrieved (server 500). Contribution paragraphs inside Scheme 2026 were therefore **not read from the Gazette text**. PIB material located for Scheme 2026 covers amnesty / exemption, not a restated contribution table.

**Working structure for a standard member in a general (12%) establishment**, based on Code s.16 + EPFO FAQ + the 1997 12% notification + the 2026 ceiling notification:

| Head | Rate | Wage base in the statutory-ceiling case |
|---|---|---|
| Employee → EPF | 12% | `min(PF wages, ₹15,000)` |
| Employer total | 12% | same |
| Of which EPS | 8.33% | same, and pensionable wage is also capped at ₹15,000 |
| Residual employer → EPF | 3.67% | same, **only when EPS uses the same wage base** |
| EDLI (employer, not EPF corpus) | 0.50% | typically on the ceiling; **outside this calculator** |

`3.67%` is a residual, not the employer’s total contribution.

---

## 2. Employee rate

**General educational case: 12%.**

- Code s.16 default text is **10%**.
- The same 10%/12% structure existed in old Act s.6. **S.O. 320(E), 9 April 1997** is the historic notification that made **12%** the general operating rate. EPFO’s own COVID FAQ still treats S.O. 320(E) as the source of the residual **10%** classes.
- Code s.164(2)(a) saves old notifications to the extent not contrary to the Code. A 12% notification is not contrary to s.16; the Code expressly allows it.
- **No fresh Gazette substituting “twelve per cent.” under Code s.16 was found** in this audit.
- Live EPFO FAQ still states employee contribution as **12% of basic + DA + retaining allowance**.
- Ministry *Compliance Handbook* (Feb 2026) restates only the Code’s **10%** text and omits the 12% proviso. That handbook is incomplete for product use.

**10% still matters only for specified classes** (historically jute, beedi, brick, coir, guar-gum and similar under S.O. 320(E)). It should stay **outside** a general educational calculator, with one line that some establishments remain on 10%.

---

## 3. Employer total rate

**12% of the contribution wage** for a standard member in a 12% establishment.

Do **not** describe the employer EPF credit as 3.67% in all cases.

---

## 4. EPS diversion

Verified from EPFO FAQ and Code s.16(1)(b):

- **8.33%** of wages is diverted from the employer share to the Pension Fund, where the member is an EPS member.
- **Pensionable / EPS wage ceiling: ₹15,000.**
- If the member is **not** in EPS, the full employer 12% stays in EPF.

**Cases that differ (exclude from default scope):**

- **New joiner on/after 01.09.2014** with PF wages **> ₹15,000**: EPFO FAQ says the person may join EPF only under the higher-wage option, **cannot join EPS**, and **both 12% shares go to EPF**.
- **Higher-pension joint option**: EPS can be on actual higher pay, with extra 1.16% on pay above ₹15,000 in eligible cases. Not for this calculator.
- **EPS exit at 58**: employer 8.33% then typically remains in EPF. Not for this calculator.
- **10% establishments**: EPS 8.33% of ceiling is **not** reduced when the PF rate is 10% (EPFO COVID FAQ). Residual employer EPF then becomes about **1.67%**, not 3.67%.

---

## 5. Residual employer EPF share

**3.67% = 12% − 8.33%**, and **only** when both percentages apply to the **same** wage.

| Situation | Employer amount into EPF |
|---|---|
| Standard member, contribution wage ≤ ₹15,000, EPS applies | 3.67% of that wage |
| Standard member, actual PF wages > ₹15,000, contributing **only on the ceiling** | 3.67% of **₹15,000**, not of full wages |
| Higher-wage contributor, EPS still on ₹15,000 | `12% × actual PF wages − 8.33% × ₹15,000` |
| New excluded joiner > ₹15,000, no EPS | **12%** of actual PF wages (if contributing on higher wages) |
| 10% establishment, EPS on ceiling | about **1.67%** of contribution wage |

FOINWI’s `salary × 3.67%` is therefore correct **only** for the first row.

---

## 6. ₹15,000 ceiling treatment

**S.O. 2702(E), 29 May 2026** notifies ₹15,000 per month as the wage ceiling for Chapter III of the Code (s.2(89)).

Meaning, from Code + EPFO FAQ (old para 26 / 26(6) language still used on the live FAQ):

| Use | Meaning |
|---|---|
| **Coverage of the establishment** | 20+ employees (First Schedule). Employees above the ceiling still count for headcount. |
| **Who must join** | An employee at or below ₹15,000 PF wages is the ordinary mandatory member. |
| **Existing member whose wage later exceeds ₹15,000** | Remains a member. Statutory contribution is **restricted to ₹15,000** unless a higher-wage option is in force. |
| **New joiner already above ₹15,000** | Excluded unless a higher-wage option is exercised. EPS membership generally does **not** start. |
| **Contribution calculation** | Statutory shares are computed on **`min(PF wages, ₹15,000)`** unless higher-wage contribution applies. |
| **EPS / EDLI** | Pensionable and EDLI wages are also ceiling-capped unless a specific higher-pension option applies. |

Code s.2 “employee” **excepts the Provident Fund Scheme** from the “wages ≤ ceiling” employee definition. Higher-wage persons can still be EPF members. The ceiling still governs ordinary **contribution and EPS** treatment.

PF wages are **not** “basic salary” alone. Official wage for contribution is wages as defined for the scheme / Code (basic + DA + retaining allowance, and Code wage add-back can apply). Same caution as gratuity: do not tell visitors that basic always equals PF wages.

---

## 7. Higher-wage / VPF treatment

**VPF (higher rate on the statutory wage):** employee may contribute above the statutory 12%. Employer **need not** match. EPFO FAQ also describes voluntary + mandatory employee contribution up to ₹15,000/month when the statutory base is the ceiling.

**Higher-wage contribution (old para 26(6) / successor option):** employee and employer contribute on actual PF wages above ₹15,000. Employer matching is on that higher wage; EPS usually remains on ₹15,000 unless a joint higher-pension option exists.

**Product recommendation:** exclude both from v1. Default = statutory-ceiling member. If added later, it must be an **explicit optional mode**, never silent `salary × 15.67%`.

---

## 8. FY 2024-25 interest status

**Notified: 8.25%.**

- EPFO circular *Declaration of Rate of Interest for … 2024-25* (26.05.2025): Central Government approval under **para 60(1)** of the 1952 Scheme to credit **8.25%** for 2024-25. Authority: MoLE letter **R-11018/01/2023-SS-II dated 22.05.2025**.
- PIB PRID 2209767 repeats that Government approval.
- Ministry Annual Report (labour.gov.in, 2026 upload): interest **8.25% on monthly running balance** for 2024-25.
- CBT recommendation earlier that year (PIB PRID 2106914) is **not** the legal credit. The May 2025 Government approval is.

---

## 9. FY 2025-26 interest status

**FY 2025-26 EPF INTEREST RATE NOT DEFINITIVELY NOTIFIED IN SOURCES FOUND**

- PIB PRID 2234502 (2 March 2026): CBT **recommended 8.25%** for FY 2025-26 and said the rate **“would be officially notified by the Government of India, following which EPFO would credit”** it.
- No later Government approval letter, Gazette, or EPFO “Declaration of Rate of Interest … 2025-26” circular was found, of the kind that exists for 2024-25.
- CBT recommendation ≠ notified rate.

---

## 10. Interest-crediting methodology

Official method (EPFO FAQ Q.27; Annual Report 23.4; para 60 of the 1952 Scheme):

- **Compound interest on monthly running balance**
- At the **statutory rate declared for that year**
- Typically computed month-wise and credited to the member account (classically in March)

Estimator implication: `monthlyRate = annualRate/12` applied to each month’s closing balance is the right *family* of method. A continuous future-value annuity with contributions treated as an annuity-due is only an approximation. It ignores month-of-credit timing, in-year contribution dates, and year-by-year rate changes.

FOINWI currently uses:

`balance × (1 + r/12)^n + PMT × [((1+r/12)^n − 1) / (r/12)] × (1 + r/12)`

That is monthly compounding of an assumed constant rate, **not** stated as an EPFO running-balance estimate.

---

## 11. EPF Scheme 2026 impact on *this* calculator

**What is official**

- Scheme 2026 exists: **G.S.R. 525(E), 29.06.2026**, under Code s.15(1)(a), superseding the 1952 Scheme (PIB PRID 2283802).
- CBT also approved EPS 2026 and EDLI Scheme 2026 (PIB PRID 2234502). Those Gazette texts were **not** retrieved here.
- Code-era ceiling is confirmed: **₹15,000** (S.O. 2702(E)).
- Code contribution architecture is still 10% default / 12% by notification / EPS ≤ 8.33%.

**What is not verified from Scheme 2026 text**

- Whether Scheme 2026 changed the **12% / 8.33% / 3.67%** split
- Whether higher-wage / excluded-employee mechanics were rewritten
- Withdrawal / 25% retention stories circulating on non-government sites were **not** used

**For an accumulation estimator:** Scheme 2026 does **not**, on official sources found, justify dropping the wage ceiling or treating employer EPF as 3.67% of full salary. It does require the calculator to stop presenting itself as a 1952-only tool.

---

## 12. Exact current FOINWI discrepancies

Inspected: `EpfCalculator.jsx`, `EpfCalculatorPage.jsx`, `calculators.js`, `calculatorInsights.js`, `calculatorExplains.js`, `validateAllCalculators.js`. No dedicated EPF engine.

**Engine**

```15:21:src/components/EpfCalculator.jsx
const EPF_EMPLOYEE_RATE = 0.12;
const EPF_EMPLOYER_RATE = 0.0367;
// ...
const monthlyContribution = basicSalary * (EPF_EMPLOYEE_RATE + EPF_EMPLOYER_RATE);
```

| Item | FOINWI | Official / safe model | Effect |
|---|---|---|---|
| Employee rate | 12% of **full** “Monthly Basic Salary” (default ₹30,000, max ₹1,50,000) | 12% of **`min(PF wages, ₹15,000)`** in statutory mode | Default case overstates employee credit (₹3,600 vs ₹1,800) |
| Employer EPF | 3.67% of **full** salary | 3.67% of **contribution wage**, and only if EPS uses that same base | Default overstates employer EPF (₹1,101 vs ₹550.50) |
| Combined monthly EPF | 15.67% of ₹30,000 = **₹4,701** | Statutory ceiling: **₹2,350.50**. Higher-wage + EPS on 15k: **₹5,950.50** | Wrong in both common above-ceiling cases |
| Wage ceiling | None | ₹15,000 (S.O. 2702(E)) | Material miss |
| Wage label | “Monthly Basic Salary” | PF / statutory wages (basic + DA + RA; may differ after add-back) | Misstates the base |
| EPS | Invisible | 8.33% diverted; not part of EPF corpus | Visitor can think 3.67% is “the employer contribution” |
| Default interest | **8.15%** | Last **notified** rate: **8.25% (FY 2024-25)** | Stale |
| FY 2025-26 | Visitor-typed, no year label | Not notified in sources found | Risk of presenting 8.15/8.25 as current official |
| Interest method | Monthly FV, annuity-due style | Monthly running balance, annual declared rate | Approximate only; copy says “monthly compounding” as if that were the scheme |
| New joiner > ₹15k / no EPS | Not disclosed | Both 12% can go to EPF | Unsafe if visitor is in that class |
| VPF / higher wage | Not modelled; explains still mention “ignoring voluntary PF top-ups” | Optional / exclude | Copy and math disagree |
| Legal frame | None | Code + Scheme 2026 | Same gap gratuity already closed |
| Validator | Re-implements `0.12+0.0367` and `8.15` in `validateAllCalculators.js` | Should call a centralized engine | Tautological; no ceiling tests |
| Card | “Project your EPF retirement corpus.” | Educational estimate | Over-confident |

Insights still publish: `Monthly EPF = Basic × (12% + 3.67%)`.

---

## 13. Recommended calculator scope

**Educational EPF accumulation estimate for a standard member using statutory contribution assumptions.**

In scope:

- Already-enrolled standard member in a **12%** establishment
- Visitor-entered **monthly PF wages**
- Contribution wage = `min(PF wages, ₹15,000)`
- Employee 12% → EPF
- Employer 12% split: 8.33% EPS (shown, not added to corpus) + 3.67% EPF
- Current EPF balance + remaining years
- Illustrative interest = **last notified 8.25% (FY 2024-25)**, editable, labelled as an assumption
- Simplified monthly projection, disclosed as **not** an EPFO passbook

Out of scope:

- 10% industry classes
- VPF
- Higher-wage / para 26(6) mode (unless a later explicit toggle)
- New joiner excluded-employee / no-EPS cases
- Higher-pension joint option
- EDLI, admin charges, taxable inoperative-account rules
- Full payroll wage reconstruction
- FY 2025-26 rate until a Government notification is found

---

## 14. Authoritative official sources

| Source | Title / what it proves | URL |
|---|---|---|
| Code on Social Security, 2020 | s.16 10%/12% and EPS ≤ 8.33%; s.2(89) wage ceiling; s.164 repeal/savings | https://www.labour.gov.in/static/uploads/2025/07/b0620548445580767b5c0d18c95c26f7.pdf |
| Gazette S.O. 2702(E), 29 May 2026 | ₹15,000 Chapter III wage ceiling | https://egazette.gov.in/WriteReadData/2026/273002.pdf |
| PIB, 2 Mar 2026, PRID 2234502 | CBT recommends 8.25% for FY 2025-26 (**to be notified**); approves EPF/EPS/EDLI Scheme 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234502 |
| PIB, 12 Jul 2026, PRID 2283802 | EPF Scheme, 2026 issued as **G.S.R. 525(E) dated 29.06.2026** | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2283802 |
| EPFO circular 26.05.2025 | FY **2024-25** interest **8.25%** approved under para 60(1) | https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/DeclarationOfROI_2024_25.pdf |
| PIB PRID 2209767 | Same 2024-25 Government approval | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209767 |
| Ministry Annual Report (2026 upload) | 8.25% **on monthly running balance** for 2024-25 | https://www.labour.gov.in/static/uploads/2026/06/4b7ec0e8206aa4860576d6f75b432e97.pdf |
| EPFO FAQ | 12% / 8.33% / 3.67%; ₹15,000 membership & contribution; VPF; new joiner >15k no EPS; monthly running-balance interest | http://epfindia.gov.in/site_en/FAQ.php |
| EPFO COVID FAQ | S.O. 320(E) 09.04.1997 = 10% residual classes; 12% is the general rate | https://www.epfindia.gov.in/site_docs/PDFs/Updates/FAQ_Reduced_rate_of_contribution_20052020.pdf |
| MoLE Compliance Handbook, Feb 2026 | Code s.16 described as 10%; coverage 20+ employees | https://www.labour.gov.in/static/uploads/2026/02/83978455025732b99b0165def80ab171.pdf |

---

## 15. Required code changes (ranked)

**P0 — do before any “current rule” claim**

1. Stop `fullSalary × (12% + 3.67%)` above the ceiling.
2. Centralize rules: contribution wage = `min(pfWages, 15000)` in the default statutory mode.
3. Split the display: employee EPF 12%, employer total 12%, EPS 8.33%, residual employer EPF 3.67% — all on the contribution wage.
4. Relabel the input to PF / statutory wages, with helper that this may differ from basic.
5. Change default illustrative rate from **8.15%** to **8.25%**, labelled FY 2024-25 last notified rate. Do **not** present FY 2025-26 as notified.
6. Rewrite insights/explains so 3.67% is not “the employer contribution.”

**P1 — trust / scope**

7. Position as Code + Scheme 2026 educational estimate; do not claim Scheme 2026 changed the 12/8.33/3.67 split until the Gazette text is read.
8. Disclose monthly-running-balance vs simplified projection.
9. State new joiner > ₹15,000 / no-EPS and VPF / higher-wage are outside scope.
10. Dedicated `epfEngine` + real validator (ceiling, residual math, no NaN). Replace the tautological `validateAllCalculators` EPF block.
11. Soften card copy from “Project your EPF retirement corpus.”

**P2 — later, only if wanted**

12. Explicit higher-wage toggle with correct residual (`12% × actual − 8.33% × 15000`).
13. Optional VPF (employee only).
14. True month-by-month running-balance interest.
15. Swap in FY 2025-26 **after** a Government notification is found.

---

## 16. git status

```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

No files were modified in this audit.

---

### Bottom line for implementation

The earlier audit concerns are real, and two of them are worse than “stale constants”:

- **12% employee** is the right *general* rate to model, with a 10%-class disclaimer.
- **3.67% employer EPF on full salary** is not a general rule. It is only the residual on the **same** wage that EPS uses.
- **₹15,000 must be applied** in the default statutory mode. At the current default ₹30,000, the calculator roughly **doubles** statutory-ceiling EPF credits.
- **8.15% is not the last notified rate.** Use **8.25% (FY 2024-25)** as an illustrative assumption.
- **FY 2025-26 EPF INTEREST RATE NOT DEFINITIVELY NOTIFIED IN SOURCES FOUND.**

EPF P1 CURRENT-RULE AUDIT:  
READY FOR CTO REVIEW