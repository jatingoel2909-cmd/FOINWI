import { LOAN_TYPES } from "../../data/loanTypes";

function EmiLoanTypeSelector({ value, onChange }) {
  return (
    <div className="emi-loan-type">
      <p className="emi-loan-type__label" id="emi-loan-type-label">
        Loan Type
      </p>
      <div
        className="emi-loan-type__options"
        role="radiogroup"
        aria-labelledby="emi-loan-type-label"
      >
        {LOAN_TYPES.map((type) => {
          const selected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`emi-loan-type__option${selected ? " emi-loan-type__option--active" : ""}`}
              onClick={() => onChange(type.id)}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EmiLoanTypeSelector;
