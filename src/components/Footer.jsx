import logo from "../assets/shrix-logo.png";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 8.5h3v9h-3v-9Zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10 8.5h2.9v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V17.5h-3v-4.1c0-.98-.02-2.24-1.36-2.24-1.36 0-1.57 1.06-1.57 2.16v4.18H10V8.5Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.6 5h3.1l-6.8 7.8L20.5 19h-6.1l-4.8-5.6L4 19H.9l7.3-8.4L3.5 5h6.2l4.3 5.1L16.6 5Zm-1.1 12.2h1.7L7.9 6.7H6.1l9.4 10.5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8Zm9 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="shrix-footer">
      <img src={logo} alt="Shrix icon" />
      <p>Premium Financial Platform for Indian Investors.</p>
      <div className="shrix-footer-social">
        {socialLinks.map(({ label, href, icon }) => (
          <a key={label} href={href} aria-label={label}>
            {icon}
          </a>
        ))}
      </div>
      <small>Educational purpose only. Not financial advice.</small>
    </footer>
  );
}

export default Footer;
