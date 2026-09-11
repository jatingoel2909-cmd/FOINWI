# GST P1 current-rule audit — September 2026

Read-only. No code was modified. Nothing was committed or pushed.

---

## 1. Pre-work Git status / HEAD

| Item | Value |
|---|---|
| Branch | `main` tracking `origin/main` |
| Working tree | Clean |
| HEAD | `5352acc` — *Correct NPS calculator for current exit rules* |
| Full hash | `5352accc1a586b67a423964f20691b84ee89d2bd` |

---

## 2. Current GST legal framework (as of 10 September 2026)

**Separate these layers. Do not mix them.**

| Layer | What it is | FOINWI relevance |
|---|---|---|
| **GST arithmetic** | How tax is computed from a given taxable value and a given rate | Calculator’s only real job |
| **Statutory GST rates** | Rates notified by Government on GST Council recommendation | Visitor must enter/select; FOINWI must not classify |
| **Supply classification** | Which HSN/SAC and which notification entry apply | **Not modelled** |
| **Place of supply / intra vs inter** | CGST+SGST/UTGST vs IGST | **Not modelled** |
| **Registration / composition / e-invoice** | Thresholds and special schemes | **Not in GST calculator surfaces** |
| **FOINWI educational assumptions** | Defaults, slider caps, labels, rounding | Must be labelled as such |

**Levy (in force)**

- Intra-State: CGST levied under **CGST Act, 2017, s.9(1)** on value under **s.15**, at notified rates **not exceeding 20%**. Alcohol for human consumption (and specified ENA) is outside the levy. Specified petroleum products await a notified levy date (s.9(2)).  
  Source: [CBIC taxinformation, s.9](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter3/section9_v1.00.html).
- Inter-State: IGST levied under **IGST Act, 2017, s.5(1)** at notified rates **not exceeding 40%**.  
  Source: [CBIC taxinformation, s.5](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chapteriii/section5_v1.00.html).
- Combined intra-State 40% is legally possible as **20% CGST + 20% SGST/UTGST** without raising the CGST ceiling.

**Inclusive-of-tax valuation**

- **CGST Rules, 2017, Rule 35**:  
  `Tax amount = (Value inclusive of taxes × tax rate %) / (100 + sum of tax rates as applicable)`  
  Source: [CBIC taxinformation, Rule 35](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter4/rule35_v1.00.html).

**Council recommendation vs notified law**

