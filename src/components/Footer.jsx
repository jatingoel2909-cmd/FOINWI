import BrandWordmark from "./BrandWordmark";

function Footer() {
  return (
    <footer className="shrix-footer" id="about">
      <BrandWordmark className="foinwi-wordmark--footer" />
      <p>Premium Financial Platform for Indian Investors.</p>
      <small id="contact">
        FOINWI provides educational financial tools only. This is not financial advice.
        Please consult a qualified financial advisor before making financial decisions.
      </small>
    </footer>
  );
}

export default Footer;
