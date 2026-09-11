GST P1 is implemented on a clean `5352acc` tree. Nothing was committed or pushed.

## 1. Pre-work Git status

- Branch: `main` = `origin/main`
- HEAD: `5352acc` — *Correct NPS calculator for current exit rules*
- Working tree was clean

## 2. Files changed

**Created**
- `src/utils/gst/gstRules.js`
- `src/utils/gst/gstEngine.js`
- `scripts/validateGst.js`

**Updated**
- `src/components/GstCalculator.jsx` — imports the production engine
- `src/utils/calculatorFormat.js` — `currencyPaise` parse/display
- `src/components/ui/InputField.jsx` — decimal keypad for paise
- `src/components/ui/calculator-ui.css` — illustration rate chips
- `scripts/validateAllCalculators.js` — real engine, not hardcoded literals
- `package.json` — `validate:gst`
- Direct GST copy in calculators, explains, insights, journeys, Learn, Guide

## 3. Locked product scope

Educational **transaction-level GST arithmetic** for a **visitor-entered applicable GST rate**.

Not a rate/HSN/SAC classifier, place-of-supply engine, CGST/SGST/IGST determiner, GSTR/ITC/composition/registration/cess/e-invoice calculator.

## 4. Centralized architecture

`GstCalculator.jsx` and `scripts/validateGst.js` both import `calculateGstEstimate` from `gstEngine.js`. Rules, labels, helpers, and two-decimal display live in `gstRules.js`.

## 5. Add-GST formula (unchanged identity)

`gstAmount = taxableValue * gstRatePercent / 100`  
`invoiceValue = taxableValue + gstAmount`

## 6. Extract-GST formula (Rule 35 identity)

`taxableValue = inclusiveAmount * 100 / (100 + gstRatePercent)`  
`gstAmount = inclusiveAmount - taxableValue`  
Equivalent: `inclusive × rate / (100 + rate)`  
**Not** `inclusive × rate / 100`.

## 7. Rate input / range

- Label: **Applicable GST rate (%)**
- Helper: FOINWI does **not** determine the legally applicable rate
- Range **0–40%**, step 0.25 on the slider; typed decimals allowed
- Manual entry supports **0, 0.25, 1.5, 3, 5, 18, 28, 40** and other finite rates including 12%
- Convenience chips: **0 / 5 / 18 / 28 / 40**, labelled as illustration choices, not a complete schedule
- **12% is not a chip**

## 8. 18% starting value

Default remains **18%**, with:

> 18% is only this calculator's starting value. It is not FOINWI's classification of your transaction.

## 9. Special decimal-rate support

Engine vectors: ₹10,000 @ **0.25%** → ₹25 / ₹10,025; **1.5%** → ₹150 / ₹10,150; **3%** → ₹300 / ₹10,300.

## 10. 0% safeguard

0% remains numeric. Copy states it does **not** determine exempt / nil-rated / zero-rated / outside GST.

## 11. CGST / SGST / IGST

One **combined GST component**. No intra/inter selector, no state fields. Beginner CGST/SGST-split copy removed.

## 12. Cess

Not modelled. Visible: **Compensation cess, where applicable, is not included.**

## 13. ITC / liability

Visible: transaction-level arithmetic only; **not** return liability or ITC. Output label is **GST component**, not payable/liability/net GST.

## 14. Validation / normalization

NaN / Infinity / negative amount or rate → `valid: false`, reason `invalid-input`, money fields **0**. Unknown/missing mode → `invalid-mode`. Visitor-visible money stays finite and nonnegative.

## 15. Monetary display / rounding

Internal values stay unrounded. Display uses **2 decimal places**. ₹999.99 @ 18% add: internal GST **179.9982**, invoice **1179.9882**; display **₹180.00** / **₹1,179.99**. Copy states this is **not** statutory invoice rounding.

## 16. Result labels

- Add: **GST-inclusive invoice value**, **Taxable value**, **GST component**
- Extract: **Taxable value**, **GST-inclusive amount**, **GST component**
- Amount field follows mode: taxable value vs GST-inclusive amount, with the requested helpers

## 17. Exact deterministic vectors

| ID | Result |
|---|---|
| A ₹1,000 @ 18% add | GST 180, invoice 1,180 |
| B 5% | 50 / 1,050 |
| C 28% | 280 / 1,280 |
| D 40% | 400 / 1,400 |
| E extract ₹1,180 @ 18% | taxable 1,000, GST 180 |
| F extract ₹1,050 @ 5% | taxable 1,000, GST 50 |
| G 0% | GST 0, invoice 1,000 |
| H ₹0 | all 0 |
| I ₹999.99 @ 18% | internal 179.9982 / 1179.9882; display ₹180.00 / ₹1,179.99 |
| J–L 0.25 / 1.5 / 3% | 25 / 150 / 300 |
| M invalid numbers | finite nonnegative zeros |
| N invalid mode | `invalid-mode` |
| O inclusive bug | GST **180**, not **212.40** |

## 18. `validate:gst`

**Passed: 133 checks.**

## 19. Regression results

| Command | Result |
|---|---|
| `npm run validate:gst` | 133 checks |
| `npm run validate:calculators` | GST uses production engine; all calculators passed |
| `npm run validate:trust` | 32 checks |
| `npm run validate:hardening` | 15 checks |
| `npm run lint` | passed |
| `npm run build` | passed |
| `validate:guide` / `validate:learn` | passed (extra) |

Browser click-through was not possible: the IDE browser and shell could not reach a live Vite server.

## 20. Remaining limitations

- Combined GST only; no CGST/SGST/IGST split
- No cess, composition, registration, ITC, HSN/SAC, or e-invoice logic
- Rate chips are a small illustration set, not the statutory schedule
- ₹1 crore amount cap is a product limit, disclosed as such
- Two-decimal display is a product rule, not invoice law

## 21. `git diff --stat`

```
 package.json                             |   1 +
 scripts/validateAllCalculators.js        |  21 ++--
 src/components/GstCalculator.jsx         | 198 +++++++++++++++++++++----------
 src/components/ui/InputField.jsx         |   2 +-
 src/components/ui/calculator-ui.css      |  32 +++++
 src/data/calculatorExplains.js           |  20 ++--
 src/data/calculatorInsights.js           |  22 ++--
 src/data/calculators.js                  |   2 +-
 src/data/journeys.js                     |   2 +-
 src/data/learnAcademy.js                 |   4 +-
 src/intelligence/guide/guideIntents.js   |   2 +-
 src/intelligence/guide/guideResources.js |   2 +-
 src/utils/calculatorFormat.js            |  15 ++-
 13 files changed, 224 insertions(+), 99 deletions(-)
```

Untracked (not in that stat): `scripts/validateGst.js`, `src/utils/gst/`.

## 22. Final git status

- Branch `main`...`origin/main`
- HEAD still `5352acc`
- Modified files listed above; untracked `scripts/validateGst.js` and `src/utils/gst/`
- **Not committed. Not pushed.**

---

GST P1 CORRECTION:  
READY FOR CTO REVIEW