# FOINWI Guided Assistant Blueprint

**Status:** Phase 2 planning  
**Product posture:** Educational, calculator-linked, and safety-first

## 1. Purpose

FOINWI Guided Assistant is a future educational layer that will help users:

- choose a calculator for a financial question;
- understand financial concepts in plain language;
- find relevant learning paths; and
- understand result sections based on the values they entered.

It is intended to reduce confusion and help users navigate FOINWI. It is not intended to make decisions for users.

## 2. Assistant scope

### Allowed

The Guided Assistant may:

- explain a calculator's purpose and inputs;
- route users to relevant FOINWI calculators;
- explain financial terms in educational language;
- suggest relevant FOINWI learning paths;
- explain calculator result sections in simple words;
- describe illustrative trade-offs, such as how a longer loan tenure may affect estimated total interest; and
- use language such as “based on your inputs” when explaining a calculator result.

### Not allowed

The Guided Assistant must not:

- provide personalized financial advice;
- make return guarantees or outcome assurances;
- make loan approval claims;
- provide tax or legal advice;
- recommend a bank, lender, investment product, or provider;
- collect sensitive personal data, including account credentials, card details, PAN, Aadhaar, or government-document images;
- make a final decision for a user; or
- present illustrative calculator outputs as certain outcomes.

When a request exceeds these boundaries, the assistant should state its educational limitation in clear language and direct the user to an appropriate qualified professional where relevant.

## 3. First guided flows

Each flow should begin with a simple goal selection and finish by routing to a FOINWI tool or learning resource. The initial release should use predefined choices and safe explanations rather than open-ended chat.

### EMI / Loan

**Goal:** Help users explore loan repayment concepts and suitable calculator paths.

**Entry choices**

- Estimate EMI
- Compare tenure
- Understand interest
- Explore prepayment

**Destinations**

- EMI Calculator
- Loan Prepayment Calculator
- Home Loan Eligibility Calculator
- Loans & EMI lesson

**Safe explanation pattern**

“Based on your inputs, this calculator can estimate a monthly instalment and total interest. A longer tenure may lower the estimated monthly EMI while increasing the time interest is charged.”

### SIP / Investment

**Goal:** Help users understand recurring investment planning concepts.

**Entry choices**

- Estimate a monthly SIP
- Understand compounding
- Explore inflation
- Plan toward a goal

**Destinations**

- SIP Calculator
- Lumpsum Calculator
- Inflation Calculator
- Goal Planner
- Investing basics lesson

**Safe explanation pattern**

“These illustrations show how regular contributions, time, and assumed returns can affect an estimated value. Actual market outcomes can differ.”

### Income Tax

**Goal:** Help users understand FOINWI's calculator inputs and estimated outputs.

**Entry choices**

- Estimate tax impact
- Understand taxable income
- Learn about deductions
- Compare calculator scenarios

**Destinations**

- Income Tax Calculator
- Tax basics lesson

**Safe explanation pattern**

“This calculator provides an educational estimate based on its stated assumptions and your inputs. It does not provide tax advice.”

### Goal Planning

**Goal:** Break an objective into understandable planning inputs.

**Entry choices**

- Estimate a goal amount
- Understand monthly contribution
- Explore the effect of time
- Understand inflation

**Destinations**

- Goal Planner
- SIP Calculator
- Inflation Calculator
- Goal planning lesson

**Safe explanation pattern**

“The estimate can show how a goal amount, timeline, and assumptions may relate to a monthly contribution. It is an illustrative planning view.”

### Retirement

**Goal:** Help users understand retirement-planning assumptions without directing a personal course of action.

**Entry choices**

- Estimate future expenses
- Understand inflation
- Understand a retirement corpus
- Explore monthly contribution estimates

**Destinations**

- Retirement Calculator
- SIP Calculator
- Inflation Calculator
- Retirement planning lesson

**Safe explanation pattern**

“This educational estimate uses the expenses and assumptions you enter. It may help you understand the relationship between inflation, time, and a future corpus.”

### Financial Health Score

**Goal:** Explain future health-score categories and learning pathways without rating users as approved, safe, or financially fit.

**Entry choices**

