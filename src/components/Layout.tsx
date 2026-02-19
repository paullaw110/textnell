import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const NellGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
    <circle cx="14" cy="14" r="13" fill="#1a1230" stroke="#4d3e69" />
    <circle cx="10" cy="11" r="1.8" fill="#ff58bf" />
    <circle cx="18" cy="11" r="1.8" fill="#ff58bf" />
    <path d="M10 17c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5" stroke="#9f92c8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {showNavigation ? (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f091b]/88 backdrop-blur-xl">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 text-white">
              <NellGlyph />
              <span className="font-display text-[1.8rem] leading-none">Nell</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hidden text-xs font-semibold uppercase tracking-[0.11em] text-[#c8c0e1] transition hover:text-white sm:inline-flex">
                Privacy
              </Link>
              <Link href="/terms" className="hidden text-xs font-semibold uppercase tracking-[0.11em] text-[#c8c0e1] transition hover:text-white sm:inline-flex">
                Terms
              </Link>
              <a href="sms:+12795290731" className="site-pill-btn px-4 py-2 text-[11px]">
                Text Nell
              </a>
            </div>
          </nav>
        </header>
      ) : null}

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-white/10 bg-[#0f091b]/78">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-white">
            <NellGlyph />
            <span className="font-display text-xl">Nell</span>
          </div>

          <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.11em] text-[#beb6d8]">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>

          <div className="text-xs uppercase tracking-[0.11em] text-[#aaa1c9]">SMS concierge for thoughtful friendships | 2026</div>
        </div>
      </footer>
    </div>
  );
}