- **56th GST Council** (PIB, **3 September 2025**): recommended a “Simple Tax” of merit **5%**, standard **18%**, de-merit **40%**, and asked for implementation from **22 September 2025**, with tobacco/pan masala/cigarettes/bidi remaining on old GST + compensation cess until a later notified date.  
  Source: [GST Council-hosted PIB press release](https://gstcouncil.gov.in/sites/default/files/2025-09/press_release_press_information_bureau_0.pdf).
- That is a **Council recommendation**, not itself law.
- **Notified law:** rate notifications dated **17 September 2025**, generally **effective 22 September 2025** (confirmed in the GST Council September 2025 newsletter and, for services, in Notification **15/2025-CTR**’s commencement clause).  
  Source: [GST Council September 2025 newsletter](https://gstcouncil.gov.in/sites/default/files/2025-10/september_newsletter.pdf).
- **No later general rate overhaul was found as notified law through 10 September 2026.** The 57th GST Council meeting is reported as rescheduled to **7 October 2026** and has not yet sat. Treat any 57th-meeting discussion as **not law**.

---

## 3. Exact existing FOINWI implementation

**Production math lives only in** `src/components/GstCalculator.jsx`. It is **not exported**. There is no `gstEngine`, no shared utility, no rate-preset buttons.

**Page:** `src/pages/GstCalculatorPage.jsx` — shell only.

**Exact formula (production):**

```18:36:src/components/GstCalculator.jsx
function calculateGst(amount, rate, type) {
  if (type === "add") {
    const gstAmount = amount * (rate / 100);
    return {
      baseAmount: amount,
      gstAmount,
      totalAmount: amount + gstAmount,
    };
  }

  const baseAmount = amount / (1 + rate / 100);
  const gstAmount = amount - baseAmount;

  return {
    baseAmount,
    gstAmount,
    totalAmount: amount,
  };
}
```

**Inputs**

| Input | Control | Limits | Default |
|---|---|---|---|
| Amount | `CurrencyInput` (integer parse) | min **₹100**, max **₹1,00,00,000**, step **100** | **₹10,000** |
| GST Rate (%) | `InputField` percent | min **0**, max **28**, step **0.5** | **18** |
| Calculation Type | `<select>` | `add` / `remove` | **`add`** (“Add GST”) |

**No** CGST/SGST/IGST split. **No** intra/inter choice. **No** cess. **No** composition. **No** ITC. **No** HSN/SAC. **No** place-of-supply.

**Output labels:** primary **Total Amount**; metrics **Base Amount**, **GST Amount**, **GST Rate**.

**Story copy:** “GST splits an invoice into taxable value and tax component. The same rate can be used to add GST or extract it from an inclusive total.”

**Header copy:** “Estimate base amount, Goods and Services Tax (GST) component, and total for **common Indian GST rates**.”

**Other production surfaces inspected**

| Surface | What it currently says |
|---|---|
| `calculators.js` | “Add or remove GST from any amount.” |
| `calculatorExplains.js` | Arithmetic of add vs extract; beginner mistakes include “wrong rate for goods vs services categories” and “Confusing CGST/SGST components with the total rate” |
| `calculatorInsights.js` | Documents the two formulas; “estimated”; “simplified tax assumptions” |
| `journeys.js` (Save Tax) | “Understand GST on purchases and invoices.” |
| `learnAcademy.js` | Inclusive vs exclusive prices; “A calculator performs arithmetic, not compliance.” |
| `guideIntents.js` (`tax-gst`) | “useful for understanding the arithmetic, not for determining compliance” |
| `guideResources.js` | “Add or remove Goods and Services Tax from an amount.” |
| `financialConcepts.js` | GST is only a tag on the generic Tax concept |
| `scripts/validateAllCalculators.js` | Hardcoded GST object; **does not import production** |

**Not present anywhere in FOINWI GST-adjacent copy:** composition scheme, e-invoice, e-way bill, registration thresholds (₹20 lakh / ₹40 lakh), cess, CGST/SGST/IGST amounts.

---

## 4. Forward-GST formula

**Production add mode:**

\[
\text{GST} = \text{amount} \times \frac{\text{rate}}{100}
\]
\[
\text{total} = \text{amount} + \text{GST}
\]

When the user-entered amount is treated as **taxable value**, this is the standard tax-exclusive identity.

**Verdict:** arithmetic is **correct** for a visitor-entered rate.

---

## 5. Inclusive / reverse-GST formula

FOINWI **does** support GST-inclusive pricing via **Remove GST**.

**Production:** `baseAmount = amount / (1 + rate/100)`, `gstAmount = amount - baseAmount`.

Algebraically identical to:

\[
\text{taxableValue} = \text{inclusive} \times \frac{100}{100 + \text{rate}}
\]
\[
\text{GST} = \text{inclusive} \times \frac{\text{rate}}{100 + \text{rate}}
\]

This matches **Rule 35** (single combined rate in the denominator).

**It does not use the common bug** `inclusive × rate / 100`.

**UI distinction:** “Add GST” vs “Remove GST”. It does **not** use the words “GST-inclusive price”, “tax exclusive”, or “extract GST”. The amount field is labelled only **Amount**, so a first-time visitor can still apply the wrong mode. That is a **mode-clarity** issue, not a formula bug.

---

## 6. Rate presets

There are **no rate buttons**. The only control is a **0–28%, step 0.5** slider, default **18**.

So 5 / 12 / 18 / 28 are all enterable. **40% is not.** **0.25% is not** (step 0.5). **1.5% and 3% are enterable.**

---

## 7. Special-rate findings (notified, September 2026)

From **Notification 9/2025-Integrated Tax (Rate) dated 17-9-2025** (corrigendum 18-9-2025), superseding 01/2017-ITR, IGST (combined) goods schedules:

| Schedule | Notified IGST rate |
|---|---|
| I | **5%** |
| II | **18%** |
| III | **40%** |
| IV | **3%** |
| V | **0.25%** |
| VI | **1.50%** |
| VII | **28%** (narrow residual list: pan masala, specified tobacco/nicotine goods) |

**There is no 12% goods schedule in this superseding notification.**

Corresponding **Notification 09/2025-CTR** dated 17.09.2025 is listed in the GST Council September 2025 newsletter as superseding 01/2017-CTR with the same Schedules I–VII. Twin UTGST/ITR notifications 9/2025–17/2025 are also listed there.

**Compensation cess:** Notification **02/2025-Compensation Cess (Rate) dated 17.09.2025** removes cess except pan masala, gutkha, cigarettes and chewing tobacco, effective **22.09.2025** (GST Council newsletter). Council/PIB still say specified tobacco items remain on **old GST + cess** until a later notified transition. Schedule VII of 9/2025-ITR still lists those goods at **28%**. Treat the **tobacco 40% transition date as later-to-be-notified** unless a 2026 commencement notification is produced.

**Services (Notification 15/2025-CTR, 17.09.2025, w.e.f. 22.09.2025)** — official PDF hosted by Karnataka GST at [gst.karnataka.gov.in … CTR1518925.pdf](https://gst.karnataka.gov.in/Documents/NOTIFICATIONS/CTR1518925.pdf):

- Many former **6% CGST (12% combined)** service entries were moved to **2.5% or 9% CGST** (5% or 18% combined).
- Special service rates remain, e.g. diamond job-work **0.75% CGST** (1.5% combined); some entertainment entries **20% CGST** (40% combined).
- Whether **every** 12% service entry in 11/2017-CTR as amended is gone is **NOT DEFINITIVELY VERIFIED** (would require the full as-amended services table, not only the amending notification).

**What a generic FOINWI calculator should safely offer**

Common presets (0, 5, 18, 28, 40) as **educational conveniences**, plus a **free numeric rate**, with copy that they **do not cover every notified supply**. Do **not** claim the old 0/5/12/18/28 set is the current complete story. Keep **cess, composition, and classification out**.

---

## 8. Nil / exempt / zero-rated / non-GST

FOINWI only offers a numeric **0%**. It does **not** currently label 0% as “exempt”. Learn copy is generic. **Do not equate these:**

| Concept | Legal basis | Calculator treatment |
|---|---|---|
| **0% / nil-rated** | A notified nil rate on a taxable supply | Numeric 0% is only this |
| **Exempt** | CGST **s.2(47)**: nil-rated **or** wholly exempt under CGST s.11 / IGST s.6, **and includes non-taxable supply** | Not modelled |
| **Zero-rated** | IGST **s.16**: exports; SEZ supplies for authorised operations. ITC/refund mechanics differ from a simple 0% domestic invoice | Not modelled |
| **Non-GST / non-taxable** | e.g. alcoholic liquor excluded from s.9/s.5; specified petroleum awaiting levy | Not modelled |

**Recommendation:** if 0% remains, label it **“0% rate”** with a caveat that this is **not** a determination that the supply is exempt, nil-rated, zero-rated, or non-GST.

Source for exempt: [CBIC s.2(47)](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter1/section2_v1.00.html).  
Source for zero-rated: [CBIC IGST s.16](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chaptervii/section16_v1.00.html).

---

## 9. CGST / SGST / IGST treatment

FOINWI currently shows **one combined GST amount**. It does **not** assume intra-State or inter-State. That is the **safer** current design.

Legal arithmetic, **only after the user (or a real invoice) has already classified the supply:**

- Intra-State: CGST + SGST/UTGST. For an equal split of a combined rate: **CGST = GST/2**, **SGST = GST/2**.
- Inter-State: **IGST = GST**.

FOINWI has **no** place-of-supply model and **must not** infer intra vs inter from state names.

**Recommendation:** keep a single combined GST figure for P1, **or** add an explicit user choice labelled as **visitor-provided transaction treatment**, not FOINWI legal determination.

---

## 10. Place-of-supply assumptions

**None in code.** Copy mentions CGST/SGST confusion as a beginner mistake even though the UI never splits — slightly confusing, not a false determination.

**Preferred P1 choice: A — avoid the split entirely.**  
Optional later: B — user chooses Intra-state / Inter-state.

Do **not** build place-of-supply adjudication.

---

## 11. Composition references

**None** in FOINWI GST calculator, Learn GST lesson, insights, or guide.

Background law (do **not** add to this calculator):

- CGST **s.10**: composition in lieu of s.9 tax; person **shall not collect tax** from the recipient (s.10(4)).
- Act turnover gate: **₹50 lakh**, notifyable up to **₹1.5 crore**.
- Rule 7 (CGST Rules compilations on CBIC): manufacturer **0.5% CGST**, restaurant (Sch. II para 6(b)) **2.5% CGST**, other goods suppliers **0.5% CGST**, s.10(2A) **3% CGST**. Combined figures often quoted as ~1% / ~5% / ~6% include the State/UT twin.

**Current notified composition turnover (₹1.5 crore vs special-category ₹75 lakh) is NOT DEFINITIVELY VERIFIED for September 2026** from a 2025–26 primary notification in this audit. Irrelevant if composition stays out.

**Recommendation:** keep composition **out**. Those rates are not ordinary invoice GST.

---

## 12. Registration-threshold references

**None** in FOINWI GST surfaces.

Background (do **not** add to the calculator):

- CGST **s.22(1)**: general **₹20 lakh**; special-category default **₹10 lakh**, enhanceable to **₹20 lakh**; exclusive-goods suppliers enhanceable to **₹40 lakh** at a State’s request.
- GST Council FAQ (PIB 3 Sep 2025): **no change** to the goods registration threshold in the 56th-meeting reforms.  
  Source: [GST Council-hosted FAQ](https://gstcouncil.gov.in/sites/default/files/2025-09/faq.pdf).
- **s.24** compulsory-registration cases (including many inter-State supplies) still exist.

Do **not** publish “₹20 lakh always” or “₹40 lakh always”.

---

## 13. E-invoice / e-way bill references

**None** in FOINWI GST-adjacent copy. GST Council FAQ Q.12 only clarifies that existing e-way bills need not be regenerated solely because of the 22 Sep 2025 rate change.

**Recommendation:** do **not** add operational thresholds to this calculator. Current numeric e-invoice / e-way thresholds were **not** re-verified because they are out of product scope.

---

## 14. Rounding

| Layer | Behaviour |
|---|---|
| Engine | Full IEEE float; no statutory rounding |
| Display | `formatCurrency` → `Intl.NumberFormat("en-IN")`, **0 fraction digits** (nearest rupee) |
| Amount input | Integers only (`parseIntegerInput`) |
| CGST/SGST split | N/A |

**CGST s.170** rounds **tax, interest, penalty, fee, refund or other sum payable/due under the Act** to the nearest rupee (50 paise up). Source: [CBIC s.170](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter21/section170_v1.00.html). That is **not** verified here as a mandate to rupee-round every educational invoice line.

**Recommended deterministic product rule (not claimed as invoice law):**

1. Keep unrounded values internally.  
2. Display **two decimal places (paise)** for Base, GST, and Total **or**  
3. If rupee display is kept: round GST, then set Total = Base + rounded GST (add mode) so the three labels always reconcile.  
4. Do **not** tell visitors this is statutory invoice rounding.

Integer ₹1,000 at 5/18/28% is exact, so current display matches for the main vectors. Paise amounts (blocked by UI today) can make Base + GST ≠ displayed Total.

---

## 15. Defaults

| Default | Value | Trust issue |
|---|---|---|
| Amount | ₹10,000 | Educational starting value; not labelled as such |
| Rate | **18%** | Matches the current **standard notified rate**, but copy never says this is **only a starting value**, not FOINWI’s classification of the user’s supply |
| Mode | Add GST | OK if labels improve |
| Rate UI | Continuous slider 0–28 | Caps out below notified **40%** |

18% as default is acceptable **if** copy says so. Silent default + “common Indian GST rates” is the problem.

---

## 16. Validation behaviour

**UI (`InputField` + `clamp`):**

- Below min → clamped to min (amount ₹100, rate 0%).  
- Above max → clamped (amount ₹1 crore, rate 28%).  
- Empty blur → `limits.min`.  
- Amount cannot be 0, negative, or paise.  
- Rate cannot be 40%, 0.25%, or >28.

**Engine:** no NaN / Infinity / negative / finite guards. Direct calls with `NaN`/`Infinity` would produce non-finite outputs. The live UI cannot currently feed those values.

**Zero rate:** works (GST 0, total = amount).  
**Zero amount:** engine would return zeros; UI forbids it.

---

## 17. ITC / liability wording

FOINWI does **not** currently say “tax payable”, “GST liability”, “net GST”, or “input credit” on the GST calculator.

Insights: “Estimated tax amount when GST is added.” Guide: arithmetic, not compliance.

**Gap:** there is still **no explicit sentence** that this is **not** return liability after ITC.

**Required visitor sentence (do not build GSTR computation):**

> This calculator estimates transaction-level GST arithmetic only. It does not calculate GST return liability or input tax credit.

---

## 18. Discrepancies

| # | Finding | Severity |
|---|---|---|
| 1 | Forward and reverse formulas are **correct** | None (math) |
| 2 | Inclusive identity is **not** the reverse-GST bug | None (math) |
| 3 | Copy “**common Indian GST rates**” + **hard max 28%** after notified **40%** de-merit and surviving special rates | **P0** current-rule framing |
| 4 | 18% default without “starting value only” | **P1** |
| 5 | Explains “wrong rate for **goods vs services categories**” implies classification | **P1** |
| 6 | Mentions CGST/SGST confusion but never splits | **P2** |
| 7 | Amount label does not say taxable vs GST-inclusive | **P1** |
| 8 | Slider cannot enter 40% or 0.25% | **P1** (if rate remains visitor-entered) |
| 9 | 12% is still enterable; it is **no longer a general goods slab** | Educational, not a code bug |
| 10 | Validator does not import production; tautological hardcoded 10000/1800/11800 | **P1** |
| 11 | Display rupee-rounding can desync Base+GST vs Total for paise | **P1** product rule |
| 12 | Engine has no finite/nonnegative guard | **P1** |
| 13 | No ITC / not-a-classifier disclaimer on the calculator itself | **P1** |
| 14 | Learn/guide GST copy is comparatively safe | Keep |

---

## 19. Deterministic vectors

Using **current production identities** (unrounded). Display is nearest rupee.

| ID | Inputs | Engine | Display (₹0 dp) | Notes |
|---|---|---|---|---|
| **A** | Add 18% on ₹1,000 | GST 180, total 1,180 | Same | Pass |
| **B** | Add 5% on ₹1,000 | GST 50, total 1,050 | Same | Pass |
| **C** | Add 28% on ₹1,000 | GST 280, total 1,280 | Same | Pass |
| **D** | Remove 18% on ₹1,180 | taxable 1,000, GST 180 | Same | Pass; **not** 1,180×18% |
| **E** | Remove 5% on ₹1,050 | taxable 1,000, GST 50 | Same | Pass |
| **F** | Add 0% on ₹1,000 | GST 0, total 1,000 | Same | Pass |
| **G** | Zero amount | all 0 | UI min ₹100 | Engine vs UI split |
| **H** | ₹999.99 @ 18% add | GST **179.9982**, total **1179.9882** | typically ₹180 / ₹1,180; base ₹1,000 | **UI cannot enter paise** |
| **I** | Intra-state 18% split | — | — | **Not implemented** |
| **J** | Inter-state 18% IGST | — | — | **Not implemented** |
| **K** | negative / NaN / Infinity | non-finite or negative possible | UI clamps | Engine unguarded |
| **40%** | Add 40% on ₹1,000 | would be GST 400, total 1,400 | **UI blocked at 28** | Current-rule gap |

Inclusive check: `1180 × 18/100 = 212.4` (**wrong**). Production uses `1180 × 18/118 = 180` (**correct**).

---

## 20. Recommended product scope

**Narrowest useful calculator:**

> Educational transaction-level GST arithmetic calculator for a visitor-entered applicable GST rate.

**Modes**

1. Add GST to taxable value  
2. Extract GST from a GST-inclusive value  

**Optional (not required for P1):** visitor chooses Intra-state / Inter-state **as their treatment**, then show CGST+SGST or IGST.

**Explicitly not**

- GST rate classifier  
- Registration advisor  
- Return-filing / GSTR calculator  
- ITC calculator  
- Composition calculator  
- Place-of-supply adjudicator  
- Cess calculator  

Safe visitor wording:

> Enter or select the GST rate applicable to your transaction. Rate classification can depend on the goods or services, the notification, and the facts of the transaction. FOINWI does not determine the legally applicable rate. 18% is only this calculator’s starting value.

---

## 21. P0 / P1 / P2 changes (recommend only — do not implement)

### P0

1. Stop describing the tool as covering “**common Indian GST rates**” while capping at **28%**. After 22 Sep 2025, notified combined rates include **40%**, plus special goods rates **0.25% / 1.5% / 3%**, and a residual **28%** tobacco schedule.  
2. Do not imply FOINWI knows the visitor’s applicable rate (default 18% + goods-vs-services beginner-mistake copy).  
3. Do not equate GST amount with return **liability** or with **exempt/zero-rated** treatment (currently mostly avoided; lock this in).

### P1

1. Central engine + rules module; calculator imports it.  
2. Mode labels: **Add GST to taxable value** / **Extract GST from GST-inclusive amount**. Rename Amount by mode.  
3. Visitor-entered rate; raise numeric max so **40% can be typed** as illustration, not as FOINWI classification.  
4. Explicit 18% = **starting value only**.  
5. ITC / not-a-classifier / not-cess disclaimer on the calculator.  
6. 0% labelled as **0% rate**, not exempt.  
7. Validator imports production; cover vectors A–H and K.  
8. Finite, nonnegative engine outputs.  
9. One reconciling display-rounding rule.  
10. Keep CGST/SGST/IGST **optional**; if added, user-declared treatment only.

### P2

1. Optional convenience chips (0 / 5 / 18 / 28 / 40) clearly “not a complete schedule”.  
2. Optional 0.25 / 1.5 / 3 as advanced convenience.  
3. Labels: Taxable value / GST component / Invoice value.  
4. Learn polish on nil vs exempt vs zero-rated.  
5. Drop CGST/SGST beginner-mistake unless a split is actually offered.

---

## 22. Validator weaknesses

Current GST block in `scripts/validateAllCalculators.js`:

- **Does not import** `calculateGst` (and cannot: it is not exported).  
- **Reimplements** remove as `11800 / 1.18`.  
- **Hardcodes** add as `{ 10000, 1800, 11800 }`.  
- Asserts its own literals. **Tautological.**  
- Misses inclusive-bug detection, 5/28/0%, paise, 40%, NaN/Infinity, UI/engine limit mismatch.

If P1 is implemented later: `src/utils/gst/gstRules.js`, `gstEngine.js`, `scripts/validateGst.js` importing the engine.

---

## 23. Recommended centralized architecture (no implementation)

```
src/utils/gst/gstRules.js     // scope, labels, rate bounds, disclaimers, source notes
src/utils/gst/gstEngine.js    // add / extract; optional user split; finite guards
scripts/validateGst.js        // vectors A–K plus 40% and Rule 35 identity
GstCalculator.jsx             // UI only; import engine
```

Keep statutory notes in `gstRules.js` as **educational metadata**, not as a classifier.

---

## 24. Authoritative primary sources

| Source | What it establishes | Date / number |
|---|---|---|
| [CBIC CGST s.9](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter3/section9_v1.00.html) | Intra-State levy, 20% ceiling | Act 2017; ENA exclusion via Finance (No. 2) Act 2024 s.114 |
| [CBIC IGST s.5](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chapteriii/section5_v1.00.html) | Inter-State levy, 40% ceiling | Act 2017 |
| CGST s.15 | Value of taxable supply | Act 2017 |
| [CBIC Rule 35](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter4/rule35_v1.00.html) | Inclusive-tax split formula | CGST Rules 2017 |
| [CBIC CGST s.2(47)](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter1/section2_v1.00.html) | Exempt supply definition | Act 2017 |
| [CBIC IGST s.16](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_IGST_Act/active/chaptervii/section16_v1.00.html) | Zero-rated (export / SEZ authorised operations) | Act 2017 as amended |
| [CBIC CGST s.10](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter3/section10_v1.00.html) | Composition; no tax collection | Act 2017 |
| [CBIC CGST s.22](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter6/section22_v1.00.html) | Registration thresholds | Act 2017 as amended |
| [CBIC CGST s.170](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter21/section170_v1.00.html) | Rounding of amounts payable/due | Act 2017; w.e.f. 1 Jul 2017 |
| [PIB / GST Council 56th meeting press](https://gstcouncil.gov.in/sites/default/files/2025-09/press_release_press_information_bureau_0.pdf) | **Recommendation** of 5 / 18 / 40; 22 Sep 2025 target; tobacco later | Posted 3 Sep 2025 |
| [GST Council FAQ](https://gstcouncil.gov.in/sites/default/files/2025-09/faq.pdf) | Effective date; registration threshold unchanged | PIB 3 Sep 2025 |
| [GST Council Sep 2025 newsletter](https://gstcouncil.gov.in/sites/default/files/2025-10/september_newsletter.pdf) | Lists **09/2025-CTR** … **17/2025-CTR**, ITR/UTR twins, **02/2025-Compensation Cess (Rate)**; 22.09.2025 | Council site, Oct 2025 upload |
| Notification **9/2025-ITR** 17-9-2025 (corr. 18-9-2025) | Goods IGST schedules 5 / 18 / 40 / 3 / 0.25 / 1.50 / 28 | Text retrieved from CBIC courier host: `courier.cbic.gov.in/ECCS/advisory/2025/NOTIFICATION NO. 9_2025-INTEGRATED TAX (RATE)-1759486719.pdf` (ICAI-formatted reprint of the notification) |
| Notification **15/2025-CTR** 17-9-2025 | Amends 11/2017-CTR; **w.e.f. 22 Sep 2025**; G.S.R. cited in reprints as **663(E)** | Official PDF: [gst.karnataka.gov.in CTR1518925.pdf](https://gst.karnataka.gov.in/Documents/NOTIFICATIONS/CTR1518925.pdf) |

**Council vs notification:** 3 Sep 2025 PIB is recommendation. 17 Sep 2025 notifications are the instruments. 22 Sep 2025 is the general commencement for services and for goods other than the specified tobacco basket.

---

## 25. NOT DEFINITIVELY VERIFIED

1. **Gazette G.S.R. number and full commencement clause** of **09/2025-Central Tax (Rate)** from a CBIC HTML page. Newsletter + ITR twin + 15/2025 commencement are used instead. The GST Council `cgst-rate-notification` listing fetched in this audit still **stops at 08/2025** and is stale as a catalogue.  
2. **Complete residual 12% service list** after 15/2025. Many 12% service entries were moved; **not proven that none remain**.  
3. Whether the **tobacco/pan masala 40% + cess-off transition** was later notified before September 2026. Council said later date; Schedule VII 28% still appears in 9/2025-ITR.  
4. **Current notified composition turnover** (₹1.5 crore / special-category figure) as of Sep 2026.  
5. **Current e-invoice and e-way numeric thresholds** (out of FOINWI GST copy; not re-verified).  
6. Whether **s.170** governs educational invoice-line display (it governs amounts payable/due under the Act).  
7. Exact **G.S.R.** of 9/2025-ITR from the Gazette PDF cover (courier text is an ICAI-formatted reprint on a CBIC host).  
8. Any **2026** Central/Integrated Tax (Rate) notification that would have rewritten the Sep 2025 slabs — **none found**; still not a proof that none exists on an unindexed Gazette page.

---

## 26. Final Git status

Unchanged from pre-work:

- Branch `main` = `origin/main`  
- Working tree clean  
- HEAD `5352acc` *Correct NPS calculator for current exit rules*

No files modified.

---

### Bottom line for CTO

**Math is sound.** Add GST and Remove GST implement the exclusive and Rule-35 inclusive identities. The inclusive bug is **not** present.

**Current-rule trust is not.** The product still behaves like a pre-22-Sep-2025 “common rates up to 28%” widget: silent **18%** default, **28% cap**, and “common Indian GST rates” copy, while notified law now includes **40%** and special rates **0.25% / 1.5% / 3%**, and **12% is no longer a general goods slab**. FOINWI correctly avoids classifying supplies, splitting CGST/SGST/IGST, and inventing registration/composition/e-invoice numbers — keep that restraint.

**P1 shape:** visitor-entered-rate arithmetic only; two clear modes; honest rate bounds and disclaimers; real engine + validator. Not a classifier, not a GST return, not composition, not cess, not place-of-supply.

---

GST P1 CURRENT-RULE AUDIT:  
READY FOR CTO REVIEW