- Understand savings
- Understand debt
- Understand protection
- Explore planning gaps

**Destinations**

- Relevant FOINWI calculators
- Money basics learning path
- Future Financial Health Score experience

**Safe explanation pattern**

“A future score is intended to explain planning areas in an educational way. It would not determine creditworthiness, eligibility, or a financial outcome.”

## 4. Example user journey: Loan / EMI

1. User selects **Loan / EMI**.
2. The assistant presents four safe choices:
   - Do you want to estimate EMI?
   - Compare tenure?
   - Understand interest?
   - Explore prepayment?
3. The selected choice routes to the relevant destination:
   - **Estimate EMI** → EMI Calculator
   - **Compare tenure** → EMI Calculator comparison view
   - **Understand interest** → Loans & EMI lesson
   - **Explore prepayment** → Loan Prepayment Calculator
4. The assistant may also show links to Home Loan Eligibility Calculator and the Loans & EMI lesson when contextually relevant.
5. After a calculator result is available, the assistant can explain result labels and trade-offs based on displayed inputs. It must not advise the user to choose a lender, loan, tenure, or product.

## 5. Trust language rules

### Preferred language

Use:

- estimated
- illustrative
- educational
- may
- can
- based on your inputs

### Restricted language

Avoid:

- language that implies guaranteed returns;
- approved;
- best;
- assured;
- recommended bank;
- certain outcome.

### Copy checks

- Say “This calculator estimates…” rather than “You will get…”.
- Say “You may compare these scenarios…” rather than directing a user to take an action.
- Say “Educational explanation only” when presenting guidance.
- Attach a visible limitation notice to flows involving tax, legal, investment, lending, or official financial information.

## 6. Future technical architecture

The future implementation should keep the user interface, financial knowledge, calculator context, and guardrails separate.

### Frontend Guided Assistant

- Presents predefined goals, choices, and routes.
- Shows static educational explanations first.
- Uses accessible buttons, keyboard navigation, clear loading states, and visible limitations.
- Does not require login for the initial guided experience.

### Knowledge base

- Stores approved calculator descriptions, definitions, learning links, trust copy, and source references.
- Uses versioned, human-reviewed content.
- Separates general educational explanations from official financial-data references.

### Calculator result context

- Receives only the minimum displayed calculator inputs and outputs needed to explain a result.
- Uses calculator-specific result schemas rather than free-form personal profiles.
- Identifies the calculator version and assumptions used for an explanation.

### Guardrails

- Classifies and refuses out-of-scope requests.
- Blocks advice, approval, product recommendation, and sensitive-data collection prompts.
- Uses predefined escalation copy for tax, legal, investment, and lending questions.
- Logs safety events without retaining unnecessary personal data.

### Human-reviewed financial data

- Official rates, thresholds, and regulated information must have a source, review owner, effective date, and review date.
- Expired or unverified references must not be surfaced as current information.

### Rate limiting

- Applies per-session and per-IP limits before any future model-backed capability.
- Provides a calm retry message without encouraging users to share data elsewhere.

### Privacy controls

- Data minimization by default.
- Clear notice of what context is used in an explanation.
- No sensitive personal data collection in assistant prompts.
- Retention, deletion, and audit controls must be defined before a controlled AI beta.

## 7. Phase roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| Phase 1 | Static AI mission page | Done |
| Phase 2 | Guided assistant mock with predefined flows and static content | Next |
| Phase 3 | Rule-based guided assistant using reviewed routing and explanation rules | Planned |
| Phase 4 | Controlled AI chat beta with guardrails, rate limits, and privacy controls | Planned |
| Phase 5 | Personalized dashboard intelligence after consent, safety, and review requirements are met | Future |

## 8. Phase 2 acceptance criteria

Before Phase 2 moves beyond a mock:

- Every flow has an approved destination and educational explanation.
- Every flow includes an appropriate trust boundary.
- No flow requests or stores sensitive personal data.
- No copy implies advice, approval, certainty, or return assurance.
- Calculator links and learning links are tested.
- Mobile, keyboard, and screen-reader behaviour are reviewed.
- Product, compliance, and content owners approve the reviewed copy.
