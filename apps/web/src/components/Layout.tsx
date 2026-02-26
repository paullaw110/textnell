import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

export default function Layout({
  children,
  showNavigation = true,
  showFooter = true,
}: LayoutProps) {
  return (
    <div className="site-root">
      {showNavigation && (
        <header className="legal-nav-wrap">
          <div className="container-shell legal-nav">
            <Link href="/" className="brand-wordmark" aria-label="Nell home">
              nell
            </Link>
            <a href="sms:+12795290731" className="btn-nav">
              Text Nell →
            </a>
          </div>
        </header>
      )}

      <main>{children}</main>

      {showFooter && (
        <footer className="legal-footer-wrap">
          <div className="container-shell legal-footer">
            <div className="legal-footer-top">
              <Link href="/" className="brand-wordmark">
                nell
              </Link>
              <p>Made with 💛 for people who give a damn about their people.</p>
              <div className="legal-footer-links">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
            <p className="legal-footer-copy">© 2026 Nell</p>
          </div>
        </footer>
      )}
    </div>
  );
}
