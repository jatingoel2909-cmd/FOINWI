import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CURRENCY_PAIR, QUICK_CURRENCY_PAIRS } from "../../data/currencyMetadata";
import { fetchCurrencies, fetchExchangeRate, getExchangeErrorMessage } from "../../services/exchangeRatesClient";
import {
  convertAmount,
  formatCurrencyAmount,
  formatTimestamp,
  normalizeCurrencies,
} from "../../utils/exchangeRates";
import CurrencyCombobox from "./CurrencyCombobox";

const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

function isStale(rate) {
  return rate && Date.now() - new Date(rate.sourcePublishedAt).getTime() > STALE_AFTER_MS;
}

function ExchangeConverter() {
  const [amountText, setAmountText] = useState("1");
  const [base, setBase] = useState(DEFAULT_CURRENCY_PAIR.base);
  const [quote, setQuote] = useState(DEFAULT_CURRENCY_PAIR.quote);
  const [currencies, setCurrencies] = useState([]);
  const [currencyError, setCurrencyError] = useState("");
  const [rateResult, setRateResult] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [currencyReloadToken, setCurrencyReloadToken] = useState(0);
  const amount = Number(amountText);
  const validAmount = amountText.trim() !== "" && Number.isFinite(amount) && amount >= 0 && amount <= 1e15;
  const isSameCurrency = base === quote;
  const rateRequestKey = `${base}:${quote}:${refreshToken}`;
  const isCurrentRateResult = rateResult?.key === rateRequestKey;
  const rate = !isSameCurrency && isCurrentRateResult && rateResult.status === "ready"
    ? rateResult.rate
    : null;
  const rateState = isSameCurrency
    ? "ready"
    : !currencies.length
      ? currencyError ? "error" : "loading"
      : isCurrentRateResult ? rateResult.status : "loading";
  const rateError = !isSameCurrency && isCurrentRateResult && rateResult.status === "error"
    ? rateResult.error
    : "";
  const convertedAmount = isSameCurrency && validAmount
    ? amount
    : rate && validAmount
      ? convertAmount(amount, rate.rate)
      : null;
  const stale = isStale(rate);

  useEffect(() => {
    let active = true;

    fetchCurrencies()
      .then((payload) => {
        if (!active) return;
        const normalized = normalizeCurrencies(payload.currencies);
        if (
          !normalized.some((currency) => currency.code === DEFAULT_CURRENCY_PAIR.base) ||
          !normalized.some((currency) => currency.code === DEFAULT_CURRENCY_PAIR.quote)
        ) {
          throw new Error("unsupported-currency");
        }
        setCurrencyError("");
        setCurrencies(normalized);
      })
      .catch((error) => {
        if (active) {
          setCurrencyError(getExchangeErrorMessage(error));
        }
      });

    return () => {
      active = false;
    };
  }, [currencyReloadToken]);

  useEffect(() => {
    if (!currencies.length || isSameCurrency) return undefined;

    let active = true;

    fetchExchangeRate(base, quote, { refresh: refreshToken > 0 })
      .then((nextRate) => {
        if (!active) return;
        setRateResult({ key: rateRequestKey, status: "ready", rate: nextRate, error: "" });
      })
      .catch((error) => {
        if (!active) return;
        setRateResult({
          key: rateRequestKey,
          status: "error",
          rate: null,
          error: getExchangeErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [base, currencies.length, isSameCurrency, quote, rateRequestKey, refreshToken]);

  const rateDescription = useMemo(() => {
    if (isSameCurrency) return "No reference rate is required for the same currency.";
    if (rateState === "loading") return "Loading the latest available reference rate…";
    if (rateState === "error") return rateError || "Exchange rate currently unavailable.";
    if (!rate) return "Exchange rate currently unavailable.";
    return `1 ${rate.base} = ${new Intl.NumberFormat(undefined, { maximumSignificantDigits: 10 }).format(rate.rate)} ${rate.quote}`;
  }, [isSameCurrency, rate, rateError, rateState]);

  const selectQuickPair = ({ base: nextBase, quote: nextQuote }) => {
    setBase(nextBase);
    setQuote(nextQuote);
  };

  return (
    <section className="er-tool" aria-labelledby="exchange-converter-title">
      <div className="er-tool__intro">
        <p className="shrix-section-label">FOINWI Live Financial Tool</p>
        <h1 id="exchange-converter-title">FOINWI Exchange Rates</h1>
        <p>
          Convert using the latest available reference rate from a published source.
          This educational tool does not provide transaction pricing.
        </p>
      </div>

      <div className="er-quick-pairs" aria-label="Quick currency pairs">
        {QUICK_CURRENCY_PAIRS.map((pair) => (
          <button
            type="button"
            key={pair.label}
            className="er-quick-pairs__button"
            onClick={() => selectQuickPair(pair)}
            aria-pressed={base === pair.base && quote === pair.quote}
          >
            {pair.label}
          </button>
        ))}
      </div>

      <div className="er-tool__panel">
        <div className="er-amount">
          <label htmlFor="exchange-amount">Amount</label>
          <input
            id="exchange-amount"
            type="text"
            inputMode="decimal"
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
            aria-invalid={!validAmount}
            aria-describedby={!validAmount ? "exchange-amount-error" : undefined}
          />
          {!validAmount ? <p id="exchange-amount-error" className="er-error" role="alert">Enter a zero or positive number.</p> : null}
        </div>

        <div className="er-currencies">
          <CurrencyCombobox
            id="exchange-from"
            label="From currency"
            currencies={currencies}
            value={base}
            onChange={setBase}
            disabled={Boolean(currencyError)}
          />
          <button
            type="button"
            className="er-swap"
            onClick={() => {
              setBase(quote);
              setQuote(base);
            }}
            aria-label="Swap from and to currencies"
            disabled={Boolean(currencyError)}
          >
            ⇄
          </button>
          <CurrencyCombobox
            id="exchange-to"
            label="To currency"
            currencies={currencies}
            value={quote}
            onChange={setQuote}
            disabled={Boolean(currencyError)}
          />
        </div>

        {currencyError ? <p className="er-error" role="alert">{currencyError}</p> : null}

        <div className="er-result" aria-busy={rateState === "loading"}>
          <p className="er-result__label">Converted amount</p>
          <output className="er-result__amount" aria-live="polite">
            {convertedAmount === null ? "—" : formatCurrencyAmount(convertedAmount, quote)}
          </output>
          <p className="er-result__rate" aria-live="polite">{rateDescription}</p>
        </div>

        <div className="er-status" aria-live="polite">
          {rate && !isSameCurrency ? (
            <>
              <p><strong>Source:</strong> {rate.provider}</p>
              <p><strong>Source published:</strong> <time dateTime={rate.sourcePublishedAt}>{formatTimestamp(rate.sourcePublishedAt)}</time></p>
              <p><strong>FOINWI retrieval:</strong> <time dateTime={rate.retrievedAt}>{formatTimestamp(rate.retrievedAt)}</time> ({rate.cacheState})</p>
              {stale ? <p className="er-warning">This source rate may be stale. Refresh before relying on it.</p> : null}
            </>
          ) : null}
          {rateState === "error" ? <p className="er-error" role="alert">Exchange rate currently unavailable.</p> : null}
        </div>

        <button
          type="button"
          className="er-refresh"
          onClick={() => {
            if (currencyError) {
              setCurrencyError("");
              setCurrencyReloadToken((value) => value + 1);
              return;
            }
            setRefreshToken((value) => value + 1);
          }}
          disabled={rateState === "loading" && !currencyError}
        >
          {currencyError ? "Retry currency list" : "Refresh reference rate"}
        </button>
      </div>

      <p className="er-disclaimer">
        Rates are reference rates and may differ from bank, card, remittance,
        exchange-counter, broker, or transaction rates. Fees, spreads, taxes, and
        provider-specific charges are not included.
      </p>
    </section>
  );
}

export default ExchangeConverter;
