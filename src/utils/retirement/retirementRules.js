/**
 * FOINWI educational retirement-planning rules.
 *
 * Primary model: visitor-selected retirement duration with monthly
 * beginning-of-month withdrawals, retirement-period inflation, and
 * post-retirement growth. Not a pension quote, adequacy certificate,
 * or personalised savings recommendation.
 *
 * 25× annual retirement-age expense is retained only as a secondary
 * educational comparison. It is not the primary corpus estimate.
 */

export const RETIREMENT_TITLE = "Illustrative retirement corpus estimate";
export const RETIREMENT_DESCRIPTION =
  "This illustration estimates a retirement-age corpus from the monthly expense, inflation, return, and retirement-duration assumptions you enter. It is educational only and is not a prediction of how long savings will last.";

export const RETIREMENT_PRIMARY_RESULT_LABEL = "Illustrative retirement corpus";
export const RETIREMENT_PROJECTED_SAVINGS_LABEL =
  "Projected value of current retirement savings";
export const RETIREMENT_SHORTFALL_LABEL = "Illustrative funding gap";
export const RETIREMENT_SURPLUS_LABEL = "Illustrative surplus of current savings at retirement";
export const RETIREMENT_CONTRIBUTION_LABEL = "Illustrative monthly contribution";
export const RETIREMENT_25X_LABEL = "25× simple comparison";
export const RETIREMENT_25X_NOTE =
  "Annual retirement-age expenses × 25. This is a simple educational comparison, not a prediction of how long a retirement corpus will last.";

export const RETIREMENT_CURRENT_AGE_LABEL = "Current age";
export const RETIREMENT_RETIREMENT_AGE_LABEL = "Retirement age";
export const RETIREMENT_EXPENSE_LABEL = "Current monthly expense";
export const RETIREMENT_PRE_INFLATION_LABEL =
  "Illustrative annual inflation assumption until retirement (%)";
export const RETIREMENT_PRE_RETURN_LABEL =
  "Illustrative annual return assumption until retirement (%)";
export const RETIREMENT_CORPUS_LABEL = "Current retirement savings";
export const RETIREMENT_YEARS_LABEL = "Illustrated years in retirement";
export const RETIREMENT_RET_INFLATION_LABEL =
  "Illustrative annual inflation assumption during retirement (%)";
export const RETIREMENT_POST_RETURN_LABEL =
  "Illustrative annual return assumption during retirement (%)";

export const RETIREMENT_PERIOD_SECTION_TITLE = "Retirement period assumptions";
export const RETIREMENT_PERIOD_SECTION_HELPER =
  "These assumptions help estimate how expenses and the retirement corpus may change after retirement. You can adjust them.";
export const RETIREMENT_AGE_HELPER =
  "Retirement age must be later than current age for this illustration to run.";
export const RETIREMENT_INVALID_AGE_NOTE =
  "This illustration needs a retirement age later than the current age. Equal or earlier retirement ages are not modelled.";
export const RETIREMENT_PRE_RETURN_HELPER =
  "Current retirement savings are grown to retirement using this annual compounding assumption. Future monthly contributions are illustrated separately and are not included in the projected value of current savings.";
export const RETIREMENT_CONTRIBUTION_HELPER =
  "The illustrative monthly contribution is a beginning-of-month estimate that would grow at the pre-retirement return assumption to cover the funding gap, if any.";
export const RETIREMENT_WITHDRAWAL_HELPER =
  "After retirement, the model withdraws that month’s illustrated living expense at the beginning of each month, then applies one month of post-retirement growth, then inflates the next month’s expense.";
export const RETIREMENT_STORY =
  "Under the assumptions entered, this illustration estimates a retirement-age corpus by modelling monthly withdrawals over the selected retirement years. Changing inflation, return, expense, or duration assumptions changes the estimate. Actual outcomes can differ because returns, inflation, expenses, taxes, fees, longevity, and timing vary.";

export const RETIREMENT_SIMPLE_25X_MULTIPLIER = 25;
export const RETIREMENT_CLOSED_FORM_Q_EQUAL_EPSILON = 1e-12;
export const RETIREMENT_DEPLETION_ABS_TOLERANCE = 1;
export const RETIREMENT_DEPLETION_REL_TOLERANCE = 1e-8;

export const RETIREMENT_DEFAULTS = Object.freeze({
  currentAge: 30,
  retirementAge: 60,
  currentMonthlyExpense: 50000,
  preRetirementInflationRate: 6,
  preRetirementReturnRate: 10,
  currentRetirementCorpus: 500000,
  retirementYears: 25,
  retirementInflationRate: 5,
  postRetirementReturnRate: 7,
});

export const RETIREMENT_INPUT_LIMITS = Object.freeze({
  currentAge: Object.freeze({ min: 18, max: 58, step: 1 }),
  retirementAge: Object.freeze({ min: 40, max: 70, step: 1 }),
  currentMonthlyExpense: Object.freeze({ min: 10000, max: 500000, step: 1000 }),
  preRetirementInflationRate: Object.freeze({ min: 0, max: 12, step: 0.5 }),
  preRetirementReturnRate: Object.freeze({ min: 0, max: 20, step: 0.5 }),
  currentRetirementCorpus: Object.freeze({ min: 0, max: 50000000, step: 50000 }),
  retirementYears: Object.freeze({ min: 1, max: 50, step: 1 }),
  retirementInflationRate: Object.freeze({ min: 0, max: 12, step: 0.5 }),
  postRetirementReturnRate: Object.freeze({ min: 0, max: 20, step: 0.5 }),
});

export const RETIREMENT_INVALID_AGE = "retirement-age-not-after-current";
export const RETIREMENT_INVALID_DURATION = "invalid-retirement-duration";
export const RETIREMENT_INVALID_INPUT = "invalid-numeric-input";
export const RETIREMENT_NUMERICAL_OVERFLOW = "numerical-overflow";
